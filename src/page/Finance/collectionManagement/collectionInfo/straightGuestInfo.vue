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
        <div label="" label-width="30px" label-height="auto" style="margin-top: -21px;" v-if="dialogVisible2">
          <el-button style="margin: 5px 0 10px 0;" type="primary" @click="handleEdit()">添加</el-button>
          <el-table :data="ruleForm.invoiceTable" border style="width: 100%;" size="mini">
            <el-table-column label="发票类型" width="120" align="center">
              <template slot-scope="scope">
                <el-form-item :prop="'invoiceTable.' + scope.$index + '.invoiceID'" :rules="rules.invoiceID">
                  <el-select v-model="scope.row.invoiceID" placeholder="请选择">
                    <el-option v-for="item in invoiceTypeData" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="个人/单位" width="120" align="center">
              <template slot-scope="scope">
                <el-form-item :prop="'invoiceTable.' + scope.$index + '.invoiceType'" :rules="rules.invoiceType">
                  <!--<el-select v-model="scope.row.userType" placeholder="请选择" :disabled="change">-->
                  <el-select v-model="scope.row.invoiceType" placeholder="请选择">
                    <el-option key="个人" label="个人" value="1">
                    </el-option>
                    <el-option key="单位" label="单位" value="2">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="纳税人识别号" align="center" width="200">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model="scope.row.taxesNumber" required placeholder="纳税人识别号"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="发票抬头" align="center" width="200">
              <template slot-scope="scope">
                <el-form-item :prop="'invoiceTable.' + scope.$index + '.titleOrMobile'" :rules="rules.titleOrMobile">
                  <el-input v-model="scope.row.titleOrMobile" placeholder="发票抬头"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="发票项目" width="150" align="center">
              <template slot-scope="scope">
                <el-form-item :prop="'invoiceTable.' + scope.$index + '.invoiceItem'" :rules="rules.invoiceItem">
                  <el-select v-model="scope.row.invoiceItem" placeholder="发票项目">
                    <el-option v-for="item in invoiceProject" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="金额" align="center" width="120">
              <template slot-scope="scope">
                <el-form-item :prop="'invoiceTable.' + scope.$index + '.invoicemoney'" :rules="rules.invoicemoney">
                  <el-input v-model="scope.row.invoicemoney" placeholder="金额" :disabled="change"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="帐号" align="center" width="220">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model="scope.row.account" placeholder="帐号" :disabled="change"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="开户行" align="center" width="220">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model="scope.row.bank" placeholder="开户行" :disabled="change"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="地址" align="center" width="220">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model="scope.row.address" placeholder="地址" :disabled="change"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="电话" align="center" width="150">
              <template slot-scope="scope">
                <el-form-item :prop="'invoiceTable.' + scope.$index + '.mobile'" :rules="rules.mobile">
                  <el-input v-model="scope.row.mobile" placeholder="电话" :disabled="change"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" v-if="scope.row.isUpdate!='1'" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <br />
                <!-- <el-button style="margin-top: 5px;" size="mini" type="primary" v-if="invoiceListCount==scope.$index && scope.row.isUpdate!='1'" @click="handleEdit(scope.$index, scope.row)">添加</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
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
      </el-form>
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
    let validateVoucher = (rule, value, callback) => {
      if (this.fileCheckVal === 0) {
        callback(new Error('请上传凭证'));
      } else {
        callback();
      }
    };
    return {
      accountCredited: null, // 收款账户选择
      fileCheckVal: 0, // 上传凭证成功返回的文件数量（验证用）
      user_id: '',
      user_name: '',
      reable: false,
      dialogVisible2: false,
      dialogFormVisible2: false,
      upload_url: this.GLOBAL.serverSrc + '/upload/obs/api/file', // 上传凭证
      time: 0,
      len: 0,
      uid: 0, //上传图片缩略图选中项
      fileList: [],
      invoiceTypeData: [{
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
          invoicemoney: '', //金额
          cardNumber: '', //帐号
          bankName: '', //开户行
          address: '', //地址
          mobile: '', //电话
          createTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        }]
      },
      rules: {
        invoiceID: [{ required: true, message: '请选择发票类型', trigger: 'blur' }],
        invoiceType: [{ required: true, message: '请选择个人或者单位', trigger: 'blur' }],
        titleOrMobile: [{ required: true, message: '请填写发票抬头', trigger: 'blur' }],
        invoicemoney: [{ required: true, message: '请填写发票金额', trigger: 'blur' }],
        mobile: [{ required: true, message: '请填写联系电话', trigger: 'blur' }],
        invoiceItem: [{ required: true, message: '请选择发票项目', trigger: 'blur' }],
        invoice: [{ required: true, message: '是否开发票不能为空', trigger: 'blur' }],
        voucher: [{ required: true, trigger: 'change', validator: validateVoucher}],
        collectionTime: [{ required: true, message: '收款时间不能为空', trigger: 'blur' }],
        collectionNumber: [{ required: true, message: '收款账户不能为空', trigger: 'change' }],
        // invoiceID: [{ required: true, message: '收款账户不能为空', trigger: 'blur' }],
        /*serialNumber: [{ required: true, message: '交易流水号不能为空', trigger: 'blur' }],*/
        /*price: [
          { required: true, message: '收款金额不能为空', trigger: 'blur' },
          { pattern: /^\d+(\.\d+)?$/, message: '收款金额需为正数' }
        ],*/
        abstract: [{ required: true, message: '请输入摘要', trigger: 'blur' },
                { min: 0, max: 30, message: '摘要字数不能超过80字', trigger: 'change' },],
        orderNumber: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
        // invoiceID: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
      },
      tableData1: [],
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
              "isDeleted": 0,
              'orgID': sessionStorage.getItem('topID')
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
        this.GLOBAL.serverSrc + "/finance/refund/api/list", {
          object:{orderCode: that.indent},
        })
        .then(function(obj) {
          if(obj.data.objects.length == 0){
            that.$http.post(
              that.GLOBAL.serverSrc + "/teamquery/get/api/receiptorder", {
                orderCode: that.indent,
              })
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
          }else {
            that.$message({
              type: "info",
              message: "该笔订单正在退款中，不能进行收款操作"
            });
          }
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
      if(this.arrearsList[0].matchingPrice <= 0) {
        this.$message({
          type: 'info',
          message: '请填写匹配收款金额'
        });
        return;
      }
      if(!(this.arrearsList[0].uncollectedMoney - this.arrearsList[0].audited >= this.arrearsList[0].matchingPrice)){
        this.$message({
          type: 'info',
          message: '需遵循此公式：未收金额 - 待审批金额 >=  匹配收款金额'
        });
        return;
      }

      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let pictureList = [];
          let newDate = moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
          console.log(this.fileList,'pircture')
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
            collectionTime: moment(this.ruleForm.collectionTime).format('YYYY-MM-DD'), // 收款时间
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
                "invoiceID": item.invoiceID, // 发票类型 – 纸质发票
                "invoiceType": item.invoiceType, // 个人/单位
                "invoiceNumber": item.taxesNumber, // 纳税人识别号
                "invoiceHeaderOrTel": item.titleOrMobile, // 发票抬头/手机号
                "invoiceItem": item.invoiceItem, // 发票项目–旅游费
                "invoicePrice": item.invoicemoney, // 金额
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
      let getUrl = JSON.parse(file.response)
      this.uid = file.uid
      window.open(getUrl.paths[0].Url);
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
    // 上传文件-移除
    handleRemove(file, fileList) {
      this.uid = fileList[0].uid;
      this.fileList = fileList
      this.fileCheckVal = fileList.length
    },
    handleSuccess(res, file, fileList) {
      this.fileList = fileList
      this.fileCheckVal = fileList.length; // 成功时凭证的条数（校验用）
    },
    handleError(err, file) {
      this.fileList = []
    },
    isInvoiceChange(value) {
      this.dialogVisible2 = value == '1' ? true : false;
      //this.ruleForm.invoiceTable = [];
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
  }
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
