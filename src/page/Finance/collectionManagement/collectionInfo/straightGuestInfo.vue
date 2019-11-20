<template>
  <!-- 申请直客收款-弹窗 -->
  <div class="content">
    <el-dialog
      :title="title"
      :visible="dialogFormVisible"
      style="margin:-80px 0 0 0;"
      width=1100px
      :show-close="false"
      class="addReceivables"
      @close="closeAdd"
      custom-class="city_list"
    >
      <div v-if="this.find == 1 || this.find == 2" class="sh_style">审核中</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="btn" style="position:absolute;z-index:9;top:8px;right:1%;">
          <el-button @click="aaa()">取 消</el-button>
          <el-button v-if="this.find == 0" type="primary" @click="submitForm('ruleForm')">申 请</el-button>
          <el-button v-if="this.find == 1" type="danger" @click="chanelSubmit('ruleForm')" plain>撤销申请</el-button>
          <!-- <el-button v-if="this.find == 2" type="primary" @click="Transfer ('ruleForm')">转办</el-button> -->
          <el-button v-if="this.find == 2" type="primary" @click="adoptForm('ruleForm')">通过</el-button>
          <el-button v-if="this.find == 2" type="danger" @click="boSubmit('ruleForm')">驳回</el-button>
        </div>
        <!-- 表单基本信息 -->
        <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
        <el-form-item label="收款时间" prop="collectionTime" label-width="120px">
          <el-date-picker v-model="ruleForm.collectionTime" type="date" class="inputWidth" placeholder="收款时间" :disabled="change"></el-date-picker>
        </el-form-item>
        <el-form-item label="交易流水号" prop="serialNumber" label-width="120px">
          <el-input v-model="ruleForm.serialNumber" class="bright inputWidth" placeholder="交易流水" :disabled="change"></el-input>
        </el-form-item>
        <el-form-item label="收款账户" prop="collectionNumber" label-width="120px">
          <el-input style="width:200px;" v-model="ruleForm.collectionNumber" placeholder="请输入收款账户" :disabled="change"></el-input>
          <el-button class="collection" @click="account()" :disabled="change">选择</el-button>
        </el-form-item>
        <!-- <el-form-item label="收款金额" prop="price" label-width="120px">
          <el-input type="number" v-model="ruleForm.price" class="bright inputWidth" placeholder="收款金额" :disabled="change" disabled></el-input>
        </el-form-item>-->
        <!--<el-form-item label="订单号" prop="orderNumber" label-width="120px">
          <el-input v-model="ruleForm.orderNumber" class="bright inputWidth" placeholder="订单号" maxlength="20" :disabled="change" @blur='receiptorder'></el-input>
        </el-form-item> -->
        <!-- 订单信息 -->
        <!-- <el-form-item label="" label-width="" label-height="auto">
          <el-table :data="tableData1" empty-text="无订单信息" border style="width: 90%;margin-left:120px;margin-top: -5px;">
            <el-table-column prop="orderCode" label="订单号" align="center" width="180">
            </el-table-column>
            <el-table-column prop="title" label="产品" align="center" width="200">
            </el-table-column>
            <el-table-column prop="groupCode" label="团期计划" align="center" width="150">
            </el-table-column>
            <el-table-column prop="date" label="出发日期" align="center" width="100">
            </el-table-column>
            <el-table-column prop="payable" label="订单金额" align="center">
            </el-table-column>
            <el-table-column prop="uncollectedMoney" label="未收款金额" align="center">
            </el-table-column>
            <el-table-column prop="collectedMoney" label="已收款金额" align="center">
            </el-table-column>
            <el-table-column prop="examineMoney" label="待审核金额" align="center">
            </el-table-column>
          </el-table>
        </el-form-item> -->
        <el-form-item label="摘要" prop="abstract" label-width="120px">
          <el-input v-model="ruleForm.abstract" style="width:600px;" placeholder="摘要" :disabled="change"></el-input>
        </el-form-item>
        <el-form-item label="凭证" prop="voucher" label-width="120px" ref="voucher">
          <el-upload
            class="upload-demo"
            name="files"
            multiple
            :action="this.upload_url"
            :disabled="change"
            :file-list="fileList"
            :on-error="handleError"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
          >
            <el-button size="small" type="primary">上传文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否选择发票" prop="invoice" label-width="130px">
          <el-radio-group v-model="ruleForm.invoice" :disabled="change" @change="isInvoiceChange">
            <el-radio value='1' label='1' key='1'>是</el-radio>
            <el-radio value='0' label='0' key='0'>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 发票表格 -->
        <el-form-item label="" label-width="30px" label-height="auto" style="margin-top: -21px;" v-if="dialogVisible2">
          <el-button style="margin: 5px 0 10px 0;" type="primary" @click="handleEdit()">添加</el-button>
          <el-table :data="ruleForm.invoiceTable" border style="width: 100%;" size="mini">
            <el-table-column label="发票类型" width="120" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" placeholder="请选择" :disabled="change">
                  <el-option v-for="item in invoiceType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <div style="color:red; text-align:left;" v-if="scope.row.invoiceID !== '1' && a != false">不能为空</div>
                <!-- <div style="color:red;" v-show="null11">发票类型不能为空</div> -->
              </template>
            </el-table-column>
            <el-table-column label="个人/单位" width="120" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.userType" placeholder="请选择" :disabled="change">
                  <el-option key="个人" label="个人" value="1">
                  </el-option>
                  <el-option key="单位" label="单位" value="2">
                  </el-option>
                </el-select>
                <div style="color:red; text-align:left;" v-if="scope.row.invoiceType == '' && a != false">不能为空</div>
              </template>
            </el-table-column>
            <el-table-column label="纳税人识别号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.taxesNumber" required placeholder="纳税人识别号"></el-input>
                <div style="color:red; text-align:left;" v-if="scope.row.taxesNumber == '' && a != false" disabled="change">不能为空</div>
              </template>
            </el-table-column>
            <el-table-column label="发票抬头" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.titleOrMobile" placeholder="发票抬头" :disabled="change"></el-input>
                <div style="color:red; text-align:left;" v-if="scope.row.titleOrMobile == '' && a != false" disabled="change">不能为空</div>
              </template>
            </el-table-column>
            <el-table-column label="发票项目" width="120" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.project" placeholder="发票项目" :disabled="change">
                  <el-option v-for="item in invoiceProject" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <div style="color:red; text-align:left;" v-if="scope.row.project == '' && a != false">不能为空</div>
              </template>
            </el-table-column>
            <el-table-column label="金额" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.money" placeholder="金额" :disabled="change"></el-input>
                <div style="color:red; text-align:left;" v-if="scope.row.money == '' && a != false" disabled="change">不能为空</div>
              </template>
            </el-table-column>
            <el-table-column label="帐号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.account" placeholder="帐号" :disabled="change"></el-input>
                <div style="color:red; text-align:left;" v-if="scope.row.account == '' && a != false" disabled="change">不能为空</div>
              </template>
            </el-table-column>
            <el-table-column label="开户行" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.bank" placeholder="开户行" :disabled="change"></el-input>
                <div style="color:red; text-align:left;" v-if="scope.row.bank == '' && a != false" disabled="change">不能为空</div>
              </template>
            </el-table-column>
            <el-table-column label="地址" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.address" placeholder="地址" :disabled="change"></el-input>
                <div style="color:red; text-align:left;" v-if="scope.row.address == '' && a != false" disabled="change">不能为空</div>
              </template>
            </el-table-column>
            <el-table-column label="电话" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.mobile" placeholder="电话" :disabled="change"></el-input>
                <div style="color:red; text-align:left;" v-if="scope.row.mobile == '' && a != false" disabled="change">不能为空</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" v-if="scope.row.isUpdate!='1'" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <br />
                <!-- <el-button style="margin-top: 5px;" size="mini" type="primary" v-if="invoiceListCount==scope.$index && scope.row.isUpdate!='1'" @click="handleEdit(scope.$index, scope.row)">添加</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 关联欠款 -->
        <div>
          <el-divider content-position="left" class='title-margin title-margin-t'>关联欠款</el-divider>
          <el-form-item label="订单：" prop="indent" label-width="80px" style="float:left; margin:0 30px 20px 0;">
            <el-input placeholder="请输入" v-model="indent" :disabled="change"></el-input>
          </el-form-item>
          <!-- <el-form-item label="订单联系人" prop="indentPeople" label-width="120px" style="float:left; margin:0 50px 20px 0;">
            <el-input placeholder="请输入" v-model="indentPeople" :disabled="change"></el-input>
          </el-form-item> -->
          <div style="float:left;">
            <el-button type="primary" @click="receiptorder()">搜索</el-button>
            <el-button type="primary" @click="resetIndent()">重置</el-button>
          </div>
          <el-table :data="arrearsList" border style="width: 1030px; margin:10px 0 20px 25px;":header-cell-style="getRowClass">
             <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
             <el-table-column prop="title" label="产品名称" align="center"></el-table-column>
             <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
             <el-table-column prop="date" label="出发日期" align="center"></el-table-column>
             <el-table-column prop="payable" label="订单金额" align="center"></el-table-column>
             <el-table-column prop="uncollectedMoney" label="未收金额" align="center"></el-table-column> <!-- 订单减已收-->
             <el-table-column prop="collPrice" label="已收金额" align="center"></el-table-column>
             <el-table-column prop="audited" label="待审批金额" align="center"></el-table-column>
             <el-table-column prop="matchingPrice" label="匹配收款金额" align="center">
               <template slot-scope="scope">
                 <el-input v-model="scope.row.matchingPrice" placeholder="匹配收款金额" :disabled="change"></el-input>
               </template>
             </el-table-column>
          </el-table>
        </div>
        <!-- 审批过程 -->
        <!--  <el-form-item v-if="this.find == 1" label="审批过程" label-width="120px" label-height="auto">
        </el-form-item>
        <el-form-item v-if="this.find == 1" label="" label-width="" label-height="auto">
          <el-table :data="tableData2" border style="width: 97.8%;margin-left: 30px;margin-top: -25px;">
            <el-table-column prop="createTime" label="申请日期" align="center">
            </el-table-column>
            <el-table-column prop="user" label="申请人" align="center">
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
            </el-table-column>
            <el-table-column prop="abstract" label="摘要" align="center">
            </el-table-column>
          </el-table>
        </el-form-item> -->
        <!-- <div style="height: 200px;"></div> -->
      </el-form>
    </el-dialog>
    <!--协办弹窗-->
    <!--<el-dialog style="text-align: left" title="选择协办人:" :visible.sync="dialogFormVisible1" width="50%">
      <div style="text-align: center">
        <div style="width: 100%">
          <div class="button_select" style="margin-bottom: 30px;margin-top: -30px;">
            <el-input v-model="apply_user_input" class="input" style='margin-left: 0px;'></el-input>
            <el-button type="primary" @click="searchHand2()" size="medium">搜索</el-button>
          </div>
          <div class="table_trip" style=" width: 100%;">
            <el-table :data="tableData3" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
              <el-table-column prop="id" label="ID" align="center" width="100%">
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="120%" align="center">
              </el-table-column>
              <el-table-column prop="org" label="组织" align="center">
              </el-table-column>
              </el-table-column>
            </el-table>
          </div>
          <div class="block" style="margin-top: 30px;text-align:center;">
            <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page.sync="currentPage" :page-sizes="[5, 10, 50, 100]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="routerHandle2()">确 定</el-button>
        </span>
      </el-dialog> -->
      <!--驳回意见弹窗end-->
      <!--驳回意见弹窗-->
    <!--<el-dialog title="请填写审批意见" :visible.sync="dialogFormVisible2" width="30%">
      <textarea style="width: 90%; height: 132px; resize:none;margin-left: 13px; ">123123</textarea>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rejectHandle2()">确 定</el-button>
    </span>
    </el-dialog> -->
    <!--驳回意见弹窗end-->
    <el-dialog style="text-align: left" title="放大图片:" :visible.sync="dialogVisible" width="50%">
      <el-button type="primary" @click="downs()" style="margin-bottom: 30px;">点击下载</el-button>
      <div>
        <img :src="imgBig" alt="图片" style="width: 95%;" :alt="imgBigName"/>
        <br /><span>{{imgBigName}}</span>
      </div>
    </el-dialog>
    <!--收款账户选择弹窗-->
    <el-dialog title="选择账户" :visible.sync="accountShow" width="70%" custom-class="city_list">
      <div style="overflow:hidden;">
        <el-table :data="accountTable" border style="width: 100%" :header-cell-style="getRowClass" @row-click="clickPlan">
          <el-table-column prop="id" label="ID" align="center"></el-table-column>
          <el-table-column prop="cardType" label="类型" align="center"></el-table-column>
          <el-table-column prop="title" label="账号名称" align="center"></el-table-column>
          <el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
          <el-table-column prop="openingBank" label="开户行" align="center"></el-table-column>
          <el-table-column prop="openingName" label="开户人" align="center"></el-table-column>
          <el-table-column prop="operation" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="routerHandle4(scope.$index, scope.row)" class="table_details">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import { formatDate } from '@/js/libs/formatDate.js'
