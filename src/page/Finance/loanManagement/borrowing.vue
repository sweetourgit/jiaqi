<template>
<!--借款页面-->
  <div class="loanManagement">
	<div class="loanBorder">
		<div class="plan">
			<div style="width:1100px;">
				<div class="fl">
					<span class="emptyPlan">团期计划</span>
					<el-input v-model="empty" class="empty" clearable placeholder="请输入团期计划"></el-input>
				</div>
				<div class="fl">
					<span class="emptyPlan">申请人</span>
					<el-input v-model="people" class="empty" clearable placeholder="请输入申请人"></el-input>
				</div>
				<div class="fl">
					<span class="emptyPlan">发起时间</span>
					<el-date-picker v-model="planTime" type="date" class="planTime" placeholder="日期"></el-date-picker>
					<span class="time">——</span>
					<el-date-picker v-model="planData" type="date" class="planTime" placeholder="日期"></el-date-picker>
				</div>
			</div>
			<div style="width:1100px;clear:both;">
				<div style=" float:left">
			       <span class="emptyPlan">类型</span>
				   <el-cascader :options="settlement" v-model="settlement_01"  class="empty" clearable placeholder="请输入类型"></el-cascader>
				</div>
				<div style="float:right; margin: 0 10px 0 0;">
					<el-button type="primary">搜索</el-button>
					<el-button @click="emptyButton()" type="primary">重置</el-button>
				</div>
			</div>
			
		</div>
		<div class="primary">
			<el-button plain @click="noIncome()" style="margin:30px 0 0 0;">申请</el-button>
			<!-- <el-button plain @click="checkIncome()" :disabled="forbidden">查看借款</el-button> -->
		</div>
		<el-table :data="tableData"  class="labelTable" ref="multipleTable" :header-cell-style="getRowClass" border :row-style="rowClass" @row-click="clickRow">
	      <el-table-column prop="paymentID" label="借款单号" width="120" align="center"></el-table-column>
	      <el-table-column prop="checkTypeEX" label="状态" width="80" align="center">
	      	<template slot-scope="scope">
	          <div v-if="scope.row.checkTypeEX=='审批中'" style="color: #7F7F7F" >{{scope.row.checkTypeEX}}</div>
	          <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D" >{{scope.row.checkTypeEX}}</div>
	          <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174" >{{scope.row.checkTypeEX}}</div>
	        </template>
	      </el-table-column>
	      <el-table-column prop="beginTime" label="发起时间" width="210" align="center"></el-table-column>
	      <el-table-column prop="groupCode" label="团期计划" width="240" align="center"></el-table-column>
	      <el-table-column prop="supplierName" label="供应商名称" width="150" align="center"></el-table-column>
	      <el-table-column prop="supplierTypeEX" label="类型" width="80" align="center"></el-table-column>
	      <el-table-column prop="price" label="借款金额" width="120" align="center"></el-table-column>
	      <el-table-column prop="expensePrice" label="已核销金额" width="120" align="center"></el-table-column>
	      <!-- <el-table-column prop="collectionPrice" label="已付款金额" width="120" align="center"></el-table-column>
	      <el-table-column prop="orgName" label="申请组织" width="150" align="center"></el-table-column> -->
	      <el-table-column prop="createUser" label="申请人" width="100" align="center"></el-table-column>
	      <el-table-column prop="approvalOpinion" label="审批意见" width="180" align="center"></el-table-column>
	      <el-table-column prop="approvalOpinion" label="操作" width="180" align="center">
	      	<template slot-scope="scope">
	          <el-button @click="checkIncome(scope.row)" type="text" size="small" class="table_details">详情</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
	    <!--分页-->
	    <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
	</div>
	<!--申请无收入借款弹窗-->
	    <el-dialog title="借款申请" :visible.sync="noIncomeShow" width="1100px" custom-class="city_list" :show-close='false'>  
	      <div style="position:absolute; top:8px; right:10px;">
	      	<el-button @click="CloseNoIncomeShow()">取消</el-button>
	      	<el-button type="primary"@click="ensureIncome()">申请</el-button>
	      </div>
	      <div class="basicTitle">基本信息</div>
	      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
	      	 <!-- <el-form-item label="借款人" prop="name">
	      	 			    <el-input class="name_input" v-model="ruleForm.name"></el-input>
	      	 			    <el-button class="name_button" @click="IncomeName()">选择</el-button>
	      	 			 </el-form-item> -->
			 <el-form-item label="团期计划" prop="plan" style="float:left;">
			    <el-input class="name_input" @blur="tour_check" v-model="ruleForm.plan" placeholder="请输入团期计划"></el-input>
			    <el-input style="width:300px;" disabled v-model="ruleForm.plan_01" placeholder=" 通过输入团期计划，自动补充产品名
