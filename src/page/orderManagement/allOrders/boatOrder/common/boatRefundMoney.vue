<template>
  <!--退款信息弹窗-->
  <el-dialog
    title="退款信息"
    :visible.sync="propsObj.dialogType === 3"
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
    // 退款信息弹窗关闭事件
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