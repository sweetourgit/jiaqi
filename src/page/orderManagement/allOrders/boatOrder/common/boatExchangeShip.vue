<template>
  <!--分房信息弹窗-->
  <el-dialog
    title="换舱"
    :visible.sync="propsObj.dialogType === 2"
    :close-on-click-modal="false"
    class
    width="780px"
    @close="btDivideDialogClose"
  ></el-dialog>
</template>

<script>
export default {
  name: "boatDivideRoomInfo",
  props: {
    propsObj: { type: Object }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    // 弹窗关闭事件
    btDivideDialogClose() {
      this.$emit(
        "update:this.propsObj.dialogType",
        (this.propsObj.dialogType = -1)
      );
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
</style>