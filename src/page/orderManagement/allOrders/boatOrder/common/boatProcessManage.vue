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
       <!-- <el-tabs v-model="activebox"  v-for="(item,index) in ruleForm.favourable" :key="index" @tab-click="joinClick"   style="float:left;width: 100%;">
              <el-tab-pane label="预付款" name="2"></el-tab-pane>
            
        </el-tabs> -->
      <el-tabs v-model="activebox" type="card"  @tab-click="GetCabinbtn">
        <el-tab-pane
          :key="item.name"
          v-for="(item,index) in GetCabinData"
          :label="item.title"
          :name="item.name"
        >
          
        </el-tab-pane>
      </el-tabs>

       <el-tabs v-model="activebox" @tab-click="joinClick"   style="float:left;width: 100%;">
              <el-tab-pane label="预付款" name="2"></el-tab-pane>
              <el-tab-pane label="无收入" name="1"></el-tab-pane>
              <el-tab-pane label="无收入(无团期计划)" name="0"></el-tab-pane>
          </el-tabs>
          <!-- @row-click="joinData_btn" -->
          <el-table 
            :data="joinData" 
            border 
            tooltip-effect="dark"
            @selection-change="joinData_btn"
            style="width: 100%; margin-top: 30px">
            <el-table-column type="selection"  align="center"></el-table-column>
            <el-table-column prop="paymentID" label="预付款借款ID"  align="center" v-if="s_find==1"></el-table-column>
            <el-table-column prop="paymentID" label="无收入借款ID"  align="center" v-if="s_find==2"></el-table-column>
          
            <el-table-column prop="supplierName" label="供应商"  align="center"></el-table-column>
            <el-table-column prop="supplierTypeEX" label="借款类型"  align="center"></el-table-column>
            <!-- <el-table-column prop="orgName" label="部门" width="140"  align="center"></el-table-column> -->
            <el-table-column prop="price" label="金额"  align="center"></el-table-column>
            <!-- <el-table-column prop="wcount" label="未报销金额" width="150" align="center"></el-table-column> -->
            <el-table-column prop="paymentMark" label="摘要"  align="center"></el-table-column>
            <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
          </el-table>


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
          @click="orderModification(orderinfo.order_status,orderget.occupyStatus)"
          :disabled="isChangeNumber || isLowPrice"
          class="confirm fr"
        >{{statusNext}}</el-button>
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
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "boatProcessManage",
  props: {
     propsObj: { type: Object },
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
      activebox:0,//舱房状态
      GetCabinData:{},//
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
    },
   
    processManage() {  //流程详情
     this.disperseOrderDisabled = false
     this.$http  //查询一条订单信息
        .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order/info", {
          id: this.orderId
        })
        .then(res => {
           if (res.data.code == 200) {
           
            this.orderinfo = res.data.data;
            this.ruleForm.favourable = this.orderinfo.orderotherfee; // 其他费用
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
            for(let i in this.cabin){// 海景大床房  成人 ￥16999.00 * 2 
              this.ordercabinText = 
              this.cabin[i].name +
               '成人'+
               '￥'+
               this.cabin[i].adult_price +
               '*'+
               this.cabin[i].adult_num;

               this.GetCabinId( this.cabin[i].cabin_id);//获取客人房型tab
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
    this.$http
        .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/cabin-type/getparents", {
         ids:id
        })
        .then(res => {
          if (res.data.code == 200) {
           console.log(res.data,'噶是大哥');
           this.GetCabinData = res.data.data;
             console.log(this.GetCabinData,'噶是大哥');
            
          }
        })
        .catch(err => {
          console.log(err);
        });
        
    },
    GetCabinbtn(id){//房型切换

    },
    ordersave(id, occupyStatus) { // 保存订单
        
    },
    getOrderStatus(order_status,occupy_status,order_channel){
      //console.log(order_status,occupy_status,order_channel,'id');
      switch (order_status) {
        case 0: //订单状态0，暂按未确认处理
          switch (occupy_status) {
            case 1: //不占
              this.statusNow = "预定不占";
              this.statusNext = "预定占位";
              this.statusEnd = "确认占位";
              break;
            case 2: // 预定占位
              this.statusNow = "预定占位";
              this.statusNext = "确定占位";
              this.statusEnd = "补充资料";
              break;
            case 3: // 确定占位
              this.statusNow = "确定占位";
              //this.replenishInfoToastFun(this.orderget.orderChannel);
              this.statusNext = "补充资料";
              this.statusEnd = "签订合同";
              break;
          }
          break;
        case 1:
          // setTimeout(() => {
          //   let guest = this.orderget.guests;
          //   for (let i = 0; i < guest.length; i++) {
          //     if (guest[i].cnName == "点击填写") {
          //       this.isChangeNumber = true;
          //     } else {
          //       this.isChangeNumber = false;
          //     }
          //   }
          //   if (this.isChangeNumber === true) {
          //     this.$message.error("请补全出行人信息");
          //   }
          // }, 200);

          this.statusNow = "补充材料";
          this.statusNext = "签订合同";
          this.statusEnd = "待出行";
          break;
        case 2:
          this.statusNow = "签订合同";
          this.statusNext = "待出行";
          this.statusEnd = "出行中";
          break;
        case 3:
          switch (order_channel) {
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
          switch (order_channel) {
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
          break;
        case 9:
          this.statusNow = "作废订单";
          this.statusNext = "";
          this.statusEnd = "";
          break;
        case 10:
          this.statusNow = "确认占位";
          //this.replenishInfoToastFun(this.orderget.orderChannel);
          this.statusNext = "补充资料";
          this.statusEnd = "签订合同";
          break;
      }

    }
  },
  mounted() {}
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
</style>