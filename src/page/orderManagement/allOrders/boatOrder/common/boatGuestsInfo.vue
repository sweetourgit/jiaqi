<template>
  <!--客人信息弹窗-->
  <el-dialog
    title="客人信息"
    :visible.sync="propsObj.dialogType === 5"
    :close-on-click-modal="false"
    class
    width="780px"
    @close="btReceiptDialogClose"
  >
    <!-- tabs  begin -->
    <el-radio-group v-model="chooseTab">
      <el-radio-button label="分房"></el-radio-button>
      <el-radio-button label="保险"></el-radio-button>
      <el-radio-button label="大巴"></el-radio-button>
    </el-radio-group>
    <!-- tabs  end -->

    <!-- swiper begin  -->
    <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item index="1">处理中心</el-menu-item>
  </el-menu> -->
    <!-- <el-tabs v-model="chooseSwiper" @tab-click="handleClick" class="swiper">
      <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs> -->
    <!-- swiper begin  -->
  </el-dialog>
</template>

<script>
export default {
  name: "boatReceipt",
  props: {
    propsObj: { type: Object }
  },
  data() {
    return {
      chooseTab: "", //tabs选中的
      chooseSwiper: "" //swiper选中的
    };
  },
  created() {},
  methods: {
    // swiper 切换事件
    handleClick(tab, event) {
    },

    // 客人信息弹窗关闭事件
    btReceiptDialogClose() {
      this.$parent.resetDialogType();
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.swiper {
  margin: 15px 0;
}
</style>