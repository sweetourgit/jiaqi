<template>
  <div id="outDiv" :style="{'minHeight':height+'px'}">
    <el-container style="height:100%;">
      <el-header>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="跟团游" name="team"></el-tab-pane>
          <el-tab-pane label="周边游" name="around"></el-tab-pane>
        </el-tabs>
      </el-header>
      <!-- 只有周边游组件下会生成报账单 需要您审批 -->
      <AroundLayout v-show="activeName=='around'" :parentHeight="height"></AroundLayout>
      <el-main v-show="activeName!='around'">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import AroundLayout from "./components/aroundLayout.vue";
export default {
  components: {
    AroundLayout
  },
  data() {
    return {
      activeName: "1",
      height: 1
    };
  },
  mounted() {
    this.height =
      document.getElementById("outDiv").parentElement.offsetHeight - 30;
    this.handleClick({ name: "team" });
  },
  methods: {
    handleClick(tab, event) {
      let { name } = tab;
      let { query } = this.$route;
      this.$router.replace({ path: `/checkSheet/${name}`, query });
    },
    getTabNameFromPath(path) {
      return path.substring(12);
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        this.activeName = this.getTabNameFromPath(val.path);
      },
      // 深度观察监听
      deep: true,
      immediate: true
    }
  }
};
</script>