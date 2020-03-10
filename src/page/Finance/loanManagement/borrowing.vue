<template>
  <!-- 借款页面 -->
  <div class="distributor-content">
    <!-- 搜索表单 -->
    <el-form :model="ruleFormSeach" ref="ruleFormSeach" label-width="80px" id="form-content">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="团期计划:" prop="groupCode_01">
            <el-input v-model="ruleFormSeach.groupCode_01" placeholder="请输入团期计划"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="借款人:" prop="borrower">
            <el-autocomplete
              style="width: 100%"
              class="name_input"
              v-model="ruleFormSeach.borrower"
              :fetch-suggestions="querySearchBorrower"
              placeholder="请输入借款人"
              :trigger-on-focus="false"
              @select="departureBorrower"
              @blur="departureBorrowerBlur"
              @focus="departureBorrowerFocus"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态:" prop="checkType">
            <el-select v-model="ruleFormSeach.checkType" placeholder="请选择类型" class="status-length">
              <el-option :label="item.label" :value="item.value" v-for="(item,index) of settlement" :key="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8">
          <el-form-item label="申请时间:">
            <el-col :span="11">
              <el-form-item prop="beginTime">
                <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleFormSeach.beginTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endTime">
                <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleFormSeach.endTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button @click="search()" type="primary" :disabled="ifShowsearch">搜索</el-button>
            <el-button @click="emptyButton('ruleFormSeach')" type="primary">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 搜索表单 END -->
    <!-- 申请按钮 -->
    <el-button type="primary" @click="noIncome()" class="add-style">申请</el-button>
    <!-- 申请按钮 END -->
    <!-- <el-button plain @click="checkIncome()" :disabled="forbidden">查看借款</el-button> -->
    <!-- 借款列表 -->
    <el-table :data="tableData" ref="multipleTable" :header-cell-style="getRowClass" :highlight-current-row="true" border :row-style="rowClass" :stripe="true" @row-click="clickRow" id="table-content" v-loading="listLoading">
      <el-table-column prop="paymentID" label="借款单号" align="center"></el-table-column>
      <el-table-column prop="checkTypeEX" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkTypeEX=='审批中'" style="color: #7F7F7F" >{{scope.row.checkTypeEX}}</div>
          <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D" >{{scope.row.checkTypeEX}}</div>
          <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174" >{{scope.row.checkTypeEX}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发起时间" :formatter='dateFormat' align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="supplierTypeEX" label="类型" align="center"></el-table-column>
      <el-table-column prop="price" label="借款金额" align="center"></el-table-column>
      <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="checkIncome(scope.row)" type="text" size="small" class="table_details">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 借款列表 END -->
    <!-- 分页 -->
    <el-row type="flex" class="paging">
      <el-col :span="8" :offset="13">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="ruleFormSeach.page"
          :limit.sync="ruleFormSeach.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <!-- 分页 END -->
    <!-- 申请无收入借款弹窗 -->
    <el-dialog title="借款申请" :visible.sync="noIncomeShow" width="1100px" custom-class="city_list" @close="cancel">
      <div style="position:absolute; top:8px; right:10px;">
        <el-button @click="CloseNoIncomeShow()">取消</el-button>
        <el-button type="primary" @click="ensureIncome()">申请</el-button>
      </div>
      <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <!-- 基本信息 -->
        <el-form-item label="团期计划" prop="plan" style="float:left;">
          <el-autocomplete
            class="name_input"
            v-model="ruleForm.plan"
            :fetch-suggestions="querySearch3Plan"
            placeholder="请输入团期计划"
            @select="departurePlan"
            @blur="tour_check"
            :trigger-on-focus="false"
          >
          </el-autocomplete>
          <el-input style="width:300px;" disabled v-model="ruleForm.plan_01" placeholder="通过输入团期计划,自动补充产品名称"></el-input>
          <el-button class="name_button" @click="IncomePlan()">选择</el-button>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplier" style="clear:both;">
          <el-autocomplete
            class="name_input"
            :fetch-suggestions="querySearch3"
            v-model="ruleForm.supplier"
            placeholder="请输入供应商名称"
            :trigger-on-focus="false"
            @select="departure"
          ></el-autocomplete>
          <!--<el-input style="width:300px;" disabled v-model="ruleForm.supplier" placeholder="请通过模糊查询选择相应供应商"></el-input>-->
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
        <el-form-item label="附件" style="clear:both;" prop="accessory">
          <el-upload
            class="upload-demo"
            name="files"
            ref="upload"
            multiple
            :action="this.upload_url"
            :file-list="fileList"
            :on-error="handleError"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <!-- 基本信息 END -->
        <!-- 相关信息 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>相关信息</el-divider>
        <el-table :data="tableMoney" border :header-cell-style="getRowClass">
          <el-table-column prop="payable" label="订单总额" align="center"></el-table-column>
          <el-table-column prop="paymentChecking" label="审批中借款总额" align="center"></el-table-column>
          <el-table-column prop="payment" label="已审批借款总额" align="center"></el-table-column>
          <el-table-column prop="expenseChecking" label="报销中总额" align="center"></el-table-column>
          <el-table-column prop="expense" label="已报销总额" align="center"></el-table-column>
          <el-table-column prop="price" label="已收总额" align="center"></el-table-column>
          <el-table-column prop="expenseChecking" label="供应商欠款总额" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.payable - scope.row.price}}</div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 相关信息 END -->
        <!-- 无收入借款明细 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>无收入借款明细</el-divider>
        <el-table :data="tableIncome" border :header-cell-style="getRowClass">
          <el-table-column prop="paymentID" label="ID" width="50" align="center"></el-table-column>
          <el-table-column prop="checkTypeEX" label="审批状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.checkTypeEX=='审批中'" style="color: #7F7F7F" >{{scope.row.checkTypeEX}}</div>
              <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D" >{{scope.row.checkTypeEX}}</div>
              <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174" >{{scope.row.checkTypeEX}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
          <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
          <el-table-column prop="price" label="金额" align="center"></el-table-column>
          <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
          <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
          <el-table-column prop="process" label="审批过程" align="center">
            <template slot-scope="scope">
              <div @click="processIncome(scope.$index, scope.row,1)">查看</div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 无收入借款明细 END -->
        <!-- 预付款明细 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>预付款明细</el-divider>
        <el-table :data="tablePayment" border :header-cell-style="getRowClass">
          <el-table-column prop="paymentID" label="ID" width="50" align="center"></el-table-column>
          <el-table-column prop="checkTypeEX" label="审批状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.checkTypeEX=='审批中'" style="color: #7F7F7F" >{{scope.row.checkTypeEX}}</div>
              <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D" >{{scope.row.checkTypeEX}}</div>
              <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174" >{{scope.row.checkTypeEX}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
          <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
          <el-table-column prop="price" label="金额" align="center"></el-table-column>
          <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
          <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
          <el-table-column prop="process" label="审批过程" align="center">
            <template slot-scope="scope">
              <div @click="processIncome(scope.$index, scope.row,2)">查看</div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 预付款明细 END -->
        <!-- 收入明细 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>收入明细</el-divider>
        <el-table :data="tableEarning" border :header-cell-style="getRowClass">
          <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
          <el-table-column prop="channel" label="订单来源" align="center"></el-table-column>
          <el-table-column prop="person" label="订单联系人" align="center"></el-table-column>
          <el-table-column prop="number" label="人数" align="center"></el-table-column>
          <el-table-column prop="payable" label="订单金额" align="center"></el-table-column>
          <el-table-column prop="priceSum" label="已收金额" align="center"></el-table-column>
          <el-table-column prop="arrears" label="欠款金额" align="center"></el-table-column>
          <el-table-column prop="arrearsDate" label="欠款日期" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.orderChannel !== 1 ? '' : scope.row.arrearsDate | formatDate }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="repaymentDate" label="应还日期" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.orderChannel !== 1 ? '' : scope.row.repaymentDate | formatDate }}</div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 收入明细 END -->
      </el-form>
    </el-dialog>
    <!-- 申请无收入借款弹窗 END -->
    <!-- 查看图片文件弹窗 -->
    <el-dialog style="text-align: left" title="放大图片:" :visible.sync="dialogVisible4" width="50%">
      <div>
        <img :src="imgBig" style="width: 95%;" alt="图片" :alt="imgBigName"/>
        <br /><span>{{imgBigName}}</span>
      </div>
    </el-dialog>
    <!-- 查看图片文件弹窗 END -->
    <!-- 申请无收入借款中团期计划选择弹窗 -->
    <!-- :visible.sync="dialogFormVisible_plan"  原 -->
	  <el-dialog width="70%" title="团期计划" :visible="dialogFormVisible_plan" :append-to-body="true" :show-close="false">
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
            <el-date-picker
              class="indialog_input"
              style="width: 80%"
              v-model="plan_data"
              type="daterange"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
            >
            </el-date-picker>
          </div>
          <el-button class="indialog_button" @click="planSelect()" type="primary">搜索</el-button>
          <el-button class="indialog_button" @click="planStage()" type="primary">重置</el-button>
        </div>
        <el-table :data="tablePlan" border ref="multipleTablePlan" style="width: 100%; margin:30px 0 20px 0;" :header-cell-style="getRowClass" @row-click="clickPlan" :row-style="rowClassPlan" @selection-change="changeFunPlan">
          <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
          <el-table-column prop="title" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="destination" label="目的地" align="center"></el-table-column>
          <el-table-column prop="date" label="出行日期" align="center"></el-table-column>
          <el-table-column prop="name" label="产品录入人" align="center"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" class="paging">
          <el-col :span="8" :offset="8">
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="ruleFormSeach.page"
              :limit.sync="ruleFormSeach.limit"
              @pagination="planList"
            />
          </el-col>
        </el-row>
        <!-- 分页 END -->
        <div class="number_button" style="margin-top: 30px">
          <el-button @click="planCancel()">取消</el-button>
          <el-button :disabled="ifShowPlanIdSureBtn" @click="routerHandle4()" type="primary">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 申请无收入借款中团期计划选择弹窗 END -->
    <!-- 申请无收入借款中账号选择弹窗 -->
    <el-dialog width="45%" title="选择账户" :visible.sync="dialogFormVisible_account" append-to-body>
      <div class="indialog">
        <el-table
          :data="tableAccount"
          @current-change="handleCurrentChangeAcount"
          ref="multipleTableBank"
          border
          style="width: 100%; margin:30px 0 20px 0;"
          :header-cell-style="getRowClass"
          @row-click="clickBank"
          @selection-change="changeFunBank"
          highlight-current-row
        >
          <el-table-column prop="cardName" label="汇款户名" align="center"></el-table-column>
          <el-table-column prop="cardNumber" width="200" label="账号" align="center"></el-table-column>
          <el-table-column prop="bankName" label="开户行" align="center"></el-table-column>
          <el-table-column prop="memo" label="备注" align="center"></el-table-column>
        </el-table>
        <div class="number_button">
          <el-button @click="accountCancel()">取消</el-button>
          <el-button @click="accountSure" type="primary">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 申请无收入借款中账号选择弹窗 END -->
    <!-- 申请无收入借款中预付款明细查看弹窗 -->
    <el-dialog width="45%" title="预付款明细" :visible.sync="dialogFormVisible_paymenrt" append-to-body>
      <div class="indialog">
        <el-table :data="tableApprove" border style=" width:90%;margin:30px 0 20px 25px;":header-cell-style="getRowClass">
           <el-table-column prop="times" :formatter='dateFormat' label="审批时间" width="150" align="center"></el-table-column>
           <el-table-column prop="people" label="审批人" align="center"></el-table-column>
           <el-table-column prop="result" label="审批结果" align="center"></el-table-column>
           <el-table-column prop="opinion" label="审批意见" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 申请无收入借款中预付款明细查看弹窗 END -->
    <!-- 申请无收入借款中无收入借款明细查看弹窗 -->
    <el-dialog width="45%" title="审批过程" :visible.sync="dialogFormVisible_Income" append-to-body>
      <div class="indialog">
        <el-table :data="tableIncomeCheck" border style=" width:90%;margin:30px 0 20px 25px;" :header-cell-style="getRowClass">
           <el-table-column prop="finishedTime" :formatter='dateFormat' label="审批时间" width="150" align="center"></el-table-column>
           <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
           <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
           <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 申请无收入借款中无收入借款明细查看弹窗 END -->
    <!-- 查看无收入借款申请详情弹窗 -->
    <el-dialog title="借款申请详情" :visible.sync="checkIncomeShow" width="1100px" custom-class="city_list" :show-close='false'>
      <div style="position:absolute; top:8px; right:10px;">
        <el-button @click="CloseCheckIncomeShow()">取消</el-button>
        <el-button @click="splitRelTable()">拆分关系表</el-button>
        <el-button type="danger" @click="repeal()" v-if="status == '审批中'" plain>撤销借款</el-button>
        <el-button
          type="success"
          @click="touchPrint"
          plain
          v-if="(ifDY100009 && (presentRouter == '无收入借款管理' || presentRouter == '预付款管理') && creatUserOrgID == 490) || ( ifDY100042 && (presentRouter == '无收入借款管理' || presentRouter == '预付款管理') && creatUserOrgID != 490)"
        >
          打印本页详情信息
        </el-button>
      </div>
      <checkLoanManagement :paymentID="paymentID" :groupCode="groupCode" :acoutInfo="acoutInfo" ref="printHandle" v-if="checkIncomeShow"></checkLoanManagement>
    </el-dialog>
    <!-- 查看无收入借款申请详情弹窗 END -->
  </div>
  <!--借款页面 END -->
