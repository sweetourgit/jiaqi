<!--
  待办 -> 借款详情（无收入、预付款）；
  含有打印部分，选择银行账户；
  通过，驳回的一些方法在common.js里；
-->

<template>
  <div class="loan-management">
    <!-- 按钮组 -->
    <div style="text-align: right; margin: 25px 20px 0 0;position: sticky;top: 0;right: 0;z-index: 100;">
      <el-button icon="el-icon-remove" plain @click="handleCancel()">取消</el-button>
      <el-button
        icon="el-icon-circle-close"
        @click="handlePass"
        type="primary"
        plain
        :disabled="ifPassClick"
        v-if="(ifDY100009 && creatUserOrgID === 490) || ( ifDY100042 && creatUserOrgID !== 490)"
      >
        通过
      </el-button>
      <el-button icon="el-icon-circle-check" @click="handlePass" type="success" plain v-else>通过</el-button>
      <el-button icon="el-icon-circle-close" @click="handleRejected" type="danger" plain>驳回</el-button>
      <el-button
        icon="el-icon-s-check"
        type="danger"
        :disabled="ifClick"
        @click="handleBankAccount"
        v-if="(ifDY100009 && creatUserOrgID === 490) || (ifDY100042 && creatUserOrgID !== 490)"
      >
        支付账户
      </el-button>
      <el-button
        icon="el-icon-printer"
        @click="printDetails"
        plain
        v-if="(ifDY100009 && creatUserOrgID === 490) || (ifDY100042 && creatUserOrgID !== 490)"
      >
        打印本页详情
      </el-button>
    </div>
    <!-- 按钮组 END -->
    <!-- 查看无收入借款弹窗 -->
    <el-divider content-position="left" class='print-hidden'>基本信息</el-divider>
    <!-- 被 print 包括的是要打印的区域，关于print开头的命名样式均为打印样式 -->
    <div ref="print">
      <div class="print-title">{{ getTopName }} - {{ whichComponentName == '无收入借款管理' ? '无收入借款' : '预付款' }} - 借款单 </div>
      <!-- 基本信息 -->
      <div class="item-content print-hidden">
        <el-tag type="warning" v-if="fundamental.checkType=='0'" class="distributor-status">审批中</el-tag>
        <el-tag type="danger" v-if="fundamental.checkType=='2'" class="distributor-status">驳回</el-tag>
        <el-tag type="success" v-if="fundamental.checkType=='1'" class="distributor-status">通过</el-tag>
      </div>
      <!-- 第一行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="5"><div class="grid-del label-color">ID:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del">{{ fundamental.id }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="5"><div class="grid-del label-color">申请人:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="5"><div class="grid-del label-color">创建时间:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ fundamental.createTime  | formatDate  }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第一行 END -->
      <!-- 第二行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="5"><div class="grid-del label-color">团期计划:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del">{{ fundamental.groupCode }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="5"><div class="grid-del label-color">产品名称:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ fundamental.productName }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="5"><div class="grid-del label-color">供应商:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ fundamental.supplierName }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第二行 END -->
      <!-- 第三行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="5"><div class="grid-del label-color">借款类型:</div></el-col>
          <el-col :span="17">
            <div class="grid-del base-value">{{ fundamental.supplierTypeEX }}</div>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="5"><div class="grid-del label-color">借款金额:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del">{{ fundamental.price }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <!-- 摘要打印时隐藏 -->
          <el-col :span="5" class="print-hidden"><div class="grid-del label-color">摘要:</div></el-col>
          <el-col :span="17" class="print-hidden base-value"><div class="grid-del ">{{ fundamental.mark }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第三行 END -->
      <!-- 支付账户 -->
      <el-row type="flex" class="row-bg print-acount" justify="start">
        <el-col :span="5" :offset="1"><div class="grid-del label-color">支付账户:</div></el-col>
        <el-col :span="17" class="base-value"><div class="grid-del">{{ fundamental.accountsName }}</div></el-col>
      </el-row>
      <!-- 支付账户 -->
      <!-- 审批人 打印时输出 -->
      <el-row type="flex" class="row-bg print-approve" justify="start">
        <el-col :span="2" :offset="1"><div class="grid-del label-color">审批人:</div></el-col>
        <el-col :span="18" class="base-value"><div class="grid-del" v-html="printAuditingContent"></div></el-col>
      </el-row>
      <!-- 审批人 打印时输出 END -->
      <!-- 第四行 -->
      <el-row type="flex" class="row-bg print-acount-padding" justify="space-around">
        <el-col :span="6">
          <el-col :span="5"><div class="grid-del label-color">账号:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ fundamental.cardNumber }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="5"><div class="grid-del label-color">开户行:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del">{{ fundamental.bankName }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="5"><div class="grid-del label-color">开户名:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ fundamental.cardName }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第四行 END -->
      <!-- 第五行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <!-- 打印时隐藏 -->
          <el-col :span="5" class="print-hidden"><div class="grid-del label-color">支付账户:</div></el-col>
          <el-col :span="17" class="print-hidden base-value">
            <div class="grid-del">{{ fundamental.accountsName }}</div>
          </el-col>
        </el-col>
        <el-col :span="14">
          <el-col :span="5"><div class="grid-del label-color print-hidden">附件:</div></el-col>
          <el-col :span="17">
            <el-upload
              class="upload-demo print-hidden"
              name="files"
              :file-list="fundamental.files"
              :show-file-list=true
              action="test"
              :disabled=true
              :on-preview="handlePreview"
            >
            </el-upload>
          </el-col>
        </el-col>
      </el-row>
      <!-- 第五行 END -->
    </div>
    <!-- 基本信息 END -->
    <!-- 相关表格 -->
    <el-collapse v-model="collapseName">
      <!-- 审核结果 -->
      <el-collapse-item class="collapse-m" name="collapseApprove">
        <template slot="title">
          <el-divider content-position="left">审核结果</el-divider>
        </template>
        <el-table :data="tableAuditResults" stripe border :header-cell-style="getRowClass">
          <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
          <el-table-column prop="approvalName" label="审批结果" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.approvalName === '审批中'" style="color: #7F7F7F" >{{ scope.row.approvalName }}</div>
              <div v-if="scope.row.approvalName === '驳回'" style="color: #FF4A3D" >{{ scope.row.approvalName }}</div>
              <div v-if="scope.row.approvalName === '通过'" style="color: #33D174" >{{ scope.row.approvalName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="comments" label="审批意见" align="center"></el-table-column>
          <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
        </el-table>
      </el-collapse-item>
      <!-- 审核结果 END -->
      <!-- 相关信息 -->
      <el-collapse-item class="collapse-m" name="collapseRelated">
        <template slot="title">
          <el-divider content-position="left">相关信息</el-divider>
        </template>
        <el-table :data="tableMoney" stripe border :header-cell-style="getRowClass">
          <el-table-column prop="payable" label="订单总额" align="center"></el-table-column>
          <el-table-column prop="paymentChecking" label="审批中借款总额" align="center"></el-table-column>
          <el-table-column prop="payment" label="已审批借款总额" align="center"></el-table-column>
          <el-table-column prop="expenseChecking" label="报销中总额" align="center"></el-table-column>
          <el-table-column prop="expense" label="已报销总额" align="center"></el-table-column>
          <el-table-column prop="price" label="已收总额" align="center"></el-table-column>
          <el-table-column prop="paymentChecking" label="供应商欠款总额" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.payable - scope.row.price}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <!-- 相关信息 END -->
      <!-- 无收入借款明细 -->
      <el-collapse-item class="collapse-m" name="collapseInCome">
        <template slot="title">
          <el-divider content-position="left">无收入借款明细</el-divider>
        </template>
        <el-table :data="tableIncome" stripe border :header-cell-style="getRowClass">
          <el-table-column prop="paymentID" label="ID" align="center"></el-table-column>
          <el-table-column prop="checkTypeEX" label="审批状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.checkTypeEX === '审批中'" style="color: #7F7F7F" >{{ scope.row.checkTypeEX }}</div>
              <div v-if="scope.row.checkTypeEX === '驳回'" style="color: #FF4A3D" >{{ scope.row.checkTypeEX }}</div>
              <div v-if="scope.row.checkTypeEX === '通过'" style="color: #33D174" >{{ scope.row.checkTypeEX }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="supplierTypeEX" label="借款类型" align="center">

          </el-table-column>
          <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
          <el-table-column prop="price" label="金额" align="center"></el-table-column>
          <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
          <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
          <el-table-column prop="process" label="审批过程" align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-view" type="primary" plain size="small" @click="handleLookApprovalProcess(scope.$index, scope.row,1)" v-if="scope.row.guid !== ''">查看</el-button>
              <el-button icon="el-icon-view" plain size="small" @click="handleLookApprovalProcess(scope.$index, scope.row,1)" v-else>查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <!-- 无收入借款明细 END -->
      <!-- 预付款明细 -->
      <el-collapse-item class="collapse-m" name="collapseAdvance">
        <template slot="title">
          <el-divider content-position="left">预付款明细</el-divider>
        </template>
        <el-table :data="tablePayment" stripe border :header-cell-style="getRowClass">
          <el-table-column prop="paymentID" label="ID" align="center"></el-table-column>
          <el-table-column prop="checkTypeEX" label="审批状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.checkTypeEX === '审批中'" style="color: #7F7F7F" >{{ scope.row.checkTypeEX }}</div>
              <div v-if="scope.row.checkTypeEX === '驳回'" style="color: #FF4A3D" >{{ scope.row.checkTypeEX }}</div>
              <div v-if="scope.row.checkTypeEX === '通过'" style="color: #33D174" >{{ scope.row.checkTypeEX }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
          <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
          <el-table-column prop="price" label="金额" align="center"></el-table-column>
          <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
          <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
          <el-table-column prop="process" label="审批过程" align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-view" type="primary" plain size="small" @click="handleLookApprovalProcess(scope.$index, scope.row,1)" v-if="scope.row.guid !== ''">查看</el-button>
              <el-button icon="el-icon-view" plain size="small" @click="handleLookApprovalProcess(scope.$index, scope.row,1)" v-else>查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <!-- 预付款明细 END -->
      <!-- 收入明细 -->
      <el-collapse-item class="collapse-m" name="collapseEarning">
        <template slot="title">
          <el-divider content-position="left">收入明细</el-divider>
        </template>
        <el-table :data="tableEarning" border stripe :header-cell-style="getRowClass">
          <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
          <el-table-column prop="channel" label="订单来源" align="center"></el-table-column>
          <el-table-column prop="person" label="订单联系人" align="center"></el-table-column>
          <el-table-column prop="number" label="人数" align="center"></el-table-column>
          <el-table-column prop="payable" label="订单金额" align="center"></el-table-column>
          <el-table-column prop="priceSum" label="已收金额" align="center"></el-table-column>
          <el-table-column label="欠款金额" align="center" prop="arrears"></el-table-column>
          <el-table-column prop="arrearsDate" label="欠款日期" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.orderChannel !== 1 ? '暂无' : scope.row.arrearsDate | formatDateDetailsAn }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="repaymentDate" label="应还日期" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.orderChannel !== 1 ? '暂无' : scope.row.repaymentDate | formatDateDetailsAn }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <!-- 收入明细 END -->
    </el-collapse>
    <!-- 相关表格 END -->
    <!-- 审批过程-查看弹窗 -->
    <el-drawer direction="rtl" size="30%" :show-close="false" :visible.sync="ifLookApproveProcessDialog">
        <el-divider class="mb-40">审批过程</el-divider>
        <el-table class="el-drawer-content" :data="tableIncomeCheck" stripe border :header-cell-style="getRowClass">
          <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
          <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
          <el-table-column prop="approvalName" label="审批结果" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.approvalName === '审批中'" style="color: #7F7F7F" >{{ scope.row.approvalName }}</div>
              <div v-if="scope.row.approvalName === '驳回'" style="color: #FF4A3D" >{{ scope.row.approvalName }}</div>
              <div v-if="scope.row.approvalName === '通过'" style="color: #33D174" >{{ scope.row.approvalName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="comments" label="审批意见" align="center"></el-table-column>
        </el-table>
    </el-drawer>
    <!-- 审批过程-查看弹窗 END -->
    <!-- 通过、驳回弹框 -->
    <el-drawer direction="rtl" size="30%" :show-close="false" :visible.sync="ifShowApproveDialog">
      <el-divider class="mb-40">{{ approveDialogTitle }}</el-divider>
      <div class="el-drawer-content">
        <el-input type="textarea" v-model="approvalOpinion"></el-input>
      </div>
      <div style="display: flex; justify-content: flex-end;margin:30px 2% 0 0;">
        <el-button icon="el-icon-close" size="small" plain @click="handleApproveDialogCancel">取消</el-button>
        <el-button icon="el-icon-check" size="small" type="primary" plain @click="handleApproveDialogConfirm">确定</el-button>
      </div>
    </el-drawer>
    <!-- 通过、驳回弹框 END -->
    <!-- 付款账户弹窗 -->
    <el-drawer direction="rtl" size="30%" :show-close="false" :visible.sync="ifLookAccountDialog">
      <el-divider class="mb-40">选择账户</el-divider>
      <el-table class="el-drawer-content" :data="tableAccount" stripe border :header-cell-style="getRowClass">
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.cardType === 1">收款</span>
            <span v-if="scope.row.cardType === 2">付款</span>
            <span v-if="scope.row.cardType === 3">应收</span>
            <span v-if="scope.row.cardType === 4">应付</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="账号名称" align="center"></el-table-column>
        <el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
        <el-table-column prop="openingBank" label="开户行" align="center"></el-table-column>
        <el-table-column prop="openingName" label="开户人" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-check" type="primary" plain size="small" @click="handleSelectBankAccount(scope.$index, scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <!-- 付款账户弹窗 END -->
  </div>
</template>

<!-- 依据审批状态显示不同行的背景颜色 -->
<!-- :row-class-name="tableRowClassName" -->
<style>
  .el-table .going-row {
    background: #7F7F7F;
  }
  .el-table .pass-row {
    background: #f0f9eb;
  }
  .el-table .reject-row {
    background: #FF4A3D;
  }
</style>

<script>
  import common from "../mixins/common";

  export default {
    name: 'borrowDetails',
    data () {
      return {
        collapseName: [], // 控制折叠面板是否折叠
        ifDY100009: false,
        ifDY100042: false,
        creatUserOrgID: 0,
        ifClick: false, // 如果点击选择账户之后这个按钮会禁止点击
        ifPassClick: true, // 点击选择账户之后才可以点击通过
        printAuditingContent: null, // 打印审核结果的内容拼接
        whichComponentName: null, // 组件名称
        tableIncomeCheck: null, // 审批过程-查看弹窗-数据
        fundamental: {}, // 打印详情数据
        tableMoney: [], // 相关信息表格表格
        tablePayment: [], // 预付款明细表格
        tableIncome: [], // 无收入借款明细弹窗
        tableAccount: [], // 银行账户表格数据
        ifLookApproveProcessDialog: false, // 查看审批过程
        ifLookAccountDialog: false, // 银行账户弹窗
        tableEarning: [], // 收入明细表格
        tableAuditResults: [], // 查看无收入借款审批过程
        keepPaymentType: null, // 弹窗中调用获取一条详情，保存paymentType类型
        getTopName: '', // 部门
        approveDialogTitle: '', // 审批弹窗标题设置
        approvalOpinion: '', // 审批意见
        guid: '', // 接口用的guid
        getWorkItemId: '', // 保存匹配的 workItemId
        getUserTopID: null, // 保存用户 TopID
        keepPaymentID: null // 保存当前选择行的 paymentID
      }
    },
    mixins: [ common ],
    created () {
      this.keepPaymentID = this.$route.query.pendingDetailPaymentId; // 查看详情用
      this.getUserTopID = sessionStorage.getItem('topID');
      this.getTopName = sessionStorage.getItem('topName');
      let getUserCode = sessionStorage.getItem('userCode');
      this.getWorkItemId = this.$route.query.workItemID; // 工作流接口用
      this.whichComponentName = this.$route.query.componentName; // 来自无收入还是预付款
      // 打印相关（目前两个人可以进行打印）
      getUserCode === 'DY100009' ? this.ifDY100009 = true : this.ifDY100009 = false;
      getUserCode === 'DY100042' ? this.ifDY100042 = true : this.ifDY100042 = false;
      // 详情方法
      this.getLabel(this.keepPaymentID);
    },
    methods: {
      // 打印详情
      printDetails () {
        this.$print(this.$refs.print);
      },
      // 点击图片钩子
      handlePreview (file) {
        window.open(file.url);
      },
      // 支付账户按钮触发弹窗
      handleBankAccount () {
        this.ifLookAccountDialog = true;
        this.apiBankAccountTable();
      },
      // 选择银行具体账户
      handleSelectBankAccount (index, row) {
        this.$confirm('想好了？就选这个银行账户？', '注意！', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          let _this = this;
          this.$http.post(this.GLOBAL.serverSrc + "/finance/payment/api/insertebs", {
            "paymentID": this.keepPaymentID,
            "accountID": row.id
          }).then( res => {
            if (res.data.isSuccess === true) {
              _this.ifClick = true;
              _this.ifPassClick = false;
              _this.ifLookAccountDialog = false;
              _this.$message({
                type: 'success',
                message: '选择成功'
              });
            }
            // 选择成功之后刷新当前列表,让不具备付款账户按钮进行重新判断
          }).catch(err => {
            console.log( err )
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消选择'
          });
        });
      },
      // 银行账户表格查询
      apiBankAccountTable () {
        let _this = this;
        this.$http.post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list", {
          "object": {
            "isDeleted": 0,
            'orgID': this.getUserTopID,
          }
        }).then( res => {
          _this.tableAccount = res.data.objects
        }).catch( err => {
          console.log( err )
        })
      },
      // 查看审批流程对异常情况做出提示（写的不太理想）
      mesApprove (paramsGuid, paramsCode) {
        if (paramsGuid === '' || paramsCode === -1) {
          this.$message({
            message: '该条数据无审批流程',
            type: 'warning'
          });
        }
      },
      // 审批过程-查看按钮触发
      handleLookApprovalProcess (index, row, type) {
        this.mesApprove(row.guid);
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ', {
          jq_id:	row.guid,
          jQ_Type: type,
        }).then(obj => {
          let keepObj = obj.data;
          // 禁止直行两次
          if ( row.guid !== '') {
            this.mesApprove(row.guid, keepObj.code);
          }
          if (keepObj.code !== -1) {
            this.tableIncomeCheck = keepObj.extend.instanceLogInfo;
            this.ifLookApproveProcessDialog = true;
          }
        }).catch(err => {
          console.log( err );
        })
      },
      // 审核结果
      auditResult (result, paramJqType) {
        let _this = this;
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ', {
          jq_id:	result,
          jQ_Type: paramJqType, // 无收入1 预付款2,
        }).then(obj => {
          // 裡面的具提屬性沒有調試
          let keepApproveData = obj.data.extend.instanceLogInfo
          _this.tableAuditResults = [];
          _this.tableAuditResults = keepApproveData;
          // 依据有无数据控制折叠面板显示
          if (keepApproveData.length > 0) {
            this.collapseName.push('collapseApprove')
          }
          if (_this.tableAuditResults.length > 0) {
            _this.printAuditingContent = '<b>开始</b> -> ';
            _this.tableAuditResults.forEach(function (item) {
              _this.printAuditingContent += item.participantName + '( <b>' + item.approvalName + '</b> )'  + ' -> ';
            });
          }
        }).catch(err => {
          console.log( err );
        })
      },
      // 获取一条信息
      getLabel (paramPaymentId) {
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get', {
          "id": paramPaymentId
        }).then(res => {
          if (res.data.isSuccess === true) {
            let keepRes = res.data.object;
            this.tablePayment = [];
            this.tableIncome = [];
            this.tableMoney = [];
            this.tableEarning = [];
            this.guid = keepRes.guid;
            this.creatUserOrgID = keepRes.creatUserOrgID
            let createUserCode = keepRes.creatUserCode;
            let getPaymentType = keepRes.paymentType;
            this.keepPaymentType = getPaymentType;
            this.fundamental = keepRes;
            this.auditResult(keepRes.guid, getPaymentType);
            if (keepRes.planID > 0) {
              this.apiSomeTableDel(keepRes.planID);
            } else {
              this.apiBorrowDel(createUserCode);
            }
          }
        })
      },
      // 无收入没有订单号根据登录人员查询无收入借款明细
      apiBorrowDel (params) {
        let _this = this;
        this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
          "object": {
            "paymentType": 1,
            "createUser": params,
          }
        }).then(res => {
          if (res.data.isSuccess === true) {
            let keepRes = res.data.objects;
            _this.tableIncome = keepRes;
            if (keepRes.length > 0) {
              this.collapseName.push('collapseInCome')
            }
          }
        }).catch(err => {
          console.log( err )
        })
      },
      // 如果有团期计划，则获取相关表格信息
      apiSomeTableDel (val) {
        let _this = this;
        // 相关信息
        this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
          "object": {
            planID: val, // 团期计划ID
          }
        }).then(res => {
          if (res.data.isSuccess === true) {
            _this.fundamental.groupCode = res.data.objects[0].groupCode;
            _this.fundamental.plan_01 = res.data.objects[0].title;
          }
        }).catch(err => {
          console.log( err )
        });

        // 预付付款明细
        this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
          "object": {
            "paymentType": 2,
            "planID": val,
          }
        }).then(res => {
          if (res.data.isSuccess === true) {
            let keepRes = res.data.objects;
            _this.tablePayment = keepRes;
            if (keepRes.length > 0) {
              this.collapseName.push('collapseAdvance')
            }
          }
        }).catch(err => {
          console.log(err)
        });

        // 无收入借款明细
        this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
          "object": {
            "paymentType": 1,
            "planID": val,
          }
        }).then(res => {
          if (res.data.isSuccess === true) {
            let keepRes = res.data.objects;
            _this.tableIncome = keepRes;
            if (keepRes.length > 0) {
              this.collapseName.push('collapseInCome')
            }
          }
        }).catch(err => {
          console.log( err )
        });

        // 根据计划ID获取订单总额,已收款总额,总人数,已审批借款总额，审批中借款总额
        this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/fivetotal', {
          "id": val
        }).then(res => {
          if (res.data.isSuccess === true) {
            let keepRes = res.data.object;
            _this.tableMoney = [];
            _this.tableMoney.push(keepRes);
            if (keepRes.length > 0) {
              this.collapseName.push('collapseRelated')
            }
          }
        }).catch(err => {
          console.log( err );
        });

        // 收入明细
        _this.$http.post(this.GLOBAL.serverSrc + '/orderquery/api/income/detail', {
          "id": val,
        }).then(res => {
          if (res.data.isSuccess === true) {
            let keepRes = res.data.objects;
            _this.tableEarning = res.data.objects;
            if (keepRes.length > 0) {
              this.collapseName.push('collapseEarning')
            }
          }
        }).catch(err => {
          console.log( err );
        })
      },
    }
  }
</script>

<style lang="scss">
  .el-drawer{
    overflow-y: auto;
  }
</style>

<style scoped lang="scss">
  .el-divider__text{
    font-size: 16px !important
  }
  .el-drawer-content{
    width: 96%;
    margin: 0 auto;
  }
  .mb-40{
    margin-bottom: 40px;
  }

  .loan-management{
    width: 99%;
    margin: 25px auto 50px;
    height: auto;
    border: 1px solid #e6e6e6;
    .item-content{
      margin-bottom: 20px;
    }
    .base-value{
      color: #000;
    }
    .collapse-m{
      margin: 30px 0;
    }
    /* 先隐藏打印的时候显示 */
    .print-title{
      display: none;
    }
    .print-acount{
      display: none;
    }
    .print-approve{
      display: none;
    }
    .distributor-status{
      margin-left: 40px;
    }
    .row-bg {
      padding: 13px 0;
      .grid-del{
        text-align: left;
        font-size: 14px;
      }
      .label-color{
        color: #909399;
      }
      .doc-mt-3{
        margin-top: 3px;
      }
    }
  }

</style>
