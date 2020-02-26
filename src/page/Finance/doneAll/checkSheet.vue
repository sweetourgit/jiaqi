<template>
  <div>
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane :label="'跟团游(' + approveCountSheetTeam +')'">
        <check-sheet-team ref="sheetTeam" :whereSheetTab="whereSheetTab" @handlePassVal="approveTableDataSheet"></check-sheet-team>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import checkSheetTeam from "./checkSheetTeam";
  export default {
    name: "checkSheet",
    data() {
      return {
        tabPosition: 'left',
        approveCountSheetTeam:0,
        whereSheetTab:'borrow',
      }
    },
    props:{
      whereTab: String
    },
    components: {
      checkSheetTeam
    },
    watch: {
      tabChange: function(val, oldVal){
        if(val === 'sheet'){
          console.log(val)
          this.$refs.sheetTeam.approveTableList(val)
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
        this.whereSheetTab = tab.name
      },
      approveTableDataSheet(paramsPassCount){
        this.approveCountSheetTeam = paramsPassCount
      }
    }
  }
</script>

<style scoped>

</style>