</template>

<script>
import checkLoanManagement from './checkLoanManagement/checkLoanManagement'
import moment from 'moment'
import Pagination from '@/components/Pagination'

export default {
  name: "borrowing",
  components: {
    Pagination,
    checkLoanManagement
  },
  data(){
    var validateVoucher = (rule, value, callback) => {
      if (this.fileCheckVal === 0) {
        callback(new Error('请上传附件'));
      } else {
        callback();
      }
    };
    return {
      creatUserOrgID: null, // 用来判断付款账户是否显示
      presentRouter: null, // 当前路由
      ifDY100009: false,
      ifDY100042: false,
      ifShowPlanIdSureBtn: true, // 只有选中任一个团期计划行才取消禁止按钮
      acoutInfo: null, // 传到子组件弹窗内的值 row
      ifShowsearch: false,
      listLoading: true,
      fileCheckVal: 0, // 上传凭证成功返回的文件数量（验证用）
      ruleFormSeach: {
        groupCode_01:'', // 团号
        createTime:'', // 创建时间
        endTime:'', // 结束时间
        checkType:'', // 状态
        borrower: '', // 借款人
        page: 1,
        limit: 10,
      },
      settlement:[{ // 表头切换
        value: '0',
        label: '审批中'
      }, {
        value: '1',
        label: '通过'
      }, {
        value: '2',
        label: '驳回'
      }],
      forbidden:true, // 借款表格
      multipleSelection: [],
      paymentID:0,
      groupCode:0,
      tableData:[],
      pagesize: 10, // 设定默认分页每页显示数
      pageIndex: 1, // 设定当前页数
      total: 0,
      currentPage: 1,
      noIncomeShow:false, // 无收入借款弹窗
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
        accessory:[],
      },
      dialogVisible4:false, // 查看图片文件弹窗
      imgBig: '',
      imgBigName: '',
      upload:{
        accessory:'',
      },
      tour_id:0, // 无收入弹窗id
      borrowingType: [], // 无收入借款类型选择器
      payment_01:[{ // 无收入借款支付方式选择器
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
        supplier:[{ required: true, message: '请选择相应供应商', trigger: 'change' }],
        planType:[{ required: true, message: '请选择借款类型', trigger: 'change' }],
        planAmount:[
          { required: true, message: '请输入借款金额', trigger: 'blur' },
//          { pattern: /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/, message: '请正确输入借款金额（若有小数点，其后面不应超过两位）' }
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '请正确输入借款金额（若有小数点，其后面不应超过两位）' }
        ],
        abstract:[
          { required: true, message: '请输入摘要', trigger: 'change' },
          { min: 0, max: 80, message: '摘要字数不能超过80字', trigger: 'change' }
        ],
        account:[{ required: true, message: '请输入汇款账号', trigger: 'blur' }],
        accountBank:[{ required: true, message: '请输入开户行', trigger: 'blur' }],
        accountOpenName:[{ required: true, message: '请输入开户名', trigger: 'blur' }],
        payment:[{ required: true, message: '请选择付款方式', trigger: 'blur' }],
        /*accessory:[{ required: true, trigger: 'change', validator: validateVoucher}],*/
      },
      fileList: [],
      dialogFormVisible1:false, // 无收入借款中借款人弹窗
      number_name:'',
      tableName: [], // 申请无收入借款中借款人选择弹窗表格
      dialogFormVisible_plan:false, // 无收入借款中团期计划弹窗
      plan_stage:'',
      plan_name:'',
      plan_data:'',
      tablePlan:[], // 申请无收入借款中团期计划选择弹窗表格
      multipleSelectionPlan: [],
      dialogFormVisible_account:false, // 无收入借款中账户弹窗
      tableAccount:[], // 选择账户表格数据
      multipleSelectionBank:[], // 银行表格高亮
      tableMoney:[], // 无收入借款金额表格
      tablePayment:[], // 无收入借款弹窗预付款明细表格
      dialogFormVisible_paymenrt:false, // 无收入借款弹窗中预付款明细查看弹窗
      tableApprove:[],
      tableIncome:[], // 无收入借款弹窗中无收入借款明细弹窗
      dialogFormVisible_Income:false, // 无收入借款弹窗中预付款明细查看弹窗
      tableIncomeCheck:[],
      tableEarning:[], // 无收入借款弹窗中收入明细表格
      checkIncomeShow:false, // 查看无收入借款弹窗
      tableCourse:[],
      tour_name_pre: '',
      product_name_pre:'',
      planID:'',
      supplier_id:null, // 供应商选择之后绑定之后获取相关id
      tableData2:[],
      tableDataBorrower:[],
      upload_url: this.GLOBAL.serverSrc + '/upload/obs/api/file', // 图片上传
      uid: 0, // 上传图片缩略图选中项
      status:"",
      tableSelect:[], // 选择弹窗表格
      pageshow:true,
      pid:'',
      countItemInfo: null, // 选择账户表格选中行时，行的信息
      querySearchPlanData: [], // 团期计划检索联想数组
      keepBorrowerUserCode: null, // 模糊查询之后选中事件获得 借款人对应的 usercode
    }
  },
  filters: {
    formatDate: function (value) {
      if(typeof value == 'string'){
        return ''
      } else {
        return moment(value).format('YYYY-MM-DD')
      }
    }
  },
  computed:{
    rejectUpadataList:function () {
      return this.$store.state.updatAdvancePaymentData
    }
  },
  watch:{
    rejectUpadataList:function (newV, oldV) {
      let _this = this
      if(newV != oldV) {
        setTimeout(function () {
          _this.getList()
        },500)
      }
    }
  },
  methods: {
    // 打印详情
    touchPrint(){
      this.$refs.printHandle.printDetails()
    },
    // 借款记录列表
    getList() {
      this.listLoading = true
      let objectRequest = {}
      let _this = this
      objectRequest.paymentType = 1;
      objectRequest.checkType = -1;

      if (this.ruleFormSeach.groupCode_01) { objectRequest.groupCode = this.ruleFormSeach.groupCode_01; }
      if (this.ruleFormSeach.beginTime) { objectRequest.beginTime =  moment(this.ruleFormSeach.beginTime).format('YYYY-MM-DD HH:mm:ss'); }
      if (this.ruleFormSeach.endTime) { objectRequest.endTime = moment(this.ruleFormSeach.endTime).format('YYYY-MM-DD HH:mm:ss'); }
      if (this.ruleFormSeach.borrower) { objectRequest.createUser = this.keepBorrowerUserCode; }
      if (this.ruleFormSeach.checkType) { objectRequest.checkType = this.ruleFormSeach.checkType;}else{objectRequest.checkType='-1'}
      //if (this.checkTypeEX) { objectRequest.checkTypeEX = this.checkTypeEX; }
      this.$http.post( this.GLOBAL.serverSrc + "/finance/payment/api/page", {
        "pageIndex":_this.ruleFormSeach.page,
        "pageSize":_this.ruleFormSeach.limit,
        "total": 0,
        "object": objectRequest,
      }).then(function (obj) {
        _this.total = obj.data.total
        _this.tableData = obj.data.objects
        _this.listLoading = false
      }).catch(function (obj) {
        console.log(obj)
      })
    },
    moment,
    // 起始时间格式转换
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined || date == '') {
        return '';
      }
      return moment(date).format('YYYY-MM-DD')
    },
    // 重置
    emptyButton(formName){
      this.$refs[formName].resetFields();
    },
    // 表格表头颜色
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
    // 选中行复选框勾选
    clickRow(row){
      this.$refs.multipleTable.clearSelection(); // 清空用户的选择
      this.$refs.multipleTable.toggleRowSelection(row);
      this.paymentID=row.paymentID;
      this.guid=row.guid;
      this.groupCode=row.groupCode;
    },
    rowClass({row, rowIndex}){  // 选中行样式改变
     for(var i=0;i<this.multipleSelection.length;i++){
        if(this.multipleSelection[i].paymentID==row.paymentID){
           return { "background-color": "#ecf5ff" }
        }
      }
    },
    // 银行表格高亮
    changeFunBank(val) {
      this.multipleSelectionBank=val;
    },
    // 选中行复选框勾选
    clickBank(row){
      this.$refs.multipleTableBank.clearSelection(); // 清空用户的选择
      this.$refs.multipleTableBank.toggleRowSelection(row);
    },
    // 供应商选择银行账号
    IncomeAccount() {
      if (this.supplier_id) {
        this.dialogFormVisible_account = true;
        this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/banklist', {
          "object": {
            "supplierID": this.supplier_id, // 供应商ID
          }
        }).then(res => {
          this.tableAccount = res.data.objects;
        }).catch(err => {})
      } else {
          this.$message.error('供应商未匹配后台数据,请手动输入银行信息!');
      }
    },
    // 供应商联想查询
    querySearch3(queryString3, cb) {
      this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/supplierlist', {
        "object": {
          name: queryString3,
          UserState:-1,
          SupplierType:-1,
        }
      }).then(res => {
        this.tableData2 = []
        for (let i = 0; i < res.data.objects.length; i++) {
          this.tableData2.push({
            "value": res.data.objects[i].name,
            "id": res.data.objects[i].id,
            "supplierType": res.data.objects[i].supplierType
          })
          //this.supplier_id = res.data.objects[i].id ? res.data.objects[i].id : 0;
        }
        var results = queryString3 ? this.tableData2.filter(this.createFilter(queryString3)) : [];
        cb(results)
      }).catch(err => {})
    },
    // 供应商选中
    departure(item){
      this.supplier_id = item.id
      //this.ruleForm.planType = item.supplierType//供应商名称和借款类型关联
    },
    // 借款人模糊检索
    querySearchBorrower(queryBorrowerString, cb) {
      this.tableDataBorrower = []
      this.$http.post(this.GLOBAL.serverSrc + '/org/api/userlist', {
        "object": {
          name: queryBorrowerString
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.tableDataBorrower.push({
            "value": res.data.objects[i].name,
            "userCode": res.data.objects[i].userCode
          })
        }
        var results = queryBorrowerString ? this.tableDataBorrower.filter(this.createFilteBorrowerr(queryBorrowerString)) : [];
        cb(results)
      }).catch(err => {})
    },
    // 团号搜索联想
    querySearch3Plan(queryStringPlan, cb) {
      this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
        "object": {
          "groupCode": this.ruleForm.plan, // 团号
          "title": '', // 产品名称
          "beginDate": 0, // 搜索用开始日期
          "endDate": 0, // 搜索用结束日期
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.querySearchPlanData.push({
            "value": res.data.objects[i].groupCode,
            "planID": res.data.objects[i].planID,
          })
        }
        var results = queryStringPlan ? this.querySearchPlanData.filter(this.createFilter(queryStringPlan)) : [];
        cb(results)
      }).catch(err => {})
    },
    // 团期计划输入框失去焦点时
    tour_check() {
      if (this.ruleForm.plan != '') {
        this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
          "pageIndex": 1,
          "pageSize": 1,
          "object": {
            "groupCode": this.ruleForm.plan, // 团号
            "title": '', // 产品名称
            "beginDate": 0, // 搜索用开始日期
            "endDate": 0, // 搜索用结束日期
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            this.product_name_pre = res.data.objects[0].title
            this.ruleForm.plan_01 = res.data.objects[0].title
            this.tour_id = res.data.objects[0].planID
            this.getPaymentdetails(res.data.objects[0].planID)
          }
        }).catch(err => {
          console.log(err)
          this.product_name_pre = ''
          this.ruleForm.plan_01 = ''
        })
      } else {
        this.tableMoney = [];
        this.tableIncome = [];
        this.tablePayment = [];
        this.tableEarning = [];
        this.product_name_pre = ''
        this.ruleForm.plan_01 = ''
      }
    },
    // 团期计划选中
    departurePlan(item) {
      this.tour_id = item.planID
    },
    // 模糊查询返回下拉选中项 - 查询返回value的
    createFilter(queryString1){
      return (restaurant) => {
        return (restaurant.value);
      }
    },
    // 模糊查询返回下拉选中项 - 查询返回userCode的（借款人）
    createFilteBorrowerr(queryString1){
      return (restaurant) => {
        return (restaurant.userCode);
      }
    },
    // 借款人选中
    departureBorrower (item) {
      this.keepBorrowerUserCode = item.userCode
    },
    // 借款人 失焦
    departureBorrowerBlur(){
      if(this.ruleFormSeach.borrower == ''){
        this.ifShowsearch = false
      }else {
        if(this.keepBorrowerUserCode == null){
          this.ifShowsearch = false
          this.ruleFormSeach.borrower = ''
          // this.$message.success("无相关借款人");
        } else {
          this.ifShowsearch = true
        }
      }
    },
    // 借款人 获得焦点
    departureBorrowerFocus(){
      this.ifShowsearch = true
    },
    // 选择账户弹窗的表格选择事件
    handleCurrentChangeAcount(currentPage) {
      this.countItemInfo = currentPage
    },
    // 选择账户弹窗里面的申请事件
    accountSure () {
      if (this.countItemInfo) {
        this.ruleForm.account = this.countItemInfo.cardNumber
        this.ruleForm.accountOpenName = this.countItemInfo.cardName
        this.ruleForm.accountBank = this.countItemInfo.bankName
        this.dialogFormVisible_account = false;
      }
    },
    // 无收入借款弹窗
    noIncome(){
      // 点击显示弹窗
      this.noIncomeShow =true;
     //this.clearPlan();
    },
    // 借款申请详情弹窗（取消）
    cancel(){
      this.noIncomeShow = false;
      this.$refs["ruleForm"].resetFields();
      this.tableMoney = [];
      this.tableIncome = [];
      this.tablePayment = [];
      this.tableEarning = [];
    },
    // 点击关闭弹窗
    CloseNoIncomeShow(){
      this.$confirm("是否取消本次借款申请?", "提示", {
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
    // 清除申请无收入借款弹窗内容
    clearPlan(){
      this.fileList = []
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
      this.tableMoney = [];
      this.tableIncome = [];
      this.tablePayment = [];
      this.tableEarning = [];
    },
    // 无收入借款中团期计划弹窗（）
    IncomePlan(){
      this.plan_stage = '';
      this.plan_name = '';
      this.plan_data = '';
      this.planList();
      this.dialogFormVisible_plan = true;
    },
    // 查询无收入借款团期计划列表
    planList(){
      this.$http.post(
        this.GLOBAL.serverSrc + "/teamquery/get/api/planfinancepage",
        {
          "pageSize":this.ruleFormSeach.limit,
          "pageIndex":this.ruleFormSeach.page,
          "total": 0,
          "object": {
            "groupCode": this.plan_stage, // 团号
            "title": this.plan_name, // 产品名称
            "beginDate": this.plan_data[0] ? moment(this.plan_data[0]).format('YYYYMMDD') : 0, // 搜索用开始日期
            "endDate": this.plan_data[1] ? moment(this.plan_data[1]).format('YYYYMMDD') : 0, // 搜索用结束日期
          }
        })
        .then(res => {
          this.total = res.data.total
          this.tablePlan = res.data.objects;
        })
        .catch(function (obj) {})
    },
    // 无收入借款团期计划表格点击行时事件
    clickPlan(row){
      this.ifShowPlanIdSureBtn = false
      this.$refs.multipleTablePlan.clearSelection(); // 清空用户的选择
      this.$refs.multipleTablePlan.toggleRowSelection(row);
      this.tour_name_pre = row['groupCode'];
      this.product_name_pre = row['title'];
      this.planID = row['planID'];
    },
    // 选中行样式改变
    rowClassPlan({row, rowIndex}){
     for(var i=0;i<this.multipleSelectionPlan.length;i++){
        if(this.multipleSelectionPlan[i].planID==row.planID){
           return { "background-color": "#ecf5ff" }
        }
      }
    },
    // 团期计划选中之后的确定按钮
    routerHandle4() {
      this.ifShowPlanIdSureBtn = true
      this.tour_id = this.planID
      this.ruleForm.plan = this.tour_name_pre;
      this.ruleForm.plan_01 = this.product_name_pre;
      this.getPaymentdetails(this.tour_id);
      this.dialogFormVisible_plan = false;
      this.plan_stage = '';
      this.plan_name = '';
      this.plan_data = '';
      this.tablePlan = ''
    },
    // 供应商所有关联列表信息
    getPaymentdetails(val) {
      var that = this
      // 预付付款明细
      that.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
        "object": {
          "paymentType": 2,
          "planID": val,
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tablePayment = res.data.objects
        }
      }).catch(err => {})
      // 无收入借款明细
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
      // 根据计划ID获取订单总额,已收款总额,总人数,已审批借款总额，审批中借款总额/
      that.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/fivetotal', {
          "id": val,
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tableMoney = []
          that.tableMoney.push(res.data.object)
        }
      }).catch(err => {
        console.log(err)
      })
      // 收入明细
      that.$http.post(this.GLOBAL.serverSrc + '/orderquery/api/income/detail', {
        "id": val,
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tableEarning = res.data.objects
          //that.tableEarning.push(res.data.object)
        }
      }).catch(err => {})
    },
    changeFunPlan(val) {
      this.multipleSelectionPlan=val;
      //event.cancelBubble = true;//row-click和selection-change耦合事件
    },
    // 团期计划取消事件
    planCancel(){
      this.ifShowPlanIdSureBtn = true
      this.dialogFormVisible_plan = false;
    },
    // 申请无收入借款中团期计划选择弹窗（搜索）
    planSelect() {
      this.planList();
    },
    planStage(){
      this.plan_stage = '';
      this.plan_name = '';
      this.plan_data = '';
    },
    accountCancel(){
      this.dialogFormVisible_account = false;
    },
    // 无收入借款中预付款明细查看
    processPaymenrt(scope,row){
      this.dialogFormVisible_paymenrt = true;
    },
    // 参看无收入借款明细审批过程弹窗
    processIncome(index,row, type){
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ', {
        jQ_ID: row.guid,
        jQ_Type: type,
      }).then(obj => {
        this.tableIncomeCheck = obj.data.extend.instanceLogInfo;
        this.dialogFormVisible_Income = true;
      }).catch(obj => {})

    },
    // 查看无收入借款弹窗(列表中的详情)
    checkIncome(row){
      this.checkIncomeShow = true;
      this.pid = row.paymentID;
      this.acoutInfo = row
      this.status = row.checkTypeEX;
      this.ruleForm = row;
      this.getLabel(row.paymentID)
      console.log(row.paymentID,'参数错置')
    },
    // 获取一条详情（控制打印按钮）
    getLabel(paramsPaymentID){
      this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get',{
        "id": paramsPaymentID
      }).then(res => {
        if(res.data.isSuccess == true){
          this.creatUserOrgID = res.data.object.creatUserOrgID
        }
      })
    },
    // 关闭弹窗
    CloseCheckIncomeShow(){
      this.checkIncomeShow = false;
      // this.$refs['ruleForm'].resetFields();
      // this.clearPlan();
    },
    splitRelTable(){
      this.$router.push({ path: "/relationSplitMap", query: { id: this.pid } })
    },
    // 搜索
    search(){
      this.ruleFormSeach.page = 1
      this.ruleFormSeach.limit = 10
      this.getList()
    },
    // 申请无收入借款
    ensureIncome(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let pictureList = [];

          this.fileList.forEach(function(item){
            pictureList.push({ url: JSON.parse(item.response).paths[0].Url, name: item.name})
          })

          var _this = this;
          this.$http.post(this.GLOBAL.serverSrc + "/finance/payment/api/insert",
            {
              object: {
                //payway: this.ruleForm.payment, // 付款方
                "createUser": sessionStorage.getItem('id'),
                "paymentType": 1, // 借款类型 1无收入借款 2预付款
                "planID": this.tour_id, // 对应计划ID --Plan，不存在传值0
                "supplierID": this.supplier_id, // 对应供应商ID --Supplier，不存在传值0
                "supplierName": this.ruleForm.supplier, // Supplier不存在时补充供应商名称
                "supplierType": this.ruleForm.planType, // 供应商类型 0返款
                "price": this.ruleForm.planAmount, // 金额
                "mark": this.ruleForm.abstract, // 摘要
                "cardNumber": this.ruleForm.account, // 账号
                "bankName": this.ruleForm.accountBank, // 开户行
                "cardName": this.ruleForm.accountOpenName, // 开户名
                "files": pictureList, //上传图片,
              }
            })
            .then(res => {
              if(res.data.isSuccess == true){
                 this.getList();
                 this.clearPlan();
                 this.$emit('aprovalNum',true) // 如果已经成功申请无收入借款，传回true，给父组件，父组件将值传给无需要您审批的组件对该列表进行刷新
                 this.noIncomeShow = false;
                 //this.$refs["ruleForm"].resetFields();
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
    // 付款方式
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
        //this.payment_01 =  res.data.objects;
      })/*.catch(function(err){
        console.log(err);
      })*/
    },
    // 借款类型
    themeList(){
      this.borrowingType = [];
      this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/dictionaryget?enumname=PaymentType')
      .then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.borrowingType.push({
            "value": res.data.objects[i].id,
            "label": res.data.objects[i].name
          })
        }
      })
      .then(res =>{
        //this.borrowingType =  res.data.objects;
      })/*.catch(function(err){
        console.log(err);
      })*/
    },
    // 文件上传
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    handleError(err, file) {
      this.fileList = []
    },
    handleSuccess(res, file, fileList) {
      this.fileCheckVal = fileList.length; // 成功时凭证的条数（校验用）
      // 多次添加图片判断，如果是第一次添加修改全部图片数据，否则修改新添加项数据
      if (this.time != fileList.length) { // 多张图片情况只在第一次执行数组操作
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
      this.fileCheckVal = fileList.length
    },
    handlePreview(file) {
      // this.dialogVisible4 = true
      let getUrl = JSON.parse(file.response)
      this.uid = file.uid
      window.open(getUrl.paths[0].Url);
      this.imgBigName = file.name
      // this.imgBig = getUrl.paths[0].Url

    },
    // 撤销（结束工作流程）预付款要参照这个改，这个是对的
    repeal(){
      this.$confirm("是否需要撤销该笔借款?", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
      })
      .then(() => {
        this.$http.post(this.GLOBAL.jqUrl + "/JQ/EndProcessForJQ",{
          "jq_id": this.guid,
          "jQ_Type": 1
        }).then(res => {
          this.$message.success("撤销成功");
          this.checkIncomeShow = false;
          this.deleteBorrow();
          // this.history.go(0); // 刷新页面
         })
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "撤销借款已取消"
        });
      });
    },
    // 结束工作流程后删除
    deleteBorrow(){
      this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/delete',{
        "id": this.paymentID
      })
      .then(res => {
        this.getList();
      })
      .catch(() => {});
    }
  },
  mounted(){
    this.getList()
    this.planList();
  },
  created(){
    if(sessionStorage.getItem('userCode') == 'DY100009') {
      this.ifDY100009 = true
    }else {
      this.ifDY100009 = false
    }
    if(sessionStorage.getItem('userCode') == 'DY100042') {
      this.ifDY100042 = true
    } else {
      this.ifDY100042 = false
    }
    this.presentRouter = this.$route.name
    this.themeList();
    this.payment();
  }
}
</script>

