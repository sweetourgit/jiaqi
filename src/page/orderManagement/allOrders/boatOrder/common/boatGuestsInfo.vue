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
    <div class="swiperBox">
      <i class="el-icon-arrow-left iconLeft" @click="handleLeft()"></i>
      <el-menu
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
      </el-menu>
      <i class="el-icon-arrow-right iconRight" @click="handleRight()"></i>
      <div class="line"></div>
    </div>

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
      swiperInfo: [
        "处理中心1",
        "处理中心2",
        "处理中心3",
        "处理中心4",
        "处理中心5",
        "处理中心6",
        "处理中11111心7",
        "处理中心8"
      ] //swiper数据的集合
    };
  },
  created() {},
  methods: {
    // swiper 选中事件
    handleSelect(key, keyPath) {
      // console.log(key);
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
// 轮播导航begin
.swiperBox {
  position: relative;

  .swiper {
    width: 700px;
    margin: 15px 0 15px 20px;
    padding: 0 10px;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: scroll;
    display: flex;
    justify-content: space-between;
    white-space: nowrap;

    .swiperSon {
      margin: 0 17px;
      list-style: none;
      text-align: center;
    }

  }

  .iconLeft {
    position: absolute;
    left: 0;
    top: 15px;
    padding: 10px;
    cursor:pointer;
  }

  .iconRight {
    position: absolute;
    right: 0;
    top: 15px;
    padding: 10px;
    cursor:pointer;
  }

  .iconLeft:hover,.iconRight:hover {
    color: #409EFF;
  }

  ::-webkit-scrollbar {
    display: none;
  }

}
// 轮播导航end

</style>