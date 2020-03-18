<!--
  根组件tab
  I - 一级tab;
  II - 二级tab;
-->
<template>
  <div>
    <el-tabs v-model="tabIShowWhich" @tab-click="handleClickILabel" style="width: 98%;margin: 20px auto;">
      <!-- 无收入 -->
      <el-tab-pane :label="'无收入借款管理(' + approveDataNum +')'" name="nameINoIn">
        <el-tabs v-model="tabIINoInShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameIINoInTeam">
            <team-table :whichTab="whichTab" ref="noInDom"></team-table>
          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameIINoInShip">

          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <!-- 无收入 END -->
      <!-- 预付款 -->
      <el-tab-pane :label="'预付款管理(' + approveDataNumAdvance +')'" name="nameIAdvance">
        <el-tabs v-model="tabIIAdvanceShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameIIAdvanceTeam">
            <team-table :whichTab="whichTab" ref="advanceDom"></team-table>
          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameIIAdvanceShip">

          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <!-- 预付款 END -->
      <!-- 报销 -->
      <el-tab-pane :label="'报销管理(' + approveDataNumReimburse +')'" name="nameIReimburse">
        <el-tabs v-model="tabIIReimburseShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameIIReimburseTeam">
            <team-table :whichTab="whichTab" ref="reimburseDom"></team-table>
          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameIIReimburseShip">

          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <!-- 报销 END -->
      <!-- 退款管理 -->
      <el-tab-pane :label="'退款管理(' + approveDataNumRefund +')'" name="nameIRefund">
        <el-tabs v-model="tabIIRefundShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameIIRefundTeam">
            <team-table :whichTab="whichTab" ref="refundDom">></team-table>
          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameIIRefundShip">

          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <!-- 退款管理 END -->
      <!-- 报账单管理 -->
      <el-tab-pane :label="'报账单管理(' + 0 +')'" name="nameISheet">
        <el-tabs v-model="tabIISheetShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameIISheetTeam">
            <team-table :whichTab="whichTab" ref="sheetDom"></team-table>
          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameIISheetShip">

          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <!-- 报账单管理 -->
      <!-- 收款管理 -->
      <el-tab-pane :label="'收款管理(' + allCount +')'" name="nameICollection">
        <el-tabs v-model="tabIICollectionShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameIICollectionTeam">
            <el-tabs v-model="tabIIICollectionTeamShowWhich" @tab-click="handleClickILabel" style="width: 98%;margin: 20px auto;">
              <el-tab-pane :label="'直客(' + approveDataNum +')'" name="nameIIICollectionTeamDirect">
              </el-tab-pane>
              <el-tab-pane :label="'同业(' + approveDataNum +')'" name="nameIIICollectionTeamSame">
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameIICollectionShip">
            <el-tabs v-model="tabIIICollectionShipShowWhich" @tab-click="handleClickILabel" style="width: 98%;margin: 20px auto;">
              <el-tab-pane :label="'直客(' + approveDataNum +')'" name="nameIIICollectionShipDirect">
              </el-tab-pane>
              <el-tab-pane :label="'同业(' + approveDataNum +')'" name="nameIIICollectionShipSame">
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <!-- 收款管理 END -->
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import teamTable from "./team/teamTable";

  export default {
    name: "ILabel",
    data(){
      return {
        tabIShowWhich: 'nameINoIn',
        tabIIAdvanceShowWhich: 'nameIIAdvanceTeam',
        tabIIReimburseShowWhich: 'nameIIReimburseTeam',
        tabIIRefundShowWhich: 'nameIIRefundTeam',
        tabIISheetShowWhich: 'nameIISheetTeam',
        tabIIICollectionTeamShowWhich: 'nameIIICollectionDirect',
        tabIIICollectionShipShowWhich: 'nameIIICollectionShipDirect',
        tabIICollectionShowWhich: 'nameIICollectionTeam',
        tabIINoInShowWhich: 'nameIINoInTeam',
        approveDataNum: 1,
        approveDataNumAdvance: 1,
        approveDataNumReimburse: 1,
        approveDataNumRefund: 1,
        allCount: 1,
        whichTab: 'nameINoIn'
      }
    },
    components: {
      // 除收款外，跟团的所有类别的列表
      teamTable
    },
    created() {

    },
    mounted() {
      // 初始化加载所有tab下的表格数据，不能写在teamTable里面，否则会被调用多次
      this.$refs.noInDom.pendingApprovalTable('nameIINoInTeam')
      this.$refs.advanceDom.pendingApprovalTable('nameIIAdvanceTeam')
      this.$refs.reimburseDom.pendingApprovalTable('nameIIReimburseTeam')
      this.$refs.refundDom.pendingApprovalTable('nameIIRefundTeam')
      this.$refs.sheetDom.pendingApprovalTable('nameIISheetTeam')
    },
    methods: {
      handleClickILabel(tab, event){
        this.whichTab = tab.name
      },
      handleClickIILabel(){

      }
    }
  }
</script>

<style scoped>

</style>
