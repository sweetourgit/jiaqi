<!-- 已办列表页 -->
<template>
  <div class="distributor-content">
    <el-tabs v-model="tabShowWhich" @tab-click="handleClick" style="width: 98%;margin: 20px auto;">
      <el-tab-pane :label="'无收入借款管理(' + approveDataNum +')'" name="borrow">
        <noIn :whereTab="whereTab" @handlePassVal="handleGetAlreadyNum"></noIn>
      </el-tab-pane>
      <el-tab-pane label="预付款管理" name="advance">
        <noIn :whereTab="whereTab"></noIn>
      </el-tab-pane>
      <el-tab-pane label="报销管理" name="reimburse">
        <reimbursement></reimbursement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import noIn from './noIn'
  import reimbursement from './reimbursement'
  export default {
    name: "approveList",
    components: {
      noIn,
      reimbursement
    },
    data(){
      return{
        whereTab:'borrow',
        approveDataNum:0,
        tabShowWhich: 'borrow', // 显示哪一个tab
      }
    },
    created(){

    },
    computed: {

    },
    methods: {
      // tab切换
      handleClick(tab, event) {
        this.whereTab = tab.name
        // console.log(tab.name);
      },
      handleGetAlreadyNum(paramsPassCount){
        console.log(paramsPassCount)
        this.approveDataNum = paramsPassCount
      }
    }
  }
</script>

<style scoped lang="scss">
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    .plan{
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .time{
        margin: 0 0 0 10px;
      }
      .fl{
        float:left;
        margin: 20px 0 20px 0;
      }
    }
    #table-content{
      width: 98%;
      margin: 40px auto 10px;
    }
  }
</style>
