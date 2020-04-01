<template>
  <!--客人信息弹窗-->
  <el-dialog
    title="客人信息"
    :visible.sync="propsObj.dialogType === 5"
    :close-on-click-modal="false"
    class
    width="780px"
    @open="orderData"
    @close="btReceiptDialogClose"
  >
    <!-- tabs  begin -->
    <el-radio-group v-model="chooseTab" @tab-click="chooseTabClick">
      <el-radio-button label="1">分房</el-radio-button>
      <el-radio-button label="2">保险</el-radio-button>
      <el-radio-button label="3">大巴</el-radio-button>
    </el-radio-group>
    <!-- tabs  end -->
      <!-- <el-tabs v-model="activebox" type="card" @tab-click="GetCabinbtn" style="float:left;width: 100%;">
        <el-tab-pane
          v-for="(item,index) in GetCabinData"
          :key="item.id"
          :label="item.name"
          :name="item.id"
        >
        </el-tab-pane>
      </el-tabs>
        -->
      <table class="costList" border="1" cellpadding="0" cellspacing="0" >
            <tr class="costList_01">
              <td width="120">姓名</td>
              <td width="120">报名类型</td>
              <td width="120">护照</td>
              <td width="120">电话</td>
              <td width="180">身份证</td>
              <td width="120">性别</td>
              <!-- <td width="120" v-if='this.chooseTab== 1'>房间号</td>
               <td width="120" v-if='this.chooseTab== 2'>保险</td>
                <td width="120" v-if='this.chooseTab== 3'>大巴</td> -->
            </tr>
        <tr v-for="(guest, index) in NewGetCabinData" :key="'g'+index">
          <td>{{guest.NGDName}}</td>
          <td>{{guest.NGDType}}</td>
          <td>{{guest.NGDCard}}</td>
          <td>{{guest.NGDPassport}}</td>
          <td>{{guest.NGDTel}}</td>
          <td>
            <div v-if="guest.NGDSex=='1'">男</div>
            <div v-if="guest.NGDSex=='2'">女</div>
          </td>
          <!-- <td width="120" v-if='this.chooseTab== 1'>房间号</td>
          <td width="120" v-if='this.chooseTab== 2'>保险</td>
          <td width="120" v-if='this.chooseTab== 3'>大巴</td> -->
        </tr>
      </table>
 
 
  </el-dialog>
</template>

<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
export default {
  name: "boatReceipt",
  props: {
    propsObj: { type: Object },
    orderId:0
  },
  data() {
    return {
      chooseTab:"1", //tabs选中的
      NewGetCabinData:{},//客人信息
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
    btReceiptDialogClose() {  // 客人信息弹窗关闭事件
      this.$parent.resetDialogType();
    },
    orderData(){ // 获取客人信息
      this.$http
        .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order/guestinfo", {
          id: this.orderId
        })
        .then(res => {
              if(res.data.code === 200){
                 console.log("请求一条数据的",res.data.data)
                      this.NewGetCabinData = res.data.data.info;
                     
              }
         
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    chooseTabClick(tab,event){
      console.log(tab);
      console.log(event);

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