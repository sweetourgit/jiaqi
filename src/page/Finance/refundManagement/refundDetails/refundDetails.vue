<template>
  <div>
    <!--详情-->
    <el-dialog :title="title" :visible.sync="dialogFormOrder" custom-class="city_list dialogOrder" style="margin-top:-100px" width="1200px"
      @close="cancelInfoOrder()">
      <div class="controlButton">
  	    <div class="fl">
  	      <el-button class="ml13" @click="cancelInfoOrder()">取 消</el-button>
  	      <el-button class="ml13" type="primary" @click="undoRefund()" v-if="title == '详情'">撤 销</el-button>
  	    </div>
        <div class="fl" v-if="title == '审批'">
    	    <el-button class="ml13" type="primary" @click="payAccount()">支付账户</el-button>
          <!-- <el-button class="ml13" type="primary">转 办</el-button> -->
          <el-button class="ml13" type="primary" @click="through()">通 过</el-button>
          <el-button class="ml13" type="primary" @click="rejected()">驳 回</el-button>
        </div>
      </div>
      <div class="planBorder">
        <div class="order-title"><span>基本信息</span></div>
        <div>
          <div v-if="refundList.refundStateType=='0'" class="state01">申请退款</div>
          <div v-if="refundList.refundStateType=='1'" class="state02">退款完成</div>
          <div v-if="refundList.refundStateType=='2'" class="state04">拒绝退款</div>
        </div>
        <div class="pro-info">
          <table width="100%">
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">退款单号:</div>
                <div class="fl ml13">{{refundList.refundCode}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">申请人:</div>
                <div class="fl ml13">{{refundList.name}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">申请时间:</div>
                <div class="fl ml13">{{refundList.createTime | formatDate}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">退款方式:</div>
                <div class="fl ml13">{{refundList.refundType}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">总退款:</div>
                <div class="fl ml13">{{refundList.allRefundPrice}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">实际退款金额:</div>
                <div class="fl ml13">{{refundList.realRefundPrice}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">汇款账号:</div>
                <div class="fl ml13">{{refundList.remittanceCode}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">汇款开户行:</div>
                <div class="fl ml13">{{refundList.remittanceBank}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">汇款开户人:</div>
                <div class="fl ml13">{{refundList.remittancePerson}}</div>
              </td>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">退款原由:</div>
                <div class="fl ml13">{{refundList.reason}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">支付账户:</div>
                <div class="fl ml13">{{refundList.payID}}</div>
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
                <div class="fl ml13 cursor" @click="orderDetails(1)"><u>{{0}}</u></div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">订单金额:</div>
                <div class="fl ml13">{{refundList.payable}}</div>
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
        <div>还需退款: {{refundList.needRefundPrice}}</div>
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
    <order-information :orderID="orderID" :orderVariable="orderVariable" :orderDialogType="orderDialogType"></order-information>
    <!--支付账户弹窗-->
    <el-dialog title="选择账户" :visible.sync="dialogAccount" custom-class="city_list dialogOrder" style="margin-top:-100px" width="1000px"
      @close="cancelAccount()">
      <div class="controlButton">
        <el-button class="ml13" @click="cancelAccount()">取 消</el-button>
        <el-button class="ml13" type="primary">确 认</el-button>
      </div>
      <el-table :data="tableAccount" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
        <el-table-column label="类型" prop="cardType" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.cardType===1">收款</span>
            <span v-if="scope.row.cardType===2">付款</span>
            <span v-if="scope.row.cardType===3">应收</span>
            <span v-if="scope.row.cardType===4">应付</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="账号名称" align="center"></el-table-column>
        <el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
        <el-table-column prop="openingBank" label="开户行" align="center"></el-table-column>
        <el-table-column prop="openingName" label="开户人" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <!--通过、驳回弹窗-->
    <el-dialog :title="approval" :visible.sync="dialogApproval" custom-class="city_list" style="margin-top:-100px;" width="800px"
      @close="cancelApproval()">
      <div class="controlButton">
        <el-button class="ml13" @click="cancelApproval()">取 消</el-button>
        <el-button class="ml13" type="primary">确 认</el-button>
      </div>
      <div class="oh">
        <div class="fl" v-if="approval === '审批通过'">通过说明:</div>
        <div class="fl" v-if="approval === '审批驳回'">驳回意见:</div>
        <el-input class="opinions" type="textarea" :rows="5" placeholder="请输入内容" v-model="opinion"> </el-input>
      </div>
    </el-dialog>
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
      dialogAccount:false, // 支付账户弹窗
      tableAccount:[], // 支付账户表格
      dialogApproval:false, // 通过驳回弹窗
      approval:"",// 通过驳回标题
      opinion:'', // 通过驳回输入框
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
          this.getInvoice(this.refundID);
        },200);
        this.dialogFormOrder = true;
        this.title = "详情"
      } else if(this.dialogType == 2){  // 审批详情
        setTimeout(() => {
          this.getInvoice(this.refundID);
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
    undoRefund(){ // 撤销该条退款
      this.$confirm("是否需要撤销该笔退款?", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
      }).then(() => {
          // this.$http.post(this.GLOBAL.serverSrc + '/order/blacklist/api/delete',{
          //   "id": this.multipleSelection[0].id
          // })
          // .then(res => {
          //   if(res.data.isSuccess == true){
          //      this.$message.success("撤销成功");
          //      this.$parent.pageList(
          //        this.pageIndex == 1 ? this.pageIndex : 1
          //      );
          //     }
          //  })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    getJqId(){ // 获取审批结果
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ',{
        "jq_id":this.orderCode,
        "jQ_Type":6,
      })
    },
    getInvoice(ID){//详情弹窗
      this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/get", {
        id: ID
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.refundList = res.data.objects;
          this.orderCode = res.data.objects.orderCode;
        }
      });
    },
    orderDetails(i){ // 点击订单ID出现弹窗
      this.orderVariable++;
      this.orderDialogType = i;
      this.dialogFormOrder = false;
    },
    cancelAccount(){ // 支付账户点击取消弹窗隐藏
      this.dialogAccount = false;
      this.tableAccount = [];
      this.dialogFormOrder = true;
    },
    payAccount(){ // 支付账户点击支付账户弹窗显示
      this.dialogAccount = true;
      this.dialogFormOrder = false;
      this.accountList();
    },
    accountList() { // 点击支付账户查询列表
      var that = this
      this.$http.post(
        this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list",
        {
          "object": {
            "isDeleted": 0
          },
        },)
        .then(function (obj) {
          that.tableAccount = obj.data.objects
        })
        .catch(function (obj) {
          console.log(obj)
        })
    },
    cancelApproval(){ // 通过、驳回弹窗取消
      this.dialogApproval = false ;
      this.opinion = '';
    },
    through(){ // 点击通过显示弹窗
      this.dialogApproval = true ;
      this.approval = '审批通过';
    },
    rejected(){ // 点击驳回显示弹窗
      this.dialogApproval = true ;
      this.approval = '审批驳回';
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
.oh{overflow: hidden;}
.opinions{float: left;margin: 0 0 0 13px; width: 500px;}
</style>