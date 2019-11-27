<style lang="scss" scoped>

</style>

<template>
  <div class="check-sheet">
    <el-tabs 
      v-model="currentTab"
      @tab-click="tabClickHandler">
      <el-tab-pane label="报账单" name="all">
        <all-pane 
          ref="allPaneRef">
        </all-pane>
      </el-tab-pane>
      <el-tab-pane :label="'需要您审批（'+ mineCount +'）'" name="mine">
        <mine-pane 
          ref="minePaneRef">
        </mine-pane>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCheckSheetList } from './api'
import allPane from './comps/allPane/allPane'
import minePane from './comps/minePane/minePane'

export default {
  components: { allPane, minePane },

  mounted(){
    this.init();
  },

  data(){
    return Object.assign(
      // 视图
      {
        currentTab: 'all',
        mineCount: 0, // 需要审批数量
      }
    )
  },

  methods: Object.assign(
    {
      // 考虑了路由后退还原的情况
      init(){
        let query;
        if('tab' in this.$route.query){
          query= this.reappearConditions();
          this.$router.replace('/checkSheet');
        }
        let { tab, conditions, pageInfo }= query || {};
        if(tab) this.currentTab= tab;
        this.$refs.allPaneRef.init(tab=== 'all' && { conditions, pageInfo });
        this.$refs.minePaneRef.init(tab=== 'mine' && { conditions, pageInfo });
      },

      // 分流query
      reappearConditions(){
        let { tab, groupCode, userName, teamProTitle, beginTime, endTime, pageIndex, pageSize, total }= this.$route.query;
        let conditions= {
          groupCode, userName, teamProTitle, beginTime, endTime
        }
        let pageInfo= {
          pageIndex, pageSize, total
        }
        return { tab, conditions, pageInfo }
      },

      tabClickHandler(tab){
        console.log(tab.name, this)
      }  
    }
  )

}
</script>