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
            <team-table :whichTab="whichTab" ref="noInTeamDom"></team-table>
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
            <team-table :whichTab="whichTab" ref="advanceTeamDom"></team-table>
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
            <team-table :whichTab="whichTab" ref="reimburseTeamDom"></team-table>
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
            <team-table :whichTab="whichTab" ref="refundTeamDom">></team-table>
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
            <team-table :whichTab="whichTab" ref="sheetTeamDom"></team-table>
          </el-tab-pane>
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameIISheetShip">

          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <!-- 报账单管理 -->
      <!-- 收款管理 -->
      <el-tab-pane :label="'收款管理(' + allCount +')'" name="nameICollection">
        <el-tabs v-model="tabIICollectionShowWhich" tab-position="left" @tab-click="handleClickIILabel">
          <!-- 跟团tab -->
          <el-tab-pane :label="'跟团(' + 0 +')'" name="nameIICollectionTeam">
            <el-tabs v-model="tabIIICollectionTeamShowWhich" @tab-click="handleClickIIITeamLabel" style="width: 98%;margin: 20px auto;">
              <el-tab-pane :label="'直客(' + approveDataNum +')'" name="nameIIICollectionTeamDirect">
                <team-collect-table :whichCollectTeamTab="whichCollectTeamTab" ref="collectTeamDirectDom"></team-collect-table>
              </el-tab-pane>
              <el-tab-pane :label="'同业(' + approveDataNum +')'" name="nameIIICollectionTeamSame">
                <team-collect-table :whichCollectTeamTab="whichCollectTeamTab" ref="collectTeamSameDom"></team-collect-table>
              </el-tab-pane>
              <el-tab-pane :label="'内部收款(' + approveDataNum +')'" name="nameIIICollectionTeamInner">
                <team-collect-table :whichCollectTeamTab="whichCollectTeamTab" ref="collectTeamInnerDom"></team-collect-table>
              </el-tab-pane>
              <el-tab-pane :label="'报销还款(' + approveDataNum +')'" name="nameIIICollectionTeamReimburse">
                <team-collect-table :whichCollectTeamTab="whichCollectTeamTab" ref="collectTeamReimburseDom"></team-collect-table>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <!-- 跟团tab END -->
          <!-- 游轮tab -->
          <el-tab-pane :label="'游轮(' + 0 +')'" name="nameIICollectionShip">
            <el-tabs v-model="tabIIICollectionShipShowWhich" @tab-click="handleClickILabel" style="width: 98%;margin: 20px auto;">
              <el-tab-pane :label="'直客(' + approveDataNum +')'" name="nameIIICollectionShipDirect">
              </el-tab-pane>
              <el-tab-pane :label="'同业(' + approveDataNum +')'" name="nameIIICollectionShipSame">
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <!-- 游轮tab -->
          <!-- 收款管理 END -->
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import teamTable from "./team/teamTable";
  import teamCollectTable from "./team/teamCollectTable";

  export default {
    name: "ILabel",
    data(){
      return {
        tabIShowWhich: 'nameINoIn', // 一级tab预设值为无收入
        tabIINoInShowWhich: 'nameIINoInTeam', // 无收入二级tab预设值（跟团）
        tabIIAdvanceShowWhich: 'nameIIAdvanceTeam', // 预付款二级tab预设值（跟团）
        tabIIReimburseShowWhich: 'nameIIReimburseTeam',  // 报销二级tab预设值（跟团）
        tabIIRefundShowWhich: 'nameIIRefundTeam', // 退款二级tab预设值（跟团）
        tabIISheetShowWhich: 'nameIISheetTeam', // 报账单二级tab预设值（跟团）
        tabIICollectionShowWhich: 'nameIICollectionTeam',  // 收款管理二级tab预设值（跟团）
        tabIIICollectionTeamShowWhich: 'nameIIICollectionTeamDirect', // 收款三级tab预设值（跟团下的直客）
        tabIIICollectionShipShowWhich: 'nameIIICollectionShipDirect', // 收款三级tab预设值（游轮下的直客）
        approveDataNum: 1,
        approveDataNumAdvance: 1,
        approveDataNumReimburse: 1,
        approveDataNumRefund: 1,
        allCount: 1,
        whichTab: 'nameINoIn', // 选中的是哪一个tab，给子组件传值
        whichCollectTeamTab: 'nameIIICollectionTeamDirect'
      }
    },
    components: {
      teamTable,
      teamCollectTable
    },
    created () {

    },
    mounted () {
      this.$refs.noInTeamDom.pendingApprovalTable('nameIINoInTeam') // 跟团下的无收入（初始化加载所有tab下的表格数据，不能写在teamTable里面）
      this.$refs.advanceTeamDom.pendingApprovalTable('nameIIAdvanceTeam') // 跟团下的预付款
      this.$refs.reimburseTeamDom.pendingApprovalTable('nameIIReimburseTeam') // 跟团下的报销
      this.$refs.refundTeamDom.pendingApprovalTable('nameIIRefundTeam') // 跟团下的退款
      this.$refs.sheetTeamDom.pendingApprovalTable('nameIISheetTeam') // 跟团下的报账
      this.$refs.collectTeamDirectDom.approvalCollectTeamTable('nameIIICollectionTeamDirect') // 跟团下收款的直客
      this.$refs.collectTeamSameDom.approvalCollectTeamTable('nameIIICollectionTeamSame') // 跟团下收款的同业
      this.$refs.collectTeamInnerDom.approvalCollectTeamTable('nameIIICollectionTeamInner') // 跟团下收款的内部收款
      this.$refs.collectTeamReimburseDom.approvalCollectTeamTable('nameIIICollectionTeamReimburse') // 跟团下收款的报销还款
    },
    methods: {
      handleClickILabel (tab, event) {
        this.whichTab = tab.name
      },
      handleClickIILabel () {

      },
      // 三级tab（收款下的跟团上的tab）
      handleClickIIITeamLabel (tab, event) {
        this.whichCollectTeamTab = tab.name
      }
    }
  }
</script>

<style scoped>

</style>
