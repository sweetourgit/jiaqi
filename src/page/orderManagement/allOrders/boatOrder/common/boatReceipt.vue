<template>
  <div>
    <!--收款信息弹窗begin-->
    <el-dialog
      :title="'申请同业收款'"
      :visible.sync="propsObj.dialogType === 1"
      :close-on-click-modal="false"
      class
      width="1100px"
      @close="btReceiptDialogClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label align="right">
          <el-button type="primary" @click="handleCancel('form')">取消</el-button>
          <el-button type="primary" @click="handleApply('form')">申请</el-button>
        </el-form-item>
        <el-form-item label="收款时间" prop="date">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <!-- 同业收款显示begin -->
        <el-form-item label="同业社名称" prop="name">
          <el-input v-model="form.name" class="ipt" disabled></el-input>
        </el-form-item>
        <!-- 同业收款显示end -->
        <!-- 直客收款显示begin -->
        <el-form-item label="交易流水号" prop="name">
          <el-input v-model="form.number" class="ipt"></el-input>
        </el-form-item>
        <!-- 直客收款显示end -->
        <el-form-item label="收款账户" prop="account">
          <el-input v-model="form.account" class="ipt"></el-input>&nbsp;&nbsp;
          <el-button type="primary" @click="handleChooseAccountBtn">选择</el-button>
        </el-form-item>
        <!-- 同业收款显示begin -->
        <el-form-item label="收款金额" prop="price">
          <el-input v-model="form.price" class="ipt"></el-input>
        </el-form-item>
        <!-- 同业收款显示end -->
        <el-form-item label="摘要" prop="digest">
          <el-input v-model="form.digest" class="ipt"></el-input>
        </el-form-item>
        <el-form-item label="凭证" prop="fileList">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            multiple
            :limit="3"
            :file-list="form.fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="开发票" prop="invoice">
          <el-radio-group v-model="form.invoice">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 是否开发票  是则显示 否隐藏 begin -->
        <el-form-item label-width="2px" v-if="form.invoice == '是'">
          <el-button type="primary" @click="handleAddInvoiceBtn">添加</el-button>
          <el-table :data="tableDataInvoice" :border="true" class="debtTable">
            <el-table-column prop="date" label="发票类型" align="center"></el-table-column>
            <el-table-column prop="name" label="个人/单位" align="center"></el-table-column>
            <el-table-column prop="address" label="纳税人识别号" align="center"></el-table-column>
            <el-table-column prop="taitou" label="发票抬头" align="center"></el-table-column>
            <el-table-column prop="address" label="发票项目" align="center"></el-table-column>
            <el-table-column prop="address" label="金额" align="center"></el-table-column>
            <el-table-column prop="address" label="账号" align="center"></el-table-column>
            <el-table-column prop="address" label="开户行" align="center"></el-table-column>
            <el-table-column prop="address" label="地址" align="center"></el-table-column>
            <el-table-column prop="address" label="电话" align="center"></el-table-column>
            <el-table-column prop="address" label="操作" align="center">
              <template slot-scope="{row,$index}">
                <el-button size="mini" type="info" @click="handleDelete(row,$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 是否开发票  是则显示 否隐藏 end -->

        <!-- 关联欠款begin -->
        <p class="debtName">关联欠款</p>
        <el-form-item label-width="2px">
          <el-table :data="tableDataDebt" :border="true" class="debtTable">
            <el-table-column prop="date" label="订单编号" align="center"></el-table-column>
            <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
            <el-table-column prop="address" label="团期计划" align="center"></el-table-column>
            <el-table-column prop="address" label="出发日期" align="center"></el-table-column>
            <el-table-column prop="address" label="订单金额" align="center"></el-table-column>
            <!-- 同业显示begin -->
            <el-table-column prop="address" label="欠款金额" align="center"></el-table-column>
            <el-table-column prop="address" label="已还金额" align="center"></el-table-column>
            <!-- 同业显示end -->
            <!-- 直客收款显示begin -->
            <el-table-column prop="address" label="未收金额" align="center"></el-table-column>
            <el-table-column prop="address" label="已收金额" align="center"></el-table-column>
            <!-- 直客收款显示end -->
            <el-table-column prop="address" label="待审核金额" align="center"></el-table-column>
            <el-table-column prop="address" label="匹配收款金额" align="center"></el-table-column>
          </el-table>
        </el-form-item>
        <!-- 关联欠款end -->
      </el-form>
    </el-dialog>
    <!--收款信息弹窗end-->

    <!-- 选择收款账户的弹窗begin -->
    <el-dialog
      :title="'选择账户'"
      :visible.sync="isChooseAccountDialog"
      :close-on-click-modal="false"
      class
      width="1100px"
      @close="isChooseAccountDialog = false"
    >
      <el-table :data="tableDataAccount" :border="true" label-width="2px">
        <el-table-column prop="date" label="ID" align="center"></el-table-column>
        <el-table-column prop="name" label="类型" align="center"></el-table-column>
        <el-table-column prop="accountType" label="账户名称" align="center"></el-table-column>
        <el-table-column prop="address" label="卡号" align="center"></el-table-column>
        <el-table-column prop="address" label="开户行" align="center"></el-table-column>
        <el-table-column prop="address" label="开户人" align="center"></el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <template slot-scope="scope">
            <span @click="handleChooseAccount(scope.row)">选择</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 选择收款账户的弹窗end -->

    <!-- 添加开发票的弹窗begin -->
    <el-dialog
      :title="'添加开发票'"
      :visible.sync="isAddInvoiceDialog"
      :close-on-click-modal="false"
      class
      width="600px"
      @close="isAddInvoiceDialog = false"
    >
      <el-form
        :model="ruleForm"
        :rules="ruleFormRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="发票类型" prop="InvoiceType">
          <el-select v-model="ruleForm.InvoiceType" placeholder="请选择发票类型">
            <el-option label="纸质发票" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个人/单位" prop="personOrUnit">
          <el-select v-model="ruleForm.personOrUnit" placeholder="请选择发票类型">
            <el-option label="个人" value="shanghai"></el-option>
            <el-option label="单位" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="identifyNumber">
          <el-input v-model="ruleForm.identifyNumber" class="ipt"></el-input>&nbsp;&nbsp;
        </el-form-item>
        <el-form-item label="发票抬头" prop="taitou">
          <el-input v-model="ruleForm.taitou" class="ipt"></el-input>
        </el-form-item>
        <el-form-item label="发票项目" prop="project">
          <el-select v-model="ruleForm.project" placeholder="请选择发票项目">
            <el-option label="旅游费" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="price">
          <el-input v-model="ruleForm.price" class="ipt"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="ruleForm.account" class="ipt"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="openBank">
          <el-input v-model="ruleForm.openBank" class="ipt"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="ruleForm.address" class="ipt"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="ruleForm.phone" class="ipt"></el-input>
        </el-form-item>
        <el-form-item label align="right">
          <el-button type="primary" @click="handleAddInvoiceCancel('ruleForm')">取消</el-button>
          <el-button type="primary" @click="handleAddInvoiceAdd('ruleForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加开发票的弹窗end -->
  </div>