称"></el-input>
			    <el-button class="name_button" @click="IncomePlan()">选择</el-button>
			 </el-form-item>
			 <!-- <el-form-item prop="plan_01" style="float:left; margin-left:-90px;">
			    <el-input class="name_input" v-model="ruleForm.plan_01"></el-input>
			    <el-button class="name_button" @click="IncomePlan()">选择</el-button>
			 </el-form-item> -->
			 <el-form-item label="供应商名称" prop="supplier" style="clear:both;">
			    <!-- <el-input class="name_input" v-model="ruleForm.supplier" placeholder="请输入供应商名称"></el-input> -->
			    <el-autocomplete class="name_input" v-model="ruleForm.supplier" :fetch-suggestions="querySearch3"placeholder="请输入供应商名称" :trigger-on-focus="false"@select="departure"></el-autocomplete>
			 </el-form-item>
			 <el-form-item label="借款类型" prop="planType">
			    <el-select v-model="ruleForm.planType" placeholder="请选择借款类型">
				  <el-option v-for="item in borrowingType" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			 </el-form-item>
			 <el-form-item label="借款金额" prop="planAmount" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.planAmount" placeholder="请输入借款金额"></el-input>
			 </el-form-item>
			 <el-form-item label="摘要" prop="abstract" style="clear:both;">
			    <el-input class="name_input01" v-model="ruleForm.abstract" placeholder="请输入摘要"></el-input>
			 </el-form-item>
			 <el-form-item label="汇款账户" prop="account" style="float:left;">
			    <el-input class="name_input" v-model="ruleForm.account" placeholder="请输入汇款账号"></el-input>
			 </el-form-item>
			 <el-form-item prop="accountOpenName" style=" float:left; margin: 0 0 0 -90px;">
			    <el-input class="name_input" v-model="ruleForm.accountOpenName" placeholder="请输入开户名"></el-input>
			 </el-form-item>
			 <el-form-item prop="accountBank" style="float:left; margin: 0 0 0 -90px;">
			    <el-input class="name_input" v-model="ruleForm.accountBank" placeholder="请输入开户行"></el-input>
			 </el-form-item>
			 <el-button class="plan_button" @click="IncomeAccount()">选择</el-button>
			 <!-- <el-form-item label="付款方式" prop="payment">
			    <el-select v-model="ruleForm.payment" placeholder="请选择">
			 				  <el-option v-for="item in payment_01" :key="item.value" :label="item.label" :value="item.value"></el-option>
			 				</el-select>
			 </el-form-item> -->
			 <!-- <el-form-item label="附件" prop="accessory" style="clear:both;">
			    <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList">
			  		<el-button type="primary">选择文件</el-button>
			 				</el-upload>
			 </el-form-item> -->
			 <el-form-item label="附件" style="clear:both;" prop="accessory">
                <el-upload class="upload-demo" name="files" ref="upload" :action="this.upload_url" :file-list="fileList" :on-error="handleError" :on-success="handleSuccess" :on-remove="handleRemove" :on-preview="handlePreview" list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
			 <div class="basicTitle">相关信息</div>
			 <el-table :data="tableMoney" border style="width: 95%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
	           <el-table-column prop="payable" label="订单总额" align="center"></el-table-column>
	           <el-table-column prop="paymentChecking" label="审批中借款总额" align="center"></el-table-column>
	           <el-table-column prop="payment" label="已审批借款总额" align="center"></el-table-column>
	           <el-table-column prop="expenseChecking" label="报销中总额" align="center"></el-table-column>
	           <el-table-column prop="expense" label="已报销总额" align="center"></el-table-column>
	           <el-table-column prop="price" label="已收总额" align="center"></el-table-column>
	           <el-table-column prop="supTotal" label="供应商欠款总额" align="center"></el-table-column>
	        </el-table>
	        <div style="margin:0 0 0 25px;">无收入借款明细</div>
	        <el-table :data="tableIncome" border style="width: 95%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
	           <el-table-column prop="paymentID" label="ID" width="50" align="center"></el-table-column>
	           <el-table-column prop="checkType" label="审批状态" align="center"></el-table-column>
	           <el-table-column prop="paymentType" label="借款类型" align="center"></el-table-column>
	           <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
	           <el-table-column prop="price" label="金额" align="center"></el-table-column>
	           <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
	           <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
	           <el-table-column prop="process" label="审批过程" align="center">
	           	<template slot-scope="scope">
			      <div @click="processIncome(scope.row)">查看</div>
			    </template>
	           </el-table-column>
	           
	        </el-table>
	        <div style="margin:0 0 0 25px;">预付款明细</div>
	        <el-table :data="tablePayment" border style="width: 95%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
	           <el-table-column prop="paymentID" label="ID" width="50" align="center"></el-table-column>
	           <el-table-column prop="checkType" label="审批状态" align="center"></el-table-column>
	           <el-table-column prop="paymentType" label="借款类型" align="center"></el-table-column>
	           <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
	           <el-table-column prop="price" label="金额" align="center"></el-table-column>
	           <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
	           <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
	           <el-table-column prop="process" label="审批过程" align="center">
	           	<template slot-scope="scope">
			      <div @click="processIncome(scope.row)">查看</div>
			    </template>
	           </el-table-column>
	        </el-table>
	        <div style="margin:0 0 0 25px;">收入明细</div>
	        <el-table :data="tableEarning" border style="width: 90%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
	           <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
	           <el-table-column prop="source" label="订单来源" align="center"></el-table-column>
	           <el-table-column prop="contactName" label="订单联系人" align="center"></el-table-column>
	           <el-table-column prop="number" label="人数" align="center"></el-table-column>
	           <el-table-column prop="payable" label="订单金额" align="center"></el-table-column>
	           <el-table-column prop="paid" label="已收金额" align="center"></el-table-column>
	           <!-- <el-table-column prop="Number(payable)-Number(paid)" label="欠款金额" align="center"></el-table-column> -->
	           <el-table-column label="欠款金额" align="center">
	           	<template slot-scope="scope">{{scope.row.payable-scope.row.paid}}</template>
	           </el-table-column>
	           <el-table-column prop="createTime" label="欠款日期" align="center"></el-table-column>
	           <el-table-column prop="shouldAlso" label="应还日期" align="center"></el-table-column>
	        </el-table>
	      </el-form>
	    </el-dialog>
	    <!--查看图片文件弹窗-->
	  	<el-dialog style="text-align: left" title="放大图片:" :visible.sync="dialogVisible4" width="50%">
	      <!-- <el-button type="primary" @click="downs()" style="margin-bottom: 30px;">点击下载</el-button> -->
	      <div>
	        <img :src="imgBig" style="width: 95%;" alt="图片" :alt="imgBigName"/>
	        <br /><span>{{imgBigName}}</span>
	      </div>
	    </el-dialog>
	  <!--申请无收入借款中借款人选择弹窗-->
	  <!-- <el-dialog width="45%" title="选择报销的人" :visible.sync="dialogFormVisible1"append-to-body>
	      <div class="indialog">
	        <div class="indialog_search">
	          <el-input v-model="number_name" placeholder="请输入内容" class="name_input"></el-input>
	          <el-button type="primary">搜索</el-button>
	        </div>
	        <el-table :data="tableName" border style="width: 100%; margin:30px 0 20px 0;":header-cell-style="getRowClass">
	          <el-table-column prop="id" label="ID" align="center"></el-table-column>
	          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
	          <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
	          <el-table-column prop="orgName" label="组织" align="center"></el-table-column>
	          <el-table-column prop="sex" label="性别" align="center"></el-table-column>
	          <el-table-column prop="userStateCN" label="状态" align="center"></el-table-column>
	        </el-table>
	        <div class="number_button">
	        	<el-button @click="numberCancel()">取消</el-button>
	      		<el-button type="primary">申请</el-button>
	        </div>
	      </div>
	        </el-dialog> -->
      <!--申请无收入借款中团期计划选择弹窗-->
	  <el-dialog width="70%" title="团期计划" :visible.sync="dialogFormVisible_plan"append-to-body>
	      <div class="indialog">
	        <div class="indialog_search">
	          <div class="plan_indialog">
				<span class="indialog_plan">团期计划</span>
				<el-input class="indialog_input" v-model="plan_stage" clearable placeholder="请输入"></el-input>
			  </div>
			  <div class="plan_indialog">
				<span class="indialog_plan">产品名称</span>
				<el-input class="indialog_input" v-model="plan_name" clearable placeholder="请输入"></el-input>
			  </div>
			  <div class="plan_indialog">
				<span class="indialog_plan">出行日期</span>
				<el-input class="indialog_input" v-model="plan_data" clearable placeholder="请输入"></el-input>
				<!-- <span>——</span>
				<el-input class="indialog_input01" v-model="plan_data01" clearable></el-input> -->
			  </div>
			  <el-button class="indialog_button" type="primary">搜索</el-button>
	          <el-button class="indialog_button" @click="planStage()" type="primary">重置</el-button>
	        </div>
	        <el-table :data="tablePlan" border ref="multipleTablePlan" style="width: 100%; margin:30px 0 20px 0;":header-cell-style="getRowClass" @row-click="clickPlan" :row-style="rowClassPlan"@selection-change="changeFunPlan">
	          <el-table-column prop="groupCode" label="团期计划ID" align="center"></el-table-column>
	          <el-table-column prop="title" label="产品名称" align="center"></el-table-column>
	          <el-table-column prop="destination" label="目的地" align="center"></el-table-column>
	          <el-table-column prop="date" label="出行日期" align="center"></el-table-column>
	          <!-- <el-table-column prop="orgName" label="部门" align="center"></el-table-column> -->
	          <el-table-column prop="name" label="产品录入人" align="center"></el-table-column>
	        </el-table>
	        <div class="number_button">
	        	<el-button @click="planCancel()">取消</el-button>
	      		<el-button @click="routerHandle4()" type="primary">申请</el-button>
	        </div>
	      </div>
      </el-dialog>
      <!--申请无收入借款中账号选择弹窗-->
      <el-dialog width="45%" title="选择账户" :visible.sync="dialogFormVisible_account"append-to-body>
	      <div class="indialog">
			<el-table :data="tableAccount" ref="multipleTableBank" border style="width: 100%; margin:30px 0 20px 0;":header-cell-style="getRowClass" @row-click="clickBank" :row-style="rowClassBank"@selection-change="changeFunBank">
	          <el-table-column prop="accountNumber" width="200" label="账户" align="center"></el-table-column>
	          <el-table-column prop="openBank" label="开户行" align="center"></el-table-column>
	          <el-table-column prop="accountName" label="开户名" align="center"></el-table-column>
	        </el-table>
	        <div class="number_button">
	        	<el-button @click="accountCancel()">取消</el-button>
	      		<el-button type="primary">申请</el-button>
	        </div>
	      </div>
      </el-dialog>
      <!--申请无收入借款中预付款明细查看弹窗-->
      <el-dialog width="45%" title="预付款明细" :visible.sync="dialogFormVisible_paymenrt"append-to-body>
	      <div class="indialog">
	      	<el-table :data="tableApprove" border style=" width:90%;margin:30px 0 20px 25px;":header-cell-style="getRowClass">
	           <el-table-column prop="times" label="审批时间" width="150" align="center"></el-table-column>
	           <el-table-column prop="people" label="审批人" align="center"></el-table-column>
	           <el-table-column prop="result" label="审批结果" align="center"></el-table-column>
	           <el-table-column prop="opinion" label="审批意见" align="center"></el-table-column>
	        </el-table>
	      </div>
      </el-dialog>
      <!--申请无收入借款中无收入借款明细查看弹窗-->
      <el-dialog width="45%" title="无收入借款明细" :visible.sync="dialogFormVisible_Income"append-to-body>
	      <div class="indialog">
	      	<el-table :data="tableIncomeCheck" border style=" width:90%;margin:30px 0 20px 25px;":header-cell-style="getRowClass">
	           <el-table-column prop="times" label="审批时间" width="150" align="center"></el-table-column>
	           <el-table-column prop="people" label="审批人" align="center"></el-table-column>
	           <el-table-column prop="result" label="审批结果" align="center"></el-table-column>
	           <el-table-column prop="opinion" label="审批意见" align="center"></el-table-column>
	        </el-table>
	      </div>
      </el-dialog>
      <!--查看无收入借款弹窗-->
	  <el-dialog title="借款申请详情" :visible.sync="checkIncomeShow" width="1100px" custom-class="city_list" :show-close='false'>
	    <!-- <div style="line-height:30px; background:#d2d2d2;padding:0 10px; border-radius:5px; position:absolute; top:13px; left:100px;">审核中</div> -->
      	<div style="position:absolute; top:8px; right:10px;">
      		<el-button @click="CloseCheckIncomeShow()">取消</el-button>
      		<el-button @click="repeal()" type="danger" plain>撤销借款</el-button>
      	</div>
	    <checkLoanManagement :paymentID="paymentID" :groupCode="groupCode"></checkLoanManagement>
	  </el-dialog>
  </div>
