<template>
  <div class="vivo" style="position:relative">
    <el-tabs v-model="activeName">
      <el-tab-pane label="借款" name="first">
        <borrowing></borrowing>
      </el-tab-pane>
       <el-tab-pane :label="examine + msg" name="second">
        <approvalToBorrow v-on:headCallBack="headCall"></approvalToBorrow>
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
        examine:'需要您审批',
        msg:'',

      }
    },
    methods: {
      headCall: function (msg) { //回调方法，接收子组件传的参数
        this.msg = '(' + msg + ')';
      }

    }
  }
</script>
<style scoped>
.el-tabs>>>.el-tabs__header{margin: 0 !important;}
</style>
