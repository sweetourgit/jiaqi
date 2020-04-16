<template>
  <!--
    更新备忘录
    store 文件（返回列表页展示固定的tab）

  -->

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
      <el-tab-pane :label="'退款管理(' + approveDataNumRefund +')'" name="refund">
        <refund :whereTab="whereTab" @handlePassVal="handleGetAlreadyNumRefund"></refund>
      </el-tab-pane>
      <el-tab-pane :label="'报账单管理(' + sheetCountTotal +')'" name="sheet">
<!--        <check-sheet :whereTab="whereTab" @handleSheetPassVal="handleGetAlreadyNumSheet"></check-sheet>       -->
        <check-sheet :whereTab="whereTab"></check-sheet>
      </el-tab-pane>
      <el-tab-pane :label="'收款管理(' + allCount +')'" name="collection">
        <collection :whereTab="whereTab" @handlePassVal="handleGetAlreadyNumCollection"></collection>
      </el-tab-pane>
      <el-tab-pane :label="'周边借款管理(' + totalBorrowing +')'" name="borrowing">
        <borrowing :whereTab="whereTab" @handlePassVal="handleGetAlreadyNumBorrowing"></borrowing>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import noIn from './noIn'
  import advance from './advance'
  import reimbursement from './reimbursement'
  import refund from './refund'
  import checkSheet from './checkSheet'
  import collection from './collection'
  import borrowing from './aroundBorrowing/borrowing'
  export default {
    name: "approveList",
    components: {
      noIn,
      advance,
      refund,
      reimbursement,
      checkSheet,
      collection,
      borrowing
    },
    data(){
      return{
        whereTab:'borrow',
        approveDataNum:0,
        approveDataNumAdvance:0,
        approveDataNumReimburse:0,
        approveDataNumRefund:0,
        approveDataNumSheet:0,
        approveDataNumCollection:0,
        approveDataNumBorrowing:0,
        tabShowWhich: 'borrow',
      }
    },
    created(){
      this.tabShowWhich = this.$store.state.doneAll.doneAllShowWhichTab
    },
    computed: {
      allCount: function () {
        return (this.$store.state.doneAll.collectionNumDirect + this.$store.state.doneAll.collectionNumSame + this.$store.state.doneAll.collectionNumInner + this.$store.state.doneAll.collectionNumReimburse)
      },

      sheetCountTotal: function () {
        return (this.$store.state.doneAll.sheetCount + this.$store.state.doneAll.sheetAroundCount)
      },

      totalBorrowing: function () {
        return (this.$store.state.doneAll.borrowAroundNoIncomeNum + this.$store.state.doneAll.borrowAroundAdvanceNum + this.$store.state.doneAll.borrowAroundBalanceNum)
      }
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
      },
      handleGetAlreadyNumRefund(paramsPassCount){
        this.approveDataNumRefund = paramsPassCount
      },
      handleGetAlreadyNumCollection(paramsPassCount){
        this.approveDataNumCollection = paramsPassCount
      },
      handleGetAlreadyNumBorrowing(paramsPassCount){
        this.approveDataNumBorrowing = paramsPassCount
      }
     /* handleGetAlreadyNumSheet(paramsPassCount){
        this.approveDataNumSheet = paramsPassCount
      }*/
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
