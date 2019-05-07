<template>
  <div class="loanManagement">
	  <el-tabs v-model="activeName" @tab-click="handleClick">
	    <el-tab-pane label="借款" name="first">
	    	<div class="loanBorder">
				<div class="plan">
					<div class="fl">
						<span class="emptyPlan">团期计划</span>
						<el-input v-model="empty" class="empty" clearable></el-input>
					</div>
					<div class="fl">
						<span class="emptyPlan">申请人</span>
						<el-input v-model="people" class="empty" clearable></el-input>
					</div>
					<div class="fl">
						<span class="emptyPlan">发起时间</span>
						<el-date-picker v-model="planTime" type="date" class="planTime" placeholder="日期"></el-date-picker>
						<span class="time">——</span>
						<el-date-picker v-model="planData" type="date" class="planTime" placeholder="日期"></el-date-picker>
					</div>
				</div>
				<div class="primary"><el-button @click="emptyButton()" type="primary">重置</el-button></div>
				<div class="primary">
					<el-button plain @click="noIncome()">申请无收入借款</el-button>
					<el-button plain @click="checkIncome()">查看借款</el-button>
				</div>
				<el-table :data="tableData" ref="multipleTable" class="labelTable" :header-cell-style="getRowClass" border>
		          <el-table-column prop="order" label="借款单号" width="120" align="center"></el-table-column>
		          <el-table-column prop="state" label="状态" width="80" align="center">
		          	<template slot-scope="scope">
			          <div v-if="scope.row.state=='申请中'" style="color: #7F7F7F" >{{scope.row.state}}</div>
			          <div v-if="scope.row.state=='驳回'" style="color: #FF4A3D" >{{scope.row.state}}</div>
			          <div v-if="scope.row.state=='通过'" style="color: #33D174" >{{scope.row.state}}</div>
			        </template>
		          </el-table-column>
		          <el-table-column prop="startingTime" label="发起时间" width="180" align="center"></el-table-column>
		          <el-table-column prop="groupPlan" label="团期计划" width="180" align="center"></el-table-column>
		          <el-table-column prop="supplierName" label="供应商名称" width="150" align="center"></el-table-column>
		          <el-table-column prop="genre" label="类型" width="80" align="center"></el-table-column>
		          <el-table-column prop="amount" label="借款金额" width="120" align="center"></el-table-column>
		          <el-table-column prop="verification" label="已核销金额" width="120" align="center"></el-table-column>
		          <el-table-column prop="payment" label="已付款金额" width="120" align="center"></el-table-column>
		          <el-table-column prop="organization" label="申请组织" width="150" align="center"></el-table-column>
		          <el-table-column prop="proposer" label="申请人" width="100" align="center"></el-table-column>
		          <el-table-column prop="approvalOpinion" label="审批意见" width="180" align="center"></el-table-column>
		        </el-table>
		        <!--分页-->
		        <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
			</div>
	    </el-tab-pane>
	    <el-tab-pane label="需要您的审批" name="second">
	    	<div class="loanBorder">
				<div class="plan">
					<div class="fl">
						<span class="emptyPlan">团期计划</span>
						<el-input v-model="empty" class="empty" clearable></el-input>
					</div>
					<div class="fl">
						<span class="emptyPlan">申请人</span>
						<el-input v-model="people" class="empty" clearable></el-input>
					</div>
					<div class="fl">
						<span class="emptyPlan">发起时间</span>
						<el-date-picker v-model="planTime" type="date" class="planTime" placeholder="日期"></el-date-picker>
						<span class="time">——</span>
						<el-date-picker v-model="planData" type="date" class="planTime" placeholder="日期"></el-date-picker>
					</div>
				</div>
				<div class="primary"><el-button @click="emptyButton()" type="primary">重置</el-button></div>
				<div class="primary">
					<el-button plain>审批</el-button>
				</div>
				<el-table :data="tableData" ref="multipleTable" class="multipleTable" :header-cell-style="getRowClass" border>
		          <el-table-column prop="order" label="借款单号" width="120" align="center"></el-table-column>
		          <el-table-column prop="state" label="状态" width="80" align="center"></el-table-column>
		          <el-table-column prop="startingTime" label="发起时间" width="180" align="center"></el-table-column>
		          <el-table-column prop="groupPlan" label="团期计划" width="180" align="center"></el-table-column>
		          <el-table-column prop="supplierName" label="供应商名称" width="150" align="center"></el-table-column>
		          <el-table-column prop="genre" label="类型" width="80" align="center"></el-table-column>
		          <el-table-column prop="amount" label="借款金额" width="120" align="center"></el-table-column>
		          <el-table-column prop="organization" label="申请组织" width="150" align="center"></el-table-column>
		          <el-table-column prop="proposer" label="申请人" width="100" align="center"></el-table-column>
		        </el-table>
		        <!--分页-->
		        <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
			</div>
	    </el-tab-pane>
	    <div></div>
	  </el-tabs>
	
	<!--申请无收入借款弹窗-->
	  <div v-show="noIncomeShow">
	    <div class="mask" @click="CloseNoIncomeShow()"></div>
	    <div class="noIncome">
	      <div class="noIncomeTitle">
	      	<div class="noIncomeTitle_l">借款申请</div>
	      	<div class="noIncomeTitle_r">
	      		<el-button @click="CloseNoIncomeShow()">取消</el-button>
	      		<el-button type="primary">申请</el-button>
	      	</div>
	      </div>
	      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
	      	 <el-form-item label="借款人" prop="name">
			    <el-input class="name_input" v-model="ruleForm.name"></el-input>
			    <el-button class="name_button" @click="IncomeName()">选择</el-button>
			 </el-form-item>
			 <el-form-item label="团期计划" prop="plan" style="float:left;">
			    <el-input class="name_input" v-model="ruleForm.plan"></el-input>
			 </el-form-item>
			 <el-form-item prop="plan_01" style="float:left; margin-left:-90px;">
			    <el-input class="name_input" v-model="ruleForm.plan_01"></el-input>
			    <el-button class="name_button" @click="IncomePlan()">选择</el-button>
			 </el-form-item>
			 <el-form-item label="供应商" prop="supplier" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.supplier"></el-input>
			 </el-form-item>
			 <el-form-item label="类型" prop="planType">
			    <el-select v-model="ruleForm.planType" placeholder="请选择">
				  <el-option v-for="item in borrowingType" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			 </el-form-item>
			 <el-form-item label="借款金额" prop="planAmount" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.planAmount"></el-input>
			 </el-form-item>
			 <el-form-item label="摘要" prop="abstract" style="clear:both;">
			    <el-input class="name_input01" v-model="ruleForm.abstract"></el-input>
			 </el-form-item>
			 <el-form-item label="账号" prop="account">
			    <el-input class="name_input" v-model="ruleForm.account"></el-input>
			    <el-button class="name_button" @click="IncomeAccount()">选择</el-button>
			 </el-form-item>
			 <el-form-item label="开户行" prop="accountBank" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.accountBank"></el-input>
			 </el-form-item>
			 <el-form-item label="开户名" prop="accountOpenName" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.accountOpenName"></el-input>
			 </el-form-item>
			 <el-form-item label="付款方式" prop="payment">
			    <el-select v-model="ruleForm.payment" placeholder="请选择">
				  <el-option v-for="item in payment_01" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			 </el-form-item>
			 <el-form-item label="附件" prop="accessory" style="clear:both;">
			    <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList">
			  		<el-button type="primary">选择文件</el-button>
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
	      </el-form>
	    </div>
	  </div>
	  <!--申请无收入借款中借款人选择弹窗-->
	  <el-dialog width="45%" title="选择报销的人" :visible.sync="dialogFormVisible1"append-to-body>
	      <div class="indialog">
	        <div class="indialog_search">
	          <el-input v-model="number_name" placeholder="请输入内容" class="name_input"></el-input>
	          <el-button type="primary">搜索</el-button>
	        </div>
	        <el-table :data="tableName" border style="width: 100%; margin:30px 0 20px 0;":header-cell-style="getRowClass">
	          <el-table-column prop="id" label="ID" align="center"></el-table-column>
	          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
	          <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
	          <el-table-column prop="orinaze" label="组织" align="center"></el-table-column>
	          <el-table-column prop="sex" label="性别" align="center"></el-table-column>
	          <el-table-column prop="type" label="状态" align="center"></el-table-column>
	        </el-table>
	        <div class="number_button">
	        	<el-button @click="numberCancel()">取消</el-button>
	      		<el-button type="primary">申请</el-button>
	        </div>
	      </div>
      </el-dialog>
      <!--申请无收入借款中团期计划选择弹窗-->
	  <el-dialog width="70%" title="选择报销的人" :visible.sync="dialogFormVisible_plan"append-to-body>
	      <div class="indialog">
	        <div class="indialog_search">
	          <div class="plan_indialog">
				<span class="indialog_plan">团期计划</span>
				<el-input class="indialog_input" v-model="plan_stage" clearable></el-input>
			  </div>
			  <div class="plan_indialog">
				<span class="indialog_plan">产品名称</span>
				<el-input class="indialog_input" v-model="plan_name" clearable></el-input>
			  </div>
			  <div class="plan_indialog">
				<span class="indialog_plan">出行日期</span>
				<el-input class="indialog_input01" v-model="plan_data" clearable></el-input>
				<span>——</span>
				<el-input class="indialog_input01" v-model="plan_data01" clearable></el-input>
			  </div>
	          <el-button class="indialog_button" @click="planStage()" type="primary">重置</el-button>
	        </div>
	        <el-table :data="tablePlan" border style="width: 100%; margin:30px 0 20px 0;":header-cell-style="getRowClass">
	          <el-table-column prop="id" label="团期计划ID" align="center"></el-table-column>
	          <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
	          <el-table-column prop="destination" label="目的地" align="center"></el-table-column>
	          <el-table-column prop="travelDates" label="出行日期" align="center"></el-table-column>
	          <el-table-column prop="department" label="部门" align="center"></el-table-column>
	          <el-table-column prop="productionPerson" label="产品录入人" align="center"></el-table-column>
	        </el-table>
	        <div class="number_button">
	        	<el-button @click="planCancel()">取消</el-button>
	      		<el-button type="primary">申请</el-button>
	        </div>
	      </div>
      </el-dialog>
      <!--申请无收入借款中账号选择弹窗-->
      <el-dialog width="45%" title="选择账户" :visible.sync="dialogFormVisible_account"append-to-body>
	      <div class="indialog">
	        <el-tabs type="border-card" style=" margin:30px 0 20px 0;">
			  <el-tab-pane label="供应商">
			  	<el-table :data="tableAccount" border style="width: 100%;":header-cell-style="getRowClass">
		          <el-table-column prop="accountNumber" width="200" label="账户" align="center"></el-table-column>
		          <el-table-column prop="openBank" label="开户行" align="center"></el-table-column>
		          <el-table-column prop="accountName" label="开户名" align="center"></el-table-column>
		        </el-table>
			  </el-tab-pane>
			  <el-tab-pane label="个人">
			  	<el-table :data="tableAccount" border style="width: 100%;">
		          <el-table-column prop="accountNumber" width="200" label="账户" align="center"></el-table-column>
		          <el-table-column prop="openBank" label="开户行" align="center"></el-table-column>
		          <el-table-column prop="accountName" label="开户名" align="center"></el-table-column>
		        </el-table>
			  </el-tab-pane>
			</el-tabs>
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
	  <div v-show="checkIncomeShow">
	    <div class="mask" @click="CloseCheckIncomeShow()"></div>
	    <div class="noIncome">
	      <div class="noIncomeTitle">
	      	<div class="noIncomeTitle_l">借款申请</div>
	      	<div style="float:left; line-height:30px; background:#d2d2d2; margin:5px 0 0 10px; padding:0 10px; border-radius:5px;">审核中</div>
	      	<div class="noIncomeTitle_r">
	      		<el-button @click="CloseCheckIncomeShow()">取消</el-button>
	      		<el-button type="danger" plain>撤销借款</el-button>
	      	</div>
	      </div>
	      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
	      	 <el-form-item label="借款人" prop="name">
			    <el-input class="name_input" v-model="ruleForm.name"></el-input>
			 </el-form-item>
			 <el-form-item label="团期计划" prop="plan" style="float:left;">
			    <el-input class="name_input" v-model="ruleForm.plan"disabled></el-input>
			 </el-form-item>
			 <el-form-item prop="plan_01" style="float:left; margin-left:-90px;">
			    <el-input class="name_input" v-model="ruleForm.plan_01"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="供应商" prop="supplier" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.supplier"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="类型" prop="planType">
			    <el-select v-model="ruleForm.planType" placeholder="请选择">
				  <el-option v-for="item in borrowingType" :key="item.value" :label="item.label" :value="item.value"disabled></el-option>
				</el-select>
			 </el-form-item>
			 <el-form-item label="借款金额" prop="planAmount" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.planAmount"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="摘要" prop="abstract" style="clear:both;">
			    <el-input class="name_input01" v-model="ruleForm.abstract"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="账号" prop="account">
			    <el-input class="name_input" v-model="ruleForm.account"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="开户行" prop="accountBank" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.accountBank"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="开户名" prop="accountOpenName" style="clear:both;">
			    <el-input class="name_input" v-model="ruleForm.accountOpenName"disabled></el-input>
			 </el-form-item>
			 <el-form-item label="付款方式" prop="payment">
			    <el-select v-model="ruleForm.payment" placeholder="请选择">
				  <el-option v-for="item in payment_01" :key="item.value" :label="item.label" :value="item.value"disabled></el-option>
				</el-select>
			 </el-form-item>
			 <el-form-item label="附件" prop="accessory" style="clear:both;">
			    <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList">
			  		<el-button type="primary">选择文件</el-button>
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
	  </div>
  </div>