</template>




<script>
import checkLoanManagement from './checkLoanManagement/checkLoanManagement'
  export default {
  	name: "borrowing",
	components: {
	  checkLoanManagement,
	},
    data(){
      return {
      	
      	 //表头切换
         empty:'',
         people:'',
         planTime:'',
         planData:'',
         settlement:[{
	          value: '审批中',
	          label: '审批中'
	         }, {
	          value: '通过',
	          label: '通过'
	         }, {
	          value: '驳回',
	          label: '驳回'
	         }],
	     settlement_01:'',
         //借款表格
         forbidden:true,
		 multipleSelection: [],
		 paymentID:0,
		 groupCode:0,
         tableData:[],
		 //分页
		 pagesize: 10, // 设定默认分页每页显示数
         pageIndex: 1, // 设定当前页数
         total: 0,
         currentPage: 1,
         //无收入借款弹窗
         noIncomeShow:false,
         ruleForm: {
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
          //accessory:'',
         },
         dialogVisible4:false,//查看图片文件弹窗
         imgBig: '',
         imgBigName: '',
         upload:{
         	accessory:'',
         },
         tour_id:0,//无收入弹窗id
         supplier_id:0,//无收入供应商id
         borrowingType: [],//无收入借款类型选择器
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
          //plan: [{ required: true, message: '请输入团期计划', trigger: 'blur' }],
          plan_01: [{ required: true, message: '请输入团期计划', trigger: 'blur' }],
          supplier:[{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
          planType:[{ required: true, message: '请选择借款类型', trigger: 'change' }],
          planAmount:[{ required: true, message: '请输入借款金额', trigger: 'blur' },
          			  { pattern: /^[+]{0,1}(\d+)$/, message: '借款金额需为正整数' }],
          abstract:[{ required: true, message: '请输入摘要', trigger: 'blur' },
          			{ min: 0, max: 30, message: '摘要字数超过80汉字限制', trigger: 'blur' },],
          account:[{ required: true, message: '请输入汇款账号', trigger: 'blur' }],
          accountBank:[{ required: true, message: '请输入开户行', trigger: 'blur' }],
          accountOpenName:[{ required: true, message: '请输入开户名', trigger: 'blur' }],
          payment:[{ required: true, message: '请选择付款方式', trigger: 'blur' }],
          //accessory:[{ required: true, message: '附件不能为空', trigger: 'change' }],
         },
         fileList: [],
         //无收入借款中借款人弹窗
         dialogFormVisible1:false,
         number_name:'',
         tableName: [],//申请无收入借款中借款人选择弹窗表格
          //无收入借款中团期计划弹窗
          dialogFormVisible_plan:false,
          plan_stage:'',
          plan_name:'',
          plan_data:'',
          plan_data01:'',
          tablePlan:[],//申请无收入借款中团期计划选择弹窗表格
          multipleSelectionPlan: [],
          //无收入借款中账户弹窗
          dialogFormVisible_account:false,
          tableAccount:[{//无收入借款中账户弹窗表格
          	accountNumber:'1234 1234 1234 1234 1234',
          	openBank:'建行',
          	accountName:'洋洋'
          },{//无收入借款中账户弹窗表格
          	accountNumber:'1234 1234 1234 1234 1234',
          	openBank:'弄行',
          	accountName:'洋洋'
          }],
          multipleSelectionBank:[],//银行表格高亮
          //无收入借款金额表格
          tableMoney:[],
          //无收入借款弹窗预付款明细表格
          tablePayment:[],
          //无收入借款弹窗中预付款明细查看弹窗
          dialogFormVisible_paymenrt:false,
          tableApprove:[{
          	times:' 2019-1-14 19:00:00',
			people:'洋洋',
			result:'通过',
			opinion:'不同意'
          }],
          ////无收入借款弹窗中无收入借款明细弹窗
          tableIncome:[],
          //无收入借款弹窗中预付款明细查看弹窗
          dialogFormVisible_Income:false,
          tableIncomeCheck:[{
          	times:' 2019-1-14 19:00:00',
			people:'洋洋1',
			result:'通过',
			opinion:'不同意'
          }],
          //无收入借款弹窗中收入明细表格
          tableEarning:[],
		   //查看无收入借款弹窗
		   checkIncomeShow:false,
		   //查看无收入借款审批过程
		   tableCourse:[{
		   	people:'1',
		   	result:'通过',
		   	opinion:'同意',
		   	times:'2019-04-25'
		   }],
		    tour_name_pre: '',
		    product_name_pre:'',
		    planID:'',
		    //供应商选择银行账号
		    supplier_id:0,
		    tableData2:[],
		    upload_url: this.GLOBAL.imgUrl + '/upload/api/picture',//图片上传
		    uid: 0, //上传图片缩略图选中项
		   


      }
    },
    methods: {
	  handleClick(tab, event) {//表头点击切换
	  	//this.tableData='';
    	console.log(tab, event);
	  },
	  //重置
	  emptyButton(){
	  	this.empty = '';
	  	this.people = '';
	  	this.planTime = '';
	  	this.planData = '';
	  }, 
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
        this.paymentID=row.paymentID;
        this.guid=row.guid;
        this.groupCode=row.groupCode;
      },
      rowClass({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].paymentID==row.paymentID){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      //银行表格高亮
      changeFunBank(val) {
        this.multipleSelectionBank=val;
      },
      clickBank(row){    //选中行复选框勾选
      	this.$refs.multipleTableBank.clearSelection(); //清空用户的选择  
        this.$refs.multipleTableBank.toggleRowSelection(row);
      },
      rowClassBank({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.multipleSelectionBank.length;i++){
          if(this.multipleSelectionBank[i].planID==row.planID){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      //供应商选择银行账号
      IncomeAccount() {
      if (this.supplier_id) {
        this.dialogFormVisible_account = true;
        this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/banklist', {
          "object": {
            "supplierID": this.supplier_id, //供应商ID
          }
	    }).then(res => {
	       this.tableAccount = res.data.objects;
	        }).catch(err => {
	          console.log(err)
	        })
	      } else {
	        this.$message.error('供应商未匹配后台数据,请手动输入银行信息!');
	      }
    	},
    //	
    querySearch3(queryString3, cb) {
      this.tableData2 = []
      this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/supplierlist', {
        "object": {
          name: queryString3
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.tableData2.push({
            "value": res.data.objects[i].name,
            "id": res.data.objects[i].id
          })
          this.supplier_id = res.data.objects[i].id ? res.data.objects[i].id : 0;
        }
        var results = queryString3 ? this.tableData2.filter(this.createFilter(queryString3)) : [];
        cb(results)
      }).catch(err => {
        console.log(err);
      })
    },
    createFilter(queryString1){
      return (restaurant) => {
        return (restaurant.value);
      }
    },
    departure(item){
      console.log(item)
      /*this.productPos = item.id;
      this.originPlace = item.value;*/
      this.productPos = item.id;
      this.originPlace = item.value;
    },
    //分页
    handleSizeChange(page) {
      this.currentPage = 1;
      this.pagesize = page;
      this.pageList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.pageList();
    },
      //无收入借款弹窗
      noIncome(){//点击显示弹窗
      	this.noIncomeShow =true;
      	//this.$refs["ruleForm"].resetFields();
      	this.clearPlan();
      },
      CloseNoIncomeShow(){//点击关闭弹窗
      	this.$confirm("去否取消本次借款申请?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
        }).then(res => {
             this.$message.success("借款申请已取消");
             this.noIncomeShow =false;
  		     this.$refs["ruleForm"].resetFields();
  		     this.clearPlan();
           })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      	
      },
      clearPlan(){//清楚申请无收入借款弹窗内容
      	this.ruleForm.plan = '';
      	this.ruleForm.plan_01 = '';
      	this.ruleForm.supplier = '';
      	this.ruleForm.planType = '';
      	this.ruleForm.planAmount = '';
      	this.ruleForm.abstract = '';
      	this.ruleForm.account = '';
      	this.ruleForm.accountOpenName = '';
      	this.ruleForm.accountBank = '';
      	//this.accessory = '';
      	this.tour_id = 0;

      },
      //无收入借款中借款人弹窗
      /*IncomeName(){
      	this.dialogFormVisible1 = true;
      	this.incomeNameList();
      },
      //查询借款人列表
      incomeNameList() {
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/userlist",
          {
             object: {
	          isDeleted: 0
	        },
	        isGetAll: true,
	        id: 0
          },)
          .then(function (obj) {
            that.total = obj.data.total
            that.tableName = obj.data.objects
            console.log(obj.data.objects)
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },numberCancel(){
      	this.dialogFormVisible1 = false;
      },*/
      //无收入借款中团期计划弹窗
      IncomePlan(){
      	this.planList();
      	this.dialogFormVisible_plan = true;
      },
      //查询无收入借款团期计划列表
      planList(){
      	this.$http.post(
          this.GLOBAL.serverSrc + "/teamquery/get/api/planfinancelist",
          {
            "object": {
	          "groupCode": this.plan_stage, //团号
	          "title": this.plan_name, //产品名称
	          "beginDate": this.plan_data ? formatDate(this.plan_data, 'yyyyMMdd') : 0, //搜索用开始日期
	          "endDate": this.plan_data01 ? formatDate(this.plan_data01, 'yyyyMMdd') : 0, //搜索用结束日期
	        }
          },)
          .then(res => {
            //that.total = obj.data.total
            this.tablePlan = res.data.objects;
            console.log(res.data.objects)
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      clickPlan(row){//无收入借款团期计划表格
      	this.$refs.multipleTablePlan.clearSelection(); //清空用户的选择
        this.$refs.multipleTablePlan.toggleRowSelection(row);
        this.tour_name_pre = row['groupCode'];
      	this.product_name_pre = row['title'];
      	this.planID = row['planID'];
      	this.tour_id = row['planID']
      },
      rowClassPlan({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.multipleSelectionPlan.length;i++){
          if(this.multipleSelectionPlan[i].planID==row.planID){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      routerHandle4() { //团期计划
	      this.ruleForm.plan = this.tour_name_pre
	      this.ruleForm.plan_01 = this.product_name_pre
	      this.getPaymentdetails(this.planID)
	      this.dialogFormVisible_plan = false
	    },
      getPaymentdetails(val) {
      var that = this
      //预付付款明细
      that.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
        "object": {
          "paymentType": 2,
          "planID": val,
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tablePayment = res.data.objects
        }
      }).catch(err => {
        console.log(err)
      })
      //无收入借款明细
      that.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
        "object": {
          "paymentType": 1,
          "planID": val,
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tableIncome = res.data.objects
        }
      }).catch(err => {
        console.log(err)
      })
      //根据计划ID获取订单总额,已收款总额,总人数,已审批借款总额，审批中借款总额/
      that.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/fivetotal', {
        "object": {
          "id": val,
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tableMoney = []
          that.tableMoney.push(res.data.object)
        }
      }).catch(err => {
        console.log(err)
      })
      //收入明细
      that.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderlist', {
        "object": {
          "planID": val,
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tableEarning = res.data.objects
          //that.tableEarning.push(res.data.object)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    tour_check() {
      if (this.ruleForm.plan != '') {
        this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
          "pageIndex": 1,
          "pageSize": 1,
          "object": {
            "groupCode": this.ruleForm.plan, //团号
            "title": '', //产品名称
            "beginDate": 0, //搜索用开始日期
            "endDate": 0, //搜索用结束日期
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            this.product_name_pre = res.data.objects[0].title
            this.ruleForm.plan_01 = res.data.objects[0].title
            this.getPaymentdetails(res.data.objects[0].planID)
          }
        }).catch(err => {
          console.log(err)
          this.product_name_pre = ''
          this.ruleForm.plan_01 = ''
        })
      } else {
        this.product_name_pre = ''
        this.ruleForm.plan_01 = ''
      }
    },
      changeFunPlan(val) {
        this.multipleSelectionPlan=val;
        //event.cancelBubble = true;//row-click和selection-change耦合事件
      },
      planCancel(){
      	this.dialogFormVisible_plan = false;
      },
      planStage(){
      	this.plan_stage = '';
      	this.plan_name = '';
      	this.plan_data = '';
      	this.plan_data01 = '';
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
      checkIncome(row){
      	this.checkIncomeShow = true;
      	this.ruleForm = row;
      	//this.getLabel();
      },
      CloseCheckIncomeShow(){
      	this.checkIncomeShow = false;
      },
      //查询列表
      pageList() {
      	let objectRequest = {}
      	objectRequest.paymentType = 1;
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/finance/payment/api/page",
          {
            "pageSize":this.pagesize,
            "pageIndex":this.currentPage,
            "total": 0,
            "object": objectRequest,
          },)
          .then(function (obj) {
            that.total = obj.data.total
            that.tableData = obj.data.objects
            console.log(obj.data.objects)
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      /*getLabel(){//获取一条信息
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get',{
           "id":this.multipleSelection[0].id
          }).then(res => {
              if(res.data.isSuccess == true){
                 let data = res.data.object;
                 this.ruleForm.name=data.name;
				 this.ruleForm.plan=data.plan;
				 this.ruleForm.supplier=data.supplier;
				 this.ruleForm.planType=data.planType;
				 this.ruleForm.planAmount=data.planAmount;
			   	 this.ruleForm.abstract=data.abstract;
				 this.ruleForm.account=data.account;
				 this.ruleForm.accountBank=data.accountBank;
				 this.ruleForm.accountOpenName=data.accountOpenName;
				 this.ruleForm.payment=data.payment;
				 this.tour_id = obj.data.object.planID
              }
        }) 
      },*/
      //申请无收入借款
      ensureIncome(){
      	this.$refs.ruleForm.validate((valid) => {
          if (valid) {
          	let pictureList = [];
	          for (let i = 0; i < this.fileList.length; i++) {
	            let picture = {};
	            picture.url = this.fileList[i].url;
	            picture.name = this.fileList[i].name;
	            pictureList.push(picture);
	          }
	          
            var _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/finance/payment/api/insert",
              {
                object: {
                  createUser:sessionStorage.getItem('id'),
	              paymentType: 1, //借款类型 1无收入借款 2预付款
	              planID: this.tour_id, //对应计划ID --Plan，不存在传值0
	              supplierID: this.supplier_id, //对应供应商ID --Supplier，不存在传值0
	              supplierName: this.ruleForm.supplier, //Supplier不存在时补充供应商名称
	              supplierType: this.ruleForm.planType, //供应商类型 0返款
	              price: this.ruleForm.planAmount, //金额
	              mark: this.ruleForm.abstract, //摘要
	              cardNumber: this.ruleForm.account, //账号
	              bankName: this.ruleForm.accountBank, //开户行
	              cardName: this.ruleForm.accountOpenName, //开户名
	              //payway: this.ruleForm.payment, //付款方
	              files: pictureList, //上传图片
                }
              })
              .then(res => {
                if(res.data.isSuccess == true){
                   this.pageList();
                   this.sendBPM(res.data.object)
                   this.noIncomeShow = false;
                   this.$refs["ruleForm"].resetFields();
                   //this.$refs[formName].resetFields();
                }else{
                   this.$message.success("添加失败");
                }
            })
          } else {
            return false;
          }
        });
      },
      sendBPM(result) {
	      this.$http.post(this.GLOBAL.jqUrl + '/api/JQ/StartUpWorkFlowForJQ', {
	        jQ_ID: result.guid,
	        jQ_Type: result.flowModel,
	        workflowCode: result.flowModelName,
	        userCode: sessionStorage.getItem('account'), //未指定呢
	      }).then(res => {
	        let result = JSON.parse(res.data);
	        if (result.code == '0') {
	          console.log('启动工作流成功');
	        } else {
	          console.log('启动工作流错误!');
	          console.log(res.data);
	        }
	      }).catch(err => {
	        console.log(err);
	      })
	    },
      //付款方式
      payment(){
      	this.payment_01 = [];
	      this.$http.post(this.GLOBAL.serverSrc + '/finance/payway/api/get', {}).then(res => {
	        for (let i = 0; i < res.data.objects.length; i++) {
	          this.payment_01.push({
	            "value": res.data.objects[i].id,
	            "label": res.data.objects[i].name
	          })
	        }
	      })
	      .then(res =>{
	        this.payment_01 =  res.data.objects;
	      }).catch(function(err){
	        console.log(err);
	      })
	    
      },
      //供应商类型
      themeList(){
	      this.borrowingType = [];
	      this.$http.post(this.GLOBAL.serverSrc + '/universal/suppliertype/api/get', {}).then(res => {
	        for (let i = 0; i < res.data.objects.length; i++) {
	          this.borrowingType.push({
	            "value": res.data.objects[i].id,
	            "label": res.data.objects[i].name
	          })
	        }
	      })
	      .then(res =>{
	        this.borrowingType =  res.data.objects;
	      }).catch(function(err){
	        console.log(err);
	      })
	    },
	    //文件上传
	    handleChange(file, fileList) {
	      this.fileList = fileList.slice(-3);
	    },
	    handleError(err, file) {
	      console.log('失败')
	      this.fileList = []
	    },
	    handleSuccess(res, file, fileList) {
	      //多次添加图片判断，如果是第一次添加修改全部图片数据，否则修改新添加项数据            
	      if (this.time != fileList.length) { //多张图片情况只在第一次执行数组操作
	        this.time = fileList.length;
	        if (this.fileList.length == 0) {
	          this.fileList = fileList;
	        } else {
	          this.len = this.fileList.length;
	          for (let i = this.len; i < fileList.length; i++) {
	            this.fileList.push(fileList[i]);
	          }
	        }
	      }
	      var paths = null;
	      for (let i = this.len; i < fileList.length; i++) {
	        paths = JSON.parse(fileList[i].response).paths[0];
	        this.$set(this.fileList[i], "width", paths.Width);
	        this.$set(this.fileList[i], "height", paths.Height);
	        this.$set(this.fileList[i], "url1", paths.Url);
	        this.$set(this.fileList[i], "length", paths.Length);
	        this.$set(this.fileList[i], "name", paths.Name);
	      }
	      this.uid = fileList[0].uid;
	    },
	    handleRemove(file, fileList) {
	      this.uid = fileList[0].uid;
	      this.fileList = fileList
	    },
	    handlePreview(file, fileList) {
	      this.uid = file.uid
	      this.dialogVisible4 = true
	      this.imgBig = file.url
	      this.imgBigName = file.name
	    },
	    //撤销借款
	    /*repeal(){
	        this.$confirm("其否需要撤销该笔借款?", "提示", {
	           confirmButtonText: "确定",
	           cancelButtonText: "取消",
	           type: "warning"
	        })
	        .then(() => {
	          this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/delete',
	          {
	            "id": this.paymentID
	          })
	          .then(res => {
	            if(res.data.isSuccess == true){
	               this.$message.success("撤销成功");
	               this.pageList();
	               this.checkIncomeShow = false;

	              }
	           })
	        })
	        .catch(() => {
	          this.$message({
	            type: "info",
	            message: "撤销借款已取消"
	          });
	        });
	      },*/
	      repeal(){
	        this.$confirm("其否需要撤销该笔借款?", "提示", {
	           confirmButtonText: "确定",
	           cancelButtonText: "取消",
	           type: "warning"
	        })
	        .then(() => {
	          this.$http.post(
	          this.GLOBAL.jqUrl + "/api/JQ/EndProcessForJQ",
	          {
	            "jq_id": this.guid,
	            "jQ_Type": 1
	          })
	          .then(res => {
	            if(res.data.isSuccess == true){
	               this.$message.success("撤销成功");
	               //this.pageList();
	               this.deleteBorrow();

	              }
	           })
	        })
	        .catch(() => {
	          this.$message({
	            type: "info",
	            message: "撤销借款已取消"
	          });
	        });
	      },
	      deleteBorrow(){
	          this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/delete',
	          {
	            "id": this.paymentID
	          })
	          .then(res => {
	            if(res.data.isSuccess == true){
	               this.$message.success("撤销成功");
	               this.pageList();
	               this.checkIncomeShow = false;

	              }
	           })
	        .catch(() => {
	          this.$message({
	            type: "info",
	            message: "撤销借款已取消"
	          });
	        });
	      },

    },

    mounted(){
      this.pageList();
    },
    created(){
      this.themeList();
      this.payment();
    },
  }
