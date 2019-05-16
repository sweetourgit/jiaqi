<template>
  <div class="vivo" style="position:relative">
    <el-tabs v-model="activeName">
     <!-- <el-tab-pane label="同业" name="first">
        <SameTradeManagement></SameTradeManagement>
      </el-tab-pane>
    -->
      <el-tab-pane label="直客" name="second">
        <StraightGuestManagement></StraightGuestManagement>
      </el-tab-pane>
      <el-tab-pane label="待审批" name="third">
        <PendingApprovalManagement></PendingApprovalManagement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import StraightGuestManagement from '@/page/Finance/collectionManagement/straightGuestManagement'
import SameTradeManagement from '@/page/Finance/collectionManagement/sameTradeManagement'
import PendingApprovalManagement from '@/page/Finance/collectionManagement/pendingApprovalManagement'
export default {
  name: "collectionManagement",
  components: {
    SameTradeManagement,
    StraightGuestManagement,
    PendingApprovalManagement
  },
  data() {
    return {
      activeName: 'second',
    }
  },
  computed: {
    // 计算属性的 getter
  },
  methods: {

  },
  created() {

  }
}

</script>
<style lang="scss" scoped>
</style>
