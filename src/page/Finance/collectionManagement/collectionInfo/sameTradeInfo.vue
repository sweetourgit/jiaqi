<template>
  <!-- 申请同业收款-弹窗 -->
  <div class="content">
    <el-dialog
      :title="title"
      :visible="dialogFormVisible"
      style="margin:-80px 0 0 0;"
      width=1100px
      :show-close="false"
      custom-class="city_list"
      class="addReceivables"
      @close="closeAdd"
    >
      <div v-if="this.find == 1 || this.find == 2" class="sh_style">审核中</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="btn" style="position:absolute;z-index:9;top:8px;right:1%;">
          <el-button @click="canelHandle">取 消</el-button>
          <el-button v-if="this.find == 0" type="primary" @click="submitForm('ruleForm')" :disabled="ifShowApply">申 请</el-button>
          <el-button v-if="this.find == 1" type="danger" @click="chanelSubmit('ruleForm')" plain>撤销收款</el-button>
          <el-button v-if="this.find == 2" type="primary" @click="Transfer ('ruleForm')">转办</el-button>
          <el-button v-if="this.find == 2" type="primary" @click="adoptForm('ruleForm')">通过</el-button>
          <el-button v-if="this.find == 2" type="danger" @click="boSubmit('ruleForm')">驳回</el-button>
        </div>
        <!-- 表单基本信息 -->
        <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
        <!-- 表单校验 -->
        <el-form-item label="收款时间" prop="collectionTime" label-width="120px">
          <el-date-picker v-model="ruleForm.collectionTime" type="date" placeholder="收款时间" :disabled="change"></el-date-picker>
        </el-form-item>
        <el-form-item label="同业社名称" prop="sameTrade" label-width="120px">
          <el-autocomplete v-model="ruleForm.sameTrade" :fetch-suggestions="querySearch3" placeholder="请输入同业社名称" :trigger-on-focus="false" @select="departure"></el-autocomplete>
        </el-form-item>
        <el-form-item label="收款账户" prop="collectionNumber" label-width="120px">
          <el-input v-model="ruleForm.collectionNumber" placeholder="请输入收款账户" :disabled="change"></el-input>
          <el-button class="collection" @click="account()" :disabled="change">选择</el-button>
        </el-form-item>
        <el-form-item label="收款金额" prop="money" label-width="120px">
          <el-input v-model="ruleForm.money" placeholder="收款金额" :disabled="change"></el-input>
        </el-form-item>
        <el-form-item label="摘要" prop="abstract" label-width="120px">
          <el-input v-model="ruleForm.abstract" placeholder="摘要" :disabled="change"></el-input>
        </el-form-item>
        <el-form-item label="凭证" prop="voucher" label-width="120px" ref="voucher">
          <el-upload
            :file-list="fileList"
            class="upload-demo"
            name="files"
            multiple
            :action="this.uploadUrl"
            :disabled="change"
            :on-error="handleError"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
            list-type="picture"
          >
            <el-button size="small" type="primary">上传文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否选择发票" prop="isInvoice" label-width="120px">
          <el-radio-group v-model="ruleForm.isInvoice" :disabled="change" @change="isInvoiceHandle">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" label-width="30px" label-height="auto" style="margin-top: -21px;" v-if="dialogVisibleInvoice">
          <el-button style="margin: 5px 0 10px 0;" type="primary"@click="handleEdit()">添加</el-button>
          <!-- 发票表格 -->
          <el-table :data="ruleForm.invoiceList" border style="width: 100%;">
            <el-table-column label="发票类型" width="120" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" placeholder="请选择" :disabled="change">
                  <el-option v-for="item in invoiceType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
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
              </template>
            </el-table-column>
            <el-table-column label="纳税人识别号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.taxesNumber" required placeholder="纳税人识别号" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="发票抬头" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.titleOrMobile" placeholder="发票抬头" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="发票项目" width="120" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.project" placeholder="发票项目" :disabled="change">
                  <el-option v-for="item in invoiceProject" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="金额" align="center">
              <template slot-scope="scope">
                <el-input  v-model="scope.row.money" placeholder="金额" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="帐号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.account" placeholder="帐号" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="开户行" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.bank" placeholder="开户行" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="地址" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.address" placeholder="地址" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="电话" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.mobile" placeholder="电话" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <br />
                <!-- <el-button style="margin-top: 5px;" size="mini" type="primary" v-if="invoiceListCount==scope.$index" @click="handleEdit(scope.$index, scope.row)">添加</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <!-- 发票表格 END -->
        </el-form-item>
        <!-- 表单校验 END -->
        <!-- 表单基本信息 END -->
        <!-- 关联欠款 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>关联欠款</el-divider>
        <div class="associated">
          <div class="associatedIcon"><i class="el-icon-warning"></i></div>
          <div class="associatedItems">已关联<span style="font-weight: bold;">{{ tableManyRow }}</span>项</div>
          <div class="associatedMoney">总计：{{ getCollectionPriceTotal }}元</div>
        </div>
        <el-table :data="arrearsList" border :header-cell-style="getRowClass">
           <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
           <el-table-column prop="proName" label="产品名称" align="center"></el-table-column>
           <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
           <el-table-column prop="departure" label="出发日期" align="center"></el-table-column>
           <el-table-column prop="payable" label="订单金额" align="center"></el-table-column>
           <el-table-column prop="arrears_Amount" label="欠款金额" align="center"></el-table-column>
           <el-table-column prop="repayment_Amount" label="已还金额" align="center"></el-table-column>
           <el-table-column label="匹配收款金额" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.matchingMoney" placeholder="匹配收款金额" :disabled="change"></el-input>
              </template>
           </el-table-column>
        </el-table>
        <!-- 关联欠款 END -->
        <!-- 审批过程 -->
        <el-form-item v-if="this.find == 1 || this.find == 2" label="审批过程" label-width="120px" label-height="auto"></el-form-item>
        <el-form-item v-if="this.find == 1 || this.find == 2" label="" label-width="" label-height="auto">
          <el-table :data="approveCourseData" border style="width: 97.8%;margin-left: 30px;margin-top: -25px;">
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
      </el-form>
    </el-dialog>
    <!-- 协办弹窗 -->
    <el-dialog style="text-align: left" title="选择协办人:" :visible.sync="dialogFormVisibleAssist" width="50%">
      <div style="text-align: center">
        <div style="width: 100%">
          <div class="button_select" style="margin-bottom: 30px;margin-top: -30px;">
            <el-input v-model="applyUserInput" class="input" style='margin-left: 0px;'></el-input>
            <el-button type="primary" @click="searchHand2()" size="medium">搜索</el-button>
          </div>
          <div class="table_trip" style=" width: 100%;">
            <el-table :data="assistTransactionData" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
              <el-table-column prop="id" label="ID" align="center" width="100%"></el-table-column>
              <el-table-column prop="name" label="姓名" width="120%" align="center"></el-table-column>
              <el-table-column prop="org" label="组织" align="center"></el-table-column>
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="block" style="margin-top: 30px;text-align:center;">
            <el-pagination
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
              :current-page.sync="currentPage"
              :page-sizes="[5, 10, 50, 100]"
              :page-size="5"
              layout="total, sizes, prev, pager, next, jumper"
              :total=total
            >
            </el-pagination>
          </div>
          <!-- 分页 END -->
        </div>
      </div>
      <!-- 协办弹窗按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAssist = false">取 消</el-button>
        <el-button type="primary" @click="routerHandle2()">确 定</el-button>
      </span>
      <!-- 协办弹窗按钮 END -->
    </el-dialog>
    <!-- 协办弹窗 END -->
    <!-- 驳回意见弹窗 -->
    <el-dialog title="请填写审批意见" :visible.sync="dialogFormVisibleReject" width="30%">
      <textarea style="width: 90%; height: 132px; resize:none;margin-left: 13px; ">123123</textarea>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="rejectHandle2()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 驳回意见弹窗 END -->
    <!-- 放大图片 -->
    <el-dialog style="text-align: left" title="放大图片:" :visible="dialogVisible" width="50%">
      <el-button type="primary" @click="downs()" style="margin-bottom: 30px;">点击下载</el-button>
      <div>
        <img :src="imgBig" alt="图片" :alt="imgBigName"/>
        <span>{{imgBigName}}</span>
      </div>
    </el-dialog>
    <!-- 放大图片 EDN -->
    <!-- 收款账户选择弹窗 -->
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
    <!-- 收款账户选择弹窗 END -->
  </div>
  <!-- 申请同业收款 END -->