</template>

<script>
export default {
  name: "boatReceipt",

  props: {
    propsObj: { type: Object }
  },

  data() {
    return {
      isChooseAccountDialog: false, //控制选择收款账户弹窗的显示隐藏
      isAddInvoiceDialog: false, //控制添加开发票弹窗的显示隐藏
      form: {
        date: "", //收款时间
        name: "", //同业社名称  同业的显示
        number: "", //交易流水号  直客的显示
        account: "", //收款账户
        price: "", //收款金额 同业的显示
        digest: "", //摘要
        fileList: [], //凭证上传
        invoice: "否" //开发票
      },
      rules: {
        date: [{ required: true, message: "请选择收款时间", trigger: "blur" }],
        name: [{ required: true }],
        account: [
          { required: true, message: "请选择收款账户", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入收款金额", trigger: "blur" }],
        digest: [{ required: true, message: "请输入摘要", trigger: "blur" }],
        fileList: [{ required: true, message: "请上传凭证", trigger: "blur" }],
        invoice: [{ required: true }]
      }, //form 的验证
      ruleForm: {
        InvoiceType: "", //纸质发票
        personOrUnit: "", //个人/单位
        identifyNumber: "", //纳税人识别号
        taitou: "", //发票抬头
        project: "", //发票项目
        price: "", //金额
        account: "", //账号
        openBank: "", //开户行
        address: "", //地址
        phone: "" //电话
      }, //添加开发票的表单
      ruleFormRules: {
        InvoiceType: [
          { required: true, message: "请选择发票类型", trigger: "blur" }
        ],
        personOrUnit: [
          { required: true, message: "请选择个人/单位", trigger: "blur" }
        ],
        identifyNumber: [{ max: 40, trigger: "blur" }],
        taitou: [
          {
            required: true,
            message: "请输入发票抬头",
            max: 80,
            trigger: "blur"
          }
        ],
        project: [
          { required: true, message: "请选择发票项目", trigger: "blur" }
        ],
        price: [
          {
            required: true,
            message: "请输入发票金额",
            trigger: "blur"
          },
          {
            pattern: /^\d+(\.\d{0,2})?$/,
            message: "请输入整数或者小数",
            trigget: "change"
          }
        ],
        account: [{ max: 40, trigger: "blur" }],
        openBank: [{ max: 80, trigger: "blur" }],
        address: [{ max: 80, trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", max: 20, trigger: "blur" }
        ]
      }, //ruleForm的验证
      tableDataInvoice: [
        { data: "2012.02.12", name: "sansan", address: "shlj", taitou: "1" }
      ], //开发票的表格的集合
      tableDataDebt: [], //关联欠款的表格集合
      tableDataAccount: [
        { data: "2012.02.12", name: "sansan", accountType: "shlj" }
      ] //选择账户的集合
    };
  },

  created() {},

  methods: {
    // 点击收款账户按钮 弹窗出现事件
    handleChooseAccountBtn() {
      this.isChooseAccountDialog = true;
    },

    //选择收款账户事件
    handleChooseAccount(row) {
      this.form.account = row.accountType;
      this.isChooseAccountDialog = false;
    },

    //文件上传事件
    handlePreview(fileList) {},

    //文件删除事件
    handleRemove(file, fileList) {},

    // 点击开发票按钮 弹窗出现事件
    handleAddInvoiceBtn() {
      this.isAddInvoiceDialog = true;
    },

    //添加开发票弹窗的取消事件
    handleAddInvoiceCancel(ruleForm) {
      this.$refs[ruleForm].resetFields();
      this.isAddInvoiceDialog = false;
    },

    // 添加开发票弹窗的确定添加事件
    handleAddInvoiceAdd(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.tableDataInvoice.push(Object.assign({}, this.ruleForm));
          this.isAddInvoiceDialog = false;
          this.$refs[ruleForm].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 开发票表格中的删除按钮
    handleDelete(row, index) {
      this.tableDataInvoice.splice(index, 1);
    },

    // 取消申请同业或直客收款的弹窗
    handleCancel(rules) {
      this.$refs[rules].resetFields();
      this.btReceiptDialogClose();
    },

    // 申请同业或直客收款的点击事件
    handleApply(rules) {
      this.$refs[rules].validate(valid => {
        if (valid) {
          // alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 收款信息弹窗关闭事件
    btReceiptDialogClose() {
      this.$parent.resetDialogType();
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.ipt {
  width: 220px;
}

.debtName {
  padding-left: 10px;
  box-sizing: border-box;
}

.debtTable {
  margin-top: 10px;
}
</style>