<style scoped lang="scss">
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    #form-content {
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .line{
        text-align: center;
      }
      .status-length{
        width: 100% !important;
      }
    }
    .add-style{
      margin-left: 1%;
      margin-top: 30px;
    }
    #table-content{
      width: 98%;
      margin: 10px auto 10px;
    }
    .paging{
      margin:20px 0 10px 0;
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
    }
  }
  .upload-demo>>>.el-upload-list__item:first-child {
    margin-top: 5px;
  }




	/*分页*/
	.name_input{width: 200px;}
	.name_input01{width: 700px;}
	.name_button{margin-left:-5px; background:#eaeaea;color:#a4a4a4;}
	.name_button:hover{color:#a4a4a4;}
	.plan_button{margin-top:1px; background:#eaeaea;color:#a4a4a4;}
	.plan_button:hover{color:#a4a4a4;}
	/*申请无收入借款中借款人弹窗*/
	.indialog{min-height: 300px; overflow: hidden;}
	.number_button{float:right; margin: 0 0 20px 0;}
	/*申请无收入借款中团期计划弹窗*/
	.plan_indialog{float:left; line-height: 40px;}
	.indialog_plan{float:left; margin: 0 5px 0 10px;}
	.indialog_input{float:left; width: 160px;}
	.plan_indialog span{float:left; margin: 0 10px 0 10px;}
	.indialog_button{margin: 0 0 0 10px;}
	/*申请无收入借款中附件*/
	.upload-demo{width: 400px;}
	/*.upload-demo>>>.el-upload-list__item{ width: 300px; }*/
	.close{position: absolute; top: 15px; right: 15px; font-size: 20pt; cursor:pointer;}
</style>