</template>

<script type="text/javascript">
import moment from 'moment'

export default {
  name: "sameTradeInfo",
  components: {},
  props: {
    dialogFormVisible: false, // 是否显示弹窗
    find: 0,
    change: false, // 相关表单是否可点击
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
      tableManyRow: null, // 关联欠款表格共多少行
      getCollectionPriceTotal: 0, // 当前收款总额（合计）
      ifShowApply: false, // 当同业社名字下面没有关联欠款清下将其置灰
      fileCheckVal: 0, // 上传凭证成功返回的文件数量（验证用）
      userId: '',
      userName: '',
      reable: false,
      applyUserInput: '', // 经办人相关
      total: 0,
      pageNum: 1, // 当前页数
      pageSize: 5, // 每页数据量
      currentPage: 1,
      imgBigName: '',
      imgBig: '',
      dialogVisible: false,
      dialogVisibleInvoice: false,
      dialogFormVisibleAssist: false, // 协办弹窗是否显示
      dialogFormVisibleReject: false, // 驳回意见弹窗是否显示
      ruleForm: { // 同业收款表单
        voucher: [], // 凭证
        collectionTime: '', // 收款时间
        createTime: '', // 申请日期
        collectionAccount: '', // 收款账户
        sameTrade: '', // 同业社
        money: '',  // 收款金额
        abstract: '', // 摘要
        isInvoice: '0', // 发票
        collectionNumber:'', // 收款账户
        invoiceList: [{ // 发票相关
          type: '',
          userType: '',
          taxesNumber: '',
          titleOrMobile: '',
          project: '',
          invoicemoney: '',
          account: '',
          bank: '',
          address: '',
          mobile: '',
        }],
      },
      upload:{
        accessory:'',
      },
      rules: {
        voucher: [{ required: true, trigger: 'change', validator: validateVoucher}],
        collectionTime: [{ required: true, message: '收款时间不能为空', trigger: 'blur' }],
        createTime: [{ required: true, message: '收款时间不能为空', trigger: 'blur' }],
        sameTrade: [{ required: true, message: '同业社不能为空', trigger: 'change' }],
        money: [
          { required: true, message: '收款金额不能为空', trigger: 'blur' },
          { pattern: /^\d+(\.\d+)?$/, message: '收款金额需为正数' }
        ],
        abstract: [{ required: true, message: '摘要不能为空', trigger: 'blur' }],
        taxesNumber: [{ required: true, message: '纳税人识别号不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '纳税人识别号需为正整数' }
        ],
        isInvoice: [{ required: true, message: '是否开发票不能为空', trigger: 'blur' }],
        collectionNumber:[{ required: true, message: '收款账户不能为空', trigger: 'change' }]
      },
      invoiceProject:[{
        value: '1',
        label: '旅游费'
      }],
      collectionAccountList: [{
        value: '1',
        label: '收款账户1'
      }, {
        value: '2',
        label: '收款账户2'
      }, {
        value: '3',
        label: '收款账户3'
      }],
      sameTradeList: [{
        value: '1',
        label: '同业社1'
      }, {
        value: '2',
        label: '同业社2'
      }, {
        value: '3',
        label: '同业社3'
      }],
      approveCourseData: [{
        createTime: '2018-05-23',
        user: '阳阳',
        status: '通过',
        abstract: '没啥意见',
      }],
      assistTransactionData: [],
      arrearsRelation: '8822.66',
      arrearsList: [], // 关联欠款列表
      invoiceType: [{
        value: '1',
        label: '纸质发票'
      }],
      fileList: [], // 文件列表
      accountTable: [], // 收款账户列表
      sameTradeData: [], // 同业社名称模糊查询
      supplierId: 0, // 同业社名称ID
      accountShow: false, // 选择账户弹窗
      tourNamePre: '',
      uploadUrl: this.GLOBAL.serverSrc + '/upload/obs/api/file', // 上传凭证
      planID: '',
      accountCredited: null // 收款账户选择
    }
  },
  computed: {
    // 计算属性的 getter
    invoiceListCount() {
      return this.ruleForm.invoiceList.length - 1;
    },
    title() {
      return (this.find == 1 || this.find == 2) ? "查看同业收款" : "申请同业收款"
    },
  },
  methods: {
    // 时间插件
    moment,
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    // 获取id
    clickBanle(row, event, column) {
      this.userId = row['id'];
      this.userName = row['name'];
      this.reable = false;
    },
    // 子组件触发事件
    closeAdd(){
      this.$emit('close', false);
    },
    // 取消事件（顶部）
    canelHandle(){
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
         this.dialogVisibleInvoice = false;
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
    // 发票模块添加事件
    handleEdit(index, row) {
      this.ruleForm.invoiceList.push({})
    },
    // 发票模块删除事件
    handleDelete(index, row) {
      this.ruleForm.invoiceList.splice(index, 1)
      if (this.ruleForm.invoiceList.length == 0) {
        this.ruleForm.invoiceList.push({})
      }
    },
    // 撤销申请
    chanelSubmit() {
      this.$confirm('是否撤销该条收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '撤销成功!'
        });
        this.closeAdd()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤销'
        });
      });
    },
    // 转办
    Transfer() {
      this.dialogFormVisibleAssist = true
    },
    // 驳回
    boSubmit() {
      this.dialogFormVisibleReject = true
    },
    // 通过确认按钮
    adoptForm() {
      this.$confirm('是否通过该条收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '通过成功!'
        });
        this.closeAdd()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消(通过)'
        });
      });
    },
    // 转办确认按钮
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
      this.dialogFormVisibleAssist = false
    },
    // 驳回确定按钮
    rejectHandle2() {
      this.$confirm('是否驳回该条收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '驳回成功!'
        });
        this.closeAdd()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消(驳回)'
        });
      });
      this.dialogFormVisibleReject = false
    },
    // 下载图片地址和图片名
    downloadIamge(imgsrc, name) {
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    // 图片下载
    downs() {
      this.downloadIamge(this.imgBig, this.imgBigName)
    },
    // 上传文件-移除
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.fileCheckVal = fileList.length
    },
    // 文件上传
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    // 是否选择发票，复选框改变事件
    isInvoiceHandle(value) {
      this.dialogVisibleInvoice = value == '1' ? true : false
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file, fileList) {
      this.dialogVisible = true
      this.imgBig = file.url
      this.imgBigName = file.name
    },
    // 协办弹窗-搜索
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
            "input": this.applyUserInput,
          },
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      )
      .then(function(obj) {
        that.total = obj.data.total;
        that.assistTransactionData = obj.data.objects;
        that.assistTransactionData.forEach(function(v, k, arr) {
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
      .catch(function(obj) {})
    },
    // pageSize 改变时会触发
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
            "input": this.applyUserInput,

          },
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      )
      .then(function(obj) {
        that.total = obj.data.total;
        that.assistTransactionData = obj.data.objects;
        that.assistTransactionData.forEach(function(v, k, arr) {
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
      .catch(function(obj) {})
    },
    // currentPage 改变时会触发
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
              "input": this.applyUserInput,
            },
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.assistTransactionData = obj.data.objects;
          that.assistTransactionData.forEach(function(v, k, arr) {
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
        .catch(function(obj) {})
    },
    // 同业社名称模糊查询
    querySearch3(queryString3, cb) {
      this.sameTradeData = []
      this.$http.post(this.GLOBAL.serverSrc + '/universal/localcomp/api/list', {
        "object": {
          name: queryString3
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.sameTradeData.push({
            "value": res.data.objects[i].name,
            "id": res.data.objects[i].id
          })
          this.supplierId = res.data.objects[i].id ? res.data.objects[i].id : 0;
        }
        var results = queryString3 ? this.sameTradeData.filter(this.createFilter(queryString3)) : [];
        cb(results)
      }).catch(err => {})
    },
    createFilter(queryString1){
      return (restaurant) => {
        return (restaurant.value);
      }
    },
    // 自动完成输入框选中事件
    departure(item){
      this.productPos = item.id;
      this.originPlace = item.value;
      var that =this
      this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/getArrearsList', {
        lcID: item.id
      }).then(obj => {
        if(obj.data.objects == null){
          this.ifShowApply = true
          this.$message.success('该同业社下无关联欠款，无法申请同业收款');
        } else {
          this.arrearsList = obj.data.objects;
          this.ifShowApply = false
          this.tableManyRow = obj.data.objects.length
          let getPriceTotal = 0
          obj.data.objects.forEach(function(item){
            getPriceTotal += item.arrears_Amount
          })
          this.getCollectionPriceTotal = getPriceTotal
        }

      }).catch(obj => {})
    },
    // 选择账户弹窗,渲染账户列表
    account(){
      this.accountShow = true;
      let that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list",
          {
            "object": {
              "isDeleted": 0
            },
          },)
          .then(function (obj) {
            that.accountTable = obj.data.objects
          })
          .catch(function (obj) {})
    },
    // 收款账户选择弹窗隐藏
    accountClose(){
      this.accountShow = false;
    },
    //收款账户选择
    routerHandle4(index, row) {
      this.accountCredited = row.id
      console.log(row, '收款账户选择')
      setTimeout(v => {
        this.ruleForm.collectionNumber = this.tourNamePre
        this.accountShow = false
      }, 200)
    },
    // 收款账户选择弹窗列表-行被点击时的事件
    clickPlan(row){
      this.tourNamePre = row['title'];
      this.planID = row['planID'];
      this.tour_id = row['planID']
    },
    //文件上传
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    // 文件上传失败时的钩子
    handleError(err, file) {
      this.fileList = []
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.fileCheckVal = fileList.length; // 成功时凭证的条数（校验用）
      // this.$refs.voucher.clearValidate(); // 移除校验文字
      //多次添加图片判断，如果是第一次添加修改全部图片数据，否则修改新添加项数据
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
      // console.log(this.fileList)
    },
    // 申请-提交表单
    submitForm(formName) {
      let _this = this
      this.a = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let pictureList = [];
          let newDate = moment(new Date(), 'yyyy-MM-dd hh:mm:ss')
          this.fileList.forEach(function(item){
            pictureList.push({ url: item.url.slice(5), name: item.name})
          })

          let objectRequest = {}

          let needArrearData = [] // 转变关联欠款数据格式之后的数据模型
          this.arrearsList.forEach(function(item){ // 转换关联欠款表格数据结构
            needArrearData.push({
              "id": 0,
              'planID':item.planID,
              "collectionID": 0, // 收款id
              "orderCode": item.orderCode,
              "productName": item.proName,
              "groupCode": item.groupCode,
              "date": item.departure,
              "payablePrice": item.payable, // 订单金额
              "arrearsPrice": item.arrears_Amount, // 欠款金额
              "repaidPrice": item.repayment_Amount, // 已还金额
              "amountPrice": item.audited_Amount, // 待审核金额
              "matchingPrice": item.matchingMoney // 匹配收款金额
            })
          })

          objectRequest = {
            "GroupCode":"",
            "OrderNumber":"",
            "Dept":sessionStorage.getItem('orgID'),
            "LocalCompName":this.originPlace,
            "ProductName":"暂无",
            "checkType": 0, // 审批状态
            "collectionTime":  moment(this.ruleForm.collectionTime, 'yyyy-MM-dd'), // 收款时间,
            "groupCode": this.ruleForm.groupCode, // 团号,
            "orderID": 0, // 订单ID,
            "planID": 0, // 计划id,
            "orderNumber": this.indent, // 订单号
            "collectionNumber":  this.ruleForm.collectionNumber, // 收款账户
            "price": this.ruleForm.price, // 金额,
            // "dept": this.org, // 组织部门 this.dept
            "createUser": sessionStorage.getItem('userCode'), // 创建者
            "createTime": newDate, // 申请时间
            "code": "",
            "serialNumber": 0, // 流水号
            "abstract": this.ruleForm.abstract, // 摘要
            "files": pictureList, // 文件
            "invoice": this.ruleForm.isInvoice, // 是否发票,
            "isDeleted": 0,
            "collectionType": 2, // 直客1.同业2
            "localCompID": this.productPos, // 直客0，同业变成同业社id
            "arrears": needArrearData, // 收款 - 关联欠款列表
            "isEBS": 0,
            "accountID": this.accountCredited == null ? 0 : this.accountCredited, // 银行账号ID
            "moneyExplain": "string", // 款项说明
            "distributor": "string", // 分销商
            "payarr": [], // 付款 欠款关联订单
          }

          console.log(_this.ruleForm.isInvoice)
          if(_this.ruleForm.isInvoice == 1) { // 发票列表，如果选择发票则添加该对象
            let needInvoiceData = []
            _this.ruleForm.invoiceList.forEach(function(item){
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
          } else {
            objectRequest.invoiceTable = []
          }

          this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/insert', {
            "object": objectRequest
          }).then(res => {
            // console.log(res.data);
            if (res.data.isSuccess == true) {
              this.$emit('searchHand', '')
              this.$message({
                type: 'success',
                message: '创建成功!'
              });
              this.closeAdd()
            } else {}
          }).catch(err => {})
        } else {
          return false;
        }
      });
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
    left: 140px;
  }

  .collection{background:#eaeaea; color:#a4a4a4;}

  .button_select {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: left;
  }
  .el-input {
    width: auto
  }
  .accountButton{float:right; margin:20px 0 0 0; overflow: hidden;}
  .associated{ line-height: 40px; background: #e3f2fc; border: 1px solid #cfeefc; border-radius: 5px;overflow: hidden; }
  .associatedIcon{font-size:14pt; color: #0b84e6; margin: 0 0 0 15px; float:left;}
  .associatedItems{float:left; margin: 0 0 0 10px;}
  .associatedMoney{float:left; margin: 0 0 0 30px;}
</style>
