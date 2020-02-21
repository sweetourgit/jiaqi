<template>
  <div class="loan-management" style="margin-bottom: 50px;">
    <div style="text-align: right;">
      <el-button type="info" plain @click="goBack">取消</el-button>
      <el-button type="primary" @click="splitRelTable">拆分关系表</el-button>
    </div>
    <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
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
          <el-col :span="9"><div class="grid-del label-color">创建时间:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ fundamental.createTime  | formatDate  }}</div></el-col>
        </el-col>
      </el-row>
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
          <el-col :span="6"><div class="grid-del label-color">摘要:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ fundamental.mark }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
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
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">支付账户:</div></el-col>
          <el-col :span="12">
            <div class="grid-del">{{ fundamental.accountsName }}</div>
          </el-col>
        </el-col>
        <el-col :span="14">
          <el-col :span="6"><div class="grid-del label-color">附件:</div></el-col>
          <el-col :span="18">
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
    <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
    <el-table :data="tableCourse" border :header-cell-style="getRowClass">
      <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
      <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
      <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
      <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
    </el-table>
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
    <el-divider content-position="left" class='title-margin title-margin-t'>无收入借款明细</el-divider>
    <el-table :data="tableIncome" border :header-cell-style="getRowClass">
      <el-table-column prop="paymentID" label="ID" width="50" align="center"></el-table-column>
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
    <el-divider content-position="left" class='title-margin title-margin-t'>预付款明细</el-divider>
    <el-table :data="tablePayment" border :header-cell-style="getRowClass">
      <el-table-column prop="paymentID" label="ID" width="50" align="center"></el-table-column>
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
          <el-button @click="processIncome(scope.$index, scope.row,2)" type="primary" plain size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
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
          <div>{{ scope.row.orderChannel !== 1 ? '暂无' : scope.row.arrearsDate | formatDateDetails }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="repaymentDate" label="应还日期" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.orderChannel !== 1 ? '暂无' : scope.row.repaymentDate | formatDateDetails }}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="45%" title="审批过程" :visible.sync="dialogFormVisible_Income" append-to-body>
      <div class="indialog">
        <el-table :data="tableIncomeCheck" border style=" width:90%;margin:30px 0 20px 25px;" :header-cell-style="getRowClass">
          <el-table-column prop="finishedTime" label="审批时间" width="150" align="center"></el-table-column>
          <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
          <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
          <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'advanceAndNoInDetails',
    data(){
      return {
        keepPaymentId: null,
        tableIncomeCheck: null,
        fundamental:{},
        fileList: [],
        dialogFormVisible_plan:false,
        tableMoney:[],
        tablePayment:[],
        tableIncome:[],
        dialogFormVisible_Income:false,
        tableEarning:[],
        tableCourse:[],
        keepPaymentType: null,
      }
    },
    filters: {
      formatDate: function (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      },
      formatDateDetails:function (value) {
        if(typeof value == 'string'){
          return ''
        } else {
          return moment(value).format('YYYY-MM-DD')
        }
      }
    },
    created(){
      let passPaymentID = this.$route.query.doneDetailPaymentID
      this.keepPaymentId = passPaymentID
      this.getLabel(passPaymentID);
    },
    methods: {
      moment,
      dateFormat: function(row, column) {
        let date = row[column.property];
        if(date == undefined || date == '') {
          return '';
        }
        return moment(date).format('YYYY-MM-DD')
      },
      goBack(){
        this.$router.go(-1)
      },
      splitRelTable(){
        this.$router.push({ path: "/relationSplitMap", query: { id: this.keepPaymentId } })
      },
      handlePreview(file) {
        window.open(file.url);
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      // 审批过程-查看
      processIncome(index,row, type){
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ', {
          jQ_ID: row.guid,
          jQ_Type: type,
        }).then(obj => {
          this.tableIncomeCheck = obj.data.extend.instanceLogInfo;
          this.dialogFormVisible_Income = true;
        }).catch(obj => {})
      },
      // 审核结果
      auditResult(result, paramJqType) {
        var that =this
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ', {
          jQ_ID: result,
          jQ_Type: paramJqType, // 无收入1 预付款2
        }).then(obj => {
          that.tableCourse = []
          that.tableCourse = obj.data.extend.instanceLogInfo;
        }).catch(obj => {})
      },
      getLabel(paramsPaymentID){
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get',{
          "id": paramsPaymentID
        }).then(res => {
          if(res.data.isSuccess == true){
            this.tablePayment = []
            this.tableIncome = []
            this.tableMoney = []
            this.tableEarning = []
            let createUserCode = res.data.object.creatUserCode;
            let getPaymentType = res.data.object.paymentType
            this.keepPaymentType = getPaymentType
            this.fundamental=res.data.object;
            this.auditResult(res.data.object.guid, getPaymentType);
            if(res.data.object.planID>0){
              this.getPaymentdetails(res.data.object.planID);
            }else{
              this.bbb(createUserCode);
            }
          }
        })
      },
      // 无收入没有订单号根据登录人员查询无收入借款明细
      bbb(params){
        var that = this
        that.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
          "object": {
            "paymentType": 1, // 1 无收入 2 预付款
            "createUser": params, // sessionStorage.getItem('userCode')
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            that.tableIncome = res.data.objects
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 获取相关表格信息
      getPaymentdetails(val) {
        var that = this
        //相关信息
        that.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
          "object": {
            planID: val, //团期计划ID
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            that.fundamental.groupCode = res.data.objects[0].groupCode
            that.fundamental.plan_01 = res.data.objects[0].title
          }
        }).catch(err => {
          console.log(err)
        })
        //预付付款明细
        that.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
          "object": {
            "paymentType": 2,
            "planID": val,
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            that.tablePayment = res.data.objects
          }
        }).catch(err => {
          console.log(err)
        })
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
        //根据计划ID获取订单总额,已收款总额,总人数,已审批借款总额，审批中借款总额/
        that.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/fivetotal', {
          "id": val
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
          }
        }).catch(err => {
          console.log(err)
        })
      },
    },
  }
</script>
<style scoped lang="scss">
  .loan-management{
    .title-margin{
      margin-bottom: 30px;
    }
    .item-content{
      margin-bottom: 20px;
    }
    .title-margin-t{
      margin-top: 45px;
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
