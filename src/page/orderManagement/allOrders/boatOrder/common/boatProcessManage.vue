<template>
    <div>
       <el-dialog
      title="流程管理"
      :visible.sync="propsObj.dialogType === 7"
      :close-on-click-modal="false"
      class="city_list"
      width="870px"
      style="margin-top:-50px"
      @open="processManage"
      @close="close"
      
    >
    <!--订单状态begin-->
      <div style="position:relative;height:50px">
        <el-button type="primary" plain icon="el-icon-check" circle size="medium"></el-button>
        <span class="sta-title">{{statusNow}}</span>
        <span v-if="statusNext!=''">
          <em class="line line1"></em>
          <el-button type="primary" circle size="medium">&nbsp;2&nbsp;</el-button>
          <span class="sta-title">{{statusNext}}</span>
          <!-- 预订不占 预订占位 有倒计时的显示 -->
          <span
            class="confirm-time"
            v-if="orderinfo.order_status==1||orderinfo.order_status==2"
          >{{endTimeStamp}}</span>
          <!-- 补充资料 订单来源为线下直客时订单总额不等于已付金额时 动态按钮置灰并且出现提示语（已付金额低于订单总额不能进行下一状态） -->
          <span
            class="confirmPrompt"
            v-if="orderinfo.order_status==3&&orderinfo.order_status==10&&isLowPrice"
          >已付金额低于订单总额不能进行下一状态</span>
        </span>
        <span v-if="statusEnd!=''">
          <em class="line line2"></em>
          <el-button circle size="medium">&nbsp;3&nbsp;</el-button>
          <span class="sta-title">{{statusEnd}}</span>
        </span>
      </div>
      <!--订单状态end-->
      <!--报名信息begin-->
      <div class="clearfix applyinfoParent">
        <div>
          报名信息：
        </div>
        <div style="padding: 5px 10px; white-space:pre-wrap;">{{ordercabinText}}</div>
      </div>
      <!--保险信息begin-->
      <div class="clearfix applyinfoParent">
        <div>
          保险信息：
        </div>
        <div style="padding: 5px 10px; white-space:pre-wrap;">{{insuranceText}}</div>
      </div>
      <!--交通信息begin-->
      <div class="clearfix applyinfoParent">
        <div>
          交通信息：
        </div>
        <div style="padding: 5px 10px; white-space:pre-wrap;">{{trafficText}}</div>
      </div>
    
        <!--其他费用begin-->
      <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm cb" :rules="rules">
        <div v-for="(item,index) in ruleForm.favourable" :key="index" class="other-cost">
            <el-form-item class="fl" :prop="'favourable.'+ index +'.price'" :rules="rules.otherCost"
              v-if="item.fav_mode=== 1">
              <div>{{item.title}}</div>
              <el-input
                v-model="item.price"
                placeholder="请输入金额"
                class="input"
                :disabled="orderinfo.order_status == 4 || orderinfo.order_status == 6||orderinfo.order_status===9||disperseOrderDisabled"
                @change="favourableChangeHandler(item)"
              ></el-input>
            </el-form-item>
            <el-form-item class="fl" :prop="'favourable.'+ index +'.price'" :rules="rules.otherCost"
              v-else>
              <div>{{item.title}}</div>
              <el-input
                v-model="item.price"
                v-readonly="'others'"
                placeholder="请输入金额"
                class="input"
                :disabled="orderinfo.order_status == 4 || orderinfo.order_status == 6||orderinfo.order_status===9||disperseOrderDisabled"
                @change="favourableChangeHandler(item)"
              ></el-input>
            </el-form-item>

            <el-form-item class="otherCost-mark"
              v-if="item.fav_mode=== 1">
              <el-input
                v-model="item.mark"
                placeholder="请输入摘要"
                class="input1"
                :title="item.mark"
                :disabled="orderinfo.order_status == 4 || orderinfo.order_status == 6||orderinfo.order_status===9||disperseOrderDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item class="otherCost-mark"
              v-else>
              <el-input
                v-model="item.mark"
                v-readonly="'others'"
                placeholder="请输入摘要"
                class="input1"
                :title="item.mark"
                :disabled="orderinfo.order_status == 4 || orderinfo.order_status == 6||orderinfo.order_status===9||disperseOrderDisabled"
              ></el-input>
            </el-form-item>
          </div>
     
        <!--总价-->
      <div class="price">
        <!-- <p class="totle">总价：￥{{toDecimal2(payable)}}</p> -->
        <p class="totle">
          总价：￥
          <span>{{payable}}</span>
          <!-- <span v-show="changedPrice"> + {{ changedPrice}}</span>
           <span v-show="changedPriceFilter"> - {{ changedPriceFilter}}</span> -->
         
         </p>
        <!-- <p
          class="surplus"
          v-if="orderinfo.order_channel===1"
        >剩余预存款和额度：￥{{toDecimal2(deposit+balance)}}</p> -->
      </div>
      <hr />
      <!--订单联系人-->
      <el-form-item label="订单联系人" class="contact" prop="contactName">
        <br />
        <el-input class="input" placeholder="请输入"
          v-model="ruleForm.contactName"
          :disabled="orderinfo.order_status==4||orderinfo.order_status==5||orderinfo.order_status==6||orderinfo.order_status==9"
        ></el-input>
      </el-form-item>

      <el-form-item label="联系电话" class="contact" prop="contactPhone">
        <br />
        <el-input class="input" placeholder="请输入"
          v-model="ruleForm.contactPhone"
          :disabled="orderinfo.order_status==4||orderinfo.order_status==5||orderinfo.order_status==6||orderinfo.order_status==9"
        ></el-input>
      </el-form-item>
      <hr />
      <el-tabs  v-model="activebox" type="card" @tab-click="GetCabinbtn" style="float:left;width: 100%;">
        <el-tab-pane
          v-for="(item,index) in GetCabinData"
          :key="item.id"
          :label="item.name"
          :name="item.id"
        >
        </el-tab-pane>
      </el-tabs>
      <table class="costList" border="1" cellpadding="0" cellspacing="0" >
            <tr class="costList_01">
              <td width="120">姓名</td>
              <td width="120">报名类型</td>
              <td width="120">护照</td>
              <td width="180">身份证</td>
              <td width="120">电话</td>
              <td width="120">性别</td>
              <!-- <td width="120">签署状态</td> -->
              <td width="120">操作</td>
            </tr>
        <tr v-for="(guest, index) in NewGetCabinData" :key="'g'+index">
          <td>{{guest.NGDName}}</td>
          <td>{{guest.NGDType}}</td>
          <td>{{guest.NGDPassport}}</td>
          <td>{{guest.NGDCard}}</td>
          <td>{{guest.NGDTel}}</td>
          <td>
            <div v-if="guest.NGDSex=='1'">男</div>
            <div v-if="guest.NGDSex=='2'">女</div>
          </td>
          <!-- <td> 签署状态
            <el-button
              class="fl cursor"
             >{{guest.NGDState}}
            </el-button>
          </td> -->
          <td class="tc">
            <el-button
              class="fl cursor"
              @click="perateBtn(guest,index)">
                {{guest.NGDOperate}}
              </el-button>
          </td>
        </tr>
      </table>


      </el-form>
      <div style="height:50px;margin-top:25px">
        <el-button
          class="fl"
          @click="dialogVisible = true"
          :disabled="disperseOrderDisabled"
          v-if="orderinfo.order_status!=4&&orderinfo.order_status!=5&&orderinfo.order_status!=6&&orderinfo.order_status!=9"
        >取消订单</el-button>
        <!-- 修改订单状态按钮:disabled="isChangeNumber || isLowPrice"-->
        <!-- 订单来源为线下直客的时候订单总额不等于已付金额时 加上islowPrice -->
        <el-button sign="sign"
          type="primary"
          v-if="orderinfo.order_status==0||orderinfo.order_status==10||orderinfo.order_status==1"
          @click="orderModification(orderinfo.order_status,orderget.occupy_status)"
          :disabled="isChangeNumber || isLowPrice"
          class="confirm fr"
        >{{statusBtn}}</el-button>
        <!--保存游客信息按钮-->
        <el-button
          type="primary"
          v-if="orderinfo.order_status!=4&&orderinfo.order_status!=5&&orderinfo.order_status!=6&&orderinfo.order_status!=9"
          @click="ordersave"
          :disabled="isSaveBtn"
          class="confirm fr"
        >保存更改</el-button>
        <!--取消按钮-->
        <el-button class="fr" @click="close">取消</el-button>
      </div>
    </el-dialog>
    
    <!--取消订单弹框 @click="dialogVisible = false"-->
    <el-dialog title="提示" :visible.sync="dialogVisible" :modal-append-to-body="false" width="500px">
      <span>是否需要取消该订单</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="orderModification(9,0)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 出行人信息编辑 -->
    <guestEditDialog ref="guestEditDialog" 
      @save-guest="saveGuestEmit">
   </guestEditDialog>
  </div>
