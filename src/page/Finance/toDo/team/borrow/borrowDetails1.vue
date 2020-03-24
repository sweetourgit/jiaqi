<!--
  待办 -> 借款详情（无收入、预付款）
  含有打印部分
-->

<template>
  <div class="loan-management">
    <div style="text-align: right; margin:25px 20px 0 0;">
      <el-button type="warning" plain @click="handleCancel(keepComponentName)">取消</el-button>
    </div>
    <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
    <!-- 打印 -->
    <div ref="print">
      <div class="item-content">
        <el-tag type="warning" v-if="fundamental.checkType=='0'" class="distributor-status">审批中</el-tag>
        <el-tag type="danger" v-if="fundamental.checkType=='2'" class="distributor-status">驳回</el-tag>
        <el-tag type="success" v-if="fundamental.checkType=='1'" class="distributor-status">通过</el-tag>
      </div>
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
          <el-col :span="7"><div class="grid-del label-color">创建时间:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ fundamental.createTime  | formatDateCreateAn  }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">团期计划:</div></el-col>
          <el-col :span="17"><div class="grid-del">{{ fundamental.groupCode }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">产品名称:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ fundamental.productName }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">供应商:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ fundamental.supplierName }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">借款类型:</div></el-col>
          <el-col :span="17">
            <div class="grid-del">{{ fundamental.supplierTypeEX }}</div>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">借款金额:</div></el-col>
          <el-col :span="17"><div class="grid-del">{{ fundamental.price }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">摘要:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ fundamental.mark }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">账号:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ fundamental.cardNumber }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">开户行:</div></el-col>
          <el-col :span="17"><div class="grid-del">{{ fundamental.bankName }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">开户名:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ fundamental.cardName }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">支付账户:</div></el-col>
          <el-col :span="17">
            <div class="grid-del">{{ fundamental.accountsName }}</div>
          </el-col>
        </el-col>
        <el-col :span="14">
          <el-col :span="7"><div class="grid-del label-color">附件:</div></el-col>
          <el-col :span="17">
            <el-upload
              class="upload-demo"
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
    </div>
    <!-- 打印 END -->
    <!-- 审核结果 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
    <el-table :data="tableCourse" border :header-cell-style="getRowClass">
      <el-table-column prop="createTime" :formatter='dateFormatDetails' label="审批时间" align="center"></el-table-column>
      <el-table-column prop="name" label="审批人" align="center"></el-table-column>
      <el-table-column prop="typeStr" label="审批结果" align="center"></el-table-column>
      <el-table-column prop="opinions" label="审批意见" align="center"></el-table-column>
    </el-table>
    <el-divider content-position="left" class='title-margin title-margin-t'>相关信息</el-divider>
    <!--  -->
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
    <!--  -->
    <!-- 审核结果 END -->
    <!-- 无收入借款明细 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>无收入借款明细</el-divider>
    <el-table :data="tableIncome" border :header-cell-style="getRowClass">
      <el-table-column prop="paymentID" label="ID" align="center"></el-table-column>
      <el-table-column prop="checkType" label="审批状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkType==0" style="color: #7F7F7F" >审批中</div>
          <div v-if="scope.row.checkType==2" style="color: #FF4A3D" >驳回</div>
          <div v-if="scope.row.checkType==1" style="color: #33D174" >通过</div>
        </template>
      </el-table-column>
      <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
      <el-table-column prop="price" label="金额" align="center"></el-table-column>
      <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
      <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
      <el-table-column prop="process" label="审批过程" align="center">
        <template slot-scope="scope">
          <el-button @click="processIncome(scope.$index, scope.row,1)" type="primary" plain size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 无收入借款明细 END -->
    <!-- 预付款明细 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>预付款明细</el-divider>
    <el-table :data="tablePayment" border :header-cell-style="getRowClass">
      <el-table-column prop="paymentID" label="ID" align="center"></el-table-column>
      <el-table-column prop="checkType" label="审批状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkType==0" style="color: #7F7F7F" >审批中</div>
          <div v-if="scope.row.checkType==2" style="color: #FF4A3D" >驳回</div>
          <div v-if="scope.row.checkType==1" style="color: #33D174" >通过</div>
        </template>
      </el-table-column>
      <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
      <el-table-column prop="price" label="金额" align="center"></el-table-column>
      <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
      <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
      <el-table-column prop="process" label="审批过程" align="center">
        <template slot-scope="scope">
          <el-button @click="processIncome(scope.$index, scope.row,2)" type="primary" plain size="small" :loading="false">查看</el-button>
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
    <!-- 审批过程 -->
    <el-dialog width="45%" title="审批过程" :visible.sync="isShowApproveDialog" append-to-body>
        <el-table :data="tableIncomeCheck" border style=" width:90%; margin:30px 0 20px 25px;" :header-cell-style="getRowClass">
          <el-table-column prop="createTime" :formatter='dateFormatDetails' label="审批时间" align="center"></el-table-column>
          <el-table-column prop="name" label="审批人" align="center"></el-table-column>
          <el-table-column prop="typeStr" label="审批结果" align="center"></el-table-column>
          <el-table-column prop="opinions" label="审批意见" align="center"></el-table-column>
        </el-table>
    </el-dialog>
    <!-- 审批过程 END -->
  </div>
</template>

<script>
  import common from "../../mixins/common";

  export default {
    name: 'borrowDetails',
    data(){
      return {
        loading: true,
        keepPaymentId: null,
        keepComponentName: null, // 上一级组件名称
        tableIncomeCheck: null,
        fundamental: {},
        fileList: [],
        dialogFormVisible_plan: false,
        tableMoney: [],
        tablePayment: [],
        tableIncome: [],
        isShowApproveDialog: false,
        tableEarning: [],
        tableCourse: [],
        keepPaymentType: null,
      }
    },
    mixins: [common],
    created () {
      let passPaymentID = this.$route.query.doneDetailPaymentID;
      this.keepComponentName = this.$route.query.componentName;
      this.keepPaymentId = passPaymentID;
      this.getLabel(passPaymentID);
    },
    methods: {
      handlePreview (file) {
        window.open(file.url);
      },
      // 审批意见
      processIncome (index,row, type) {
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetOpinions', {
          jQ_ID: row.guid,
          jQ_Type: type,
        }).then(obj => {
          this.tableIncomeCheck = obj.data;
          this.isShowApproveDialog = true;
        }).catch(obj => {})
      },
      auditResult (result, paramJqType) {
        let _this = this
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetOpinions', {
          jQ_ID: result,
          jQ_Type: paramJqType,
        }).then(obj => {
          _this.tableCourse = [];
          _this.tableCourse = obj.data;
        }).catch(obj => {})
      },
      getLabel (paramsPaymentID) {
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get', {
          "id": paramsPaymentID
        }).then(res => {
          if (res.data.isSuccess === true) {
            this.tablePayment = [];
            this.tableIncome = [];
            this.tableMoney = [];
            this.tableEarning = [];
            let createUserCode = res.data.object.creatUserCode;
            let getPaymentType = res.data.object.paymentType;
            this.keepPaymentType = getPaymentType;
            this.fundamental = res.data.object;
            this.auditResult(res.data.object.guid, getPaymentType);
            if (res.data.object.planID > 0) {
              this.getDel(res.data.object.planID);
            } else {
              this.apiBorrowDel(createUserCode);
            }
          }
        })
      },
      // 借款详情
      apiBorrowDel (params) {
        let _this = this;
        this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
          "object": {
            "paymentType": this.keepComponentName === 'noIn' ? 1 : 2,
            "createUser": params,
          }
        }).then(res => {
          if (res.data.isSuccess === true) {
            _this.tableIncome = res.data.objects;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getDel (val) {
        let _this = this;
        this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
          "object": {
            planID: val,
          }
        }).then(res => {
          if (res.data.isSuccess === true) {
            _this.fundamental.groupCode = res.data.objects[0].groupCode;
            _this.fundamental.plan_01 = res.data.objects[0].title;
          }
        }).catch(err => {
          console.log(err)
        });
        this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
          "object": {
            "paymentType": 2,
            "planID": val,
          }
        }).then(res => {
          if (res.data.isSuccess === true) {
            _this.tablePayment = res.data.objects;
          }
        }).catch(err => {
          console.log(err);
        });
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
          console.log(err);
        });
        this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/fivetotal', {
          "id": val
        }).then(res => {
          if (res.data.isSuccess === true) {
            _this.tableMoney = [];
            _this.tableMoney.push(res.data.object);
          }
        }).catch(err => {
          console.log(err);
        });
        this.$http.post(this.GLOBAL.serverSrc + '/orderquery/api/income/detail', {
          "id": val,
        }).then(res => {
          if (res.data.isSuccess === true) {
            _this.tableEarning = res.data.objects;
          }
        }).catch(err => {
          console.log(err);
        })
      },
    },
  }
</script>


<style scoped lang="scss">
  .loan-management{
    width: 99%;
    margin: 25px auto 50px;
    height: auto;
    border: 1px solid #e6e6e6;
    .row-content{
      width: 95%;
      margin: 0 auto;
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .reimbursement-mt{
      margin: 20px 0;
    }
    .item-content{
      margin: 10px 0;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
    }
    .distributor-status{
      margin-left: 4%;
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
