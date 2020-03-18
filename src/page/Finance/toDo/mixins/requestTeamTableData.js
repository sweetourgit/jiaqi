/* 待审批表格数据（借款，报销，退款，报账单） */
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
    HandleResetPendingApproval (paramsFrom, paramsModule){
      this.$refs[paramsFrom].resetFields()
      this.pendingApprovalTable(changeComName[paramsModule]);
    },
    pendingApprovalTable(paramsTab){
      let arr = []
      let that = this
      // 依据tab点击事件传入的模块名称，取对应的字段传给接口
      let moduleArrayMapped = {
        nameIINoInTeam: 'loan_noIncome4',
        nameIIAdvanceTeam: 'borrow_Moneys4',
        nameIIReimburseTeam: 'Reimbursement_noIncome4',
        nameIIRefundTeam: 'refund4',
        nameIISheetTeam: 'reimbursement4',
      }
      this.listLoading = true
      this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/dictionaryget?enumname=FlowModel')  // workflowCode获取FlowModel传递（工作流模型名称）
        .then(obj => {
          this.$http.post(this.GLOBAL.jqUrl + "/JQ/GettingUnfinishedTasksForJQ",{
            //"userCode": sessionStorage.getItem('userCode'),
            "userCode": sessionStorage.getItem('tel'),
            "startTime": that.ruleFormSearch.startTime ? moment(that.ruleFormSearch.startTime).format('YYYY-MM-DD 00:00:00') : "1970-07-23T01:30:54.452Z",
            "endTime": that.ruleFormSearch.endTime ? moment(that.ruleFormSearch.endTime).format('YYYY-MM-DD 23:59:59') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            "startIndex": -1,
            "endIndex": -1 ,
            "workflowCode": moduleArrayMapped[paramsTab]
          }).then(obj => {
            obj.data.forEach(v=>{
              arr.push(v.jq_ID)
            })
            // 减少判断逻辑（通过guid获取相关未审批的数据）
            let ApprovalApiPayment = function () {
              that.$http.post(that.GLOBAL.serverSrc + '/finance/payment/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                if(paramsTab === 'nameIINoInTeam'){
                  that.approvalNoInData = obj.data.objects;
                } else {
                  that.approvalAdvanceData = obj.data.objects
                }
                that.listLoading = false
              }).catch(obj => {
                console.log(obj)
              })
            }
            let ApprovalApiExpense = function () {
              that.$http.post(that.GLOBAL.serverSrc + '/finance/expense/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                that.approvalReimburseData = obj.data.objects;
                that.listLoading = false
              }).catch(obj => {
                console.log(obj)
              })
            }
            let ApprovalApiRefund = function () {
              that.$http.post(that.GLOBAL.serverSrc + '/finance/refund/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                that.approvalRefundData = obj.data.objects;
                that.listLoading = false
              }).catch(obj => {
                console.log(obj)
              })
            }
            let ApprovalApiSheet = function () {
              that.$http.post(that.GLOBAL.serverSrc + '/finance/checksheet/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                that.approvalSheetData = obj.data.objects;
                that.listLoading = false
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
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
      } else {
        return ''
      }
    },
  }
}
