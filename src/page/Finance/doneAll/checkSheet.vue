<template>
  <div>
    <el-tabs v-model="tabSheetShowWhich" :tab-position="tabPosition">
      <el-tab-pane :label="'跟团游(' + approveCountSheetTeam +')'" name="sheetTeam">
        <check-sheet-team ref="sheetTeam" :whereSheetTab="whereSheetTab" @handlePassVal="approveTableDataSheet"></check-sheet-team>
      </el-tab-pane>
      <el-tab-pane :label="'周边游(' + approveCountSheetAround +')'" name="sheetAround">
        <check-sheet-around ref="sheetAround" :whereSheetTab="whereSheetTab" @handlePassVal="approveTableDataSheetAround"></check-sheet-around>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import checkSheetTeam from "./checkSheetTeam";
  import checkSheetAround from "./checkSheetAround";
  export default {
    name: "checkSheet",
    data() {
      return {
        tabPosition: 'left',
        tabSheetShowWhich: 'sheetTeam',
        approveCountSheetTeam:0,
        approveCountSheetAround:0,
        whereSheetTab:'sheetTeam',
      }
    },
    props:{
      whereTab: String
    },
    components: {
      checkSheetTeam,
      checkSheetAround
    },
    created() {
      this.tabSheetShowWhich = this.$store.state.doneAll.showSheetWhichTab
    },
    watch: {
      tabChange: function(val, oldVal){
        if(val === 'sheet'){
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
      },
      approveTableDataSheetAround(paramsPassCount){
        this.approveCountSheetAround = paramsPassCount
      }
    }
  }
</script>

<style scoped>

</style>
