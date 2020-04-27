<template>
  <div>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="退款记录" name="first">
      <refundRecord></refundRecord>
    </el-tab-pane>
    <el-tab-pane :label="examine + msg" name="second">
      <refundApproval v-on:headCallBack="headCall"></refundApproval>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import refundRecord from '@/page/Finance/refundManagement/refundRecord'
import refundApproval from '@/page/Finance/refundManagement/refundApproval'
export default {
  name:"refundManagement",
  components:{
    refundRecord,
    refundApproval
  },
  data() {
    return {
      activeName: 'first',
      examine:'需要您审批',
      msg:'',
    };
  },
  created() {
  },
  methods: {
     handleClick(tab, event) {
      console.log(tab, event);
     },
     headCall: function (msg) { 
      this.msg = '(' + msg + ')';
     }
  }
};
</script>

<style scoped lang="scss">

</style>


