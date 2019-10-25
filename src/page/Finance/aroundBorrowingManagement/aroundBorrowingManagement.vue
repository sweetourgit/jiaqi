<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="url_is">
      <el-tab-pane label="无收入借款" name="noIncomeBorrowing"></el-tab-pane>
      <el-tab-pane label="预付款管理" name="advancePaymentAround"></el-tab-pane>
      <el-tab-pane label="余额支付借款" name="balancePaymentBorrowing"></el-tab-pane>
      <el-tab-pane :label="'需要您审批（'+ (noIncomeNum + advanceNum + balanceNum) +'）'" name="pendingApproval"></el-tab-pane>
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
        noIncomeNum: 0,
        advanceNum: 0,
        balanceNum: 0
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
      },
      loadData(periphery_type){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/examinepage", {
          "pageIndex": this.currentPage,
          "pageSize": this.pageSize,
          "create_uid": '',
          "supplier_code": '',
          "start_at": '',
          "end_at": '',
          "periphery_type": periphery_type,
          "approval_status": '',
          "id": ""
        }, ).then(function(response) {
          if (response.data.code == '200') {
            if(periphery_type == 1){
              that.noIncomeNum = response.data.data.list.length;
            }else if(periphery_type == 2){
              that.advanceNum = response.data.data.list.length;
            }else if(periphery_type == 3){
              that.balanceNum = response.data.data.list.length;
            }
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal){
          if (val.path == "/aroundBorrowingManagement/noIncomeBorrowing"){
            this.activeName = "noIncomeBorrowing"
          }else if(val.path == "/aroundBorrowingManagement/advancePaymentAround"){
            this.activeName = "advancePaymentAround"
          }else if(val.path == "/aroundBorrowingManagement/balancePaymentBorrowing"){
            this.activeName = "balancePaymentBorrowing"
          }else if(val.path == "/aroundBorrowingManagement/pendingApproval"){
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
      }else if(this.$route.path == "/aroundBorrowingManagement/advancePaymentAround"){
        this.activeName = "advancePaymentAround"
      }else if(this.$route.path == "/aroundBorrowingManagement/balancePaymentBorrowing"){
        this.activeName = "balancePaymentBorrowing"
      }else if(this.$route.path == "/aroundBorrowingManagement/pendingApproval"){
        this.activeName = "pendingApproval"
      }

      // 加载待审批数量
      this.loadData(1);
      this.loadData(2);
      this.loadData(3);

    },
  };

</script>
<style scoped>
</style>
