<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="url_is">
      <el-tab-pane label="可认款报账" name="canRecognition"></el-tab-pane>
      <el-tab-pane label="未认收款" name="noRecognition"></el-tab-pane>
      <el-tab-pane label="无成本" name="noCost"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'canRecognition',
        url_is: true,
      };
    },
    methods: {
      handleClick(tab, event) {
        if (tab.name == 'canRecognition') {
          this.$router.push({ path: "/externalOrderList/canRecognition" });
        } else if (tab.name == 'noRecognition') {
          this.$router.push({ path: "/externalOrderList/noRecognition" });
        } else if (tab.name == 'noCost') {
          this.$router.push({ path: "/externalOrderList/noCost" });
        }
      }
    },
    created() {
      if (this.$route.path == "/externalOrderList/noRecognition"){
        this.activeName = "noRecognition"
      }else if(this.$route.path == "/externalOrderList/noCost"){
        this.activeName = "noCost"
      }
    },
  };

</script>
<style scoped>
</style>
