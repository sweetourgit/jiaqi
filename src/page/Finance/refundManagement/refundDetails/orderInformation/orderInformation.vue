<template>
  <div>
    <el-dialog title="订单信息" :visible.sync="dialogOrder" custom-class="city_list dialogOrder" style="margin-top:-100px;" width="1200px"
      @close="cancelOrder()">
      <div class="controlButton">
        <el-button class="ml13" @click="cancelOrder()">取 消</el-button>
      </div>
      <div class="border">
        <div class="matter">
          <div class="title"><u>新加坡斜坡滑车+空中吊椅索道滑车SkylineLuge景点门票（即定即用圣淘沙景点门票）</u></div>
          <div>
            <span class="fl red">订单总额:111.00</span>
            <span class="fl red ml30">已付金额:0.00</span>
          </div>
          <div>
            <table width="100%">
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">订单ID:</div>
                  <div class="fl ml13">{{refundList.id}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">团期计划:</div>
                  <div class="fl ml13">{{refundList.userName}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">下单时间:</div>
                  <div class="fl ml13">{{refundList.createTime}}</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">套餐:</div>
                  <div class="fl ml13">{{refundList.invoiceHeader}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">出发地:</div>
                  <div class="fl ml13">{{refundList.taxpayerIDNumber}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">目的地:</div>
                  <div class="fl ml13">{{refundList.tel}}</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">出发日期:</div>
                  <div class="fl ml13">{{refundList.tel}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">电话:</div>
                  <div class="fl ml13">{{refundList.tel}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">产品类型:</div>
                  <div class="fl ml13">{{refundList.tel}}</div>
                </td>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">联系人:</div>
                  <div class="fl ml13">{{refundList.cardNumber}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">数量:</div>
                  <div class="fl ml13">{{refundList.bankName}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">其他费用:</div>
                  <div class="fl ml13">{{refundList.bankName}}</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">整体优惠:</div>
                  <div class="fl ml13">{{refundList.cardNumber}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">销售:</div>
                  <div class="fl ml13">{{refundList.bankName}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">订单来源:</div>
                  <div class="fl ml13">{{refundList.bankName}}</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">优惠活动:</div>
                  <div class="fl ml13">{{refundList.cardNumber}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">操作:</div>
                  <div class="fl ml13">{{refundList.bankName}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">商户销售:</div>
                  <div class="fl ml13">{{refundList.bankName}}</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl fb">平台:</div>
                  <div class="fl ml13">{{refundList.cardNumber}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl fb">支付方式:</div>
                  <div class="fl ml13">{{refundList.bankName}}</div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="line"></div>
        <div class="matter">
          <div class="fl">
            <span class="point"></span>
            <span class="fl">预订不占</span>
          </div>
          <div class="fl ml30">
            <span class="fl">待确认剩余</span>
            <span class="fl red">23:00:00</span>
          </div>
          <div class="fr">
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
            <span class="fl cursor">退款</span>
            <span class="fl ml5">|</span>
            <span class="fl cursor">更多</span>
          </div>
        </div>
      </div>
      <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
        <el-table-column prop="" label="姓名" align="center"></el-table-column>
        <el-table-column prop="" label="报名类型" align="center"></el-table-column>
        <el-table-column prop="" label="电话" align="center"></el-table-column>
        <el-table-column prop="" label="身份证" align="center"></el-table-column>
        <el-table-column prop="" label="性别" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    orderID:0,
    orderVariable: 0,
    orderDialogType: 0
  },
  data() {
    return {
      dialogOrder:false,// 订单详情弹窗
      refundList:{},
      tableDate:[],
    };
  },
  watch: {
    orderVariable: function() {
      if (this.orderDialogType == 1) { // 订单详情
        setTimeout(() => {
          //this.getOrder(this.orderID);
        },200);
        this.dialogOrder = true;
      }
    },
  },
  created() {
  },
  methods: {
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
    getOrder(ID){

    },
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