</template>




<script>

  export default {
    data(){
      return {
      	 //表头切换
      	 activeName:'first',
         empty:'',
         people:'',
         planTime:'',
         planData:'',
         //借款表格
         tableData:[{
			order:'1',
			state:'申请中',
			startingTime:'2019-01-09 09:37',
			groupPlan:'TC-GTY-1001-01-180806-01',
			supplierName:'国旅',
			genre:'地接',
			amount:'17800.00',
			verification:'0',
			payment:'0',
			organization:'辽宁大运通-国内部',
			proposer:'养养',
			approvalOpinion:'',
		 },{
			order:'2',
			state:'驳回',
			startingTime:'2019-01-09 09:37',
			groupPlan:'TC-GTY-1001-01-180806-01',
			supplierName:'国旅',
			genre:'签证',
			amount:'17800.00',
			verification:'0',
			payment:'0',
			organization:'辽宁大运通-国内部',
			proposer:'养养',
			approvalOpinion:'郑总：信息不全',
		 },{
			order:'3',
			state:'通过',
			startingTime:'2019-01-09 09:37',
			groupPlan:'TC-GTY-1001-01-180806-01',
			supplierName:'国旅',
			genre:'地接',
			amount:'17800.00',
			verification:'0',
			payment:'0',
			organization:'辽宁大运通-国内部',
			proposer:'养养',
			approvalOpinion:'',
		 }],
		 //需要你审批表格
		 tableApproval:[{
			order:'1',
			state:'申请中',
			startingTime:'2019-01-09 09:37',
			groupPlan:'TC-GTY-1001-01-180806-01',
			supplierName:'国旅',
			genre:'地接',
			amount:'17800.00',
			verification:'0',
			payment:'0',
			organization:'辽宁大运通-国内部',
			proposer:'养养',
			approvalOpinion:'',
		 }],
		 //分页
		 currentPage: 1,
         total:0,
         pagesize:10,
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
          accessory:'',
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
		   //查看无收入借款弹窗
		   checkIncomeShow:false,
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
      //分页
      handleSizeChange(page) {
      },
      handleCurrentChange(currentPage) {
      },
      //无收入借款弹窗
      noIncome(){//点击显示弹窗
      	this.noIncomeShow =true;
      },
      CloseNoIncomeShow(){//点击关闭弹窗
      	this.noIncomeShow =false;
      },
      //无收入借款中借款人弹窗
      IncomeName(){
      	this.dialogFormVisible1 = true;
      },
      numberCancel(){
      	this.dialogFormVisible1 = false;
      },
      //无收入借款中团期计划弹窗
      IncomePlan(){
      	this.dialogFormVisible_plan = true;
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
      

    }
  }
</script>
<style scoped>
	.loanManagement{text-align: center; font-family: '微软雅黑'; font-size: 11pt;overflow: hidden; text-align: left; margin: 0 0 100px 0;}
	.loanBorder{border-left:1px solid #e6e6e6;border-right:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6; margin:0 0 20px 0; overflow: hidden; clear: both;}
	/*穿刺去除向上的距离*/
	.el-tabs>>>.el-tabs__header{margin: 0 !important;}
	/*搜索框*/
	.empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
	.fl{float:left; margin: 20px 0 20px 0;}
	.emptyPlan{margin: 0 0 0 30px; }
	.planTime{width: 135px; line-height: 30px;margin: 0 0 0 10px;}
	.time{margin: 0 0 0 10px;}
	/*重置*/
	.primary{clear: both;overflow: hidden;margin: 0 0 20px 30px;}
	/*表格*/
	.labelTable{margin: 0 30px 20px 30px; text-align: center;width: 1581px;}
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
</style>
