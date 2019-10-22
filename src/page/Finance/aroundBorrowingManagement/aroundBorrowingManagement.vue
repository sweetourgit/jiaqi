<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="url_is">
      <el-tab-pane label="无收入借款" name="noIncomeBorrowing"></el-tab-pane>
      <el-tab-pane label="预付款管理" name="advancePaymentAround"></el-tab-pane>
      <el-tab-pane label="余额支付借款" name="balancePaymentBorrowing"></el-tab-pane>
      <el-tab-pane label="需要您审批" name="pendingApproval"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'noIncomeBorrowing',
        url_is: true,
      };
    },
    methods: {
      handleClick(tab, event) {
        if (tab.name == 'noIncomeBorrowing') {
          this.$router.push({ path: "/aroundBorrowingManagement/noIncomeBorrowing" });
        } else if (tab.name == 'advancePaymentAround') {
          this.$router.push({ path: "/aroundBorrowingManagement/advancePaymentAround" });
        } else if (tab.name == 'balancePaymentBorrowing') {
          this.$router.push({ path: "/aroundBorrowingManagement/balancePaymentBorrowing" });
        } else if (tab.name == 'pendingApproval') {
          this.$router.push({ path: "/aroundBorrowingManagement/pendingApproval" });
        }
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal){
          if (val.path == "/aroundBorrowingManagement/noIncomeBorrowing"){
            this.activeName = "noIncomeBorrowing"
          }else if(val.path == "/externalOrderList/advancePaymentAround"){
            this.activeName = "advancePaymentAround"
          }else if(val.path == "/externalOrderList/balancePaymentBorrowing"){
            this.activeName = "balancePaymentBorrowing"
          }else if(val.path == "/externalOrderList/pendingApproval"){
            this.activeName = "pendingApproval"
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    created() {
      if (this.$route.path == "/aroundBorrowingManagement/noIncomeBorrowing"){
        this.activeName = "noIncomeBorrowing"
      }
    },
  };

</script>
<style scoped>
</style>
