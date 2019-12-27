<template>
  <div>
    <!--详情-->
    <el-dialog :title="title" :visible.sync="dialogFormOrder" custom-class="city_list dialogOrder" style="margin-top:-100px" width="1200px"
      @close="cancelInfoOrder()">
      <div class="controlButton">
        <el-button class="ml13" @click="cancelInfoOrder()">取 消</el-button>
        <el-button class="ml13" type="primary" v-if="title == '详情'">撤 销</el-button>
        <el-button class="ml13" type="primary" v-if="title == '审批'">支付账户</el-button>
        <el-button class="ml13" type="primary" v-if="title == '审批'">通 过</el-button>
        <el-button class="ml13" type="primary" v-if="title == '审批'">驳 回</el-button>
      </div>
      <div class="planBorder">
        <div class="order-title"><span>基本信息</span></div>
        <div>
          <div v-if="refundList.state=='1'" class="state01">申请退款</div>
          <div v-if="refundList.state=='2'" class="state02">退款成功</div>
          <div v-if="refundList.state=='3'" class="state04">拒绝退款</div>
        </div>
        <div class="pro-info">
          <table width="100%">
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">退款单号:</div>
                <div class="fl ml13">{{refundList.id}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">申请人:</div>
                <div class="fl ml13">{{refundList.userName}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">申请时间:</div>
                <div class="fl ml13">{{refundList.createTime | formatDate}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">18581094581
                <div width="80" class="fl fb">退款方式:</div>
                <div class="fl ml13">{{refundList.invoiceHeader}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">总退款:</div>
                <div class="fl ml13">{{refundList.taxpayerIDNumber}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">实际退款金额:</div>
                <div class="fl ml13">{{refundList.tel}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">汇款账号:</div>
                <div class="fl ml13">{{refundList.tel}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">汇款开户行:</div>
                <div class="fl ml13">{{refundList.tel}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">汇款开户人:</div>
                <div class="fl ml13">{{refundList.tel}}</div>
              </td>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">退款原由:</div>
                <div class="fl ml13">{{refundList.cardNumber}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">支付账户:</div>
                <div class="fl ml13">{{refundList.bankName}}</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="order-title"><span>订单详情</span></div>
        <div class="pro-info">
          <table width="100%">
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">订单ID:</div>
                <div class="fl ml13 cursor" @click="orderDetails(1)">{{0}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">订单金额:</div>
                <div class="fl ml13">{{refundList.userName}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">已付金额:</div>
                <div class="fl ml13">{{refundList.createTime}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">未付金额:</div>
                <div class="fl ml13">{{refundList.invoiceHeader}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">其他费用:</div>
                <div class="fl ml13">{{refundList.taxpayerIDNumber}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">整体优惠:</div>
                <div class="fl ml13">{{refundList.tel}}</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="order-title"><span>部分退信息</span></div>
        <div>还需退款: {{0}}</div>
        <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
          <el-table-column prop="" label="报名类型" align="center"></el-table-column>
          <el-table-column prop="" label="价钱" align="center"></el-table-column>
          <el-table-column prop="" label="姓名" align="center"></el-table-column>
          <el-table-column prop="" label="电话" align="center"></el-table-column>
          <el-table-column prop="" label="身份证" align="center"></el-table-column>
          <el-table-column prop="" label="性别" align="center"></el-table-column>
        </el-table>
        <div class="order-title"><span>审核结果</span></div>
        <el-table :data="tableAudit" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
          <el-table-column prop="" label="审批时间" align="center"></el-table-column>
          <el-table-column prop="" label="审批人" align="center"></el-table-column>
          <el-table-column prop="" label="审批结果" align="center"></el-table-column>
          <el-table-column prop="" label="审批意见" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <order-information :refundID="orderID" :orderVariable="orderVariable" :orderDialogType="orderDialogType"></order-information>
  </div> 
</template>
<script>
import moment from "moment";
import orderInformation from "./orderInformation/orderInformation";
export default {
  name: "refundDetails",
  components: {
    orderInformation
  },
  props: {
    refundID:0,
    variable: 0,
    dialogType: 0
  },
  data() {
    return {
      orderID:0,
      orderVariable:0,
      orderDialogType:0,
      dialogFormOrder:false,// 详情弹窗
      title:"",//退款记录和审批标题
      refundList:{},// 基本信息数组
      tableDate:[],// 详情弹窗部分退信息表格
      tableAudit:[],// 详情页面审核结果表格
    };

  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    },
    formatDate: function (value) {//截取详情时间格式
      return moment(value).format('YYYY-MM-DD')
    }
  },
  mounted () {
  },
  watch: {
    variable: function() {
      if (this.dialogType == 1) { // 退款记录详情
        setTimeout(() => {
          //this.getInvoice(this.refundID);
        },200);
        this.dialogFormOrder = true;
        this.title = "详情"
      } else if(this.dialogType == 2){  // 审批详情
        setTimeout(() => {
          //this.getInvoice(this.refundID);
        },200);
        this.dialogFormOrder = true;
        this.title = "审批"
      }
    },
  },
  methods: {
    formatDate01(date) {//时间转化
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d;
    },
    // 起始时间格式转换
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD')
    }, 

    getRowClass({ row, column, rowIndex, columnIndex }) {//表格头部颜色
      if (rowIndex == 0) {
        return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
      } else {
        return "";
      }
    },
    getCellClass() {
      return "textAlign:center";
    },
    cancelInfoOrder(){ // 关闭详情弹窗
      this.dialogFormOrder = false;
      this.tableDate = [];
      this.tableAudit = [];
    },
    getInvoice(ID){//详情弹窗
      this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/get", {
        id: ID
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.refundList = res.data.object;
        }
      });
    },
    orderDetails(i){ // 点击订单ID出现弹窗
      this.orderVariable++;
      this.orderDialogType = i;
      this.dialogFormOrder = false;
    },
  }
};
</script>

<style scoped>
/*下单弹窗团期信息样式*/
.planBorder{width: 95%;margin: 0 30px 10px 0;font-size: 14px;line-height: 25px;}
.order-title{font-size: 14pt; color:#000;line-height: 40px;}
.controlButton{position: absolute; top: 8px; right: 10px;}
.fl{float: left;}
.fb{font-weight: bold;}
.ml13{margin: 0 0 0 13px;}
.state01{text-align: center; background: #ffaa00; border-radius: 5px; color: #fff;width:60px;padding: 2px; margin: 10px 0 0 0;}
.state02{text-align: center; background: #008000; border-radius: 5px; color: #fff;width:60px;padding: 2px; margin: 10px 0 0 0;float: left;}
.state03{color:#008000;float: left; line-height: 30px; margin: 10px 0 0 10px; font-weight: bold;}
.state04{text-align: center; background: #eb0000; border-radius: 5px; color: #fff;width:60px;padding: 2px; margin: 10px 0 0 0;}
.pro-info{margin: 15px 0 20px 0;line-height: 30px;}
.table{margin: 10px 0 10px 0;padding:1px;}
.w200{width: 200px;}
.associated{background: #e6f3fc;border: 1px solid #d5f0fc; line-height: 30px;border-radius: 5px;overflow: hidden;}
.warning{float: left;color: #108ee9;margin: 0 0 0 15px;font-size: 16px;}
.relateditems{color: #108ee9; margin: 0 5px 0 5px;}
.aggregate{margin: 0 0 0 15px;float: left;}
.aggregate span{ margin: 0 0 0 15px;}
.w150{width: 150px;}
.validation{color: red;width: 150px;line-height: 30px;}
.cursor {cursor: pointer;}
</style>