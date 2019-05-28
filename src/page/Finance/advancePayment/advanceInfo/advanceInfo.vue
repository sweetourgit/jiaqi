<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="申请预付款" :visible="dialogFormVisible" width=60% :show-close="false" @close="closeAdd">
      <div v-if="this.find == 1" class="sh_style">{{this.infoStatus}}</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="btn" style="position:absolute;z-index:9;top:20px;right:1%;">
          <el-button @click="closeAdd">取 消</el-button>
          <el-button style="right: 1%;float: right;" v-if="this.find == 0" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button style="right: 1%;float: right;" v-if="this.find == 1 && this.infoStatus=='审批中'" type="danger" @click="chanelSubmit('ruleForm')" plain>撤销申请</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 基本信息 -->
          <el-tab-pane label="预付款申请" name="first">
            <div>
              <!--申请人-->
              <el-form-item label="申请人" prop="user" ref="user" label-width="120px">
                <!--<div class="destination-input">
                  <el-tag :key="tag3.pod" v-for="tag3 in dynamicTags3" closable :disable-transitions="false" @close="handleClose3(tag3)">
                    {{tag3.pod}}
                  </el-tag>
                  <el-autocomplete id="ddd" class="input-new-tags" v-model="ruleForm.user" v-if="inputVisible3" ref="saveTagInput" size="small" placeholder="请输入申请人" :trigger-on-focus="false"></el-autocomplete>
                  <el-button v-else class="input-new-tag" size="small" :disabled="change" @click="showInput3">请输入申请人</el-button>
                </div>-->
                <el-input v-model="ruleForm.user" class="inputWidth" disabled placeholder="请输入申请人"></el-input>
              </el-form-item>
              <!--团期计划-->
              <el-form-item label="团期计划" prop="tour" label-width="120px" style="float:left;">
                <el-input v-model="ruleForm.tour" @blur="tour_check" :disabled="change" class="inputWidth" placeholder="请输入或者选择团期计划"></el-input>
              </el-form-item>
              <el-form-item prop="productName" style="float:left; margin-left:10px;">
                <el-input v-model="ruleForm.productName" :disabled="true" class="inputWidth" placeholder="自动补充产品名称"></el-input>
                <el-button class="input-new-tag2" size="small" :disabled="change" @click="showInput4">选择</el-button>
              </el-form-item>
              <!-- 供应商 -->
              <el-form-item label="供应商" prop="supplier" ref="supplier" label-width="120px" style="clear:both;">
                <div class="destination-input inputWidth">
                  <el-tag :key="tag2.id" v-for="tag2 in dynamicTags2" closable :disable-transitions="false" @close="handleClose2(tag2)">
                    {{tag2.label}}
                  </el-tag>
                  <el-autocomplete id="input-error" :disabled="change" class="lable_input" v-if="inputVisible2" v-model="ruleForm.supplier" ref="saveTagInput" size="small" placeholder="请输入供应商" @keyup.enter.native="handleInputConfirm2" :fetch-suggestions="querySearch5" :trigger-on-focus="false" @select="dest_01" @blur="handleInputConfirm2">
                  </el-autocomplete>
                  <el-button v-else class="operation_Label inputWidth" :disabled="change" v-show="supplierLength" size="small" @click="showInput2">请输入供应商</el-button>
                </div>
              </el-form-item>
              <!-- 类型 -->
              <el-form-item label="类型" prop="type" label-width="120px">
                <el-select style="float: left;" class="inputWidth" v-model="ruleForm.type" placeholder="请选择类型" :disabled="change">
                  <el-option v-for="item in typeList" :key="item.label" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 借款金额 -->
              <el-form-item label="借款金额" prop="loanMoney" label-width="120px">
                <el-input type="number" v-model="ruleForm.loanMoney" class="bright inputWidth" placeholder="借款金额" :disabled="change"></el-input>
              </el-form-item>
              <!-- 借款数量 -->
              <el-form-item label="借款数量" prop="loanNumber" class="bright_b" label-width="80px" style="margin-left: 30%;">
                <el-input type="number" v-model="ruleForm.loanNumber" class="lightspot inputWidth" placeholder="借款数量" :disabled="change" style='margin-left: 10px;'></el-input>
              </el-form-item>
              <!-- 摘要 -->
              <el-form-item label="摘要" prop="abstract" label-width="120px">
                <el-input v-model="ruleForm.abstract" class="bright inputWidth" placeholder="摘要" :disabled="change"></el-input>
              </el-form-item>
              <!-- 账户 -->
              <el-form-item label="账户" prop="cardNumber" label-width="120px">
                <el-input v-model="ruleForm.cardNumber" class="bright inputWidth" placeholder="账户" :disabled="change"></el-input>
                <el-button class="input-new-tag2 " size="small" :disabled="change" @click="showInput5">选择</el-button>
              </el-form-item>
              <!-- 开户行 -->
              <el-form-item label="开户行" prop="bankName" label-width="120px">
                <el-input v-model="ruleForm.bankName" class="bright inputWidth" placeholder="开户行" :disabled="change"></el-input>
              </el-form-item>
              <!-- 开户行 -->
              <el-form-item label="开户名" prop="cardName" label-width="120px">
                <el-input v-model="ruleForm.cardName" class="bright inputWidth" placeholder="开户名" :disabled="change"></el-input>
              </el-form-item>
              <!-- 付款方式 -->
              <el-form-item label="付款方式" prop="payMode" label-width="120px">
                <el-select style="float: left;" class="inputWidth" v-model="ruleForm.payMode" placeholder="请选择" :disabled="change">
                  <el-option v-for="item in payModeList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="附件" label-width="120px">
                <el-upload class="upload-demo" name="files" ref="upload" :limit="12" multiple :action="this.upload_url" :disabled="change" :file-list="fileList" :on-error="handleError" :on-success="handleSuccess" :on-remove="handleRemove" :on-preview="handlePreview" list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="" label-width="120px" label-height="auto">
                <el-table :data="tableData5" border style="width:70%" :header-cell-style="getRowClass2">
                  <el-table-column prop="payable" label="订单总额" align="center">
                  </el-table-column>
                  <el-table-column prop="payment" label="已审批总额" align="center">
                  </el-table-column>
                  <el-table-column prop="paymentChecking" label="审批中总额" align="center">
                  </el-table-column>
                  <el-table-column prop="price" label="已收总额" align="center">
                  </el-table-column>
                  <el-table-column prop="supTotal" label="供应商欠款总额" align="center">
                  </el-table-column>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="预付付款明细" label-width="120px" label-height="auto">
                <br />
                <el-table :data="tableData6" border style="width:100%" :header-cell-style="getRowClass2">
                  <el-table-column prop="paymentID" label="ID" align="center">
                  </el-table-column>
                  <el-table-column prop="checkType" label="状态" align="center">
                  </el-table-column>
                  <el-table-column prop="paymentType" label="类型" align="center">
                  </el-table-column>
                  <el-table-column prop="supplierName" label="供应商" align="center">
                  </el-table-column>
                  <el-table-column prop="price" label="付款金额" align="center">
                  </el-table-column>
                  <el-table-column prop="peopleCount" label="人数" align="center">
                  </el-table-column>
                  <el-table-column prop="orgName" label="部门" align="center">
                  </el-table-column>
                  <el-table-column prop="createName" label="申请人" align="center">
                  </el-table-column>
                  <el-table-column prop="createTime" label="申请日期" align="center">
                  </el-table-column>
                  <el-table-column prop="mark" label="摘要" align="center">
                  </el-table-column>
                  <el-table-column label="审批过程" align="center">
                    <template slot-scope="scope">
                      <span style="color:blue;" v-on:click="advanceProcess2(scope.row.id)">查看</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="expensePrice" label="已核销金额" align="center">
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="" label-width="120px" label-height="auto" style="margin-top: -21px;" v-if="dialogVisible6">
                <el-table :data="tableData11" border style="width:55%" :header-cell-style="getRowClass2">
                  <el-table-column prop="createTime" label="申请日期" align="center">
                  </el-table-column>
                  <el-table-column prop="user" label="申请人" align="center">
                  </el-table-column>
                  <el-table-column prop="status" label="状态" align="center">
                  </el-table-column>
                  <el-table-column prop="abstract" label="摘要" align="center">
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="无收入借款明细" label-width="120px" label-height="auto">
                <br />
                <el-table :data="tableData7" border style="width:90%" :header-cell-style="getRowClass2">
                  <el-table-column prop="paymentID" label="ID" align="center">
                  </el-table-column>
                  <el-table-column prop="checkType" label="状态" align="center">
                  </el-table-column>
                  <el-table-column prop="paymentType" label="类型" align="center">
                  </el-table-column>
                  <el-table-column prop="supplierName" label="供应商" align="center">
                  </el-table-column>
                  <el-table-column prop="price" label="付款金额" align="center">
                  </el-table-column>
                  <el-table-column prop="orgName" label="部门" align="center">
                  </el-table-column>
                  <el-table-column prop="createName" label="申请人" align="center">
                  </el-table-column>
                  <el-table-column prop="createTime" label="申请日期" align="center">
                  </el-table-column>
                  <el-table-column prop="mark" label="摘要" align="center">
                  </el-table-column>
                  <el-table-column label="审批过程" align="center">
                    <template slot-scope="scope">
                      <span style="color:blue;" v-on:click="advanceProcess(scope.row.id)">查看</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="expensePrice" label="已核销金额" align="center">
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="" label-width="120px" label-height="auto" style="margin-top: -21px;" v-if="dialogVisible5">
                <el-table :data="tableData10" border style="width:55%" :header-cell-style="getRowClass2">
                  <el-table-column prop="createTime" label="申请日期" align="center">
                  </el-table-column>
                  <el-table-column prop="user" label="申请人" align="center">
                  </el-table-column>
                  <el-table-column prop="status" label="状态" align="center">
                  </el-table-column>
                  <el-table-column prop="abstract" label="摘要" align="center">
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="收入明细" label-width="120px" label-height="auto">
                <br />
                <el-table :data="tableData8" border style="width:85%" :header-cell-style="getRowClass2">
                  <el-table-column prop="oNo" label="订单编号" align="center">
                  </el-table-column>
                  <el-table-column prop="source" label="来源" align="center">
                  </el-table-column>
                  <el-table-column prop="user" label="联系人" align="center">
                  </el-table-column>
                  <el-table-column prop="number" label="人数" align="center">
                  </el-table-column>
                  <el-table-column prop="total" label="订单金额" align="center">
                  </el-table-column>
                  <el-table-column prop="accepted" label="已收" align="center">
                  </el-table-column>
                  <el-table-column prop="arrears" label="欠款" align="center">
                  </el-table-column>
                  <el-table-column prop="aNo" label="收款单号" align="center">
                  </el-table-column>
                  <el-table-column prop="arrearsTime" label="欠款日期" align="center">
                  </el-table-column>
                  <el-table-column prop="repaymentTime" label="应还日期" align="center">
                  </el-table-column>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-dialog>
    <!--预付款弹窗end-->
    <!--验证提示弹窗-->
    <el-dialog title="提示信息" :visible.sync="dialogVadi" class="city_list tips" width="400px">
      <div>
        <ul v-for="item in validaError">
          <li>{{item}}</li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog style="text-align: left" title="选择申请人:" :visible.sync="dialogVisible" width="50%">
      <div style="text-align: center">
        <div style="width: 100%">
          <div class="button_select" style="margin-bottom: 30px;margin-top: -30px;">
            <el-input v-model="apply_user_input" class="input" style='margin-left: 0px;'></el-input>
            <el-button type="primary" @click="searchHand2()" size="medium">搜索</el-button>
          </div>
          <div class="table_trip" style=" width: 100%;">
            <el-table :data="tableData3" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle2" :header-cell-style="getRowClass2">
              <el-table-column prop="id" label="ID" align="center" width="100%">
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="120%" align="center">
              </el-table-column>
              <el-table-column prop="mobile" label="手机号" align="center" width="120%">
              </el-table-column>
              <el-table-column prop="org" label="组织" align="center">
              </el-table-column>
              <el-table-column prop="sex" label="性别" align="center">
              </el-table-column>
              <el-table-column prop="status" label="状态" align="center" width="110%">
              </el-table-column>
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="block" style="margin-top: 30px;text-align:center;">
            <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page.sync="currentPage2" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
          </div>
          <!--分页-->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="routerHandle2()">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog style="text-align: left" title="选择团期:" :visible.sync="dialogVisible2" width="70%">
      <div style="text-align: center">
        <div style="width: 100%">
          <div class="button_select" style="margin-bottom: 30px;margin-top: -30px;">
            <span class="search-title" >团期计划</span>
            <el-input placeholder="团期计划" v-model="tour_name" class="group-no" style="width:20%"></el-input>
            <span class="search-title" >产品名称</span>
            <el-input placeholder="产品名称" v-model="product_name" class="group-no" style="width:20%"></el-input>
            <el-date-picker v-model="startTime2" type="date" placeholder="开始日期" class="start-time"></el-date-picker>
            <el-date-picker v-model="endTime2" type="date" placeholder="终止日期"></el-date-picker>
            <el-button type="primary" icon="el-icon-search" class="search" @click="searchHand4()"></el-button>
          </div>
          <div class="table_trip" style=" width: 100%;">
            <el-table :data="tableData4" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle4" :header-cell-style="getRowClass4">
              <el-table-column prop="groupCode" label="团号"></el-table-column>
              <el-table-column prop="title" label="产品名称"></el-table-column>
              <el-table-column prop="destination" label="目的地"></el-table-column>
              <el-table-column prop="date" label="出行日期"></el-table-column>
              <el-table-column prop="orgName" label="部门"></el-table-column>
              <el-table-column prop="name" label="操作"></el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <!-- <div class="block" style="margin-top: 30px;text-align:center;">
            <el-pagination @size-change="handleSizeChange4" @current-change="handleCurrentChange4" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
          </div> -->
          <!--分页-->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="routerHandle4()">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog style="text-align: left" title="选择账户:" :visible.sync="dialogVisible3" width="50%">
      <el-tabs v-model="activeName2" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="供应商" name="three">
          <el-table :data="tableData9" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle5" :header-cell-style="getRowClass4">
            <el-table-column prop="cardNumber" label="账户"></el-table-column>
            <el-table-column prop="bankName" label="开户行"></el-table-column>
            <el-table-column prop="cardName" label="名称"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="routerHandle5()">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog style="text-align: left" title="放大图片:" :visible.sync="dialogVisible4" width="50%">
      <el-button type="primary" @click="downs()" style="margin-bottom: 30px;">点击下载</el-button>
      <div>
        <img :src="imgBig" style="width: 95%;" alt="图片" :alt="imgBigName"/>
        <br /><span>{{imgBigName}}</span>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import { formatDate } from '@/js/libs/formatDate.js'
