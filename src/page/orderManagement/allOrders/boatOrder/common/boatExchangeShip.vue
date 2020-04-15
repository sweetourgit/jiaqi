<template>
  <!--换仓弹窗-->
  <el-dialog
    title="换仓"
    :visible.sync="dialogFormMark"
    :close-on-click-modal="false"
    class
    width="780px"
    @close="btReceiptDialogClose"
  >
    <el-tabs v-model="activebox" type="card" @tab-click="GetCabinbtn" style="float:left;width: 100%;">
        <el-tab-pane
          v-for="item in GetCabinData"
          :key="item.label"
          :label="item.name"
          :name="item.label"
        >
        </el-tab-pane>
      </el-tabs>
       
      <table class="costList" border="1" cellpadding="0" cellspacing="0" >
            <tr class="costList_01">
              <td width="125">姓名</td>
              <td width="125">报名类型</td>
              <td width="125">护照</td>
              <td width="125">电话</td>
              <td width="125">身份证</td>
              <td width="125">性别</td>
              <td width="125">拼住/整住</td>
              <td width="125">房间号</td>
              <td width="125">操作</td>
              
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
             <div v-if="cabin_type=='1'">整间</div>
             <div v-if="cabin_type=='2'">拼住</div>
          </td>
          <td>{{guest.room_number}} </td>
          <td class="tc">
            <el-button
              class="fl cursor"
              @click="perateBtn(guest,index)">
               换仓
              </el-button>
          </td>
       </tr>
      </table>
    <el-button class="m_top_20" @click="btReceiptDialogClose">取消</el-button>
     <!--拆分弹窗-->
      <el-dialog width="50%" title="换仓" :visible.sync="ExchangeCabinBox" append-to-body @close="ExchangeCabinDel()" >
            <table class="costList" border="1" cellpadding="0" cellspacing="0" v-if='this.cabin_type == 1' >
              <tr class="costList_01">
                <td width="125">姓名</td>
                <td width="125">报名类型</td>
                <td width="125">护照</td>
                <td width="125">电话</td>
                <td width="125">身份证</td>
                <td width="125">性别</td>
                <td width="125">拼住/整住</td>
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
                  <div v-if="cabin_type=='1'">整间</div>
                  <div v-if="cabin_type=='2'">拼住</div>
                </td>
              </tr>
            </table>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-if='this.cabin_type == 1 ||this.cabin_type == 2'>
              <el-form-item label="舱房:" prop="region">
                  <el-select v-model="ruleForm.region" placeholder="请选择舱房类型" class="status-length">
                      <el-option v-for="item in GetCabinsData" :key="item.cabin_id" :label="item.name" :value="item.cabin_id"  /> 
                  </el-select>
                  <span>{{CabinTypeText}}</span>
              </el-form-item>
              <el-form-item label="免费/收费:" prop="resource">
                <el-radio-group v-model="ruleForm.resource">
                  <el-radio label="1">免费</el-radio>
                  <el-radio label="2">收费</el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="cancel"  >
                  <el-button  @click="ExchangeCabinDel()">取 消</el-button>
                  <el-button  type="primary" @click="ExchangeCabinBtn" >确定</el-button>
              </div>
          </el-form>
       </el-dialog>
        <!--拆分弹窗-->
      <el-dialog width="50%" title="还需添加" :visible.sync="AddExchangeCabin" append-to-body @close="Amenddel()" >
            <table class="costList" border="1" cellpadding="0" cellspacing="0" v-if='this.cabin_type == 1' >
              <tr class="costList_01">
                <td width="125">姓名</td>
                <td width="125">报名类型</td>
                <td width="125">护照</td>
                <td width="125">电话</td>
                <td width="125">身份证</td>
                <td width="125">性别</td>
                <td width="125">拼住/整住</td>
                
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
                  <div v-if="cabin_type=='1'">整间</div>
                  <div v-if="cabin_type=='2'">拼住</div>
                </td>
              </tr>
            </table>
          <div class="cancel"  >
              <el-button  @click="AddCabinDel()">取 消</el-button>
              <el-button  type="primary" @click="AddCabinbtn(Amend)" >确定</el-button>
          </div>
       </el-dialog>
  </el-dialog>
</template>