</template>

<script>
import moment from "moment";
import guestEditDialog from './comps/guestEditDialog'

export default {
  name: "boatProcessManage",
  components: {guestEditDialog },
  props: {
    propsObj: {type:Object },
    orderId:0,//订单id
  },
  data() {
    return {
      orderinfo:{},//info详情
      statusNow: "", // 订单进度状态
      statusNext: "",// 订单进度状态
      statusEnd: "",// 订单进度状态
      ordercabin:{},//报名数组
      insurance:{},//保险数组
      traffic:{},//交通数组
      ordercabinText:'',//报名信息拼接后  
      insuranceText:'',//保险信息
      trafficText:'',//交通信息
      isSaveBtn: false, //同业月结总价大于剩余额度和预存款时为true
      disperseOrderDisabled:false,
      dialogVisible: false,
      payable:0,//总价格
      activebox:"2",//舱房状态
      GetCabinData:[],//客人信息列表头部
      guest:[],//客人数组
      NewGetCabinData:[],//筛选后的客人数据
      GuestRoomId:"",//客房id
      AddNumber:0,//加的金额
      MinusNumber:0,//减的金额
      changedPrice:0,//当前变动
      statusBtn:'',//提交按钮
      ruleForm: {
        contactName: "",
        contactPhone: "",
        favourable: []
      },
      
      rules: {
        //变更数量
         contactName: [
          { message: "联系人不能为空", trigger: "blur" },
          { max: 20, message: "不能超过20位长度", trigger: "blur" }
        ],
        contactPhone: [
          { message: "联系电话不能为空", trigger: "blur" },
          {
            pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            message: "电话号格式不正确",
            trigger: "blur"
          },
          { max: 20, message: "不能超过20位长度", trigger: "blur" }
        ],
        otherCost: [
          {
            pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/,
            message: "必须为数字值，并且不允许是负数"
          }
        ],
        //游客信息
        cnName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        enName: [
          { required: true, message: "请输入姓（拼音）", trigger: "blur" },
          {
            pattern: /(a[io]?|ou?|e[inr]?|ang?|ng|[bmp](a[io]?|[aei]ng?|ei|ie?|ia[no]|o|u)|pou|me|m[io]u|[fw](a|[ae]ng?|ei|o|u)|fou|wai|[dt](a[io]?|an|e|[aeio]ng|ie?|ia[no]|ou|u[ino]?|uan)|dei|diu|[nl](a[io]?|ei?|[eio]ng|i[eu]?|i?ang?|iao|in|ou|u[eo]?|ve?|uan)|nen|lia|lun|[ghk](a[io]?|[ae]ng?|e|ong|ou|u[aino]?|uai|uang?)|[gh]ei|[jqx](i(ao?|ang?|e|ng?|ong|u)?|u[en]?|uan)|([csz]h?|r)([ae]ng?|ao|e|i|ou|u[ino]?|uan)|[csz](ai?|ong)|[csz]h(ai?|uai|uang)|zei|[sz]hua|([cz]h|r)ong|y(ao?|[ai]ng?|e|i|ong|ou|u[en]?|uan))/,
            message: "姓（拼音）格式不正确",
            trigger: "blur"
          }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        idCard: [
          { required: true, message: "身份证号不能为空", trigger: "blur" },
          {
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: "身份证号格式不正确",
            trigger: "blur"
          }
        ]
      }

    };
  },
  created() {},
  methods: {
    moment,
    close(){//关闭
      this.$parent.resetDialogType();
      this.NewGetCabinData= []; // 用户信息
      this.GetCabinData=[];//
    },
   
    processManage() {  //流程详情
     this.disperseOrderDisabled = false
     this.$http  //查询一条订单信息 this.orderId
        .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order/info", {
          id: 8
        })
        .then(res => {
           if (res.data.code == 200) {
           
            this.orderinfo = res.data.data;
            this.ruleForm.favourable = this.orderinfo.otherfee; // 其他费用
            this.guest = this.orderinfo.guest// 所有客人信息
            this.ruleForm.contactName=this.orderinfo.contact[0].name;
            this.ruleForm.contactPhone=this.orderinfo.contact[0].tel;
            this.payable = this.orderinfo.payable // 总价
            this.getOrderStatus(
              this.orderinfo.order_status,
              this.orderinfo.occupy_status,
              this.orderinfo.order_channel
            );
            this.cabin = res.data.data.cabin;
            this.insurance = res.data.data.insure;
            this.traffic = res.data.data.deliver;
            for(let k in this.ruleForm.favourable){
              if(this.ruleForm.favourable[k].fav_mode == 1){
                this.AddNumber = this.ruleForm.favourable[k].price;
              }else if(this.ruleForm.favourable[k].fav_mode == 2){
                 this.MinusNumber = this.ruleForm.favourable[k].price;
              }
            }
            for(let i in this.cabin){// 海景大床房  成人 ￥16999.00 * 2 
              this.ordercabinText = 
              this.cabin[i].name +
               '成人'+
               '￥'+
               this.cabin[i].adult_price +
               '*'+
               this.cabin[i].adult_num;
               //this.GuestRoomId = this.cabin[i].cabin_id;
               this.GetCabinId(this.cabin[i].cabin_id);//获取客人房型tab
               this.activebox = this.cabin[0].cabin_id.toString();
                for(let j in this.guest){
                  if(this.guest[j].cabin_id == this.cabin[0].cabin_id){
                      this.NewGetCabinData.push({
                        NGDName:this.guest[j].name,//名字
                        NGDType:this.guest[j].enroll_type,//类型
                        NGDPassport:this.guest[j].passport,//护照
                        NGDCard:this.guest[j].id_card,//身份证
                        NGDTel:this.guest[j].tel,//电话
                        NGDSex:this.guest[j].sex,//男女
                        NGDState:1,//签署状态
                        NGDOperate:'编辑', //操作
                       })
                  }
                }
            }
             for(let i in this.insurance){// 出行险 99.00 * 1
              this.insuranceText = 
              this.insurance[i].insure_title +
               this.insurance[i].insure_price +
               '*'+
                this.insurance[i].insure_num;
            }
             for(let i in this.traffic){// 泰兴至上海吴淞口码头往返巴士（4人起接）￥16999.00 * 2
              this.trafficText = 
              this.traffic[i].deliver_title +
              this.traffic[i].deliver_price +
               '*'+
                this.traffic[i].deliver_num;
            }
           
           
             //console.log(this.enrollsDetailStr);

           
           
            
            
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    GetCabinId(id) { // 获取客人房型tab
      id = id.toString();
      this.$http
        .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/cabin-type/getparents", {
         ids:id
        })
        .then(res => {
          if (res.data.code == 200) {
            for(let i in res.data.data){
              res.data.data[i].id = res.data.data[i].id.toString();
            }
            this.GetCabinData.push(res.data.data[0]);
          
            }
        })
        .catch(err => {
          console.log(err);
        });
        
    },
   GetCabinbtn(GetCabinbtn){//房型切换
   this.NewGetCabinData = [];
     for(let j in this.guest){
      if(this.guest[j].cabin_id == GetCabinbtn.name){
          this.NewGetCabinData.push({
            NGDName:this.guest[j].name,//名字
            NGDType:this.guest[j].enroll_type,//类型
            NGDPassport:this.guest[j].passport,//护照
            NGDCard:this.guest[j].id_card,//身份证
            NGDTel:this.guest[j].tel,//电话
            NGDSex:this.guest[j].sex,//男女
            NGDState:1,//签署状态
            NGDOperate:'编辑', //操作
           })
        }
      }
  },
    perateBtn(guest){ // 编辑
      this.$refs.guestEditDialog.wakeup(guest);
    },
    saveGuestEmit(payload){ // 保存信息
      let { guest, formData }= payload;
      Object.assign(guest, formData);
    },
    ordersave(id, occupyStatus) { // 保存订单
            
    },
    favourableChangeHandler(item){ // 其他费用
    // if(item.fav_mode == 1){}
      //   AddNumber:0,//加的金额
      // MinusNumber:0,//减的金额
      // changedPrice:0,//当前变动
      console.log(item,'发嗯艾丝凡');
      console.log(this.AddNumber,'测试价格');
        let varied= 0;
        // 如果输入不合规，则以旧值(原值加上最后一次改变)还原
        if(this.$isNull(price) || isNaN(parseFloat(price))) return item.price= priceProto + variedProto;
        varied= parseFloat(price)- priceProto;
        this.changedPrice+= (favMode=== 1? 1: -1) * (varied- variedProto);
        // 记录最后一次
        this.AddNumber= varied;
      
     
     
    },
    changedPriceFilter(val){
      if(val> 0) return `+${val}`;
      return val;
    },
     //什么都不填写然后失去光标变为0
    // comPriceBlur(item, index) {
    //   console.log(item,'fasfaws');
    //   let { price }= this.favourableProto[index];
    //   if (item.price == "") {
    //     item.price = 0;
    //   }
    // },
    getOrderStatus(status, endTime, occupyStatus, orderChannel) {
       switch (status) {
        case 0: //订单状态0，暂按未确认处理
          switch (occupyStatus) {
            case 1: //不占
              this.statusNow = "预定不占";
              this.statusNext = "预定占位";
              this.statusEnd = "确认占位";
              this.statusBtn = '预定占位';
              break;
            case 2: // 预定占位
              this.statusNow = "预定占位";
              this.statusNext = "确定占位";
              this.statusEnd = "补充资料";
              this.statusBtn = '确定占位';
              break;
            case 3: // 确定占位
              this.statusNow = "确定占位";
              this.statusNext = "补充资料";
              this.statusEnd = "签订合同";
              this.statusBtn = '补充资料'
              break;
          }
          break;
        case 1:
          setTimeout(() => {
            let guest = this.orderinfo.guests;
            for (let i = 0; i < guest.length; i++) {
              if (guest[i].cnName == "点击填写") {
                this.isChangeNumber = true;
              } else {
                this.isChangeNumber = false;
              }
            }
            if (this.isChangeNumber === true) {
              this.$message.error("请补全出行人信息");
            }
          }, 200);

          this.statusNow = "补充材料";
          this.statusNext = "签订合同";
          this.statusEnd = "待出行";
          this.statusBtn = '提交资料';
          break;
        case 2:
          this.statusNow = "签订合同";
          this.statusNext = "待出行";
          this.statusEnd = "出行中";
          this.statusBtn = '查看合同';
          break;
        case 3:
          switch (orderChannel) {
            case 1:
              this.statusNow = "待出行";
              this.statusNext = "出行中";
              this.statusEnd = "订单完成";
              break;
            case 2:
              this.statusNow = "待出行";
              this.statusNext = "出行中";
              this.statusEnd = "待点评";
              break;
            case 3:
              this.statusNow = "待出行";
              this.statusNext = "出行中";
              this.statusEnd = "订单完成";
              break;
          }
          break;
        case 4:
          //同业社没有待评价 直客有待评价
          //订单来源现在是后台写死的3  后台对应的 1同业  2 线上直客 3 线下直客
          //而实际项目团期计划下单位置 1 线下直客 2 商户（同业和门店）
          switch (orderChannel) {
            case 1:
              this.statusNow = "出行中";
              this.statusNext = "订单完成";
              this.statusEnd = "";
              break;
            case 2:
              this.statusNow = "出行中";
              this.statusNext = "订单完成";
              this.statusEnd = "";
              break;
            case 3:
              this.statusNow = "出行中";
              this.statusNext = "订单完成";
              this.statusEnd = "";
              break;
          }
          break;
        case 5:
          this.statusNow = "待点评";
          this.statusNext = "订单完成";
          this.statusEnd = "";
          break;
        case 6:
          this.statusNow = "订单完成";
          this.statusNext = "";
          this.statusEnd = "";
          break;
        case 7:
          this.statusNow = "确认占位";
          this.statusNext = "订单确认";
          this.statusEnd = "补充资料";
          this.statusBtn = '订单确认';
          break;
        case 8:
          this.statusNow = "签订合同";
          this.statusNext = "待出行";
          this.statusEnd = "出行中";
          this.statusBtn = '查看合同';
          break;
        case 9:
          this.statusNow = "作废订单";
          this.statusNext = "";
          this.statusEnd = "";
          break;
        case 10:
          this.statusNow = "确认占位";
          this.statusNext = "补充资料";
          this.statusEnd = "签订合同";
            this.statusBtn = '补充资料';
          break;
      }
    },
  },
   orderModification(status, cancle) {
     if (
        this.orderinfo.occupy_status === 1 &&
        this.settlementType === 1 &&
      
        // this.payable < this.balance + this.deposit &&
        this.changedPrice > this.balance + this.deposit &&

        status !== 9
      ) {
        this.$message.error("总价超过剩余预存款和额度");
      }else{
       if (cancle === 0) {// 取消订单按钮
        this.$http
          .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order/cancleorder", {
            id: this.orderinfo.id
          })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
        }
        // url = "/order/all/api/orderdelete";
        // this.$http
        //   .post(this.GLOBAL.serverSrcYL + url, {
        //     object: {
        //       id: this.orderget.id,
        //       occupyStatus: this.orderget.occupyStatus
        //     }
        //   })
        //   .then(res => {
        //     if (res.data.isSuccess == true) {
        //      }
        //   });
      }
    },
};
</script>

