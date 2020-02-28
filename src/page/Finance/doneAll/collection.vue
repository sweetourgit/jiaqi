<template>
  <div>
    <el-tabs v-model="tabCollectionShowWhich" :tab-position="tabPosition" @tab-click="handleClick">
      <el-tab-pane :label="'直客(' + approveCountSheetTeam +')'" name="direct">
        <collection-direct ref="collectionDirect" :whereSheetTab="whereSheetTab" @handlePassVal="approveTableDataSheet"></collection-direct>
      </el-tab-pane>
      <el-tab-pane :label="'同业(' + approveCountSheetTeam +')'" name="same">
        <collection-same ref="collectionSame" :whereSheetTab="whereSheetTab" @handlePassVal="approveTableDataSheet"></collection-same>
      </el-tab-pane>
      <el-tab-pane :label="'内部收款(' + approveCountSheetTeam +')'" name="inner">
        <collection-inner ref="collectionInner" :whereSheetTab="whereSheetTab" @handlePassVal="approveTableDataSheet"></collection-inner>
      </el-tab-pane>
      <el-tab-pane :label="'报销还款(' + approveCountSheetTeam +')'" name="reimburse">
        <collection-reimburse ref="collectionReimburse" :whereSheetTab="whereSheetTab" @handlePassVal="approveTableDataSheet"></collection-reimburse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import collectionDirect from "./collectionDirect";
  import collectionSame from "./collectionSame";
  import collectionInner from "./collectionInner";
  import collectionReimburse from "./collectionReimburse";
  export default {
    name: "collection",
    data() {
      return {
        tabCollectionShowWhich: 'direct',
        tabPosition: 'left',
        approveCountSheetTeam:0,
        whereSheetTab:'direct',
      }
    },
    props:{
      whereTab: String
    },
    created() {
      this.tabCollectionShowWhich = this.$store.state.collectionWhichTab
      console.log()
    },
    components: {
      collectionDirect,
      collectionSame,
      collectionInner,
      collectionReimburse
    },
    watch: {
      tabChange: function(val, oldVal){
        if(val === 'sheet'){
          console.log(val)
        }
      }
    },
    computed: {
      tabChange: function () {
        return this.whereTab
      }
    },
    methods: {
      handleClick(tab, event) {
        let keepTabName = tab.name
        this.whereSheetTab = keepTabName
        if( keepTabName == 'direct'){
          this.$refs.collectionDirect.getTableData()
        }else if (keepTabName == 'same'){
          this.$refs.collectionSame.getTableData()
        } else if(keepTabName == 'inner') {
          this.$refs.collectionInner.getTableData()
        } else if(keepTabName == 'reimburse') {
          this.$refs.collectionReimburse.getTableData()
        }else {}
      },
      approveTableDataSheet(paramsPassCount){
        console.log(paramsPassCount)
        this.approveCountSheetTeam = paramsPassCount
      }
    }
  }
</script>

<style scoped>

</style>
