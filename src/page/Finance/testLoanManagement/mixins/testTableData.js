// 无收入财务管理table混入对象
import moment from 'moment'
export const testTableData={
    data(){
        return{
            freetableData: [],//自由行表格
            shiptableData:[],//游轮表格
            grouptableData:[],//跟团游表格
            listLoading:true,
            obj:{},
           //分页数据
          
            total:0,
            pageSize:10,
            pageIndex:1, 
           //分页数据 end
           basicInfo:{},
           checkResultTableData:[], //审核结果tabledata
           moneyTableData:[],//相关信息金额tabledata
           tableNoIncome:[],//相关信息无收入借款明细tabledata
           tablePayment:[],//相关信息预付款明细tabledata
           tableIncome:[],//相关信息收入明细tabledata
          
        }
    },
    mounted() {
       
    },
    
    methods: {
      moment,
        //获取分页列表
        async getPageList(whichTabParams){ 
            this.listLoading = true; 
            this.obj={};//每次获取列表数据时重新初始化一下传给后台的obj对象
            //根据不同的游行类型传给接口
            let paymentType = {
                freeITour:1,
                shipITour:2,
                groupITour:3,
              };
            this.obj.paymentType=paymentType[whichTabParams], 
            this.obj.checkType=-1;
            //对表单进行校验
           
            if(this.formquery.teamPlan){ this.obj.groupCode=this.formquery.teamPlan};
            if(this.keepBorrowerUserCode){ this.obj.createUser=this.keepBorrowerUserCode};
            if(this.formquery.applyBeginTime){ this.obj.beginTime=moment(this.formquery.applyBeginTime).format('YYYY-MM-DD ')};//改变表单中时间选择器开始时间的时间格式
            if(this.formquery.applyLastTime){ this.obj.endTime=moment(this.formquery.applyLastTime).format('YYYY-MM-DD ')};//改变表单中时间选择器的结束时间的时间格式
            
            if(this.formquery.checkType){
                this.obj.checkType=this.formquery.checkType;          
            }
            else{
                this.obj.checkType=-1;               
              
            } 
            let res=await this.$http.post( this.GLOBAL.serverSrc + "/finance/payment/api/page",{
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                total:this.total,
                object: this.obj,
            });
            console.log('this.formquery.teamPlan::::'+this.formquery.teamPlan)
            console.log(this.obj)
            this.listLoading = false;
            let totalRequest=res.data.total;
            let tableDataRequest=res.data.objects;
           //判断参数是哪个组件传来的给对应的table赋值
            if(whichTabParams==='freeITour'){//自由行tab
                this.childChangedTab='freeITour';//别忘记给赋值，否则table不显示
                this.freetableData=tableDataRequest;
                this.total=totalRequest;
                console.log('自由行js'+','+this.total);
                console.log(tableDataRequest)
            }  
            if(whichTabParams==='shipITour'){//游轮tab
                this.childChangedTab='shipITour';//别忘记给赋值,table通过'childChangedTab'判断显示隐藏,否则table不显示
                this.shiptableData=tableDataRequest;
                this.total=totalRequest;
                console.log('游轮js'+','+this.total);
            }
            else if(whichTabParams==='groupITour'){//跟团游tab
                this.childChangedTab='groupITour';//别忘记给赋值，否则table不显示
                this.grouptableData=tableDataRequest;
                this.total=totalRequest;
                console.log('跟团游js'+','+this.total);
            }    
               
        },
        //表单搜索：点击搜索时重新获取对应tab中tabledata数据
        onSubmit() {
            console.log('搜索:'+this.childChangedTab);
            this.getPageList(this.childChangedTab);
        },
        //表单重置：点击重置时清空表单，重新获取对应tab中tabledata数据
        resetForm(formName) {
          console.log(formName);
          this.$refs[formName].resetFields();
          this.getPageList(this.childChangedTab);
        },
        // 表格表头颜色
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
            return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
            } else {
            return ''
            }
        },

        //分页点击事件
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize=val;
            this.getPageList(this.childChangedTab)
          },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pageIndex=val;
            this.getPageList(this.childChangedTab)
        },
        //分页点击事件end

        // 起始时间格式转换(table)
        dateFormat: function(row, column) {
            let date = row[column.property];
            if(date == undefined || date == '') {
            return '';
            }
            return moment(date).format('YYYY-MM-DD')
        },

         
    },
    // 关于时间的过滤
    filters: {
        formatDate: function (value) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss')
        },
        formatDateDetails:function (value) {
            if(typeof value == 'string'){
                return ''
            } else {
                return moment(value).format('YYYY-MM-DD')
            }
        }
    },
   

}