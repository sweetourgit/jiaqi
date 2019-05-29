<template>
  <div class="loanManagement">
      <!--查看无收入借款弹窗-->
	   <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
	      	 <el-form-item label="借款人" prop="createUser">
			    <el-input class="name_input" v-model="ruleForm.createUser" disabled></el-input>
			 </el-form-item>
			 <el-form-item label="团期计划" prop="groupCode" style="float:left;">
			    <el-input class="name_input" v-model="ruleForm.groupCode"disabled></el-input>
			 </el-form-item>
			 <el-form-item prop="plan_01" style="float:left; margin-left:-90px;">
			    <el-input class="name_input" v-model="ruleForm.plan_01"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="供应商" prop="supplierName" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.supplierName"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="类型" prop="supplierTypeEX">
			    <el-select v-model="ruleForm.supplierTypeEX" placeholder="请选择">
				  <el-option v-for="item in borrowingType" :key="item.value" :label="item.label" :value="item.value"disabled></el-option>
				</el-select>
			 </el-form-item>
			 <el-form-item label="借款金额" prop="price" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.price"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="摘要" prop="mark" style="clear:both;">
			    <el-input class="name_input01" v-model="ruleForm.mark"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="账号" prop="cardNumber">
			    <el-input class="name_input" v-model="ruleForm.cardNumber"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="开户行" prop="bankName" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.bankName"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="开户名" prop="cardName" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.cardName"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="付款方式" prop="payway">
			    <el-select v-model="ruleForm.payway" placeholder="请选择">
				  <el-option v-for="item in payment_01" :key="item.value" :label="item.label" :value="item.value"disabled></el-option>
				</el-select>
			 </el-form-item>
			 <el-form-item label="附件" prop="files" style="clear:both;">
			    <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList"disabled>
			  		<el-button type="primary"disabled>选择文件</el-button>
				</el-upload>
			 </el-form-item>
			 <el-table :data="tableMoney" border style="width: 70%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
	           <el-table-column prop="totalOrder" label="订单总额" align="center"></el-table-column>
	           <el-table-column prop="approval" label="已审批总额" align="center"></el-table-column>
	           <el-table-column prop="examination" label="审批中总额" align="center"></el-table-column>
	           <el-table-column prop="received" label="已收总额" align="center"></el-table-column>
	           <el-table-column prop="arrears" label="供应商欠款总额" align="center"></el-table-column>
	        </el-table>
	        <div style="margin:0 0 0 25px;">预付款明细</div>
	        <el-table :data="tablePayment" border style="width: 95%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
	           <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
	           <el-table-column prop="state" label="状态" align="center"></el-table-column>
	           <el-table-column prop="type" label="类型" align="center"></el-table-column>
	           <el-table-column prop="supplier" label="供应商" align="center"></el-table-column>
	           <el-table-column prop="paymentAmount" label="付款金额" align="center"></el-table-column>
	           <el-table-column prop="people" label="人数" align="center"></el-table-column>
	           <el-table-column prop="department" label="部门" align="center"></el-table-column>
	           <el-table-column prop="applicant" label="申请人" align="center"></el-table-column>
	           <el-table-column prop="times" label="日期" align="center"></el-table-column>
	           <el-table-column prop="digest" label="摘要" align="center"></el-table-column>
	           <el-table-column prop="process" label="审批过程" align="center">
	           	<template slot-scope="scope">
			      <div @click="processPaymenrt(scope.row)">查看</div>
			    </template>
	           </el-table-column>
	           <el-table-column prop="verification" label="已核销金额" align="center"></el-table-column>
	        </el-table>
	        <div style="margin:0 0 0 25px;">无收入借款明细</div>
	        <el-table :data="tableIncome" border style="width: 95%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
	           <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
	           <el-table-column prop="state" label="状态" align="center"></el-table-column>
	           <el-table-column prop="type" label="类型" align="center"></el-table-column>
	           <el-table-column prop="supplier" label="供应商" align="center"></el-table-column>
	           <el-table-column prop="paymentAmount" label="付款金额" align="center"></el-table-column>
	           <el-table-column prop="department" label="部门" align="center"></el-table-column>
	           <el-table-column prop="applicant" label="申请人" align="center"></el-table-column>
	           <el-table-column prop="times" label="日期" align="center"></el-table-column>
	           <el-table-column prop="digest" label="摘要" align="center"></el-table-column>
	           <el-table-column prop="process" label="审批过程" align="center">
	           	<template slot-scope="scope">
			      <div @click="processIncome(scope.row)">查看</div>
			    </template>
	           </el-table-column>
	           <el-table-column prop="verification" label="已核销金额" align="center"></el-table-column>
	        </el-table>
	        <div style="margin:0 0 0 25px;">收入明细</div>
	        <el-table :data="tableEarning" border style="width: 90%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
	           <el-table-column prop="number" label="订单编号" align="center"></el-table-column>
	           <el-table-column prop="source" label="来源" align="center"></el-table-column>
	           <el-table-column prop="contact" label="联系人" align="center"></el-table-column>
	           <el-table-column prop="people" label="人数" align="center"></el-table-column>
	           <el-table-column prop="figure" label="订单金额" align="center"></el-table-column>
	           <el-table-column prop="received" label="已收" align="center"></el-table-column>
	           <el-table-column prop="arrears" label="欠款" align="center"></el-table-column>
	           <el-table-column prop="numbers" label="收款单号" align="center"></el-table-column>
	           <el-table-column prop="dates" label="欠款日期" align="center"></el-table-column>
	           <el-table-column prop="shouldAlso" label="应还日期" align="center"></el-table-column>
	        </el-table>
	        <div style="margin:0 0 0 25px;">审批过程</div>
	        <el-table :data="tableCourse" border style="width: 90%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
	           <el-table-column prop="people" label="审批人" align="center"></el-table-column>
	           <el-table-column prop="result" label="审批结果" align="center"></el-table-column>
	           <el-table-column prop="opinion" label="审批意见" align="center"></el-table-column>
	           <el-table-column prop="times" label="审批时间" align="center"></el-table-column>
	        </el-table>
	      </el-form>
  </div>
