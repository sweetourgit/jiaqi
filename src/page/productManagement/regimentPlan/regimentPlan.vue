<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="url_is">
      <el-tab-pane label="跟团游" name="1"></el-tab-pane>
      <el-tab-pane label="景区/票务" name="2"></el-tab-pane>
      <el-tab-pane label="签证" name="3"></el-tab-pane>
      <el-tab-pane label="游轮" name="4"></el-tab-pane>
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
        this.$router.push({ path: "/regimentPlan/teamPlanList" });
      } else if (tab.name == 2) {
        this.$router.push({ path: "/regimentPlan/scenicTicketingList" });
      }else if (tab.name == 3) {
        this.$router.push({ path: "/regimentPlan/visaOrderList" });
      }else if (tab.name == 4) {
        this.$router.push({ path: "/regimentPlan/visaOrderList" });
      }
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        if (val.path == "/regimentPlan/scenicTicketingList"){
          this.activeName = "2"
        }else if(val.path == "/regimentPlan/teamPlanList"){
          this.activeName = "1"
        }else if(val.path == "/regimentPlan/visaOrderList"){
          this.activeName = "3"
        }else if(val.path == "/regimentPlan/liner"){
          this.activeName = "4"
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    if (this.$route.path == "/regimentPlan/scenicTicketingList") {
      this.activeName = "2"
    }
    if (this.$route.path == "/regimentPlan/visaOrderList") {
      this.activeName = "3"
    }
    if (this.$route.path == "/regimentPlan/liner") {
      this.activeName = "4"
    }
  },
};

</script>
<style scoped>
</style>
