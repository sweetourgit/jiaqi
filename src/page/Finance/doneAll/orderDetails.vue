<template>
  <div>
    <el-dialog
      style="margin-top:-100px;" width="1200px"
      title="订单信息"
      :visible.sync="dialogOrder"
      custom-class="city_list dialogOrder"
      :show-close="false"
    >
      <div style="position: absolute; top: 8px; right: 10px;">
        <el-button type="warning" class="ml13" @click="cancelOrder()">取 消</el-button>
      </div>
      <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
      <div>
        <div class="item-content">
          <el-tag size="small" class="distributor-status">{{ orderList.name }}</el-tag>
          <el-tag type="success" size="small" class="distributor-status">
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
          </el-tag>
        </div>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">订单总额:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ orderList.payable | numFilter }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">已付金额:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ orderList.paid | numFilter }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="9"><div class="grid-del label-color">订单ID:</div></el-col>
            <el-col :span="15"><div class="grid-del">{{ orderList.orderCode }}</div></el-col>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">套餐:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ orderList.package }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">出发地:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ orderList.pod }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="9"><div class="grid-del label-color">目的地:</div></el-col>
            <el-col :span="15"><div class="grid-del ">{{ orderList.destination }}</div></el-col>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">出发日期:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ orderList.date }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">电话:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ orderList.contactTel }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="9"><div class="grid-del label-color">产品类型:</div></el-col>
            <el-col :span="15">
              <div class="grid-del">
                <div v-if="orderList.productType=='1'" class="fl ml13">跟团游</div>
                <div v-if="orderList.productType=='2'" class="fl ml13">自由行</div>
                <div v-if="orderList.productType=='3'" class="fl ml13">签证</div>
                <div v-if="orderList.productType=='4'" class="fl ml13">邮轮</div>
              </div>
            </el-col>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">联系人:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ orderList.contactName }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">数量:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ orderList.number }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="9"><div class="grid-del label-color">其他费用:</div></el-col>
            <el-col :span="15"><div class="grid-del">{{ orderList.otherPrice }}</div></el-col>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">整体优惠:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ orderList.entiretyFav }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">销售:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ orderList.indirectSale }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="9"><div class="grid-del label-color">订单来源:</div></el-col>
            <el-col :span="15">
              <div class="grid-del">
                <div v-if="orderList.orderChannel=='1'" class="fl ml13">同业</div>
                <div v-if="orderList.orderChannel=='2'" class="fl ml13">线上直客</div>
                <div v-if="orderList.orderChannel=='3'" class="fl ml13">线下直客</div>
              </div>
            </el-col>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">优惠活动:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{0}}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">操作:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ orderList.op }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="9"><div class="grid-del label-color">商户销售:</div></el-col>
            <el-col :span="15"><div class="grid-del">{{ orderList.saler }}</div></el-col>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">平台:</div></el-col>
            <el-col :span="17">
              <div class="grid-del">
                <div v-if="orderList.platform=='1'" class="fl ml13">ERP系统</div>
                <div v-if="orderList.platform=='2'" class="fl ml13">同业系统</div>
              </div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="7"><div class="grid-del label-color">支付方式:</div></el-col>
            <el-col :span="17"><div class="grid-del">{{ 0 }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="9"><div class="grid-del label-color"></div></el-col>
            <el-col :span="15"><div class="grid-del"></div></el-col>
          </el-col>
        </el-row>
      </div>
      <el-divider content-position="left" class='title-margin title-margin-t'>相关游客</el-divider>
      <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
        <el-table-column prop="cnName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="enrollName" label="报名类型" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="idCard" label="身份证" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "orderDetails",
    props: {
      orderID: 0,
      orderVariable: 0,
    },
    data() {
      return {
        dialogOrder: false,
        orderList: {},
        tableDate: [],
        orderRefundID: 0,
        orderRefund: 0,
        orderRefundDialog: 0,
      };
    },
    filters: {
      numFilter (value) {
        let realVal = parseFloat(value).toFixed(2)
        return realVal
      }
    },
    watch: {
      orderVariable: function() {
        setTimeout(() => {
          this.getOrder(this.orderID);
        },200);
        this.dialogOrder = true;
      },
    },
    created () {
    },
    methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
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
      margin-left: 44px;
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
