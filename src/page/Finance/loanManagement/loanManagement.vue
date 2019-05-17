<template>
  <div class="vivo" style="position:relative">
    <el-tabs v-model="activeName">
      <el-tab-pane label="借款" name="first">
        <borrowing></borrowing>
      </el-tab-pane>
       <el-tab-pane label="需要您审批的" name="second">
        <approvalToBorrow></approvalToBorrow>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>




<script>
import borrowing from '@/page/Finance/loanManagement/borrowing'
import approvalToBorrow from '@/page/Finance/loanManagement/approvalToBorrow'
  export default {
  	name: "loanManagement",
	  components: {
	    borrowing,
	    approvalToBorrow
	  },
    data(){
      return {
      	activeName: 'first',


      }
    },
    methods: {
      

    }
  }
</script>
<style scoped>
.el-tabs>>>.el-tabs__header{margin: 0 !important;}
</style>
