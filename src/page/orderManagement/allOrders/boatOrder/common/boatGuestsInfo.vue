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
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item v-for="(item,index) in swiperInfo" :key="index" >{{item}}</el-menu-item>
    </el-menu>

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
      chooseSwiper: "", //swiper选中的
      swiperInfo: ["处理中心","处理中心","处理中心","处理中心","处理中心","处理中心","处理中心"] //swiper数据的集合
    };
  },
  created() {},
  methods: {
    // swiper 切换事件
    handleClick(tab, event) {},

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