export default {
  name: "advanceInfo",
  components: {},
  props: {
    dialogFormVisible: false,
    find: 0,
    change: false,
    pid: '',
    infoStatus: '',
    typeList: {
      type: Array,
      default: () => []
    },
    payModeList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      activeName: 'first',
      activeName2: 'three',
      //付款搜索
      startTime2: '',
      endTime2: '',
      pageSize2: 5, // 设定默认分页每页显示数 todo 具体看需求
      total: 0,
      total2: 0,
      pageIndex2: 1, // 设定当前页数
      currentPage2: 1,
      arr: [],
      reable2: true,
      pid2: 0,
      firstIndex: 1,
      secondIndex: 1,
      firstTab: true,
      secondTab: false,
      approvalTotal: 0,
      tableData2: [],
      tableData3: [],
      tableData4: [],
      tableData5: [],
      tableData6: [],
      tableData7: [],
      tableData8: [{
        oNo: '订单编号',
        source: '来源',
        user: '联系人',
        number: '人数',
        total: '订单金额',
        accepted: '已收',
        arrears: '欠款',
        aNo: '收款单号',
        arrearsTime: '欠款日期',
        repaymentTime: '应还日期',
      }],
      tableData9: [{
        account: '账户',
        bank: '开户行',
        name: '名称',
      }],
      tableData10: [{
        id: '1',
        createTime: '审批时间',
        user: '审批人',
        status: '审批结果',
        abstract: '审批意见',
      }, {
        id: '2',
        createTime: '审批时间',
        user: '审批人',
        status: '审批结果',
        abstract: '审批意见',
      }],
      tableData11: [{
        id: '1',
        createTime: '审批时间',
        user: '审批人',
        status: '审批结果',
        abstract: '审批意见',
      }, {
        id: '2',
        createTime: '审批时间',
        user: '审批人',
        status: '审批结果',
        abstract: '审批意见',
      }],
      supplier: '',
      supplier_id: 0,
      type: '',
      payMode: '',
      ruleForm: {
        loanMoney: '',
        loanNumber: '',
        user: localStorage.getItem('name'),
        productName: '',
        tour: '',
        supplier: '',
        abstract: '',
        cardNumber: '',
        bankName: '',
        cardName: '',
        payMode: '',
        type: '',
      }, //文件上传列表
      fileList: [],
      rules: {
        //user: [{ required: true, message: '申请人不能为空', trigger: 'change' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        payMode: [{ required: true, message: '付款方式不能为空', trigger: 'change' }],
        loanMoney: [{ required: true, message: '借款金额不能为空', trigger: 'blur' }],
        loanNumber: [{ required: true, message: '借款数量不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '借款数量需为正整数' }
        ],
        tour: [{ required: true, message: '团期计划不能为空', trigger: 'change' }],
        supplier: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
        productName: [{ required: true, message: '产品名称不能为空', trigger: 'change' }],
        abstract: [{ required: true, message: '摘要不能为空', trigger: 'blur' }],
        cardNumber: [{ required: true, message: '账户不能为空', trigger: 'blur' }],
        bankName: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
        cardName: [{ required: true, message: '开户名不能为空', trigger: 'blur' }],
      },
      activeName: 'first',
      inputVisible3: false,
      dynamicTags2: [],
      noNull: '',
      validaError: '',
      empty: '',
      dialogVadi: false,
      supplierLength: true,
      inputVisible3: false,
      inputVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      dialogVisible6: false,
      dialogVisible2: false,
      dialogVisible: false,
      apply_user_input: '',
      tour_name: '',
      tour_name_pre: '',
      tour_id: 0,
      planID: '',
      product_name_pre: '',
      product_name: '',
      dynamicTags3: [],
      imgBig: '',
      imgBigName: '',
      tour_group: [],
      cardNumber_pre: '',
      bankName_pre: '',
      cardName_pre: '',
      time: 0,
      len: 0,
      uid: 0, //上传图片缩略图选中项

      upload_url: this.GLOBAL.imgUrl + '/upload/api/picture',
    }
  },
  computed: { // 计算属性的 getter
  },
  watch: {
    // 如果 `dialogFormVisible` 发生改变，这个函数就会运行
    dialogFormVisible: function() {
      if (this.dialogFormVisible == true && this.find != '0') {
        this.getPaymentInfo()
      } else {
        this.clearForm()
      }
    },
  },
  methods: {
    closeAdd() {
      this.clearForm()
      this.$emit('close', false);
    },
    advanceProcess2(num) {
      console.log(num)
      this.dialogVisible6 = true
    },
    advanceProcess(num) {
      console.log(num)
      this.dialogVisible5 = true
    },
    getRowClass2({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    routerHandle2() { //申请人添加
      this.dynamicTags3.push({ "podID": this.user_id, "pod": this.user_name });
      this.ruleForm.user = '1';
      this.dialogVisible = false
      this.$refs.ruleForm.validateField('user')
    },
    handleClose3(tag3) {
      this.dynamicTags3.splice(this.dynamicTags3.indexOf(tag3), 1);
      if (this.dynamicTags3.length <= 0) {
        this.ruleForm.user = ''
      }
      this.$refs.ruleForm.validateField('user')
    },
    handlePreview(file, fileList) {
      this.uid = file.uid
      this.dialogVisible4 = true
      this.imgBig = file.url
      this.imgBigName = file.name
    },
    downloadIamge(imgsrc, name) { //下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        var canvas = document.createElement("canvas");
        // 图片原始尺寸
        var originWidth = image.width;
        var originHeight = image.height;
        // 最大尺寸限制
        let maxWidth = 1000;
        let maxHeight = 1000;
        // 图片尺寸超过400x400的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更宽，按照宽度限定尺寸
            image.width = maxWidth;
            image.height = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            image.height = maxHeight;
            image.width = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/jpeg"); //得到图片的base64编码数据
        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    downs() {
      window.open(this.imgBig);
      //this.downloadIamge(this.imgBig, this.imgBigName)
    },
    handleRemove(file, fileList) {
      this.uid = fileList[0].uid;
      this.fileList = fileList
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

    searchHand2() {
      this.pageNum = 1;
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/userpage", {
            "pageIndex": this.pageNum,
            "pageSize": this.pageSize,
            "total": 0,
            "object": {
              "isDeleted": 0,
              "value": '',
              "type": 3,
              "user": '',
              "input": this.apply_user_input,

            },
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData3 = obj.data.objects;
        })
        .catch(function(obj) {
          console.log(obj)
        })

    },
    handleCurrentChange2(val) {

      this.pageNum = val;

      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/userpage", {
            "pageIndex": this.pageNum,
            "pageSize": this.pageSize,
            "total": 0,
            "object": {
              "isDeleted": 0,
              "value": '',
              "type": 3,
              "user": '',
              "input": this.apply_user_input,

            },
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData3 = obj.data.objects;
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    handleSizeChange2(val) {
      this.pagesize2 = val
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/userpage", {
            "pageIndex": this.pageNum,
            "pageSize": this.pageSize,
            "total": 0,
            "object": {
              "isDeleted": 0,
              "value": '',
              "type": 3,
              "user": '',
              "input": this.apply_user_input,

            },
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData3 = obj.data.objects;
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    handDb() {
      this.$router.push({
        path: 'advanceApply',
        query: {}
      })
    },
    handDb2() {
      this.$router.push({
        path: '/changepro',
        query: {
          id: this.pid2
        }
      })
    },
    resetHand() {
      this.groupNo = ''
      this.user = ''
      this.startTime = ''
      this.endTime = ''
    },
    handleClick(tab, event) {
      // if (tab.name == 'first') {
      //   this.firstTab = true
      //   this.secondTab = false
      //   this.pageIndex = this.firstIndex;
      //   this.currentPage4 = this.firstIndex;
      // }
      // if (tab.name == 'second') {
      //   this.firstTab = false
      //   this.secondTab = true
      //   this.pageIndex = this.secondIndex;
      //   this.currentPage4 = this.secondIndex;
      // }
    },
    routerHandle4() { //团期计划
      this.ruleForm.tour = this.tour_name_pre
      this.ruleForm.productName = this.product_name_pre
      this.getPaymentdetails(this.planID)
      this.dialogVisible2 = false
    },
    // 表格头部背景颜色
    getRowClass4({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    //获取id
    clickBanle2(row, event, column) {
      this.user_id = row['id']
      this.user_name = row['name']
      this.reable = false

    },
    //获取id
    clickBanle4(row, event, column) {
      this.tour_id = row['planID']
      this.tour_name_pre = row['groupCode']
      this.product_name_pre = row['title']
      this.planID = row['planID']
      this.reable = false;
    },
    //获取银行卡信息
    clickBanle5(row, event, column) {
      this.cardNumber_pre = row['cardNumber'];
      this.bankName_pre = row['bankName'];
      this.cardName_pre = row['cardName'];
    },
    routerHandle5() {
      this.ruleForm.cardNumber = this.cardNumber_pre
      this.ruleForm.bankName = this.bankName_pre
      this.ruleForm.cardName = this.cardName_pre
      this.dialogVisible3 = false
      this.$refs.ruleForm.validateField('cardNumber')
      this.$refs.ruleForm.validateField('bankName')
      this.$refs.ruleForm.validateField('cardName')
    },
    tour_check() {
      if (this.ruleForm.tour != '') {
        this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
          "pageIndex": 1,
          "pageSize": 1,
          "object": {
            "groupCode": this.ruleForm.tour, //团号
            "title": '', //产品名称
            "beginDate": 0, //搜索用开始日期
            "endDate": 0, //搜索用结束日期
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            this.product_name_pre = res.data.objects[0].title
            this.ruleForm.productName = res.data.objects[0].title
            this.getPaymentdetails(res.data.objects[0].planID)
          }
        }).catch(err => {
          console.log(err)
          this.product_name_pre = ''
          this.ruleForm.productName = ''
        })
      } else {
        this.product_name_pre = ''
        this.ruleForm.productName = ''
      }
    },
    searchHand4() {
      this.pageNum = 1;
      this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
        "pageIndex": this.pageIndex,
        "pageSize": this.pageSize2,
        "object": {
          "groupCode": this.tour_name, //团号
          "title": this.product_name, //产品名称
          "beginDate": this.startTime2 ? formatDate(this.startTime2, 'yyyyMMdd') : 0, //搜索用开始日期
          "endDate": this.endTime2 ? formatDate(this.endTime2, 'yyyyMMdd') : 0, //搜索用结束日期
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.tableData4 = res.data.objects;
          this.total = res.data.total;
        }
      }).catch(err => {
        console.log(err)
      })

    },
    handleCurrentChange4(val) {
      this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
        "pageIndex": val,
        "pageSize": this.pageSize2,
        "object": {
          "groupCode": this.tour_name, //团号
          "title": this.product_name, //产品名称
          "beginDate": this.startTime ? formatDate(this.startTime, 'yyyyMMdd') : 0, //搜索用开始日期
          "endDate": this.endTime ? formatDate(this.endTime, 'yyyyMMdd') : 0, //搜索用结束日期
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.tableData4 = res.data.objects;
          this.total = res.data.total;
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange4(val) {
      this.pageSize = val
      this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
        "pageIndex": 1,
        "pageSize": this.pageSize2,
        "object": {
          "groupCode": this.tour_name, //团号
          "title": this.product_name, //产品名称
          "beginDate": this.startTime ? formatDate(this.startTime, 'yyyyMMdd') : 0, //搜索用开始日期
          "endDate": this.endTime ? formatDate(this.endTime, 'yyyyMMdd') : 0, //搜索用结束日期
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.tableData4 = res.data.objects;
          this.total = res.data.total;
        }
      }).catch(err => {
        console.log(err)
      })
    },
    showInput5() {
      if (this.supplier_id) {
        this.dialogVisible3 = true;
        this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/banklist', {
          "object": {
            "supplierID": this.supplier_id, //供应商ID
          }
        }).then(res => {
          this.tableData9 = res.data.objects;
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$message.error('供应商未匹配后台数据,请手动输入银行信息!');
      }
    },
    showInput4() {
      this.dialogVisible2 = true;
    },
    showInput3() {
      this.dialogVisible = true
    },
    // 供应商
    dest_01(item) {
      this.ruleForm.supplier = item.value;
      this.inputVisible2 = false;
    },
    handleInputConfirm2() {
      if (this.ruleForm.supplier !== '') {
        setTimeout(res => {
          let inputVal4 = this.ruleForm.supplier;
          if (inputVal4) {
            this.dynamicTags2.push({ "labelID": 0, "label": inputVal4, "teamID": 0 });
            this.ruleForm.supplier = inputVal4;
          }
          this.inputVisible2 = false;
          this.empty = false;
        }, 200)
        this.supplierLength = false;
      } else {
        if (this.dynamicTags2.length == 0) {
          this.empty = true;
          document.getElementById('input-error').style.border = "solid 1px red";
        } else {
          this.inputVisible2 = false;
        }
      }
      this.$refs.ruleForm.validateField('supplier')
    },
    handleClose2(tag2) {
      this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag2), 1);
      this.supplierLength = true
      if (this.dynamicTags2.length < 1) {
        this.ruleForm.supplier = ''
        this.supplier_id = 0
      }
      this.$refs.ruleForm.validateField('supplier')
    },
    showInput2() {
      if (this.dynamicTags2.length < 1) {
        this.inputVisible2 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      }
      this.$refs.ruleForm.validateField('supplier')
    },
    querySearch5(queryString5, cb) {
      this.tableData2 = []
      this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/supplierlist', {
        "object": {
          name: queryString5
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.tableData2.push({
            "value": res.data.objects[i].name,
            "id": res.data.objects[i].id
          })
          this.supplier_id = res.data.objects[i].id ? res.data.objects[i].id : 0;
        }
        var results = queryString5 ? this.tableData2.filter(this.createFilter(queryString5)) : [];
        cb(results)
      }).catch(err => {
        console.log(err);
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 提交
    submitForm(formName) {
      //console.log(this.ruleForm.payMode)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let pictureList = [];
          for (let i = 0; i < this.fileList.length; i++) {
            let picture = {};
            picture.url = this.fileList[i].url1;
            picture.name = this.fileList[i].name;
            pictureList.push(picture);
          }
          this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/insert', {
            "object": {
              createUser: sessionStorage.getItem('id'),
              paymentType: 2, //借款类型 1无收入借款 2预付款
              planID: this.tour_id, //对应计划ID --Plan，不存在传值0
              supplierID: this.supplier_id, //对应供应商ID --Supplier，不存在传值0
              supplierName: this.ruleForm.supplier, //Supplier不存在时补充供应商名称
              supplierType: this.ruleForm.type, //供应商类型 0返款
              price: this.ruleForm.loanMoney, //金额
              peopleCount: this.ruleForm.loanNumber, //数量
              mark: this.ruleForm.abstract, //摘要
              cardNumber: this.ruleForm.cardNumber, //账号
              bankName: this.ruleForm.bankName, //开户行
              cardName: this.ruleForm.cardName, //开户名
              payway: this.ruleForm.payMode, //付款方式
              files: pictureList, //付款方式
            }
          }).then(res => {
            console.log(res.data);
            if (res.data.isSuccess == true) {
              this.closeAdd()
              this.sendBPM(res.data.object)
              this.$emit('searchHandList', false);
            } else {
              console.log('有错误!');
              console.log(res.data);
            }
          }).catch(err => {
            console.log(err);
          })
          this.$message({
            type: 'success',
            message: '创建成功!'
          });
        } else {
          console.log('error submit!!');
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
    //撤销申请
    chanelSubmit() {
      this.$confirm('是否撤销该条借款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var that = this
        that.$http.post(
            that.GLOBAL.serverSrc + "/finance/payment/api/delete", {
              "id": that.pid,
            }, {
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            }
          )
          .then(function(obj) {
            if (obj.data.isSuccess == true) {
              that.$message({
                type: 'success',
                message: '撤销成功!'
              });
              thua.closeAdd()
            } else {
              that.$message.error(obj.data.result.message);
              console.log(obj.data.result.message)
            }
          })
          .catch(function(obj) {
            console.log(obj)
          })
        that.$emit('searchHandList', false);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤销申请!'
        });
        this.$emit('searchHandList', false);
      });
    },
    
    getPaymentInfo() {
      var that = this
      that.$http.post(
          that.GLOBAL.serverSrc + "/finance/payment/api/get", {
            id: this.pid
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.ruleForm.user = obj.data.object.createUser
          that.ruleForm.supplier = obj.data.object.createUser
          that.supplier_id = obj.data.object.supplierID
          that.supplier = obj.data.object.supplierName
          that.supplierLength = false
          that.tour_id = obj.data.object.planID
          that.ruleForm.type = obj.data.object.supplierType
          that.ruleForm.loanMoney = obj.data.object.price
          that.ruleForm.loanNumber = obj.data.object.peopleCount
          that.ruleForm.abstract = obj.data.object.mark
          that.ruleForm.cardNumber = obj.data.object.cardNumber
          that.ruleForm.bankName = obj.data.object.bankName
          that.ruleForm.cardName = obj.data.object.cardName
          that.ruleForm.payMode = obj.data.object.payway
          //that.fileList = obj.data.object.files
          that.$set(that.dynamicTags2, 0, { "labelID": obj.data.object.supplierID, "label": obj.data.object.supplierName, "teamID": 0 })
          that.getTourByPlanId(obj.data.object.planID)
          that.getPaymentdetails(obj.data.object.planID)
          obj.data.object.files.forEach(function(v, k, arr) {
            that.fileList.push({
              "url": that.GLOBAL.imgUrl + '/upload' + arr[k]['url'],
              "name": arr[k]['name'],
            });
          })
          console.log(that.fileList)
        })
        .catch(function(obj) {
          console.log(obj)
        })

    },
    getTourByPlanId(val) {
      var that = this
      that.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
        "object": {
          planID: val, //团期计划ID
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.ruleForm.tour = res.data.objects[0].groupCode
          that.ruleForm.productName = res.data.objects[0].title
        }
      }).catch(err => {
        console.log(err)
      })
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
          that.tableData6 = res.data.objects
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
          that.tableData7 = res.data.objects
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
          that.tableData5 = []
          that.tableData5.push(res.data.object)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    clearForm() {
      this.ruleForm = {
        loanMoney: '',
        loanNumber: '',
        user: localStorage.getItem('name'),
        productName: '',
        tour: '',
        supplier: '',
        abstract: '',
        cardNumber: '',
        bankName: '',
        cardName: '',
        payMode: '',
        type: '',
      }
      this.supplier_id = 0
      this.supplier = ''
      this.dynamicTags2.splice(0, 1);
      this.supplierLength = true
      this.tour_id = 0
      this.fileList = []
    },
  },
  created() {

  },
};