</template>




<script>

  export default {
    props: {
     paymentID:0,
     groupCode:''


    },
    data(){
      return {
      	
      	 //表头切换
         empty:'',
         people:'',
         planTime:'',
         planData:'',
         //借款表格
         forbidden:true,
		 multipleSelection: [],
         tableData:[],
		 //分页
		 pagesize: 10, // 设定默认分页每页显示数
         pageIndex: 1, // 设定当前页数
         total: 0,
         currentPage: 1,
         //无收入借款弹窗
         noIncomeShow:false,
         /*ruleForm: {
          name: '',
          plan:'',
          plan_01:'',
          supplier:'',
          planType:'',
          planAmount:'',
          abstract:'',
          account:'',
          accountBank:'',
          accountOpenName:'',
          payment:'',
          accessory:'',
         },*/
         ruleForm:{
         	 createUser:'',
             groupCode:'',
             plan_01:'',
             supplierName:'',
             supplierTypeEX:'',
             price:'',
             mark:'',
             cardNumber:'',
             bankName:'',
             cardName:'',
             payway:'',
             files:'',
         },
         borrowingType: [{//无收入借款类型选择器
          value: '选项1',
          label: '地接'
         }, {
          value: '选项2',
          label: '机票（本公司）'
         }, {
          value: '选项3',
          label: '机票（非本公司）'
         }, {
          value: '选项4',
          label: '小费'
         }, {
          value: '选项5',
          label: '签证'
         }],
         payment_01:[{//无收入借款支付方式选择器
          value: '选项1',
          label: '网银'
         }, {
          value: '选项2',
          label: '现金'
         }, {
          value: '选项3',
          label: '支付宝'
         }, {
          value: '选项4',
          label: '微信'
         }],
         rules: {
          name: [{ required: true, message: '请输入借款人名字', trigger: 'blur' }],
          plan: [{ required: true, message: '请输入团期计划', trigger: 'blur' }],
          plan_01: [{ required: true, message: '请输入团期计划', trigger: 'blur' }],
          supplier:[{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
          planType:[{ required: true, message: '请选择付款方式', trigger: 'blur' }],
          planAmount:[{ required: true, message: '请输入类型', trigger: 'blur' }],
          abstract:[{ required: true, message: '请输入摘要', trigger: 'blur' }],
          account:[{ required: true, message: '请输入账号', trigger: 'blur' }],
          accountBank:[{ required: true, message: '请输入开户行', trigger: 'blur' }],
          accountOpenName:[{ required: true, message: '请输入开户名', trigger: 'blur' }],
          payment:[{ required: true, message: '请选择付款方式', trigger: 'blur' }],
         },
         fileList: [{//申请无收入借款中附件信息
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
         }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
         }],
         //无收入借款中借款人弹窗
         dialogFormVisible1:false,
         number_name:'',
         tableName: [{//申请无收入借款中借款人选择弹窗表格
            id: '001',
            name: '张三',
            phone: '15566447881',
            orinaze: '大运通-财务部',
            sex: '男',
            type: '启用'
          },{
            id: '001',
            name: '张三',
            phone: '15566447881',
            orinaze: '大运通-财务部',
            sex: '男',
            type: '启用'
          }, {
            id: '001',
            name: '张三',
            phone: '15566447881',
            orinaze: '大运通-财务部',
            sex: '男',
            type: '启用'
          }, {
            id: '001',
            name: '张三',
            phone: '15566447881',
            orinaze: '大运通-财务部',
            sex: '男',
            type: '启用'
          }],
          //无收入借款中团期计划弹窗
          dialogFormVisible_plan:false,
          plan_stage:'',
          plan_name:'',
          plan_data:'',
          plan_data01:'',
          tablePlan:[{//申请无收入借款中团期计划选择弹窗表格
          	id:'TC-GTY-1001-01-180806-01',
          	name:'美国西海岸三城双奥莱10日之旅',
          	destination:'西雅图',
          	travelDates:'2019-01-01',
          	department:'辽宁大运通-北美部',
          	productionPerson:'洋洋'
          },{
          	id:'TC-GTY-1001-01-180806-01',
          	name:'美国西海岸三城双奥莱10日之旅',
          	destination:'西雅图',
          	travelDates:'2019-01-01',
          	department:'辽宁大运通-北美部',
          	productionPerson:'洋洋'
          }],
          //无收入借款中账户弹窗
          dialogFormVisible_account:false,
          tableAccount:[{//无收入借款中账户弹窗表格
          	accountNumber:'1234 1234 1234 1234 1234',
          	openBank:'建行',
          	accountName:'洋洋'
          }],
          //无收入借款金额表格
          tableMoney:[{
          	totalOrder:'17800',
			approval:'17800',
			examination:'17800',
			received:'17800',
			arrears:'7800'
          }],
          //无收入借款弹窗预付款明细表格
          tablePayment:[{
          	id:'1',
			state:'通过',
			type:'小费',
			supplier:'国旅',
			paymentAmount:'5000.00',
			people:'5',
			department:'国内部',
			applicant:'洋洋',
			times:'2019-01-01',
			digest:'小费款',
			process:'查看',
			verification:'1000.00',
          }],
          //无收入借款弹窗中预付款明细查看弹窗
          dialogFormVisible_paymenrt:false,
          tableApprove:[{
          	times:' 2019-1-14 19:00:00',
			people:'洋洋',
			result:'通过',
			opinion:'不同意'
          }],
          ////无收入借款弹窗中无收入借款明细弹窗
          tableIncome:[{
          	id:'1',
			state:'通过',
			type:'小费',
			supplier:'国旅',
			paymentAmount:'5000.00',
			department:'国内部',
			applicant:'洋洋',
			times:'2019-01-01',
			digest:'小费款',
			process:'查看',
			verification:'1000.00',
          }],
          //无收入借款弹窗中预付款明细查看弹窗
          dialogFormVisible_Income:false,
          tableIncomeCheck:[{
          	times:' 2019-1-14 19:00:00',
			people:'洋洋1',
			result:'通过',
			opinion:'不同意'
          }],
          //无收入借款弹窗中收入明细表格
          tableEarning:[{
			number:'123',
			source:'国旅',
			contact:'洋洋',
			people:'5',
			figure:'17800',
			received:'7800',
			arrears:'10000',
			numbers:'123',
			dates:'2019-01-01',
			shouldAlso:'2019-01-30',
		   }],
		   //查看无收入借款审批过程
		   tableCourse:[{
		   	people:'1',
		   	result:'通过',
		   	opinion:'同意',
		   	times:'2019-04-25'
		   }],
		   


      }
    },
    methods: {
	  
	  //表格表头颜色
	  getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      changeFun(val) {
        this.multipleSelection=val;
        if(this.multipleSelection.length==1){
          this.forbidden=false;
        }else{
          this.forbidden=true;
        };
        //event.cancelBubble = true;//row-click和selection-change耦合事件
      },
      clickRow(row){    //选中行复选框勾选
      	this.$refs.multipleTable.clearSelection(); //清空用户的选择  
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      rowClass({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].paymentID==row.paymentID){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      
     
      planStage(){
      	this.plan_stage = '';
      	this.plan_name = '';
      	this.plan_data = '';
      	this.plan_data01 = '';
      },
      //无收入借款中账户弹窗
      IncomeAccount(){
      	this.dialogFormVisible_account = true;
      },
      accountCancel(){
      	this.dialogFormVisible_account = false;
      },
      //无收入借款中预付款明细查看
      processPaymenrt(scope,row){
      	this.dialogFormVisible_paymenrt = true;
      },
      processIncome(scope,row){
      	this.dialogFormVisible_Income = true;
      },
      //查看无收入借款弹窗
      checkIncome(){
      	this.checkIncomeShow = true;
      },
      CloseCheckIncomeShow(){
      	this.checkIncomeShow = false;
      },
      
      //获取一条信息
      getLabel(){
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get',{
           "id":this.paymentID
          }).then(res => {
              if(res.data.isSuccess == true){
                 let data = res.data.object;
                 this.ruleForm.createUser=data.createUser;
                 this.ruleForm.groupCode=data.groupCode;
                 this.ruleForm.supplierName=data.supplierName;
                 this.ruleForm.supplierTypeEX=data.supplierTypeEX;
                 this.ruleForm.price=data.price;
                 this.ruleForm.mark=data.mark;
                 this.ruleForm.cardNumber=data.cardNumber;
                 this.ruleForm.bankName=data.bankName;
                 this.ruleForm.cardName=data.cardName;
                 this.ruleForm.payway=data.payway;
                 this.ruleForm.files=data.files;

              }
        }) .catch(err => {});
      },
	    getTourByPlanId() {
	      var that = this
	      that.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
	        "object": {
	          //planID: this.paymentID, //团期计划ID
	          //groupCode:this.ruleForm.groupCode,//团期计划(团号)
	          //title:this.ruleForm.plan_01,//产品标题
	          groupCode:this.groupCode
	        }
	      }).then(res => {
	        if (res.data.isSuccess == true) {
	          that.ruleForm.groupCode = res.data.objects[0].groupCode
	          that.ruleForm.plan_01 = res.data.objects[0].title
	        }
	      }).catch(err => {
	        console.log(err)
	      })
	    },

	    },
    watch: {
      // 如果 `dialogFormVisible` 发生改变，这个函数就会运行
      paymentID: {
         immediate:true,
         handler:function(){
           this.getLabel();
           this.getTourByPlanId();
         }
      }
    },
    mounted(){

    },
    
  }
