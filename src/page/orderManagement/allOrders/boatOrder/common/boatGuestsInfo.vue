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
    <!-- <el-menu
      :default-active="achooseSwiperIndex"
      class="el-menu-demo swiper"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="(item,index) in swiperInfo"
        :key="index"
        :index="index+''"
        class="swiperSon"
      >{{item}}</el-menu-item>
    </el-menu> -->

    <!-- <ul class="swiper">
      <li class="swiperSon" v-for="(item,index) in swiperInfo" :key="index">{{item}}</li>
    </ul> -->

    <div class="line"></div>

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
      achooseSwiperIndex: "1", //当前swiper选中的index
      // swiperInfo: [
      //   "处理中心1",
      //   "处理中心2",
      //   "处理中心3",
      //   "处理中心4",
      //   "处理中心5",
      //   "处理中心6",
      //   "处理中心7",
      //   "处理中心8"
      // ] //swiper数据的集合
    };
  },
  created() {},
  methods: {
    // swiper 切换事件
    handleSelect(key, keyPath) {},

    // 客人信息弹窗关闭事件
    btReceiptDialogClose() {
      this.$parent.resetDialogType();
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
// .swiper {
//   width: 700px;
//   height: 80px;
//   line-height: 80px;
//   margin: 15px 0;
//   overflow-y: hidden;
//   overflow-x: scroll;
//   white-space: nowrap;
//   .swiperSon {
//     margin-right: 40px;
//     list-style: none;
//     display: inline-block;
//     text-align: center;
//   }
// }
// ::-webkit-scrollbar {
//     display: none;
//   }
</style>