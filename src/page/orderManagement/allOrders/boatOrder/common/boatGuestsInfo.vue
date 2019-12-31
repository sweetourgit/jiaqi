<template>
  <!--客人信息弹窗-->
  <el-dialog
    title="客人信息"
    :visible.sync="propsObj.dialogType === 5"
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
    // 客人信息弹窗关闭事件
    btReceiptDialogClose() {
      this.$parent.resetDialogType()
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
</style>