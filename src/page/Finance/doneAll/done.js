import moment from 'moment'
export default {
  data(){
    return {
      listLoading: false,
    }
  },
  methods:{
    moment,
    HandleSearchApprove (paramsModule) {
      this.approveTableList(paramsModule)
    },
    HandleResetApprove (paramsFrom, paramsModule){
      this.$refs[paramsFrom].resetFields()
      this.approveTableList(paramsModule);
    },
    approveTableList(paramsTab){
      let that = this
      let arr = []
      this.listLoading = true
      that.approveTableData  = []
      that.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/dictionaryget?enumname=FlowModel')
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
          }else if(paramsTab == 'sheet'){
            getWorkflowCode = 'reimbursement4'
          }  else {

          }
          this.$http.post(this.GLOBAL.jqUrl + "/JQ/GettingfinishedTasksForJQ",{
            "userCode": sessionStorage.getItem('tel'),
            "startTime": that.ruleFormSearch.startTime ? moment(that.ruleFormSearch.startTime).format('YYYY-MM-DD 00:00:00') : "1970-07-23T01:30:54.452Z",
            "endTime": that.ruleFormSearch.endTime ? moment(that.ruleFormSearch.endTime).format('YYYY-MM-DD 23:59:59') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            "startIndex": -1,
            "endIndex": -1 ,
            "workflowCode": getWorkflowCode
          }).then(obj => {
            obj.data.forEach(v=>{
              arr.push(v.jq_ID)
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
                "guid": arr,
                'type': 1,
              }).then(obj =>{
                let showTabCount = 0
                if(obj.data.objects != null){
                  showTabCount = obj.data.objects.length
                }
                that.$emit('handlePassVal',showTabCount)
                that.approveTableDataRefund = obj.data.objects
                that.listLoading = false
              })
            }else if(paramsTab == 'sheet'){
              this.$http.post(this.GLOBAL.serverSrc + '/finance/checksheet/api/listforguid', {
                "guid": arr
              }).then(obj =>{
                let showTabCount = 0
                if(obj.data.objects != null){
                  showTabCount = obj.data.objects.length
                }
                that.$emit('handlePassVal',showTabCount)
                this.$store.commit('doneAll/showSheetCount', showTabCount)

                that.approveTableDataSheet = obj.data.objects
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
  }
}
