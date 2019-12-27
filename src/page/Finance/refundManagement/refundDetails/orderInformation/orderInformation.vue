<template>
  <div>
    <el-dialog title="订单信息" :visible.sync="dialogOrder" custom-class="city_list dialogOrder" style="margin-top:-100px;" width="1200px"
      @close="cancelOrder()">
      <div class="controlButton">
        <el-button class="ml13" @click="cancelOrder()">取 消</el-button>
        <el-button class="ml13" type="primary">撤 销</el-button>
      </div>

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
    cancelOrder(){
      this.dialogOrder = false;
    },
  }
};
</script>

<style scoped lang="scss">

</style>


