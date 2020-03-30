/*
*
* 收款（跟团游）详情；
* 通过，驳回（收款的审批没有工作流环节）；
*
* */

import moment from 'moment'

export default {
  data () {
    return {
      getOrgID: null,
      getUserName: null,
      fundamental: {}, // 查看详情基本信息数组
      keepPaymentId: null, // PaymentId 接口传值用
      keepComponentName: null,
      paramsCollectionType: null, // 收款类型（区分关联欠款）
      tableAuditResults: [], // 审核结果表格
      tableInvoice: [], // 发票表格
      tableAssociated: [], // 发票关联表
      collCheckout: false, // 显示操作列信息（去认款）
      paramsInvoiceTable: null, // 是否显示发票列表
      approveDialogTitle: '', // 审批弹窗标题
      ifShowApproveDialog: '', // 是否展示审批弹窗
      approvalOpinion: '', // 审批意见
    }
  },
  created () {
    let paramsPaymentID = this.$route.query.id; // id 详情接口用
    this.paramsCollectionType = this.$route.query.collectionType; // 收款类型
    this.keepComponentName = this.$route.query.componentName; // 被点击的表格（属于哪个收款类型）
    this.paramsInvoiceTable = this.$route.query.invoiceTable; // 发票数据字段（数组），若长度等于0，隐藏发票模块
    this.keepPaymentId = paramsPaymentID;
    this.getLabel(paramsPaymentID);
    this.getOrgID = sessionStorage.getItem("orgID"); // 打印用
    this.getUserName = sessionStorage.getItem("name");
  },
  mounted () {

  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      return  parseFloat(value).toFixed(2);
    },
    formatDate: function (value) {//截取详情时间格式
      return moment(value).format('YYYY-MM-DD');
    },
    formatDateCreateAn: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    },
    formatDateDetailsAn:function (value) {
      if(typeof value == 'string'){
        return '';
      } else {
        return moment(value).format('YYYY-MM-DD');
      }
    }
  },
  methods: {
    moment,
    handleCancel () {
      this.handleGoBack();
    },
    handlePass () {
      this.approveDialogTitle = "审批通过";
      this.ifShowApproveDialog = true;
    },
    handleReject () {
      this.approveDialogTitle = "审批驳回";
      this.ifShowApproveDialog = true;
    },
    // 打印
    handleTouchPrint () {

    },
    // 审批弹窗取消
    handleApproveDialogCancel () {
      this.ifShowApproveDialog = false;
    },
    // 审批弹窗确定
    handleApproveDialogConfirm () {
      if (this.approveDialogTitle === '审批通过') {
        this.apiAuditApproved();
      } else {
        this.apiReject();
      }
    },
    // 通过接口
    apiAuditApproved () {

    },
    // 驳回接口
    apiReject () {

    },
    // 获取详情
    getLabel (id) {
      this.tableAssociated = [];
      let _this = this;
      this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/coll', {
        "id": id
      }).then(res => {
        //console.log(res.data.object.invoiceTable)
        if (res.data.isSuccess) {
          let keepRes = res.data.object;
          this.tableAssociated = keepRes.arrears;
          this.fundamental = keepRes;
          this.tableInvoice = keepRes.invoiceTable;
          this.tableAuditResults = keepRes.spw;
          this.tour_id = keepRes.planID;
          this.tableManyRow = this.tableAssociated.length;
          this.getAccountId(keepRes.accountID);
          this.tableAssociated.forEach(item => {
            _this.getCollectionPriceTotal += item.matchingPrice;
          })
        }
      }).catch(err => {
        console.log( err )
      })
    },
    getAccountId (paramsId) {
      let _this = this
      this.$http.post(this.GLOBAL.serverSrc + '/finance/collectionaccount/api/get', {
        "id": paramsId
      }).then(res => {
        if (res.data.isSuccess) {
          if (res.data.object.subject) {
            _this.collCheckout = true; //有科目值 对公的 ( 有科目值可以去认款 )
          }
        }
      }).catch(err => {
        console.log( err )
      })
    },
    dateFormatDetails (row, column) {
      let date = row[column.property];
      if(date === undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    handleGoBack () {
      this.$router.go(-1);
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
