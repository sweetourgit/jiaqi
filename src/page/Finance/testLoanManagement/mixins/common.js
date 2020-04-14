// 无收入、预付款共有数据 混入对象
import moment from 'moment'
export const common={
    data(){
      return{
          ruleFormSeach: {
              groupCode_01:'', // 表单团期计划
              createTime:'', // 创建时间
              endTime:'', // 结束时间
              checkType:'', // 状态
              borrower: '', // 无收入借款人
              user:'',//预付款申请人
              page: 1,
              limit: 10,
          },
          total:0,  
          listLoading:true,
          tableData:[],//无收入借款table        
      }
    },
    mounted() {       
    },
    
    methods: {
      moment,
        //获取分页列表       
      getList(params) {        
        if(typeof params == 'boolean'){
          this.dialogFormVisible = params //$emit传过来的数据 控制申请是否显示
        }
        this.pageshow = false;
        this.$nextTick(() => {
          this.pageshow = true
        })
       
        this.listLoading = true
        let objectRequest = {}
        let _this = this
        objectRequest.paymentType = this.paymentType;
        objectRequest.checkType = -1;
        
        if (this.ruleFormSeach.groupCode_01) { objectRequest.groupCode = this.ruleFormSeach.groupCode_01; }
        if (this.ruleFormSeach.beginTime) { objectRequest.beginTime =  moment(this.ruleFormSeach.beginTime).format('YYYY-MM-DD HH:mm:ss'); }
        if (this.ruleFormSeach.endTime) { objectRequest.endTime = moment(this.ruleFormSeach.endTime).format('YYYY-MM-DD HH:mm:ss'); }
       if(this.paymentType===1){ if (this.ruleFormSeach.borrower) { objectRequest.createUser = this.keepBorrowerUserCode; }}
       if(this.paymentType===2){ if (this.ruleFormSeach.user){ objectRequest.createUser = this.keepApplyUserCode;}}
        
        if (this.ruleFormSeach.checkType) { objectRequest.checkType = this.ruleFormSeach.checkType;}else{objectRequest.checkType='-1'}
        //if (this.checkTypeEX) { objectRequest.checkTypeEX = this.checkTypeEX; }
        this.$http.post( this.GLOBAL.serverSrc + "/finance/payment/api/page", {
          "pageIndex":_this.ruleFormSeach.page,
          "pageSize":_this.ruleFormSeach.limit,
          "total": 0,
          "object": objectRequest,
        }).then(function (obj) {
          console.log('获取tabledata');
          console.log(_this.keepBorrowerUserCode)
          console.log(_this.keepApplyUserCode)
          console.log(obj.data)
          _this.total = obj.data.total
          _this.tableData = obj.data.objects
          _this.listLoading = false
        }).catch(function (obj) {
          console.log(obj)
        })
      },
      //表单搜索：点击搜索时重新获取对应tab中tabledata数据
      search(){
        this.ruleFormSeach.page = 1
        this.ruleFormSeach.limit = 10
        this.getList()
      },
      //表单重置：点击重置时清空表单，重新获取对应tab中tabledata数据
      emptyButton(formName) {
        this.$refs[formName].resetFields();
        this.getList();
      },
      // 借款列表首页表格表头颜色
      getRowClass({row, column, rowIndex, columnIndex}) {
          if (rowIndex == 0) {
            return 'background:#F7F7F7;color:rgb(85, 85, 85);'
          } else {
            return ''
          }
      },
      // 选中行样式改变
      rowClassPlan({row, rowIndex}){
          for(var i=0;i<this.multipleSelectionPlan.length;i++){
          if(this.multipleSelectionPlan[i].planID==row.planID){
              return { "background-color": "#ecf5ff" }
          }
          }
      } ,
      rowClass({row, rowIndex}){  // 选中行样式改变
        for(var i=0;i<this.multipleSelection.length;i++){
            if(this.multipleSelection[i].paymentID==row.paymentID){
              return { "background-color": "#ecf5ff" }
            }
        }
      },
      // 起始时间格式转换(table)
      dateFormat: function(row, column) {
          let date = row[column.property];
          if(date == undefined || date == '') {
          return '';
          }
          return moment(date).format('YYYY-MM-DD')
      },
      //取消按钮 返回上一页
      handleCancel(){
        this.$router.go(-1);
      }
    },
    // 关于时间的过滤
    filters: {
      formatDate: function (value) {    
          if(typeof value == 'string'){
                  return ''
          } else {
                  return moment(value).format('YYYY-MM-DD')
          }
      },      
      formatDateDetails:function (value) {       
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    
   

}