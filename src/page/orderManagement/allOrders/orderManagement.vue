<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="跟团游" name="1"></el-tab-pane>
      <el-tab-pane label="签证" name="2"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: '1',
    };
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == 1) {
        this.$router.push({ path: "/orderManagement/orderList" });
      } else if (tab.name == 2) {
        this.$router.push({ path: "/orderManagement/visaOrderlist" });
      }
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        if (val.path == "/orderManagement/visaOrderlist"){
          this.activeName = "2"
        }else if(val.path == "/orderManagement/orderList"){
          this.activeName = "1"
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    if (this.$route.path == "/orderManagement/visaOrderlist") {
      this.activeName = "2"
    }
  },
};

</script>
<style scoped>
</style>
