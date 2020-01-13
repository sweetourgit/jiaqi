<template>
  <div style="padding-bottom: 80px;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="跟团游" name="team"></el-tab-pane>
      <el-tab-pane label="周边游" name="around"></el-tab-pane>
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
  mounted(){
    this.handleClick({ name: 'team' })
  },
  methods: {
    handleClick(tab, event) {
      let { name }= tab;
      let { query }= this.$route;
      this.$router.replace({ path: `/checkSheet/${name}`, query });
    },
    getTabNameFromPath(path){
      return path.substring(12);
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        this.activeName= this.getTabNameFromPath(val.path);
      },
      // 深度观察监听
      deep: true,
      immediate: true
    }
  }
};

</script>