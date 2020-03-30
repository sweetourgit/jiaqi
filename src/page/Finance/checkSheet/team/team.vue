<template>
<!--   //跟团游 去掉待审批 -->
  <!-- <div class="check-sheet">
    <all-pane ref="allPaneRef"></all-pane>
  </div>-->
  <div class="check-sheet">
    <el-tabs v-model="currentTab" @tab-click="tabClickHandler">
      <el-tab-pane label="报账单" name="all">
        <all-pane ref="allPaneRef"></all-pane>
      </el-tab-pane>
      <el-tab-pane :label="'需要您审批（'+ mineCount +'）'" name="mine">
        <mine-pane ref="minePaneRef" @mine-count="mineCount= $event"></mine-pane>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCheckSheetList, getFlowModel } from "./api";
import allPane from "./comps/allPane/allPane";
import minePane from "./comps/minePane/minePane";

export default {
  components: { allPane, minePane },
    //跟团游 去掉待审批
  // components: { allPane },

  mounted() {
    this.init();
  },

  data() {
    return Object.assign(
      // 视图
      {
        currentTab: "all",
        mineCount: 0 // 需要审批数量
      }
    );
  },

  methods: Object.assign({
    // 考虑了路由后退还原的情况
    init() {
      let { path } = this.$route;
      let query;
      if ("tab" in this.$route.query) {
        query = this.reappearConditions();
        this.$router.replace({ path });
      }
      let { tab, conditions } = query || {};
      if (tab) this.currentTab = tab;
      this.$refs.allPaneRef.init(tab === "all" && conditions);
      this.$refs.minePaneRef.init();
    },

    // 分流query
    reappearConditions() {
      let { tab, conditions } = this.$route.query;
      return { tab, conditions: conditions && JSON.parse(conditions) };
    },

    tabClickHandler(tab) {
      // console.log(tab.name, this)
    }
  })
};
</script>