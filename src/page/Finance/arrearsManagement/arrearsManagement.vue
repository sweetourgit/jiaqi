<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="欠款列表" name="1"></el-tab-pane>
      <el-tab-pane label="供应商欠款" name="2"></el-tab-pane>
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
        this.$router.push({ path: "/arrearsManagement/arrearsList" });
      } else if (tab.name == 2) {
        this.$router.push({ path: "/arrearsManagement/supplierArrears" });
      }
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        if (val.path == "/arrearsManagement/supplierArrears"){
          this.activeName = "2"
        }else if(val.path == "/arrearsManagement/arrearsList"){
          this.activeName = "1"
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    if (this.$route.path == "/arrearsManagement/supplierArrears") {
      this.activeName = "2"
    }
  },
};

</script>
<style scoped>
</style>