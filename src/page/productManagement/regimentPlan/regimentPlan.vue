<template>
  <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="跟团游" name="1"></el-tab-pane>
      </el-tabs>
      <router-view></router-view>
  </div>
</template>

<script>
export default {
    data() {
      return {
        activeName: '1'
      };
    },
    methods: {
      handleClick(tab, event) {
        if(tab.name==1){
          this.$router.push({path: "/regimentPlan/teamPlanList"});
        }
      }
    }
  };
</script>

<style scoped>

</style>