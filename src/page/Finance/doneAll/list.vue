<template>
  <div class="distributor-content">
    <el-tabs v-model="tabShowWhich" @tab-click="handleClick" style="width: 98%;margin: 20px auto;">
      <el-tab-pane :label="'无收入借款管理(' + approveDataNum +')'" name="borrow">
        <noIn :whereTab="whereTab" @handlePassVal="handleGetAlreadyNumNoin"></noIn>
      </el-tab-pane>
      <el-tab-pane :label="'预付款管理(' + approveDataNumAdvance +')'" name="advance">
        <advance :whereTab="whereTab" @handlePassVal="handleGetAlreadyNumAdvance"></advance>
      </el-tab-pane>
      <el-tab-pane :label="'报销管理(' + approveDataNumReimburse +')'" name="reimburse">
        <reimbursement :whereTab="whereTab" @handlePassVal="handleGetAlreadyNumReimburse"></reimbursement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import noIn from './noIn'
  import advance from './advance'
  import reimbursement from './reimbursement'
  export default {
    name: "approveList",
    components: {
      noIn,
      advance,
      reimbursement
    },
    data(){
      return{
        whereTab:'borrow',
        approveDataNum:0,
        approveDataNumAdvance:0,
        approveDataNumReimburse:0,
        tabShowWhich: 'borrow',
      }
    },
    created(){

    },
    computed: {

    },
    methods: {
      handleClick(tab, event) {
        this.whereTab = tab.name
      },
      handleGetAlreadyNumNoin(paramsPassCount){
        this.approveDataNum = paramsPassCount
      },
      handleGetAlreadyNumAdvance(paramsPassCount){
        this.approveDataNumAdvance = paramsPassCount
      },
      handleGetAlreadyNumReimburse(paramsPassCount){
        this.approveDataNumReimburse = paramsPassCount
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
