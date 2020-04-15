<template>
  <!--客人信息弹窗-->
  <el-dialog
    title="客人信息"
    :visible.sync="dialogFormMark"
    :close-on-click-modal="false"
    class
    width="780px"
    @close="btReceiptDialogClose"
  >
    <!-- tabs  begin -->
    <el-tabs v-model="chooseTab" type="card"  @tab-click="chooseTabClick">
      <el-tab-pane label="分房" name='0'></el-tab-pane>
      <el-tab-pane label="保险" name='deliverinfo'></el-tab-pane>
      <el-tab-pane label="大巴" name='insureinfo'></el-tab-pane>
    </el-tabs>
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
              <td width="120">身份证</td>
              <td width="120">性别</td>
              <td width="120" v-if='this.choosetext== 0'>房间号</td>
              <td width="120" v-if='this.choosetext== 1'>保险</td>
              <td width="120" v-if='this.choosetext== 2'>大巴</td>
            </tr>
        <tr v-for="(guest, index) in NewGetcontext" :key="'g'+index">
          <td>{{guest.name}}</td>
          <td>{{guest.enroll_type}}</td>
          <td>{{guest.id_card}}</td>
          <td>{{guest.passport}}</td>
          <td>{{guest.tel}}</td>
          <td>
            <div v-if="guest.sex=='1'">男</div>
            <div v-if="guest.sex=='2'">女</div>
          </td>
          <td>
            {{guest.insure_title}}
            </td>
       </tr>
      </table>
 
  <el-button class="m_top_20" @click="btReceiptDialogClose">取消</el-button>
  </el-dialog>
</template>

<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
export default {
  name: "boatReceipt",
  props: {
    orderId: 0,
    a_variable: 0,
    dialogType: 0,
    orderCodeSon:""
  },
  data() {
    return {
      chooseTab:'deliverinfo', //tabs选中的
      choosetext:"1",
      NewGetCabinData:{},//客人信息
      NewGetcontext:[],//信息
      dialogFormMark:false,//弹框
    
    };
  },
  created() {},
  watch: {
    a_variable: function() {
      if (this.dialogType == 3) {
        this.orderData(this.orderId,this.orderCodeSon);
        this.dialogFormMark = true;
      }
    }
  },
  methods: {
    btReceiptDialogClose() {  // 客人信息弹窗关闭事件
      this.$parent.resetDialogType();
      this.dialogFormMark = false;//弹框
    },
    orderData(){ // 获取客人信息
      this.$http
        .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order/guestinfo", {
          id: this.orderId
        })
        .then(res => {
              if(res.data.code === 200){
                let infodata = res.data.data.info;
                   if(this.choosetext == 0){
                     this.NewGetCabinData = infodata[0];
                   }else if(this.choosetext== 1 ){
                     this.NewGetcontext = infodata.insureinfo;
                   }else if(this.choosetext == 2){
                     this.NewGetcontext = infodata.deliverinfo;
                   }
                  console.log("请求一条数据的", this.NewGetcontext);
                  
                   
                  
             }
         
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    chooseTabClick(tab){
      this.NewGetCabinData = [];
      this.NewGetcontext = [];
      this.choosetext = tab.index;
      this.orderData();
      },
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
.costList {
  width: 700px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #ebebeb;
  border-collapse: collapse;
  border-spacing: 0;
}
.costList_01 {
  background: #f3f3f3;
}
.fl {
  float: left;
}
 
.m_top_20{
  margin: 20px 0 20px 620px;
}
</style>