/* 借款的列表数据 */
import moment from 'moment'

export default {
  data(){
    return {
      listLoading: false,
    }
  },
  methods: {
    moment,
    HandleSearchPendingApprove (paramsModule) {
      this.pendingApprovalTable(paramsModule)
    },
    HandleResetPendingApproval (paramsFrom, paramsModule){
      this.$refs[paramsFrom].resetFields()
      this.pendingApprovalTable(paramsModule);
    },
    pendingApprovalTable(paramsTab){
      let arr = []
      let that = this
      this.listLoading = true
      this.pendingApprovalTableData = []
      this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/dictionaryget?enumname=FlowModel')  // workflowCode获取FlowModel传递（工作流模型名称）
        .then(obj => {
          let moduleArrayMapped = {
            nameIINoInTeam: 'loan_noIncome4',
            nameIIAdvanceTeam: 'borrow_Moneys4',
            nameIIReimburseTeam: 'Reimbursement_noIncome4',
            nameIIRefundTeam: 'refund4',
            nameIISheetTeam: 'reimbursement4',
          }
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
          this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/listforguid', { // 通过GUID查找无收入/预付款列表
            "guid": arr
          }).then(obj =>{
            that.pendingApprovalTableData = obj.data.objects;
            that.listLoading = false
          })
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
