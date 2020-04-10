<template>
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
  import allPane from './cruise_ship-components/components-allPane/allPane.vue'
  import minePane from './cruise_ship-components/conponents-minePane/minePane.vue'
  export default {
    components: {
      allPane,
      minePane
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        currentTab: "all",
        mineCount: 0 // 需要审批数量
      }
    },
    methods: {
      // 考虑了路由后退还原的情况
      init() {
        let {
          path
        } = this.$route;
        let query;
        if ("tab" in this.$route.query) {
          query = this.reappearConditions();
          this.$router.replace({
            path
          });
        }
        let {
          tab,
          conditions
        } = query || {};
        if (tab) this.currentTab = tab;
        this.$refs.allPaneRef.init(tab === "all" && conditions);
        this.$refs.minePaneRef.init();
      },

      // 分流query
      reappearConditions() {
        let {
          tab,
          conditions
        } = this.$route.query;
        return {
          tab,
          conditions: conditions && JSON.parse(conditions)
        };
      },

      tabClickHandler(tab) {
        // console.log(tab.name, this)
      }
    }
  }
</script>

<style>
</style>
