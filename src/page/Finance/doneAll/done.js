import moment from 'moment'
export default {
  data(){
    return {
      listLoading: false,
    }
  },
  methods:{
    approveTableList(paramsTab){
      let that = this
      let arr = []
      this.listLoading = true
      that.approveTableData  = []
      that.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/dictionaryget?enumname=FlowModel')  // workflowCode获取FlowModel传递（工作流模型名称）
        .then(obj => {
          let getWorkflowCode
          if(paramsTab == 'borrow') {
            getWorkflowCode = 'loan_noIncome4'
          } else if(paramsTab == 'advance') {
            getWorkflowCode = 'borrow_Moneys4'
          }else if(paramsTab == 'reimburse'){
            getWorkflowCode = 'Reimbursement_noIncome4'
          }else if(paramsTab == 'refund'){
            getWorkflowCode = 'refund4'
          } else {}
          this.$http.post(this.GLOBAL.jqUrl + "/JQ/GettingfinishedTasksForJQ",{
            //"userCode": sessionStorage.getItem('userCode'),
            "userCode": sessionStorage.getItem('tel'),
            "startTime": this.ruleFormSearch.startTime ?  moment(this.ruleFormSearch.startTime).format('YYYY-MM-DD HH:mm:ss') : "1970-07-23T01:30:54.452Z",
            "endTime": this.ruleFormSearch.endTime ? moment(this.ruleFormSearch.endTime).format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            "startIndex": -1,  // 页码
            "endIndex": -1 ,  // 每页条数
            "workflowCode": getWorkflowCode
          }).then(obj => {
            obj.data.forEach(v=>{
              arr.push(v.jq_ID)
              // that.arr1.push(v.workItemID)
              // that.keepWorkItemID.push(v)
            })
            if(paramsTab == 'borrow' || paramsTab == 'advance') {
              this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                let showTabCount = 0
                if(obj.data.objects != null){
                  showTabCount = obj.data.objects.length
                }
                if(paramsTab == 'borrow') {
                  that.$emit('handlePassVal',showTabCount)
                  that.approveTableDataNoIn = obj.data.objects
                } else {
                  that.$emit('handlePassVal',showTabCount)
                  that.approveTableDataAdvance = obj.data.objects
                }
                that.listLoading = false
              })
            } else if(paramsTab == 'reimburse'){
              this.$http.post(this.GLOBAL.serverSrc + '/finance/expense/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                let showTabCount = 0
                if(obj.data.objects != null){
                  showTabCount = obj.data.objects.length
                }
                that.$emit('handlePassVal',showTabCount)
                that.approveTableDataReimburse = obj.data.objects
                that.listLoading = false
              })
            } else if(paramsTab == 'refund'){
              this.$http.post(this.GLOBAL.serverSrc + '/finance/refund/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                let showTabCount = 0
                if(obj.data.objects != null){
                  showTabCount = obj.data.objects.length
                }
                that.$emit('handlePassVal',showTabCount)
                that.approveTableDataRefund = obj.data.objects
                that.listLoading = false
              })
            }
          })
        })
    },
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD')
    },
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
      } else {
        return ''
      }
    }
  },
}
