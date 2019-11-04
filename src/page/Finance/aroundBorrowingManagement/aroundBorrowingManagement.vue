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
      // 加载待审批数量（-1，-1 目前看可以获取全部）
      loadData(loan){
        const that = this;
        this.$http.post(this.GLOBAL.jqUrl + "/ZB/GettingUnfinishedTasksForZB", {
          "userCode": sessionStorage.getItem('userCode'),
//          "userCode": "zb1",
          "startTime": "1970-07-23T01:30:54.452Z",
          "endTime": new Date(),
          "startIndex": -1,
          "endIndex": -1,
          "workflowCode": loan
        }, ).then(function(response) {
          console.log('获取未完成任务数量', response);
//          alert(response.data.length);

          if(loan === 'NoIncomeLoan_ZB'){
            that.noIncomeNum = response.data.length;
          }else if(loan === 'IncomeLoan_ZB'){
            that.advanceNum = response.data.length;
          }else if(loan === 'BalancePayment_ZB'){
            that.balanceNum = response.data.length;
          }
          // 赋值代码
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
      this.loadData('NoIncomeLoan_ZB');
      this.loadData('IncomeLoan_ZB');
      this.loadData('BalancePayment_ZB');

    },
  };

</script>
<style scoped>
</style>
