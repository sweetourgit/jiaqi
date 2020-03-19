/*
*
* 借款、报销、退款、报账单相关的表格请求方法、通用方法；
*
* */

import moment from 'moment'

// 通过父组件传过来的属性进行转换，搜索用
let changeComName = {
  nameINoIn: 'nameIINoInTeam', // 无收入
  nameIAdvance: 'nameIIAdvanceTeam', // 预付款
  nameIReimburse: 'nameIIReimburseTeam', // 报销
  nameIRefund: 'nameIIRefundTeam', // 退款
  nameISheet: 'nameIISheetTeam', // 报账单
}

export default {
  data(){
    return {
      listLoading: false,
    }
  },
  mounted() {
  },
  methods: {
    moment,
    HandleSearchPendingApprove (paramsModule) {
      this.pendingApprovalTable(changeComName[paramsModule])
    },
    HandleResetPendingApproval (paramsFrom, paramsModule) {
      this.$refs[paramsFrom].resetFields()
      this.pendingApprovalTable(changeComName[paramsModule]);
    },
    pendingApprovalTable (paramsTab) {
      let arr = []
      let _this = this
      // 依据tab点击事件传入的模块名称，取对应的字段传给接口
      let moduleArrayMapped = {
        nameIINoInTeam: 'loan_noIncome4',
        nameIIAdvanceTeam: 'borrow_Moneys4',
        nameIIReimburseTeam: 'Reimbursement_noIncome4',
        nameIIRefundTeam: 'refund4',
        nameIISheetTeam: 'reimbursement4',
      }
      this.listLoading = true
      this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/dictionaryget?enumname=FlowModel')
        .then(obj => {
          this.$http.post(this.GLOBAL.jqUrl + "/JQ/GettingUnfinishedTasksForJQ",{
            //"userCode": sessionStorage.getItem('userCode'),
            "userCode": sessionStorage.getItem('tel'),
            "startTime": _this.ruleFormSearch.startTime ? moment(_this.ruleFormSearch.startTime).format('YYYY-MM-DD 00:00:00') : "1970-07-23T01:30:54.452Z",
            "endTime": _this.ruleFormSearch.endTime ? moment(_this.ruleFormSearch.endTime).format('YYYY-MM-DD 23:59:59') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            "startIndex": -1,
            "endIndex": -1 ,
            "workflowCode": moduleArrayMapped[paramsTab]
          }).then(obj => {
            obj.data.forEach(v=>{
              arr.push(v.jq_ID)
            })
            // 减少判断逻辑（通过guid获取相关未审批的数据）
            let ApprovalApiPayment = function () {
              _this.$http.post(_this.GLOBAL.serverSrc + '/finance/payment/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                // 区分同业和直客
                if(paramsTab === 'nameIINoInTeam'){
                  _this.approvalNoInData = obj.data.objects;
                } else {
                  _this.approvalAdvanceData = obj.data.objects
                }
                _this.listLoading = false
              }).catch(obj => {
                _this.listLoading = false
                console.log(obj)
              })
            }
            let ApprovalApiExpense = function () {
              _this.$http.post(_this.GLOBAL.serverSrc + '/finance/expense/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                _this.approvalReimburseData = obj.data.objects;
                _this.listLoading = false
              }).catch(obj => {
                _this.listLoading = false
                console.log(obj)
              })
            }
            let ApprovalApiRefund = function () {
              _this.$http.post(_this.GLOBAL.serverSrc + '/finance/refund/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                _this.approvalRefundData = obj.data.objects;
                _this.listLoading = false
              }).catch(obj => {
                _this.listLoading = false
                console.log(obj)
              })
            }
            let ApprovalApiSheet = function () {
              _this.$http.post(_this.GLOBAL.serverSrc + '/finance/checksheet/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                _this.approvalSheetData = obj.data.objects;
                _this.listLoading = false
              }).catch(obj => {
                console.log(obj)
              })
            }
            let listApi = {
              nameIINoInTeam: ApprovalApiPayment, // 无收入
              nameIIAdvanceTeam: ApprovalApiPayment, // 预付款
              nameIIReimburseTeam: ApprovalApiExpense, // 报销
              nameIIRefundTeam: ApprovalApiRefund, // 退款
              nameIISheetTeam: ApprovalApiSheet, // 报账单
            }
            listApi[paramsTab]()
          }).catch(obj => {
            _this.listLoading = false
            console.log(obj)
          })
      })
    },
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
      } else {
        return ''
      }
    },
  }
}
