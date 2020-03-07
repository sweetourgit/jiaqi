<!-- 收款tab下的子tab -->
<template>
  <div>
    <el-tabs v-model="tabCollectionShowWhich" :tab-position="tabPosition" @tab-click="handleClick">
      <el-tab-pane :label="'直客(' + approveCountDirect +')'" name="direct">
        <collection-direct ref="collectionDirect" :whereSheetTab="whereSheetTab" @handlePassVal="approveTableDataDirect"></collection-direct>
      </el-tab-pane>
      <el-tab-pane :label="'同业(' + approveCountSame +')'" name="same">
        <collection-same ref="collectionSame" :whereSheetTab="whereSheetTab" @handlePassVal="approveTableDataSame"></collection-same>
      </el-tab-pane>
      <el-tab-pane :label="'内部收款(' + approveCountInner +')'" name="inner">
        <collection-inner ref="collectionInner" :whereSheetTab="whereSheetTab" @handlePassVal="approveTableDataInner"></collection-inner>
      </el-tab-pane>
      <el-tab-pane :label="'报销还款(' + approveCountReimburse +')'" name="reimburse">
        <collection-reimburse ref="collectionReimburse" :whereSheetTab="whereSheetTab" @handlePassVal="approveTableDataTeam"></collection-reimburse>
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
        approveCountDirect: 0,
        approveCountSame: 0,
        approveCountInner: 0,
        approveCountReimburse: 0,
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
      this.tabCollectionShowWhich = this.$store.state.doneAll.collectionWhichTab
    },
    mounted() {
      // this.$refs.collectionDirect.getTableData()
    },
    components: {
      collectionDirect,
      collectionSame,
      collectionInner,
      collectionReimburse
    },
    watch: {
      tabChange: function(val, oldVal){
        if(val === 'collection'){
          Promise.all([
                                this.$refs.collectionDirect.getTableData(),
                                this.$refs.collectionSame.getTableData(),
                                this.$refs.collectionInner.getTableData(),
                                this.$refs.collectionReimburse.getTableData()
          ]).then((result) => {
            let collectionCount = 0
            result.forEach((item) => {
              collectionCount += item
            })
            this.$emit('handlePassVal', collectionCount)
          }).catch((error) => {
            console.log(error)
          })
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
      approveTableDataDirect(paramsPassCount){
        this.approveCountDirect = paramsPassCount
      },
      approveTableDataSame(paramsPassCount){
        this.approveCountSame = paramsPassCount
      },
      approveTableDataInner(paramsPassCount){
        this.approveCountInner = paramsPassCount
      },
      approveTableDataTeam(paramsPassCount){
        this.approveCountReimburse = paramsPassCount
      }
    }
  }
</script>

<style scoped>

</style>
