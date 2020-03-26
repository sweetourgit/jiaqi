/*
*
*   处理时间格式，表格的通用方法，通过，驳回
*
* */

import moment from 'moment'

export default {
  data () {
    return {
      ifShowApproveDialog: false, // 通过驳回弹窗
      setjQType: null, // 接口用取分借款类型
      getUserTel: null // 获取登录用户电话
    }
  },
  mounted () {
    this.getUserTel = sessionStorage.getItem('tel');
    let getWhichTabName = this.$route.query.whichTabName; // 区分tab类别
    // 借款接口用（通过，驳回， 结束工作流）
    let mapTabName = {
      nameINoIn: 1,
      nameIAdvance: 2,
      nameIRefund: 6,
    };
    this.setjQType = mapTabName[ getWhichTabName ];
  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      return parseFloat(value).toFixed(2);
    },
    // 截取详情时间格式
    formatDate (value) {
      return moment(value).format('YYYY-MM-DD');
    },
    formatDateCreateAn (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    },
    formatDateDetailsAn (value) {
      if (typeof value === 'string') {
        return '';
      } else {
        return moment(value).format('YYYY-MM-DD');
      }
    }
  },
  methods: {
    moment,
    // 通过弹窗显示
    handlePass () {
      this.approveDialogTitle = "审批通过";
      this.ifShowApproveDialog = true;
    },
    // 驳回弹窗显示
    handleRejected () {
      this.approveDialogTitle = "审批驳回";
      this.ifShowApproveDialog = true;
    },
    // 取消
    handleCancel (paramsTabName, paramsCollectionTab) {
      if (paramsTabName === 'collection') {

      }
      this.handleGoBack();
    },
    // 审批弹窗确定回调
    handleApproveDialogConfirm () {
      if (this.approveDialogTitle === '审批通过') {
        this.apiAuditApproved();
      } else {
        this.apiReject();
      }
    },
    // 返回上一页
    handleGoBack () {
      this.$router.go(-1);
    },
    // 审核通过时调用
    apiAuditApproved () {
      let _this = this;
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/SubmitWorkAssignmentsForJQ_InsertOpinion', {
        "jQ_ID": _this.guid,
        "jQ_Type": this.setjQType,
        "userCode": this.getUserTel,
        "workItemID": _this.getWorkItemId,
        "approvalOpinion": _this.approvalOpinion
      }).then(res => {
        _this.ifShowApproveDialog = false;
        _this.detailstShow = false;
        this.handleGoBack();
      })
    },
    // 驳回
    apiReject () {
      let _this = this;
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/RejectionOfWorkTasksForJQ_InsertOpinion', {
        "jQ_ID": _this.guid,
        "jQ_Type": this.setjQType,
        "userCode":this.getUserTel,
        "workItemID": _this.getWorkItemId,
        "approvalOpinion": _this.approvalOpinion
      }).then(res => {
        _this.ifShowApproveDialog = false;
        _this.detailstShow = false;
        _this.rejectedSuccess();

        // 结束工作流
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/EndProcess', {
          "jq_id": this.guid,
          "jQ_Type": this.setjQType
        }).then(res => {
          this.handleGoBack()
        })
      })
    },
    // 驳回成功通过guid将checktype修改成2
    rejectedSuccess () {
      this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/savechecktype', {
        "object": {
          "guid": this.guid,
          "checkType": 2
        }
      })
    },
    // 弹窗取消，关闭
    handleApproveDialogCancel () {
      this.ifShowApproveDialog = false;
    },
    dateFormatDetails (row, column) {
      let date = row[column.property];
      if (date === undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    // 表格行样式
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px';
      } else {
        return '';
      }
    },
  }
}