<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
export default {
  name: "boatDivideRoomInfo",
  props: {
      orderId:0,//订单id
      orderCodeSon:'',
      a_variable: 0,
      dialogType: 0,
  },
  data() {
    return {
      GetCabinData:[],//  头部
      NewGetCabinData:{},//客人信息
      NewGetcontext:[],//信息
      activebox:'1',
      cabin_type:0,//拼住/整住
      ExchangeCabinBox:false,//选择换仓弹框
      AddExchangeCabin:false,//还需添加
      plan_id:0,//团期计划id
      CabinTypeText:'',//舱房库存提示
      GetCabinsData:[],//舱房数组
      dialogFormMark:false,//弹框隐藏
      ruleForm: {
          region:'',
          resource:'',
        },
       rules: {
          resource: [
            { required: true, message: '请选择免费/收费', trigger: 'change' }
          ],
          region: [
            { required: true, message: '请选择舱房类型', trigger: 'change' }
          ],
        }
    
    };
  },
   watch: {
      a_variable: function() {
        if (this.dialogType == 0) {
          this.orderData(this.orderId,this.orderCodeSon);
          this.dialogFormMark = true;
        }
      }
    },
  created() {},
  methods: {
    btReceiptDialogClose() {  // 客人信息弹窗关闭事件
      this.$parent.resetDialogType();
      this.GetCabinData=[];
       this.cabin_type = 0;
        this.dialogFormMark = false;
    },
    orderData(){ // 获取客人信息 
      this.$http
        .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order/guestinfo", {
          id: this.orderId
        })
        .then(res => {
              if(res.data.code === 200){
                this.GetCabinData=[];
                 let infodata = res.data.data.info;
                for(let y in infodata){
                  if(infodata[y].length != 0){
                      this.GetCabinData.push({
                          name:infodata[y].name,
                          label:infodata[y].cabin_type.toString(),
                          houseinfo:infodata[y].houseinfo,
                        });
                     
                    if(infodata[y].cabin_type == this.activebox){
                      this.cabin_type = infodata[y].cabin_type;
                      this.plan_id = infodata[y].plan_id;
                      this.NewGetcontext = infodata[y].houseinfo;
                    }
                  }
                  
                }
          }
      })
        .catch(err => {
          console.log(err);
        });
    },
    getchangecabins(plan_id,cabin_id,id){ // 换仓 获取 所有舱房信息
      this.$http
        .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order/getchangecabins", {
          plan_id: plan_id,//团期计划id
          current_cabin_id:cabin_id,//客人舱房id
          guest_id:id,//客人id
        })
        .then(res => {
              if(res.data.code === 200){
                this.GetCabinsData = res.data.data.cabininfos;
                
                
          }
      })
        .catch(err => {
          console.log(err);
        });
    },
    ExchangeCabinBtn(){//换仓提交
    console.log(this.ruleForm,'啦啦啦');
       this.$refs.ruleForm.validate(validate => {
        if(!validate) return this.$message.error('请完善表单信息');
       })
       alert('客官换舱吗')
        // this.$http  //jenny04/13后期调试打开
        // .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order/changecabin", {
        //       id: 0,//订单id
        //       order_code: "string",//订单编码
        //       guest_id: "string",//客人id
        //       old_cabin_id: cabin_id,//原舱id
        //       new_cabin_id: this.ruleForm.region,//新舱id
        //       is_free: this.ruleForm.resource,//是否免费
        //       create_uid: 0,//创建者
        //       org_id: 0,//部门id
        //      })
        // .then(res => {
        //       if(res.data.code === 200){
        //         console.log(res.data,'换仓提交返回结果')
        //       }
        //      })
        // .catch(err => {
        //   console.log(err);
        // });

    },
    GetCabinbtn(data){
      this.activebox = data.name;
      this.orderData();

    },
    perateBtn(data,index){//换仓
   // console.log(data,'换仓')// this.cabin_type 判断拼住/整住 ||如果是整住 data.room_number判断分配房间没
    if(this.cabin_type === 1 ){
      this.AddExchangeCabin = true;
      this.getchangecabins(this.plan_id,data.cabin_id,data.id)
    }else if(this.cabin_type === 2 ){
      this.ExchangeCabinBox = true;
      this.getchangecabins(this.plan_id,data.cabin_id,data.id)
    }
     

    },
    AddCabinbtn(){//还需添加跳转换仓
      this.ExchangeCabinBox = true;
    },
    AddCabinDel(){//关闭还需添加
      this.AddExchangeCabin = false;
    },
    ExchangeCabinDel(){//关闭换仓
      this.ExchangeCabinBox = false;
    }
    
   },
  mounted() {
    const mySwiper = new Swiper(".swiper-container", {
      slidesPerView: 2,
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
  margin: 40px auto;
}
.costList_01 {
  background: #f3f3f3;
}
.fl {
  float: left;
}
.cursor {
  cursor: pointer;
  border: none;
  width: 100%;
}
.m_top_20{
  margin: 20px 0 20px 620px;
}
.cancel{
  margin-left: 80%;
}
</style>