</script>
<style scoped>
	
	.loanManagement{text-align: center; font-family: '微软雅黑'; font-size: 11pt;overflow: hidden; text-align: left; margin: -15px 0 100px 0;}
	.loanBorder{border-left:1px solid #e6e6e6;border-right:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6; margin:15px 0 20px 0; overflow: hidden; clear: both;}
	/*搜索框*/
	.empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
	.fl{float:left; margin: 20px 0 20px 0;}
	.emptyPlan{margin: 0 0 0 30px; }
	.planTime{width: 135px; line-height: 30px;margin: 0 0 0 10px;}
	.time{margin: 0 0 0 10px;}
	/*重置*/
	.primary{clear: both;overflow: hidden;margin: 0 0 20px 30px;}
	/*表格*/
	.labelTable{margin: 0 30px 20px 30px; text-align: center;max-width: 1581px;}
	.multipleTable{margin: 0 30px 20px 30px; text-align: center;width: 1161px;}
	/*分页*/
	.pageList{float:right; margin: 0 30px 20px 0;}
	/*申请无收入借款弹窗*/
	.mask{background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0;filter:alpha(opacity=50);opacity:0.5; z-index: 100;}
	.noIncome{width:1100px; position:absolute; top:3%;left:50%; margin-left:-550px; background:#fff; z-index:1000; border-radius:3px;max-height: 95%;overflow:scroll;overflow-x:hidden;}
	.noIncomeTitle{margin: 30px; overflow: hidden;}
	.noIncomeTitle_l{float:left; font-size:13pt;line-height: 40px;}
	.noIncomeTitle_r{float:right;}
	.name_input{width: 200px;}
	.name_input01{width: 700px;}
	.name_button{margin-left:-5px; background:#eaeaea;color:#a4a4a4;}
	.name_button:hover{color:#a4a4a4;}
	/*申请无收入借款中借款人弹窗*/
	.indialog{min-height: 300px; overflow: hidden;}
	.mask_name{background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0;filter:alpha(opacity=50);opacity:0.5; z-index: 101;}
	.number_button{float:right; margin: 0 0 20px 0;}
	/*申请无收入借款中团期计划弹窗*/
	.plan_indialog{float:left; line-height: 40px;}
	.indialog_plan{float:left; margin: 0 10px 0 10px;}
	.indialog_input{float:left; width: 150px;}
	.indialog_input01{float:left; width: 80px;}
	.plan_indialog span{float:left; margin: 0 10px 0 10px;}
	.indialog_button{margin: 0 0 0 10px;}
	/*申请无收入借款中附件*/
	.upload-demo{width: 400px;}
	.upload-demo>>>.el-upload-list__item{ width: 300px; }

	.el-dialog__wrapper{top:-10%;}

</style>
