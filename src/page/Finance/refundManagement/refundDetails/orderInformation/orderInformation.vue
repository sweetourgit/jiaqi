<template>
  <div>
    <el-dialog title="订单信息" :visible.sync="dialogOrder" custom-class="city_list dialogOrder" style="margin-top:-100px;" width="1200px"
      @close="cancelOrder()">
      <div class="controlButton">
        <el-button class="ml13" @click="cancelOrder()">取 消</el-button>
      </div>
      <div class="border">
        <div class="matter">
          <div class="title"><u>{{orderList.name}}</u></div>
          <div>
            <span class="fl red">订单总额:{{orderList.payable | numFilter}}</span>
            <span class="fl red ml30">已付金额:{{orderList.paid | numFilter}}</span>
          </div>
          <div>
            <table width="100%">
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">订单ID:</div>
                  <div class="fl ml13">{{orderList.orderCode}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">团期计划:</div>
                  <div class="fl ml13">{{orderList.groupCode}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">下单时间:</div>
                  <div class="fl ml13">{{formatDate(new Date(orderList.createTime))}}</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">套餐:</div>
                  <div class="fl ml13">{{orderList.package}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">出发地:</div>
                  <div class="fl ml13">{{orderList.pod}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">目的地:</div>
                  <div class="fl ml13">{{orderList.destination}}</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">出发日期:</div>
                  <div class="fl ml13">{{orderList.date}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">电话:</div>
                  <div class="fl ml13">{{orderList.contactTel}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">产品类型:</div>
                  <div v-if="orderList.productType=='1'" class="fl ml13">跟团游</div>
                  <div v-if="orderList.productType=='2'" class="fl ml13">自由行</div>
                  <div v-if="orderList.productType=='3'" class="fl ml13">签证</div>
                  <div v-if="orderList.productType=='4'" class="fl ml13">邮轮</div>
                </td>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">联系人:</div>
                  <div class="fl ml13">{{orderList.contactName}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">数量:</div>
                  <div class="fl ml13">{{orderList.number}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">其他费用:</div>
                  <div class="fl ml13">{{orderList.otherPrice}}</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">整体优惠:</div>
                  <div class="fl ml13">{{orderList.entiretyFav}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">销售:</div>
                  <div class="fl ml13">{{orderList.saler}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">订单来源:</div>
                  <div v-if="orderList.orderChannel=='1'" class="fl ml13">同业</div>
                  <div v-if="orderList.orderChannel=='2'" class="fl ml13">线上直客</div>
                  <div v-if="orderList.orderChannel=='3'" class="fl ml13">线下直客</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">优惠活动:</div>
                  <div class="fl ml13">{{0}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">操作:</div>
                  <div class="fl ml13">{{orderList.op}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">商户销售:</div>
                  <div class="fl ml13">{{orderList.indirectSale}}</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">平台:</div>
                  <div v-if="orderList.platform=='1'" class="fl ml13">ERP系统</div>
                  <div v-if="orderList.platform=='2'" class="fl ml13">同业系统</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">支付方式:</div>
                  <div class="fl ml13">{{0}}</div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="line"></div>
        <div class="matter">
          <div class="fl">
            <span class="point"></span>
            <span v-if="orderList.orderStatus == 1">补充资料</span>
            <span v-if="orderList.orderStatus == 2">电子合同</span>
            <span v-if="orderList.orderStatus == 3">待出行</span>
            <span v-if="orderList.orderStatus == 4">出行中</span>
            <span v-if="orderList.orderStatus == 5">待评价</span>
            <span v-if="orderList.orderStatus == 6">订单完成</span>
            <span v-if="orderList.orderStatus == 7">未确认</span>
            <span v-if="orderList.orderStatus == 8">签署合同</span>
            <span v-if="orderList.orderStatus == 9">作废订单</span>
            <span v-if="orderList.orderStatus == 10">确认订单</span>
            <!-- <span class="fl">{{orderList.orderStatus}}</span> -->
          </div>
          <!-- <div class="fl ml30">
            <span class="fl">待确认剩余</span>
            <span class="fl red">23:00:00</span>
          </div> -->
          <!-- <div class="fr">
            <span class="fl cursor">联系客人</span>
            <span class="fl ml5">|</span>
            <span class="fl cursor">备注</span>
            <span class="fl ml5">|</span>
            <span class="fl cursor">收款</span>
            <span class="fl ml5">|</span>
            <span class="fl cursor">转团</span>
            <span class="fl ml5">|</span>
            <span class="fl cursor">流程管理</span>
            <span class="fl ml5">|</span>
            <span class="fl cursor" @click="refund(1)">退款</span>
            <span class="fl ml5">|</span>
            <span class="fl cursor">更多</span>
          </div> -->
        </div>
      </div>
      <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
        <el-table-column prop="cnName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="enrollName" label="报名类型" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="idCard" label="身份证" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- <order-refund :orderRefundID="orderRefundID" :orderRefund="orderRefund" :orderRefundDialog="orderRefundDialog"></order-refund> -->
  </div>
</template>

<script>
import orderRefund from "./orderRefund/orderRefund";
export default {
  name: "orderInformation",
  components: {
    orderRefund
  },
  props: {
    orderID:0,
    orderVariable: 0,
    orderDialogType: 0
  },
  data() {
    return {
      dialogOrder:false,// 订单详情弹窗
      orderList:{},
      tableDate:[],
      orderRefundID:0,
      orderRefund:0,
      orderRefundDialog:0,
    };
  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  },
  watch: {
    orderVariable: function() {
      if (this.orderDialogType == 1) { // 订单详情
        setTimeout(() => {
          this.getOrder(this.orderID);
        },200);
        this.dialogOrder = true;
      }
    },
  },
  created() {
  },
  methods: {
    formatDate(date) {//时间转化
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
    cancelOrder(){
      this.dialogOrder = false;
    },
    getOrder(ID){ // 获取订单信息
      this.$http.post(this.GLOBAL.serverSrc + "/order/all/api/pageinfo", {
        id: ID
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.orderList = res.data.object;
          this.tableDate = res.data.object.guests; // 获取订单信息页面表格内容
          this.tableDate.forEach(function (v,k,arr) {
            if(arr[k]['sex'] == 0){
              arr[k]['sex'] = '男'
            }else if(arr[k]['sex'] == 1) {
              arr[k]['sex'] = '女'
            }else if(arr[k]['sex'] == 3) {
              arr[k]['sex'] = '未选择'
            }
          })
        }
      });
    },                                                                                                                                                                          
    // refund(i){ // 点击退款出现退款流程弹窗
    //   this.orderRefund++;
    //   this.orderRefundDialog = i;
    //   this.dialogOrder = false;
    // },
  }
};
</script>

<style scoped lang="scss">
.controlButton{position: absolute; top: 8px; right: 10px;}
.ml13{margin: 0 0 0 13px;}
.border{width:1160px; border:1px solid #e6e6e6; margin:0 0 25px 0;}
.matter{line-height: 40px;margin-left:auto;margin-right:auto; overflow:hidden;width:1130px;}
.title{font-size:13pt;font-weight:bold;}
.fl{float:left;}
.red{color:red;}
.ml30{margin:0 0 0 30px;}
.line{width:1160px; line-height:40px; border-bottom:1px solid #e6e6e6;}
.point{width:10px; height:10px;background:#7ec856;border-radius:50%;float:left;overflow:hidden;margin:15px 10px 0 0;}
.fr{float:right;}
.ml5{margin:0 5px 0 5px;}
.cursor {cursor: pointer;}
</style>


