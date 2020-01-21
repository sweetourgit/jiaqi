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
    <!-- <div class="swiperBox">
      <i class="el-icon-arrow-left iconLeft" @click="handleLeft(1)"></i>
      <el-menu
        :default-active="achooseSwiperIndex"
        class="el-menu-demo swiper"
        mode="horizontal"
        ref="swiper"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="(item,index) in swiperInfo"
          :key="index"
          :index="index+''"
          class="swiperSon"
        >{{item}}</el-menu-item>
      </el-menu>
      <i class="el-icon-arrow-right iconRight" @click="handleRight(2)"></i>
      <div class="line"></div>
    </div>-->

    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide">slider1</div>
        <div class="swiper-slide">slider2</div>
        <div class="swiper-slide">slider3</div>
        <div class="swiper-slide">slider4</div>
      </div>
      <div class="swiper-wrapper">
        <div class="swiper-slide">slider1</div>
        <div class="swiper-slide">slider2</div>
        <div class="swiper-slide">slider3</div>
        <div class="swiper-slide">slider4</div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
    <!-- swiper begin  -->
  </el-dialog>
</template>

<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
export default {
  name: "boatReceipt",
  props: {
    propsObj: { type: Object }
  },
  data() {
    return {
      chooseTab: "", //tabs选中的
      // chooseSwiper: "", //swiper选中的
      // achooseSwiperIndex: "0", //当前swiper选中的index
      // swiperInfo: [
      //   "处理中心1",
      //   "处理中心2",
      //   "处理中心3",
      //   "处理中心4",
      //   "处理中心5",
      //   "处理中心6",
      //   "处理中11111心7",
      //   "处理中心8"
      // ], //swiper数据的集合
      // isDirection: false // 监听是右箭头还是左箭头的字段 默认false为向右
    };
  },
  created() {},
  methods: {
    // swiper 选中事件
    // handleSelect(key) {
    //   console.log("开始", this.achooseSwiperIndex);
    //   this.achooseSwiperIndex = key;
    //   console.log("中间", this.achooseSwiperIndex);
    //   this.isDirection
    //     ? (this.achooseSwiperIndex = (
    //         Number(this.achooseSwiperIndex) - 1
    //       ).toString())
    //     : (this.achooseSwiperIndex = (
    //         Number(this.achooseSwiperIndex) + 1
    //       ).toString());
    //   console.log("结束", this.achooseSwiperIndex);
    // },

    // swiper 左箭头
    // handleLeft() {
    //   this.isDirection = true;
    //   this.handleSelect(this.achooseSwiperIndex);
    // },

    // swiper 右箭头
    // handleRight() {
    //   this.isDirection = false;
    //   this.handleSelect(this.achooseSwiperIndex);
    // },

    // 客人信息弹窗关闭事件
    btReceiptDialogClose() {
      this.$parent.resetDialogType();
    }
  },
  mounted() {
    const mySwiper = new Swiper(".swiper-container", {
      slidesPerView: 4,
      // observer: true
      
    });
  }
};
</script>

<style lang="scss" scoped>
.swiper-container {
  width: 600px;
  height: 300px;
}
// 轮播导航begin
// .swiperBox {
//   position: relative;

//   .swiper {
//     width: 700px;
//     margin: 15px 0 15px 20px;
//     padding: 0 10px;
//     box-sizing: border-box;
//     overflow-y: hidden;
//     overflow-x: scroll;
//     display: flex;
//     justify-content: space-between;
//     white-space: nowrap;

//     .swiperSon {
//       margin: 0 17px;
//       list-style: none;
//       text-align: center;
//     }
//   }

//   .iconLeft {
//     position: absolute;
//     left: 0;
//     top: 15px;
//     padding: 10px;
//     cursor: pointer;
//   }

//   .iconRight {
//     position: absolute;
//     right: 0;
//     top: 15px;
//     padding: 10px;
//     cursor: pointer;
//   }

//   .iconLeft:hover,
//   .iconRight:hover {
//     color: #409eff;
//   }

//   ::-webkit-scrollbar {
//     display: none;
//   }
// }
// 轮播导航end
</style>