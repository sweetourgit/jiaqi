<!--
  待办 -> 借款详情（无收入、预付款）；
  含有打印部分；
  通过，驳回的一些方法在common.js里；
-->

<template>
  <div class="loan-management">
    <!-- 按钮组 -->
    <div style="text-align: right;">
      <el-button type="warning" plain @click="handleCancel()">取消</el-button>
      <el-button
        @click="handlePass"
        type="danger"
        plain
        :disabled="ifPassClick"
        v-if="(ifDY100009 && creatUserOrgID === 490) || ( ifDY100042 && creatUserOrgID !== 490)"
      >
        通过
      </el-button>
      <el-button @click="handlePass" type="primary" plain v-else>通过</el-button>
      <el-button @click="handleRejected" type="danger" plain>驳回</el-button>
      <el-button
        type="danger"
        :disabled="ifClick"
        @click="handleBankAccount(acoutInfo)"
        v-if="(ifDY100009 && creatUserOrgID === 490) || (ifDY100042 && creatUserOrgID !== 490)"
      >
        支付账户
      </el-button>
    </div>
    <!-- 按钮组 END -->
    <!-- 查看无收入借款弹窗 -->
    <el-divider content-position="left" class='title-margin print-hidden'>基本信息</el-divider>
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
          <el-col :span="7"><div class="grid-del label-color">ID:</div></el-col>
          <el-col :span="17"><div class="grid-del">{{ fundamental.id }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">申请人:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">创建时间:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ fundamental.createTime  | formatDate  }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第一行 END -->
      <!-- 第二行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">团期计划:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ fundamental.groupCode }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">产品名称:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ fundamental.productName }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">供应商:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ fundamental.supplierName }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第二行 END -->
      <!-- 第三行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">借款类型:</div></el-col>
          <el-col :span="15">
            <div class="grid-del">{{ fundamental.supplierTypeEX }}</div>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">借款金额:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ fundamental.price }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <!-- 摘要打印时隐藏 -->
          <el-col :span="6" class="print-hidden"><div class="grid-del label-color">摘要:</div></el-col>
          <el-col :span="17" class="print-hidden"><div class="grid-del ">{{ fundamental.mark }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第三行 END -->
      <!-- 支付账户 -->
      <el-row type="flex" class="row-bg print-acount" justify="start">
        <el-col :span="2" :offset="1"><div class="grid-del label-color">支付账户:</div></el-col>
        <el-col :span="18"><div class="grid-del">{{ fundamental.accountsName }}</div></el-col>
      </el-row>
      <!-- 支付账户 -->
      <!-- 审批人 打印时输出 -->
      <el-row type="flex" class="row-bg print-approve" justify="start">
        <el-col :span="2" :offset="1"><div class="grid-del label-color">审批人:</div></el-col>
        <el-col :span="18"><div class="grid-del" v-html="printAuditingContent"></div></el-col>
      </el-row>
      <!-- 审批人 打印时输出 END -->
      <!-- 第四行 -->
      <el-row type="flex" class="row-bg print-acount-padding" justify="space-around">
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">账号:</div></el-col>
          <el-col :span="18"><div class="grid-del ">{{ fundamental.cardNumber }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">开户行:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ fundamental.bankName }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">开户名:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ fundamental.cardName }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第四行 END -->
      <!-- 第五行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <!-- 打印时隐藏 -->
          <el-col :span="9" class="print-hidden"><div class="grid-del label-color">支付账户:</div></el-col>
          <el-col :span="12" class="print-hidden">
            <div class="grid-del">{{ fundamental.accountsName }}</div>
          </el-col>
        </el-col>
        <el-col :span="14">
          <el-col :span="6"><div class="grid-del label-color print-hidden">附件:</div></el-col>
          <el-col :span="18">
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
    <!-- 审核结果 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
    <el-table :data="tableCourse" border :header-cell-style="getRowClass">
      <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
      <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
      <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
      <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
    </el-table>
    <!-- 审核结果 END -->
    <!-- 相关信息 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>相关信息</el-divider>
    <el-table :data="tableMoney" border :header-cell-style="getRowClass">
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
    <!-- 相关信息 END -->
    <!-- 无收入借款明细 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>无收入借款明细</el-divider>
    <el-table :data="tableIncome" border :header-cell-style="getRowClass">
      <el-table-column prop="paymentID" label="ID" align="center"></el-table-column>
      <el-table-column prop="checkTypeEX" label="审批状态" align="center"></el-table-column>
      <el-table-column prop="supplierType" label="借款类型" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
      <el-table-column prop="price" label="金额" align="center"></el-table-column>
      <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
      <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
      <el-table-column prop="process" label="审批过程" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="handleLookApprovalProcess(scope.$index, scope.row,1)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 无收入借款明细 END -->
    <!-- 预付款明细 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>预付款明细</el-divider>
    <el-table :data="tablePayment" border :header-cell-style="getRowClass">
      <el-table-column prop="paymentID" label="ID" align="center"></el-table-column>
      <el-table-column prop="checkTypeEX" label="审批状态" align="center">
      </el-table-column>
      <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
      <el-table-column prop="price" label="金额" align="center"></el-table-column>
      <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
      <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
      <el-table-column prop="process" label="审批过程" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="handleLookApprovalProcess(scope.$index, scope.row,2)">查看</el-button>
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
    <!-- 收入明细 END -->
    <!-- 审批过程-查看弹窗 -->
    <el-dialog width="45%" title="审批过程" :visible.sync="ifLookApproveProcess" append-to-body>
        <el-table :data="tableIncomeCheck" border style=" width:90%;margin:30px 0 20px 25px;" :header-cell-style="getRowClass">
          <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
          <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
          <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
          <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
        </el-table>
    </el-dialog>
    <!-- 审批过程-查看弹窗 END -->
    <!-- 通过、驳回弹框 -->
    <el-dialog :title="approveDialogTitle" :visible.sync="ifShowApproveDialog" width="40%" custom-class="city_list" :show-close='false'>
      <div @click="handleApproveDialogCancel">×</div>
      <textarea rows="8" v-model="approvalOpinion" style="overflow: hidden; width: 99%; margin: 0 0 20px 0;"></textarea>
      <el-row type="flex" class="row-bg">
        <el-col :span="8" :offset="18">
          <el-button @click="handleApproveDialogCancel">取消</el-button>
          <el-button @click="handleApproveDialogConfirm" type="primary">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 通过、驳回弹框 END -->
  </div>
</template>

<script>
  import common from "../../mixins/common";

  export default {
    name: 'borrowDetails',
    data () {
      return {
        ifDY100009: false,
        ifDY100042: false,
        creatUserOrgID: 0,
        ifClick: false, // 如果点击选择账户之后这个按钮会禁止点击
        ifPassClick: true, // 点击选择账户之后才可以点击通过
        printAuditingContent: null, // 打印审核结果的内容拼接
        whichComponentName: null, // 组件名称
        tableIncomeCheck: null, // 审批过程-查看弹窗-数据
        fundamental: {}, // 打印详情数据
        tableMoney: [], // 无收入借款金额表格
        tablePayment:[], // 预付款明细表格
        tableIncome:[], // 无收入借款明细弹窗
        ifLookApproveProcess: false, // 查看审批过程
        tableEarning: [], // 收入明细表格
        tableCourse: [], // 查看无收入借款审批过程
        keepPaymentType: null, // 弹窗中调用获取一条详情，保存paymentType类型
        getTopName: '', // 部门
        approveDialogTitle: '', // 审批弹窗标题设置
        approvalOpinion: '', // 审批意见
        guid: '', // 接口用的guid
        getWorkItemId: '', // 保存匹配的 workItemId
      }
    },
    mixins: [ common ],
    created () {
      let keepPaymentID = this.$route.query.pendingDetailPaymentID; // 查看详情用
      let getUserCode = sessionStorage.getItem('userCode');
      this.getWorkItemId = this.$route.query.workItemID; // 工作流接口用
      this.whichComponentName = this.$route.query.componentName; // 来自无收入还是预付款
      this.getTopName = sessionStorage.getItem('topName');
      // 打印相关（目前两个人可以进行打印）
      getUserCode === 'DY100009' ? this.ifDY100009 = true : this.ifDY100009 = false;
      getUserCode === 'DY100042' ? this.ifDY100042 = true : this.ifDY100042 = false;
      // 详情方法
      this.getLabel(keepPaymentID);
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
      // 审批过程-查看按钮触发（ GetInstanceActityInfoListForJQ_Lite_BY_JQIDAndJQType -> 这是查看审批之后的流程日子 ）
      handleLookApprovalProcess (index, row, type) {
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoListForJQ_Lite_BY_JQIDAndJQType', {
          jq_id:	row.guid,
          jQ_Type: type,
        }).then(obj => {
          this.ifLookApproveProcess = true;
        }).catch(err => {
          console.log( err );
        })
      },
      // 审核结果
      auditResult (result, paramJqType) {
        let _this = this;
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoListForJQ_Lite_BY_JQIDAndJQType', {
          jq_id:	result,
          jQ_Type: paramJqType, // 无收入1 预付款2,
        }).then(obj => {
          _this.tableCourse = [];
          _this.tableCourse = obj.data.data;
          if (_this.tableCourse.length > 0) {
            _this.printAuditingContent = '<b>开始</b> -> ';
            _this.tableCourse.forEach(function (item) {
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
            this.tablePayment = [];
            this.tableIncome = [];
            this.tableMoney = [];
            this.tableEarning = [];
            this.guid = res.data.object.guid;
            let createUserCode = res.data.object.creatUserCode;
            let getPaymentType = res.data.object.paymentType;
            this.keepPaymentType = getPaymentType;
            this.fundamental = res.data.object;
            this.auditResult(res.data.object.guid, getPaymentType);
            if (res.data.object.planID > 0) {
              this.apiSomeTableDel(res.data.object.planID);
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
            _this.tableIncome = res.data.objects;
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
            _this.tablePayment = res.data.objects
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
            _this.tableIncome = res.data.objects;
          }
        }).catch(err => {
          console.log( err )
        });

        // 根据计划ID获取订单总额,已收款总额,总人数,已审批借款总额，审批中借款总额
        this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/fivetotal', {
          "id": val
        }).then(res => {
          if (res.data.isSuccess === true) {
            _this.tableMoney = [];
            _this.tableMoney.push(res.data.object);
          }
        }).catch(err => {
          console.log( err );
        });

        // 收入明细
        _this.$http.post(this.GLOBAL.serverSrc + '/orderquery/api/income/detail', {
          "id": val,
        }).then(res => {
          if (res.data.isSuccess === true) {
            _this.tableEarning = res.data.objects;
          }
        }).catch(err => {
          console.log( err );
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .loan-management{
    margin-bottom: 50px;
    .title-margin{
      margin-bottom: 30px;
    }
    .item-content{
      margin-bottom: 20px;
    }
    .title-margin-t{
      margin-top: 45px;
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
    .el-divider__text{
      font-size: 17px !important
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