import moment from 'moment'

export default {
  name: "StraightGuestInfo",
  components: {},
  props: {
    dialogFormVisible: false,
    find: 0,
    change: false,
    org: '',
    pid: '',
    dept: '',
    collectionAccountList: {
      type: Array,
      default: () => []
    },
    accountList: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    var validateVoucher = (rule, value, callback) => {
      if (this.fileCheckVal === 0) {
        callback(new Error('请上传凭证'));
      } else {
        callback();
      }
    };
    return {
      accountCredited: null, // 收款账户选择
      fileCheckVal: 0, // 上传凭证成功返回的文件数量（验证用）
      a: false,
      user_id: '',
      user_name: '',
      reable: false,
      apply_user_input: '',
      total: 0,
      pageNum: 1,
      pageSize: 5,
      currentPage: 1,
      imgBigName: '',
      imgBig: '',
      dialogVisible: false,
      dialogVisible2: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      upload_url: this.GLOBAL.serverSrc + '/upload/obs/api/file', // 上传凭证
      time: 0,
      len: 0,
      uid: 0, //上传图片缩略图选中项
      fileList: [],
      invoiceType: [{
        value: '1',
        label: '纸质发票'
      }, ],
      invoiceProject: [{
        value: '1',
        label: '旅游费'
      }, ],
      ruleForm: {
        voucher: [], // 凭证
        collectionTime: '',
        groupCode: '',
        planID: '',
        orderID: '',
        orderNumber: '',
        collectionNumber: '',
        // price: '',
        dept: '',
        createUser: '',
        serialNumber: '',
        abstract: '',
        invoice: '0',
        invoiceTable: [{
          invoiceID: '', //发票类型
          invoiceType: '', //个人/单位
          invoiceNumber: '', //纳税识别人编号
          invoiceHeaderOrTel: '', //发票抬头/手机号
          invoiceItem: '', //发票项目-旅游费
          invoicePrice: '', //金额
          cardNumber: '', //帐号
          bankName: '', //开户行
          address: '', //地址
          tel: '', //电话
          createTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        }],
      },
      rules: {
        invoice: [{ required: true, message: '是否开发票不能为空', trigger: 'blur' }],
        voucher: [{ required: true, trigger: 'change', validator: validateVoucher}],
        collectionTime: [{ required: true, message: '收款时间不能为空', trigger: 'blur' }],
        collectionNumber: [{ required: true, message: '收款账户不能为空', trigger: 'change' }],
        invoiceID: [{ required: true, message: '收款账户不能为空', trigger: 'blur' }],
        /*serialNumber: [{ required: true, message: '交易流水号不能为空', trigger: 'blur' }],*/
        /*price: [
          { required: true, message: '收款金额不能为空', trigger: 'blur' },
          { pattern: /^\d+(\.\d+)?$/, message: '收款金额需为正数' }
        ],*/
        abstract: [{ required: true, message: '请输入摘要', trigger: 'blur' },
                { min: 0, max: 30, message: '摘要字数不能超过80字', trigger: 'change' },],
        orderNumber: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
        invoiceID: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
      },
      tableData1: [],
      tableData2: [{
        createTime: '2018-05-23',
        user: '阳阳',
        status: '通过',
        abstract: '没啥意见',
      }],
      tableData3: [],
      collectedMoney: 0,
      uncollectedMoney: 0, // 未收金额
      examineMoney: 0, // 待审批金额
      accountShow:false,//选择账户弹窗
      accountTable:[],
      arrearsList: [],//关联欠款
      indent:'',//关联欠款订单号搜索
      indentPeople:'',//订单关联订单联系人搜索
      tour_name_pre:'',
      null11:false,
    }
  },
  computed: { // 计算属性的 getter
    invoiceListCount() {
      return this.ruleForm.invoiceTable.length - 1;
    },
    title() {
      return (this.find == 1 || this.find == 2) ? "查看直客收款" : "申请直客收款"
    },
  },
  watch: {
    // 如果 `dialogFormVisible` 发生改变，这个函数就会运行
    dialogFormVisible: function() {
      if (this.dialogFormVisible == true && this.find != '0') {
        this.getCollectionInfo()
      } else {
        this.clearForm()
      }
    }
  },
  methods: {
    moment,
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    //选择账户弹窗
    account(){
      this.accountShow = true;
      var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list",
          {
            "object": {
              "isDeleted": 0
            },
          },)
          .then(function (obj) {
            that.accountTable = obj.data.objects
            that.accountTable.forEach(function (v,k,arr) {
              if(arr[k]['cardType'] == 1){
                arr[k]['cardType'] = '收款账户'
              }else if(arr[k]['cardType'] == 2) {
                arr[k]['cardType'] = '付款账户'
              }
            })
          })
          .catch(function (obj) {
            console.log(obj)
          })
    },
    accountClose(){
      this.accountShow = false;
    },
    //收款账户选择
    routerHandle4(index,row ) {
      this.accountCredited = row.id
      setTimeout(v => {
        this.ruleForm.collectionNumber = this.tour_name_pre
        this.accountShow = false
      }, 200)

    },
    //收款账户点击
    clickPlan(row){
      // console.log(row)
      this.tour_name_pre = row['title'];
      this.planID = row['planID'];
      this.tour_id = row['planID']
    },
    //获取id
    clickBanle(row, event, column) {
      this.user_id = row['id'];
      this.user_name = row['name'];
      this.reable = false;
    },
    closeAdd() {
      this.$emit('close', false);
      this.$refs["ruleForm"].resetFields();
      this.arrearsList = [];
      this.indent = '';
      this.dialogVisible2 = false;
      this.a = false;
    },
    aaa(){
      //this.$emit('close', false);
      this.$confirm("是否取消本次收款申请?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
        }).then(() => {
             this.$message.success("收款申请已取消");
             //this.dialogFormVisible =false;
             this.closeAdd();
             this.$refs["ruleForm"].resetFields();
             this.arrearsList = [];
             this.indent = '';
             this.dialogVisible2 = false;
             this.a = false;
           //this.clearPlan();
           })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //通过订单号获取直客收款订单详情
    receiptorder() {
      this.arrearsList = []
      this.ruleForm.planID = ''
      this.ruleForm.orderID = ''
      this.ruleForm.groupCode = ''
      // this.getnumber()
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/teamquery/get/api/receiptorder", {
            orderCode: that.indent,
          }
        )
        .then(function(obj) {
          // obj.data.object.collectedMoney = that.collectedMoney 暂时没用上
          obj.data.object.uncollectedMoney = obj.data.object.payable - obj.data.object.collPrice // 订单金额 - 已收金额
          // obj.data.object.collectedMoney = that.examineMoney 暂时没用上
          obj.data.object.matchingPrice = 0
          that.arrearsList.push(obj.data.object)
          that.ruleForm.planID = obj.data.object.planID
          that.ruleForm.orderID = obj.data.object.id
          that.ruleForm.groupCode = obj.data.object.groupCode
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    //通过订单号获取直客收款订单详情
    getnumber() {
      var that = this
      that.$http.post(
          that.GLOBAL.serverSrc + "/finance/collection/api/getnumber", {
            number: that.indent,
          }
        )
        .then(function(obj) {
          that.collectedMoney = obj.data.isSuccess == true ? obj.data.object.price : 0
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    // 提交
    submitForm(formName) {
      // 如果没有关联相关欠款则阻止继续提交表单
     if(this.arrearsList.length == 0) {
        this.$message({
         type: 'info',
         message: '请选择关联欠款单号'
       });
       return;
     }
     console.log(this.arrearsList[0].matchingPrice)
      if(this.arrearsList[0].matchingPrice <= 0) {
        this.$message({
          type: 'info',
          message: '请填写匹配收款金额'
        });
        return;
      }
     console.log(this.arrearsList[0].uncollectedMoney - this.arrearsList[0].audited >= this.arrearsList[0].matchingPrice)
      console.log(this.arrearsList[0].matchingPrice)
      if(!(this.arrearsList[0].uncollectedMoney - this.arrearsList[0].audited >= this.arrearsList[0].matchingPrice)){
        this.$message({
          type: 'info',
          message: '未收金额 - 待审批金额 >=  匹配收款金额'
        });
        return;
      }

      let _this = this
      this.a = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let pictureList = [];
          let newDate = moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
          this.fileList.forEach(function(item){
            pictureList.push({ url: JSON.parse(item.response).paths[0].Url, name: item.name})
          })

          let objectRequest = {}

          let needArrearData = [] // 转变关联欠款数据格式之后的数据模型
          this.arrearsList.forEach(function(item){ // 转换关联欠款表格数据结构
            needArrearData.push({
              "id": item.id,
              'planID':item.planID,
              "collectionID": 0, // 收款id
              "orderCode": item.orderCode,
              // "productName": item.proName,
              "productName": item.title,
              "groupCode": item.groupCode,
              "date": item.date,
              "payablePrice": item.payable, // 订单金额
              "arrearsPrice": item.uncollectedMoney, // 欠款金额
              "repaidPrice": item.collPrice, // 已还金额
              "amountPrice": item.audited, // 待审核金额   title groupCode date payable uncollectedMoney collectedMoney examineMoney repaymentMoney
              "matchingPrice": item.matchingPrice // 匹配收款金额
            })
          })

          objectRequest = {
            GroupCode:"",
            OrderNumber:"",
            LocalCompName:"",
            Dept:sessionStorage.getItem('orgName'),
            ProductName:"暂无",
            checkType: 0, // 审批状态
            collectionTime: moment(this.ruleForm.collectionTime).format('YYYY-MM-DD HH:mm:ss'), // 收款时间
            groupCode: this.ruleForm.groupCode, //团号
            planID: 0, //团期计划的ID
            orderID: 0, //订单ID
            orderNumber: this.indent, //订单号
            collectionNumber: this.ruleForm.collectionNumber, //收款账户
            price: this.arrearsList[0].matchingPrice, //金额
            // dept: this.dept, //this.org, //组织部门
            createUser: sessionStorage.getItem('userCode'), // 创建者
            createTime: newDate, //申请时间
            serialNumber: this.ruleForm.serialNumber, //流水号
            abstract: this.ruleForm.abstract, //摘要
            files: pictureList, //图片
            invoice: this.ruleForm.invoice, //是否发票
            isDeleted: 0,
            collectionType:1,//直客1.同业2
            localCompID:0,//直客0，同业变成同业社id
            arrears: needArrearData, // 收款 - 关联欠款列表
            isEBS: 0,
            accountID: this.accountCredited == null ? 0 : this.accountCredited, // 银行账号ID
            moneyExplain: "string", // 款项说明
            distributor: "string", // 分销商
            payarr: [], // 付款 欠款关联订单
            //invoiceTable:this.ruleForm.invoiceTable,
          }
          if (_this.ruleForm.invoice == '1') {
            let needInvoiceData = []
            _this.ruleForm.invoiceTable.forEach(function(item){
              needInvoiceData.push({
                "id": 0,
                "createTime": "2019-11-11T02:43:05.258Z",
                "code": "string",
                "invoiceID": item.type, // 发票类型 – 纸质发票
                "invoiceType": item.userType, // 个人/单位
                "invoiceNumber": item.taxesNumber, // 纳税人识别号
                "invoiceHeaderOrTel": item.titleOrMobile, // 发票抬头/手机号
                "invoiceItem": item.project, // 发票项目–旅游费
                "invoicePrice": item.money, // 金额
                "cardNumber": item.account, // 账号
                "bankName": item.bank, // 开户行
                "address": item.address, // 地址
                "tel": item.mobile, // 电话
                "collectionID": 0
              })
            })
            objectRequest.invoiceTable = needInvoiceData
          }else {
            objectRequest.invoiceTable = []
          }


          this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/insert', {
            "object": objectRequest
          }).then(res => {
            if (res.data.isSuccess == true) {
              if(this.$parent.$parent.$parent.$parent.$refs.PendingApprovalManagement){
                this.$parent.$parent.$parent.$parent.$refs.PendingApprovalManagement.loadDataZK();
              };
              this.$emit('searchHand', '')
              this.$message({
                type: 'success',
                message: '创建成功!'
              });
              this.closeAdd()
            } else {
              console.log('有错误!')
              console.log(res.data)
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false;
        }
      });
    }, //转办
    Transfer() {
      this.dialogFormVisible1 = true
    },
    //驳回
    boSubmit() {
      this.$confirm('是否驳回该条收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var that = this
        that.$http.post(
            that.GLOBAL.serverSrc + "/finance/collection/api/getCollIDBH", {
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
                message: '驳回成功!'
              });
              that.closeAdd()
              that.$emit('searchHand', '')
            } else {
              console.log(obj.data)
            }
          })
          .catch(function(obj) {
            console.log(obj)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消(驳回)'
        });
      });
      // this.dialogFormVisible2 = true
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
            that.GLOBAL.serverSrc + "/finance/collection/api/delete", {
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
              that.closeAdd()
              that.$emit('searchHand', '')
            } else {
              console.log(obj.data)
            }
          })
          .catch(function(obj) {
            console.log(obj)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤销'
        });
      });
    },
    //通过确认按钮
    adoptForm() {
      this.$confirm('是否通过该条收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var that = this
        that.$http.post(
            that.GLOBAL.serverSrc + "/finance/collection/api/getCollIDTG", {
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
                message: '通过成功!'
              });
              that.closeAdd()
              that.$emit('searchHand', '')
            } else {
              console.log(obj.data)
            }
          })
          .catch(function(obj) {
            console.log(obj)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消(通过)'
        });
      });
    },
    //转办确认按钮
    routerHandle2() {
      this.$confirm('是否转办该条收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '转办成功!'
        });
        this.closeAdd()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消(转办)'
        });
      });
      this.dialogFormVisible1 = false
    },
    //驳回确定按钮
    rejectHandle2() {
      this.$confirm('是否驳回该条收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var that = this
        that.$http.post(
            that.GLOBAL.serverSrc + "/finance/collection/api/getCollIDBH", {
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
                message: '驳回成功!'
              });
              that.closeAdd()
              that.$emit('searchHand', '')
            } else {
              console.log(obj.data)
            }
          })
          .catch(function(obj) {
            console.log(obj)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消(驳回)'
        });
      });
      this.dialogFormVisible2 = false
    },
    handlePreview(file, fileList) {
      // this.dialogVisible = true
      let getUrl = JSON.parse(file.response)
      this.uid = file.uid
      window.open(getUrl.paths[0].Url);
      this.imgBigName = file.name
      /*this.imgBig = file.url
      this.imgBigName = file.name*/
    },
    handleEdit(index, row) {
      this.ruleForm.invoiceTable.push({})
    },
    handleDelete(index, row) {
      this.ruleForm.invoiceTable.splice(index, 1)
      if (this.ruleForm.invoiceTable.length == 0) {
        this.ruleForm.invoiceTable.push({})
      }
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
        let maxWidth = 1080;
        let maxHeight = 1080;
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
      // this.downloadIamge(this.imgBig, this.imgBigName)
    },
    // 上传文件-移除
    handleRemove(file, fileList) {
      this.uid = fileList[0].uid;
      this.fileList = fileList
      this.fileCheckVal = fileList.length
    },
    handleSuccess(res, file, fileList) {
      this.fileCheckVal = fileList.length; // 成功时凭证的条数（校验用）
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
    //文件上传
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    handleError(err, file) {
      this.fileList = []
    },
    isInvoiceChange(value) {
      console.log(value)
      this.dialogVisible2 = value == '1' ? true : false;

      //this.ruleForm.invoiceTable = [];
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
          that.tableData3.forEach(function(v, k, arr) {
            arr[k]['org'] = '吉林大运通-财务部-会计'
            if (arr[k]['sex'] == 1) {
              arr[k]['sex'] = '男'
            } else {
              arr[k]['sex'] = '女'
            }
            if (arr[k]['userState'] == 0) {
              arr[k]['status'] = '未选择'
            } else if (arr[k]['userState'] == 1) {
              arr[k]['status'] = '等待审核'
            } else if (arr[k]['userState'] == 2) {
              arr[k]['status'] = '正常'
            } else {
              arr[k]['status'] = '停用'
            }
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    handleSizeChange2(val) {
      this.pagesize = val
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
          that.tableData3.forEach(function(v, k, arr) {
            arr[k]['org'] = '吉林大运通-财务部-会计'
            if (arr[k]['sex'] == 1) {
              arr[k]['sex'] = '男'
            } else {
              arr[k]['sex'] = '女'
            }
            if (arr[k]['userState'] == 0) {
              arr[k]['status'] = '未选择'
            } else if (arr[k]['userState'] == 1) {
              arr[k]['status'] = '等待审核'
            } else if (arr[k]['userState'] == 2) {
              arr[k]['status'] = '正常'
            } else {
              arr[k]['status'] = '停用'
            }
          })
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
          that.tableData3.forEach(function(v, k, arr) {
            arr[k]['org'] = '吉林大运通-财务部-会计'
            if (arr[k]['sex'] == 1) {
              arr[k]['sex'] = '男'
            } else {
              arr[k]['sex'] = '女'
            }
            if (arr[k]['userState'] == 0) {
              arr[k]['status'] = '未选择'
            } else if (arr[k]['userState'] == 1) {
              arr[k]['status'] = '等待审核'
            } else if (arr[k]['userState'] == 2) {
              arr[k]['status'] = '正常'
            } else {
              arr[k]['status'] = '停用'
            }
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    getCollectionInfo() {
      var that = this
      that.$http.post(
          that.GLOBAL.serverSrc + "/finance/collection/api/coll", {
            id: this.pid
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          obj.data.object.files.forEach(function(v, k, arr) {
            that.fileList.push({
              "url": that.GLOBAL.imgUrl + '/upload' + arr[k]['url'],
              "name": arr[k]['name'],
            });
          })
          console.log(obj.data.object)
          that.ruleForm.abstract = obj.data.object.abstract
          that.ruleForm.checkType = obj.data.object.checkType
          that.ruleForm.collectionNumber = that.accountList[obj.data.object.collectionNumber]
          that.ruleForm.collectionTime = obj.data.object.collectionTime
          that.ruleForm.createUser = obj.data.object.createUser
          that.indent = obj.data.object.indent
          that.ruleForm.price = obj.data.object.price
          that.ruleForm.serialNumber = obj.data.object.serialNumber
          that.ruleForm.invoice = obj.data.object.invoice.toString()
          that.dialogVisible2 = obj.data.object.invoice == '1' ? true : false
          if (obj.data.object.invoice == '1') {
            that.ruleForm.invoiceTable = []
            obj.data.object.invoiceTable.forEach(function(v, k, arr) {
              that.ruleForm.invoiceTable.push({
                invoiceID: arr[k]['invoiceID'].toString(), //发票类型
                invoiceType: arr[k]['invoiceType'].toString(), //个人/单位
                invoiceNumber: arr[k]['invoiceNumber'].toString(), //纳税识别人编号
                invoiceHeaderOrTel: arr[k]['invoiceHeaderOrTel'].toString(), //发票抬头/手机号
                invoiceItem: arr[k]['invoiceItem'].toString(), //发票项目-旅游费
                invoicePrice: arr[k]['invoicePrice'], //金额
                cardNumber: arr[k]['cardNumber'].toString(), //帐号
                bankName: arr[k]['bankName'].toString(), //开户行
                address: arr[k]['address'].toString(), //地址
                tel: arr[k]['tel'].toString(), //电话
                isUpdate: 1, //是否能够操作
              });
            })
          }
          that.receiptorder()
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    sendBPM(result) {
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/StartUpWorkFlowForJQ', {
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
    clearForm() {
      this.ruleForm = {
        abstract: '',
        checkType: '',
        collectionNumber: '',
        collectionTime: '',
        createUser: '',
        orderNumber: '',
        price: '',
        serialNumber: '',
        invoice: '0',
        invoiceTable: [{
          invoiceID: '', //发票类型
          invoiceType: '', //个人/单位
          invoiceNumber: '', //纳税识别人编号
          invoiceHeaderOrTel: '', //发票抬头/手机号
          invoiceItem: '', //发票项目-旅游费
          invoicePrice: '', //金额
          cardNumber: '', //帐号
          bankName: '', //开户行
          address: '', //地址
          tel: '', //电话
        }],
      }
      this.fileList = []
      this.tableData1 = []
    },
    //关联欠款搜索重置
    resetIndent(){
      this.indent = '';
      this.indentPeople = '';
    },

  },
  created() {

  },
}

</script>
<style lang="scss" scoped>
  .content{
    position: relative;
    .el-divider__text{
      font-size: 17px !important
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .invoice{
      margin-left: 30px;
    }
  }
.sh_style {
  background: #eaeaea;
  position: absolute;
  width: 50px;
  height: 23px;
  text-align: center;
  line-height: 26px;
  top: 20px;
  left: 135px;
}

.bright {
  width: 220px;
}

.bright2 {
  width: 70%;
}

.button_select {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: left;
  /*margin-left: 50px;*/
}

.el-input {
  width: auto
}

.search_input {
  float: left;
  width: 200px
}

.inputWidth {
  width: 200px;
}

  .upload-demo>>>.el-upload-list__item:first-child {
    margin-top: 5px;
  }
  .upload-demo{width: 400px;}
  .upload-demo>>>.el-upload-list__item{ width: 300px; }
.collection{background:#eaeaea; color:#a4a4a4;}
.accountButton{float:right; margin:20px 0 0 0; overflow: hidden;}
/*关联欠款*/
.associated{ line-height: 40px; background: #e3f2fc; border: 1px solid #cfeefc;width: 1030px; margin: 0 0 0 25px; border-radius: 5px;overflow: hidden; }
.associatedIcon{font-size:14pt; color: #0b84e6; margin: 0 0 0 15px; float:left;}
.associatedItems{float:left; margin: 0 0 0 10px;}
.associatedMoney{float:left; margin: 0 0 0 30px;}

</style>
