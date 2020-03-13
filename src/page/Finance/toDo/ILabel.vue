<!-- 一级tab页 -->
<template>
  <div>
    <el-tabs v-model="ITabShowWhich" @tab-click="handleClickILabel" style="width: 98%;margin: 20px auto;">
      <el-tab-pane :label="'无收入借款管理(' + approveDataNum +')'" name="borrow">
        <el-tabs v-model="IITabNoInShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameNoInTeam">

          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameNoInShip">

          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane :label="'预付款管理(' + approveDataNumAdvance +')'" name="advance">
        <!-- @handlePassVal="handleGetAlreadyNumAdvance" -->
        <el-tabs v-model="IITabNoInShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameNoInTeam">

          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameNoInShip">

          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane :label="'报销管理(' + approveDataNumReimburse +')'" name="reimburse">
        <el-tabs v-model="IITabNoInShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameNoInTeam">

          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameNoInShip">

          </el-tab-pane>
        </el-tabs>
<!--        <reimbursement :whereITab="whereITab"></reimbursement>-->
      </el-tab-pane>
      <el-tab-pane :label="'退款管理(' + approveDataNumRefund +')'" name="refund">
        <el-tabs v-model="IITabNoInShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameNoInTeam">

          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameNoInShip">

          </el-tab-pane>
        </el-tabs>
<!--        <refund :whereITab="whereITab"></refund>-->
      </el-tab-pane>
      <el-tab-pane :label="'报账单管理(' + 0 +')'" name="sheet">
        <el-tabs v-model="IITabNoInShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameNoInTeam">

          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameNoInShip">

          </el-tab-pane>
        </el-tabs>
<!--        <check-sheet :whereITab="whereITab"></check-sheet>-->
      </el-tab-pane>
      <el-tab-pane :label="'收款管理(' + allCount +')'" name="collection">
        <el-tabs v-model="IITabNoInShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameNoInTeam">

            <el-tabs v-model="ITabShowWhichw" @tab-click="handleClickILabel" style="width: 98%;margin: 20px auto;">
              <el-tab-pane :label="'无收入借(' + approveDataNum +')'" name="wborrow">
              </el-tab-pane>
              <el-tab-pane :label="'无收入借(' + approveDataNum +')'" name="222">
              </el-tab-pane>
            </el-tabs>

          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameNoInShip">

            <el-tabs v-model="ITabShowWh22ichw" @tab-click="handleClickILabel" style="width: 98%;margin: 20px auto;">
              <el-tab-pane :label="'无收入借(' + approveDataNum +')'" name="wborr222ow">
              </el-tab-pane>
              <el-tab-pane :label="'无收入借(' + approveDataNum +')'" name="22222">
              </el-tab-pane>
            </el-tabs>

          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: "ILabel",
    data(){
      return {
        ITabShowWhich: 'borrow',
        ITabShowWhichw: 'wborrow',
        ITabShowWh22ichw: 'wborr222ow',
        IITabNoInShowWhich: 'nameNoInTeam',
        approveDataNum: 1,
        approveDataNumAdvance: 1,
        approveDataNumReimburse: 1,
        approveDataNumRefund: 1,
        allCount: 1,
        whereITab: ''
      }
    },
    methods: {
      handleClickILabel(){

      },
      handleClickIILabel(){

      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