<style lang="scss" scoped>
/*订单状态*/
.line {
  display: inline-block;
  margin: 5px 8px;
  height: 2px;
  width: 220px;
}
.line1 {
  background-color: #2e94f9;
}
.line2 {
  background-color: #eee;
}
.sta-title {
  font-size: 16px;
}
/*费用*/
.input {
  width: 200px;
  margin: -15px 0 0 0px;
}
.input1 {
  width: 200px;
  margin: -15px 0 0 15px;
}
.fl {
  float: left;
}
.other-cost {
  clear: both;
  height: 85px;
}
.otherCost-mark {
  float: left;
  margin-top: 40px;
}
/*总价*/
.price {
  height: 50px;
  margin-top: -25px;
  text-align: right;
}
.price p {
  margin: 8px 0;
}
.totle {
  font-size: 17px;
  font-weight: bold;
}
.surplus {
  font-size: 12px;
}
hr {
  background-color: #eee;
  height: 1px;
  border: 0;
  clear: both;
}
/*订单联系人*/
.contact {
  float: left;
  margin: 35px 50px 0 0;
  height: 95px;
}
.contact .el-input {
  width: 300px;
}
.costList {
  width: 800px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #ebebeb;
  border-collapse: collapse;
  border-spacing: 0;
}
.costList_01 {
  background: #f3f3f3;
}
.tc {
  text-align: center;
}
.cursor {
  cursor: pointer;
  border: none;
  width: 100%;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
</style>