</script>
<style scoped>
	
	.loanManagement{text-align: center; font-family: '微软雅黑'; font-size: 11pt;overflow: hidden; text-align: left; margin: -15px 0 100px 0;}
	.loanBorder{border-left:1px solid #e6e6e6;border-right:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6; margin:15px 0 20px 0; overflow: hidden; clear: both;}
	/*搜索框*/
	.empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
	.fl{float:left; margin: 20px 0 20px 0;}
	.emptyPlan{margin: 0 0 0 30px; float:left; width:80px; text-align:right; line-height:40px;}
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
	.plan_button{margin-top:1px; background:#eaeaea;color:#a4a4a4;}
	.plan_button:hover{color:#a4a4a4;}
	/*申请无收入借款中借款人弹窗*/
	.indialog{min-height: 300px; overflow: hidden;}
	.mask_name{background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0;filter:alpha(opacity=50);opacity:0.5; z-index: 101;}
	.number_button{float:right; margin: 0 0 20px 0;}
	/*申请无收入借款中团期计划弹窗*/
	.plan_indialog{float:left; line-height: 40px;}
	.indialog_plan{float:left; margin: 0 10px 0 10px;}
	.indialog_input{float:left; width: 160px;}
	.indialog_input01{float:left; width: 80px;}
	.plan_indialog span{float:left; margin: 0 10px 0 10px;}
	.indialog_button{margin: 0 0 0 10px;}
	/*申请无收入借款中附件*/
	.upload-demo{width: 400px;}
	.upload-demo>>>.el-upload-list__item{ width: 300px; }

	.el-dialog__wrapper{top:-10%;}

	.basicTitle{font-size: 14pt; line-height: 40px; margin: 0 0 20px 0;}

</style>
