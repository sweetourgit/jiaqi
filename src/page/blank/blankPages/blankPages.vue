<template>
  <div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  created() {
    this.getOrder()
  },
  methods: {
    getOrder(){ // 点击退款获取详情信息
      this.$http.post(this.GLOBAL.server + "/finance/refund/api/insertebs", {
        "refundID": 4,
        "accountID": 14
      }).then(res => {

        }
      );
      
      
    },
  }
};
</script>

<style scoped lang="scss">

</style>


