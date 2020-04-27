<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="url_is">
      <el-tab-pane label="商户欠款订单" name="1"></el-tab-pane>
      <el-tab-pane label="分销商欠款订单" name="2"></el-tab-pane>
       <el-tab-pane label="供应商欠款订单" name="3"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: '1',
      url_is: true,
    };
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == 1) {
        this.$router.push({ path: "/balanceOrder/commercia" }); //商户
      } else if (tab.name == 2) {
        this.$router.push({ path: "/balanceOrder/distribution" }); // 分销
      }else if (tab.name == 3) {
        this.$router.push({ path: "/balanceOrder/supplier" }); //供应商 
      }
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        if (val.path == "/balanceOrder/commercia"){
          this.activeName = "1"
        }else if(val.path == "/balanceOrder/distribution"){
          this.activeName = "2"
        }else if(val.path == "/balanceOrder/supplier"){
          this.activeName = "3"
        }
      },
      deep: true
    }
  },
  created() {
    if (this.$route.path == "/balanceOrder/distribution") {
      this.activeName = "2"
    }else if (this.$route.path == "/balanceOrder/supplier") {
      this.activeName = "3"
    }
  },
};

</script>
<style scoped>
</style>