</script>
<style lang="scss" scoped>
.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

#tab-first {
  font-size: 30px
}

.el-table th {
  background-color: red;
}

.demo-input-suffix {
  width: 900px
}

.el-input {
  width: auto
}

.group-no {
  margin-left: 10px
}

.start-time {
  margin-left: 25px
}

.date-line {
  width: 10px;
  border-bottom: 1px solid #e6e6e6;
  display: inline-block;
  margin: 0 3px 3px 0
}

.search-title {
  font-size: 14px;
  margin-left: 20px;
  margin-top: 10px;
}

.el-input__inner {
  width: 10%;
}

.button_select {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: left;
  //margin-left: 50px;

  .select_button {
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e9eaea;
    text-align: left;
    padding-left: 50px;
  }
}

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

.input-new-tags {
  width: 200px;
  float: left;
  margin-left: 5px;
  height: 30px;
  line-height: 30px;
  padding-top: 1px;
  margin-top: 1px;
  margin-bottom: 4px;
  padding-bottom: 2px
}

.bright_b {
  float: left;
  margin-left: 205px;
  margin-top: -62px;
}

.sh_style {
  background: #eaeaea;
  position: absolute;
  width: 50px;
  height: 23px;
  text-align: center;
  line-height: 26px;
  top: 20px;
  left: 116px;
}

.inputWidth {
  width: 200px;
}

</style>
