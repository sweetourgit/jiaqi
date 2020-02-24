<template>
  <div>
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="跟团游">
        <check-sheet-table></check-sheet-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import checkSheetTable from "./checkSheetTable";
  export default {
    name: "checkSheet",
    data() {
      return {
        tabPosition: 'left'
      }
    },
    components:{
      checkSheetTable
    }
  }
</script>

<style scoped>

</style>
