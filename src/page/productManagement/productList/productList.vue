<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="url_is">
      <el-tab-pane label="跟团游" name="1"></el-tab-pane>
      <el-tab-pane label="景区/票务" name="2"></el-tab-pane>
      <el-tab-pane label="签证" name="3"></el-tab-pane>
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
          this.$router.push({ path: "/productList/packageTour" }); // 跟团游
        } else if (tab.name == 2) {
          this.$router.push({ path: "/productList/scenicOrTicketList" }); // 景区/票务
        } else if (tab.name == 3) {
          this.$router.push({ path: "/productList/productVisa" }); // 签证
        }
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal){
          if (val.path == "/productList/scenicOrTicketList"){ // 景区/票务
            this.activeName = "2"
          }else if(val.path == "/productList/packageTour"){ // 跟团游
            this.activeName = "1"
          }else if(val.path == "/productList/productVisa"){ // 签证
            this.activeName = "3"
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    created() {
      if (this.$route.path == "/productList/scenicOrTicketList"){ // 景区/票务
        this.activeName = "2"
      }else if(this.$route.path == "/productList/packageTour"){ // 跟团游
        this.activeName = "1"
      }else if(this.$route.path == "/productList/productVisa"){ // 签证
        this.activeName = "3"
      }
    },
  };

</script>
<style scoped>
</style>
