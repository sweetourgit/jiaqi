<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="url_is">
      <el-tab-pane label="跟团游" name="1"></el-tab-pane>
      <el-tab-pane label="景区/票务" name="2"></el-tab-pane>
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
      }
    }
  },
  created() {
    if (this.$route.path == "/regimentPlan/scenicTicketingList") {
      this.activeName = "2"
    }
  },
};

</script>
<style scoped>
</style>
