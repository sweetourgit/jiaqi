/*
*
*   处理时间格式，表格的通用方法，通过，驳回
*
* */

import moment from 'moment'

export default {
  data () {
    return {

    }
  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2);
      return realVal;
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
    // 通过
    handlePass () {
      this.approveDialogTitle = "审批通过";
      this.ifShowApproveDialog = true;
    },
    // 驳回
    handleRejected () {
      this.approveDialogTitle = "审批驳回";
      this.apiAuditApprovedShow = true;
    },
    // 支付账户
    handleBankAccount (paramsAcountInfo) {

    },
    // 取消
    handleCancel (paramsTabName, paramsCollectionTab) {
      if (paramsTabName === 'collection') {

      }
      this.$router.go(-1);
    },
    // 审批弹窗确定回调
    handleApproveDialogConfirm (formName) {
      if (this.approveDialogTitle === '审批通过') {
        this.apiAuditApproved(formName);
      } else {
        this.rejected_01(formName);
      }
    },
    // 审核通过时调用
    apiAuditApproved (formName) {
      let _this = this;
      let getWorkflowCode
      if(this.presentRouter == '无收入借款管理') {
        getWorkflowCode = 1
      } else if(this.presentRouter == '预付款管理') {
        getWorkflowCode = 2
      }else {}

      this.$http.post(this.GLOBAL.jqUrl + '/JQ/SubmitWorkAssignmentsForJQ_InsertOpinion', {
        "jQ_ID": _this.guid,
        "jQ_Type": getWorkflowCode,
        "userCode": sessionStorage.getItem('tel'),
        "workItemID": _this.getWorkItemId,
        "approvalOpinion": _this.approvalOpinion
      }).then(res => {
        _this.apiAuditApprovedShow = false;
        _this.detailstShow = false;
        _this.pageList();
      })
    },
    // 驳回
    rejected_01 (formName) {
      let _this = this;
      let getWorkflowCode
      if (this.presentRouter == '无收入借款管理') {
        getWorkflowCode = 1
      } else if(this.presentRouter == '预付款管理') {
        getWorkflowCode = 2
      } else {}

      this.$http.post(this.GLOBAL.jqUrl + '/JQ/RejectionOfWorkTasksForJQ_InsertOpinion', {
        "jQ_ID": _this.guid,
        "jQ_Type": getWorkflowCode,
        "userCode":sessionStorage.getItem('tel'),
        "workItemID": _this.getWorkItemId,
        "approvalOpinion": _this.approvalOpinion
      }).then(res => {
        _this.apiAuditApprovedShow = false;
        _this.detailstShow = false;
        _this.rejectedSuccess();

        let getWorkflowCode
        if (this.presentRouter == '无收入借款管理') {
          getWorkflowCode = 1;
        } else if (this.presentRouter == '预付款管理') {
          getWorkflowCode = 2;
        } else {}
        // 结束工作流
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/EndProcess', {
          "jq_id": this.guid,
          "jQ_Type": getWorkflowCode
        }).then(res => {
          _this.pageList();
          _this.$store.commit('changeAparoveState');
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
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px';
      } else {
        return '';
      }
    },
  }
}
