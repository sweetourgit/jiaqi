<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="url_is">
      <el-tab-pane label="可认款报账" name="canRecognition"></el-tab-pane>
      <el-tab-pane label="未认收款" name="noRecognition"></el-tab-pane>
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
        }
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal){
          if (val.path == "/externalOrderList/canRecognition"){
            this.activeName = "canRecognition"
          }else if(val.path == "/externalOrderList/noRecognition"){
            this.activeName = "noRecognition"
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    created() {
      
      if (this.$route.path == "/externalOrderList/noRecognition"){
        this.activeName = "noRecognition"
      }
    },
  };

</script>
<style scoped>
</style>
