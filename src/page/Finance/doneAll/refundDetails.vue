<template>
  <div class="loan-management">
    <div style="text-align: right; margin:25px 20px 0 0;">
      <el-button type="info" plain  @click="handleCancel('refund')">取消</el-button>
    </div>
    <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
    <div>
      <div class="item-content">
        <el-tag type="warning" v-if="refundList.refundStateType=='0'" class="distributor-status">申请退款</el-tag>
        <el-tag type="danger" v-if="refundList.refundStateType=='1'" class="distributor-status">退款完成</el-tag>
        <el-tag type="success" v-if="refundList.refundStateType=='2'" class="distributor-status">拒绝退款</el-tag>
      </div>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">退款单号:</div></el-col>
          <el-col :span="17"><div class="grid-del">{{ refundList.refundCode }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">申请人:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ refundList.name }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">申请时间:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ refundList.createTime | formatDate  }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">退款方式:</div></el-col>
          <el-col :span="15" v-if="refundList.refundType == 1"><div class="grid-del">部分退</div></el-col>
          <el-col :span="15" v-if="refundList.refundType == 2"><div class="grid-del">全退</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">总退款:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ refundList.allRefundPrice }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">实际退款金额:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ refundList.realRefundPrice }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">汇款账号:</div></el-col>
          <el-col :span="15">
            <div class="grid-del">{{ refundList.remittanceCode }}</div>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">汇款开户行:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ refundList.remittanceBank }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">汇款开户人:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ refundList.remittancePerson }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">退款原由:</div></el-col>
          <el-col :span="18"><div class="grid-del ">{{ refundList.reason }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">支付账户:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ payName }}</div></el-col>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
    </div>
    <el-divider content-position="left" class='title-margin title-margin-t'>订单详情</el-divider>
    <div>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">订单ID:</div></el-col>
          <el-col :span="17"><div class="grid-del" @click="orderDetails(1)"><el-link type="info">{{ refundList.orderCode }}</el-link></div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">订单金额:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ refundList.payable }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">已付金额:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ refundList.paid }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">未付金额:</div></el-col>
          <el-col :span="17"><div class="grid-del">{{ nonPayment }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">其他费用:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ refundList.otherPrice }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">整体优惠:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ refundList.entiretyFav }}</div></el-col>
        </el-col>
      </el-row>
    </div>
    <el-divider content-position="left" class='title-margin title-margin-t'>部分退信息</el-divider>
    <div>
      <div class="item-content">
        <el-tag type="success">还需退款: {{refundList.needRefundPrice}}</el-tag>
      </div>
      <el-table :data="mark" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
        <el-table-column prop="enrollName" label="报名类型" align="center"></el-table-column>
        <el-table-column prop="singlePrice" label="价钱" align="center"></el-table-column>
        <el-table-column prop="cnName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="idCard" label="身份证" align="center"></el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sex===0">男</span>
            <span v-if="scope.row.sex===1">女</span>
            <span v-if="scope.row.sex===3">未选择</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
    <div>
      <el-table :data="tableAudit" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
        <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
        <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
        <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
        <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
      </el-table>
    </div>
  <order-info :orderID="orderID" :orderVariable="orderVariable" :orderDialogType="orderDialogType"></order-info>
  </div>
</template>
<script>
  import orderInfo from "./orderInfo";
  import common from "./common";
  export default {
    name: "refundDetails",
    components: {
      orderInfo
    },
    data() {
      return {
        orderID:0,
        orderVariable:0,
        orderDialogType:0,
        refundList:{},
        tableDate:[],// 详情弹窗部分退信息表格
        tableAudit:[],// 详情页面审核结果表格
        orderCode:'',// 获取orderCode来获取审核结果
        indentID:0,
        multipleSelection: [], //选中的list
        disbursementID:0, // 获取详情时支付账户的id
        payName:'', // 选择支付账户，通过ID获取名字
        nonPayment:0,//未付金额
        mark:[],
        instanceID:0,
        keepComponentName: null
      };
    },
    mixins: [common],
    created(){
      let passPaymentID = this.$route.query.doneDetailPaymentID
      this.keepComponentName = this.$route.query.componentName
      this.keepPaymentId = passPaymentID
      this.getInvoice(passPaymentID);
    //    this.getOrder(this.refundList.orderID);
    },
    methods: {
      getCellClass() {
        return "textAlign:center";
      },
      changeFun(val) {
        //保存选中项的数据
        this.multipleSelection = val;
      },
      clickRow(row) {
        //选中行复选框勾选
        this.$refs.multipleTable.clearSelection(); //清空用户的选择,注释掉可多选
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      rowClass({row, rowIndex}){  //选中行样式改变
        for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].id==row.id){
            return { "background-color": "#ecf5ff" }
          }
        }
      },
      getJqId(result){ // 获取审批结果tableAudit
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ_BY_InstanceID',{
          "instanceId":this.instanceID,
          // "jq_id":result,
          // "jQ_Type":6,
        }).then(obj => {
          this.tableAudit = [];
          this.tableAudit = obj.data.extend.instanceLogInfo;
          console.log(this.tableAudit)
        })
      },
      getOrder(ID){ // 点击退款获取详情信息
        this.$http.post(this.GLOBAL.serverSrc + "/order/refund/api/get", {
          id:ID,
        }).then(res => {
          if (res.data.isSuccess == true){
            let orderInfo = res.data.object;
            if(this.refundList.refundStateType==1){
              this.nonPayment = this.refundList.payable - (this.refundList.paid - this.refundList.realRefundPrice);
            }else{
              this.nonPayment = this.refundList.payable - this.refundList.paid;
            }
            this.nonPayment=this.nonPayment>0?this.nonPayment:0;
          }
        })
      },
      getInvoice(ID){//详情弹窗
        this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/get", {
          id: ID
        }).then(res => {
          if (res.data.isSuccess == true) {
            this.refundList = res.data.object;
            this.orderCode = res.data.object.orderCode;
            this.indentID = res.data.object.orderID;
            this.instanceID = res.data.object.instanceID;
            console.log(res.data.object.instanceID)
            this.getJqId(this.orderCode);
            this.tableDate = res.data.object.guests;
            this.mark = res.data.object.mark==""?[]:JSON.parse(res.data.object.mark);
            this.disbursementID = res.data.object.payID;
            this.$http.post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/get",{
              id:this.disbursementID,
            }).then(res => {
              if(res.data.isSuccess == true){
                this.payName = res.data.object.title;
              }
            })
          }
        });
      },
      orderDetails(i){
        this.orderVariable++;
        this.orderDialogType = i;
        this.orderID = this.indentID;
      },
    }
  };
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
