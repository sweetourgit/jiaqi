<template>
  <!--出团通知书弹窗-->
  <el-dialog
    title="出团通知书"
    :visible.sync="propsObj.dialogType === 4"
    :close-on-click-modal="false"
    class
    width="780px"
    @close="btReceiptDialogClose"
  ></el-dialog>
</template>

<script>
export default {
  name: "boatReceipt",
  props: {
    propsObj: { type: Object }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    // 出团通知书弹窗关闭事件
    btReceiptDialogClose() {
      // this.$emit(
      //   "update:this.propsObj.dialogType",
      //   (this.propsObj.dialogType = -1)
      // );
      this.$parent.resetDialogType()
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
</style>