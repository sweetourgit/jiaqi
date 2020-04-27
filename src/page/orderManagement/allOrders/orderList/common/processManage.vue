<template>
  <div>
    <el-dialog
      title="流程管理"
      :visible.sync="dialogFormProcess"
      :close-on-click-modal="false"
      class="city_list"
      width="870px"
      style="margin-top:-50px"
      @open="openDiolog"
      @close="cancle"
    >
      <div style="position:relative;height:50px">
        <el-button type="primary" plain icon="el-icon-check" circle size="medium"></el-button>
        <span class="sta-title">{{statusNow}}</span>
        <span v-if="statusNext!=''">
          <em class="line line1"></em>
          <el-button type="primary" circle size="medium">&nbsp;2&nbsp;</el-button>
          <span class="sta-title">{{statusNext}}</span>
          <span
            class="confirm-time"
            v-if="orderget.occupyStatus==1||orderget.occupyStatus==2"
          >{{endTimeStamp}}</span>
          <span
            class="confirmPrompt"
            v-if="orderget.occupyStatus==3&&orderget.orderStatus==10&&isLowPrice"
          >已付金额低于订单总额不能进行下一状态</span>
        </span>
        <span v-if="statusEnd!=''">
          <em class="line line2"></em>
          <el-button circle size="medium">&nbsp;3&nbsp;</el-button>
          <span class="sta-title">{{statusEnd}}</span>
        </span>
      </div>

      <div class="clearfix applyinfoParent">
        <div>
          报名信息：
        </div>
        <div style="padding: 5px 10px; white-space:pre-wrap;">{{ enrollsDetailStr }}</div>
      </div>

      <p class="yuwei">余位：{{ positionLeft }}</p>

      <p>当前使用【{{priceChange}}】价格</p>

      <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm cb" :rules="rules">
        <div>
          <span class="num-req">*</span>
          报名人数
        </div>
        <!-- <div style="white-space:pre-wrap" v-html="salePrice"></div> -->
        <div class="registration" v-for="(item,index) in salePrice" :key="'a'+index">
          <span class="multi-wrap" :title="getShowName(item) + getShowPrice(item)">
            <span>{{ getShowName(item) }}</span>
            <span>￥</span>
            <!-- <span v-show="ruleForm.price==1">{{item.price_01}}*{{enrolNum[index]}}</span>
            <span v-show="ruleForm.price==2">{{item.price_02}}*{{enrolNum[index]}}</span>-->
            <span>{{ getShowPrice(item) }}</span>
          </span>
          <div>
            <!-- :max="salePriceNum[index].quota" -->
            <numberInputer class="input-num"
              :proto="item"
              :disabled="orderget.orderStatus==4||orderget.orderStatus==5||orderget.orderStatus==6||orderget.orderStatus==9||disperseOrderDisabled"
              @change="enrollChangeHandler">
            </numberInputer>
          </div>
          <!-- <div> -->
          <!-- 余位{{item.quota}} -->
          <!-- <span v-show="quota[index]">库存不足</span>  v-bind:class="{red:quota[index]}" -->
          <!-- </div> -->
        </div>

        <div class="red cb" v-show="enrolNums">{{enrolNumsWarn}}</div>
        
        <div v-for="(item,index) in ruleForm.favourable" :key="index" class="other-cost">
          <el-form-item class="fl" :prop="'favourable.'+ index +'.price'" :rules="rules.otherCost"
            v-if="item.favMode=== 1">
            <div>{{item.title}}</div>
            <el-input
              v-model="item.price"
              placeholder="请输入金额"
              class="input"
              :disabled="orderget.orderStatus == 4 || orderget.orderStatus == 6||orderget.orderStatus===9||disperseOrderDisabled"
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
              :disabled="orderget.orderStatus == 4 || orderget.orderStatus == 6||orderget.orderStatus===9||disperseOrderDisabled"
              @change="favourableChangeHandler(item)"
            ></el-input>
          </el-form-item>

          <el-form-item class="otherCost-mark"
            v-if="item.favMode=== 1">
            <el-input
              v-model="item.mark"
              placeholder="请输入摘要"
              class="input1"
              :title="item.mark"
              :disabled="orderget.orderStatus == 4 || orderget.orderStatus == 6||orderget.orderStatus===9||disperseOrderDisabled"
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
              :disabled="orderget.orderStatus == 4 || orderget.orderStatus == 6||orderget.orderStatus===9||disperseOrderDisabled"
            ></el-input>
          </el-form-item>
        </div>

        <div class="price">
          <!-- <p class="totle">总价：￥{{toDecimal2(payable)}}</p> -->
          <p class="totle">
            总价：￥
            <span>{{ totalPrice }}</span>
            <span v-show="changedPrice">{{ changedPrice | changedPriceFilter }}</span>
          </p>
          <p
            class="surplus"
            v-if="orderget.orderChannel===1&&settlementType===1"
          >剩余预存款和额度：￥{{toDecimal2(deposit+balance)}}</p>
        </div>
        <hr />
        <el-form-item label="订单联系人" class="contact" prop="contactName">
          <br />
          <el-input class="input" placeholder="请输入"
            v-model="ruleForm.contactName"
            :disabled="orderget.orderStatus==4||orderget.orderStatus==5||orderget.orderStatus==6||orderget.orderStatus==9"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" class="contact" prop="contactPhone">
          <br />
          <el-input class="input" placeholder="请输入"
            v-model="ruleForm.contactPhone"
            :disabled="orderget.orderStatus==4||orderget.orderStatus==5||orderget.orderStatus==6||orderget.orderStatus==9"
          ></el-input>
        </el-form-item>
        <hr />
        <!--出行人信息-->
        <!-- <el-form-item label="出行人信息" class="cb">
          <div class="oh" v-for="(item,indexPrice) in salePrice" :key="indexPrice">
            <div class="tour-til">{{item.enrollName}}</div>
            <div class="tourist">
              <span
                v-for="(item,index) in tour[indexPrice]"
                :key="index"
                placeholder="点击填写"
                @click="fillTour(indexPrice,index)"
                :disabled="orderget.orderStatus==4||orderget.orderStatus==5||orderget.orderStatus==6||orderget.orderStatus==9"
              >{{item.cnName}}</span>
            </div>
          </div>
        </el-form-item>-->

        <div class="travelMessage">出行人信息</div>
        <travelMessage
          :proto="salePrice"
          :disabled="orderget.orderStatus==4||orderget.orderStatus==5||orderget.orderStatus==6||orderget.orderStatus==9||disperseOrderDisabled"
          :editDisabled="orderget.orderStatus==4||orderget.orderStatus==5||orderget.orderStatus==6||orderget.orderStatus==9"
          @remove-guest="removeGuestEmit"
          @edit-guest="editGuestEmit">
        </travelMessage>
      </el-form>
      <hr />
      <div style="height:50px;margin-top:25px">
        <el-button
          class="fl"
          @click="dialogVisible = true"
          :disabled="disperseOrderDisabled"
          v-if="orderget.orderStatus!=4&&orderget.orderStatus!=5&&orderget.orderStatus!=6&&orderget.orderStatus!=9"
        >取消订单</el-button>
        <el-button sign="sign"
          type="primary"
          v-if="orderget.orderStatus==0||orderget.orderStatus==10||orderget.orderStatus==1"
          @click="orderModification(orderget.orderStatus,orderget.occupyStatus)"
          :disabled="isChangeNumber || isLowPrice"
          class="confirm fr"
        >{{statusNext}}</el-button>
        <el-button
          type="primary"
          v-if="orderget.orderStatus!=4&&orderget.orderStatus!=5&&orderget.orderStatus!=6&&orderget.orderStatus!=9"
          @click="ordersave"
          :disabled="isSaveBtn"
          class="confirm fr"
        >保存更改</el-button>
        <el-button class="fr" @click="cancle">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible" :modal-append-to-body="false" width="500px">
      <span>是否需要取消该订单</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="orderModification(orderget.orderStatus,0)">确 定</el-button> -->
        <el-button type="primary" @click="orderModification(9,0)">确 定</el-button>
      </span>
    </el-dialog>
    <guestEditDialog ref="guestEditDialog"
      @save-guest="saveGuestEmit">
    </guestEditDialog>
  </div>
</template>

<script>
import { max } from "moment";
import numberInputer from './comps/numberInputer'
import travelMessage from './comps/travelMessage'
import guestEditDialog from './comps/guestEditDialog'
import ProcessManageMixin from './ProcessManageMixin'

export default {
  mixins: [ProcessManageMixin],
  components: { numberInputer, travelMessage, guestEditDialog },
  
  props: {
    orderId: 0,
    a_variable: 0,
    dialogType: 0,
    orderCode: "",
    paid: 0, 
    priceType: 0, 
    settlementType: 0, 
    balance: 0, 
    deposit: 0 
  },
  data() {
    return {
      propPriceType: this.priceType, 
      showContent: null, 
      dialogVisible: false,
      dialogFormProcess: false,
      orderget: {}, 
      teampreviewData: {}, 
      statusNow: "",
      statusNext: "",
      statusEnd: "",
      ruleForm: {
        contactName: "",
        contactPhone: "",
        price: "1", 
        favourable: []
      },
      priceChange: "",
      isPricechange: null, 
      isChangeNumber: false, 
      isLowPrice: false, 
      isSaveBtn: false, 
      quota: [], 
      endTimeStamp: "00天00时00分00秒", 
      enrolNum: [], 
      // paidMaxEnrolNum: [], 
      enrolNums: false, 
      enrolNumsWarn: "",
      number: 0, 
      prePayable: 0, 
      payable: 0, 
      dialogFormTour: false,
      salePrice: [], 
      salePriceNum: [], 
      tourType: 0, 
      fillIndex: 0, 
      preLength: [], 
      applyInfomations: [], 
      tour: [], 
      winTitle: "", 
      enrollDetail: "", 
      enrollDetailShow: "", 
      tempresult: [], 
      enrollformatData: [], 
      conForm: {
        id: 0,
        isDeleted: 0,
        code: "",
        cnName: "",
        enName: "",
        sex: "",
        mobile: "",
        idCard: "",
        bornDate: 0,
        credType: 0,
        credCode: "",
        // credTOV: 0,
        orderID: 0,
        orderCode: "string",
        orgID: 0,
        userID: 0
      },
      rules: {
        price: [{ required: true, message: "请选择价格", trigger: "change" }],
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

  watch: {
    a_variable() {
      if (this.dialogType == 1) {
        this.processManage(this.orderId);
        this.dialogFormProcess = true;
      }
    },
    enrolNum(val) {
      this.changeQuota();
      // this.compPrice(1);
    },
    priceType() {
      this.propPriceType = this.priceType;
    }
  },

  methods: {
    // processManage(orderId) {
    //   this.$http
    //     .post(this.GLOBAL.serverSrc + "/order/all/api/orderget", {
    //       id: orderId
    //     })
    //     .then(res => {
    //       console.log(res.data);
    //       if (res.data.isSuccess == true) {
    //         this.orderget = res.data.object;
    //         this.payable = res.data.object.payable;
    //         this.enrollDetail = res.data.object.enrollDetail;
    //         this.enrollDetail = JSON.parse(this.enrollDetail);
    //         this.ruleForm.favourable = this.orderget.favourable;
    //         this.getOrderStatus(
    //           this.orderget.orderStatus,
    //           this.orderget.endTime,
    //           this.orderget.occupyStatus,
    //           this.orderget.orderChannel
    //         );
    //         this.propPriceType == 1
    //           ? (this.isPricechange = true)
    //           : (this.isPricechange = false);
    //         this.propPriceType == 1
    //           ? (this.priceChange = "直客")
    //           : (this.priceChange = "同业");
    //         this.occupyStatus = this.orderget.occupyStatus; // 唐 占位状态
    //         //联系人信息
    //         this.Timechange(this.orderget.endTime);
    //         this.ruleForm.contactName = JSON.parse(
    //           res.data.object.contact
    //         ).Name;
    //         this.ruleForm.contactPhone = JSON.parse(
    //           res.data.object.contact
    //         ).Tel;
    //         this.orderSourceFun(res.data.object.orderChannel);
    //         this.dialogFormProcess = true;
    //         this.teampreview(res.data.object.planID);
    //         // 记录最开始的总价 isSaveBtnClick需要
    //         this.prePayable = this.orderget.payable;
    //         this.showEnrollDetail();
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    showEnrollDetail() {
      this.formatData(this.enrollDetail)
      this.showApplyInfo(this.enrollformatData)
    },
    formatData(origindata) {
      let data = origindata;
      let keys = Object.keys(data);
      let [result, tempresult] = [[], []];
      keys.forEach(key => {
        let values = data[key];
        values.forEach(value => {
          tempresult.push({
            type: key,
            price: value[0],
            number: value[1]
          });
          result.push({
            type: key,
            price: value[0],
            number: 0
          });
        });
      });
      this.tempresult = tempresult;
      result.forEach(res => {
        tempresult.forEach(tempres => {
          if (tempres.type == res.type && tempres.price == res.price) {
            res.number += tempres.number;
          }
        });
      });
      let [_resultstring, splitstring] = [[], "?*&"];
      result.forEach(res => {
        let resstring = [res.type, res.price, res.number].join(splitstring);
        if (_resultstring.indexOf(resstring) < 0) {
          _resultstring.push(resstring);
        }
      });

      result = _resultstring.map(res => {
        return res.split(splitstring);
      });

      return this.enrollformatData = result;
   },
    showApplyInfo(res) {
     res.forEach(item => {
        this.enrollDetailShow += `${item[0]}(${item[1]}*${item[2]})`;
      });
    },

    counterArray(arr) {
      let obj = {};
      arr.forEach((v, k) => {
        if (obj[v]) {
          obj[v]++;
        } else {
          obj[v] = 1;
        }
      });
      return obj;
    },

    // isSaveBtnClick() {
    //   if (this.orderget.orderChannel === 1 && this.settlementType === 1) {
    //     if (this.payable - this.prePayable > this.deposit + this.balance) {
    //       return (this.isSaveBtn = true);
    //     } else {
    //       this.isSaveBtn = false;
    //     }
    //     if (this.payable === this.prePayable) {
    //       return (this.isSaveBtn = false);
    //     }
    //   }
    // },
    isSaveBtnClick(){
      this.isSaveBtn = false
      if(this.totalPrice + this.changedPrice<= 0) return this.isSaveBtn = true;
      if(this.guestTotal<= 0) return this.isSaveBtn = true;
      if (this.orderget.orderChannel === 1 && this.settlementType === 1) {
        if(this.changedPrice > this.deposit + this.balance) return this.isSaveBtn = true;
      }
    },

    isChangeNumberClick() {
      this.isChangeNumber= !!this.changedPrice;
    },

    timeFormat(param) {
      return param < 10 ? "0" + param : param;
    },

    Timechange(endTime) {
      // var interval = setInterval(() => {
      //   let obj = null;
      //   let newTime = new Date().getTime(); // 未结束，对时间进行处理
      //   var tt = endTime - newTime;
      //   if (tt < 0) {
      //     // 临时相反
      //     obj = {
      //       day: "00",
      //       hou: "00",
      //       min: "00",
      //       sec: "00"
      //     };
      //     this.orderget.orderStatus = 9;
      //     window.clearInterval(interval);
      //   } else {
      //     let time = (endTime - newTime) / 1000;
      //     // 获取天、时、分、秒
      //     let day = parseInt(time / (60 * 60 * 24));
      //     let hou = parseInt((time % (60 * 60 * 24)) / 3600);
      //     let min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60);
      //     let sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60);
      //     obj = {
      //       day: this.timeFormat(day),
      //       hou: this.timeFormat(hou),
      //       min: this.timeFormat(min),
      //       sec: this.timeFormat(sec)
      //     };
      //   }
      //   return (this.endTimeStamp =
      //     obj.day + "天" + obj.hou + "时" + obj.min + "分" + obj.sec + "秒");
      // }, 1000);
    },

    orderModification(status, cancle) {
      if (
        this.orderget.orderChannel === 1 &&
        this.settlementType === 1 &&
      
        // this.payable < this.balance + this.deposit &&
        this.changedPrice > this.balance + this.deposit &&

        status !== 9
      ) {
        this.$message.error("总价超过剩余预存款和额度");
      } else {
        // console.log(status)
        let url = "/order/stat/api";
        switch (status) {
          case 0:
          case 7:
            switch (cancle) {
              case 1:
                this.ordersave(this.orderget.id, cancle);
                break;
                retrun;
              case 2:
                url = "";
                this.ordersave(this.orderget.id, cancle);
                break;
                retrun;
              // case 3:
              //   url += "/material";
              //   break;
              //   retrun;
            }
            break;
          case 10:
            url += "/material";
            break;
          case 1:
            for (let i = 0; i < this.salePrice.length; i++) {
              for (let j = 0; j < this.salePrice[i].length; j++) {
                if (this.salePrice[i][j].cnName == "") {
                  this.$message.error("请补全出行人信息");
                  // this.isChangeNumber = true;
                  return;
                } else {
                  url = "/order/stat/api/econtract";
                }
              }
            }
            // url += "/econtract";
            break;
          case 2:
            url += "/signcontract";
            break;
        }
        if (cancle == 0) {
          this.dialogVisible = false;
          url = "/order/stat/api/invalid";
          // url = "/order/all/api/orderdelete";
        }

        this.$http
          .post(this.GLOBAL.serverSrc + url, {
            object: {
              id: this.orderget.id,
              occupyStatus: this.orderget.occupyStatus
            }
          })
          .then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              if (status === 1) {
                this.ordersave(3);
              }
              if (status === 10) {
                this.ordersave(1);
              }
              if (cancle === 0) {
                this.$http
                  .post(this.GLOBAL.serverSrc + "/order/all/api/orderdelete", {
                    id: this.orderget.id
                  })
                  .then(res => {
                    console.log(res);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
              this.$emit("orderPage");
              this.cancle();
            }
          });
      }
    },
    getOrderStatus(status, endTime, occupyStatus, orderChannel) {
      if (status == 2) {
        status = 3; 
      }
      switch (status) {
        case 0: 
          switch (occupyStatus) {
            case 1: 
              this.statusNow = "预定不占";
              this.statusNext = "预定占位";
              this.statusEnd = "确认占位";
              break;
            case 2: 
              this.statusNow = "预定占位";
              this.statusNext = "确定占位";
              this.statusEnd = "补充资料";
              break;
            case 3: 
              this.statusNow = "确定占位";
              this.replenishInfoToastFun(this.orderget.orderChannel);
              this.statusNext = "补充资料";
              this.statusEnd = "签订合同";
              break;
          }
          break;
        case 1:
          setTimeout(() => {
            let guest = this.orderget.guests;
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
          break;
        case 2:
          this.statusNow = "签订合同";
          this.statusNext = "待出行";
          this.statusEnd = "出行中";
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
          break;
        case 9:
          this.statusNow = "作废订单";
          this.statusNext = "";
          this.statusEnd = "";
          break;
        case 10:
          this.statusNow = "确认占位";
          this.replenishInfoToastFun(this.orderget.orderChannel);
          this.statusNext = "补充资料";
          this.statusEnd = "签订合同";
          break;
      }
    },
    addInfoFun() {
      if (this.orderget.payable !== this.payable) {
        this.isChangeNumber = true; 
      } else {
        this.isChangeNumber = false;
      }
    },

    // changeQuota() {
    //   //余位变化方法
    //   this.salePrice = JSON.parse(JSON.stringify(this.salePriceNum));
    //   let salePriceType = {};
    //   // 实时减少相关余位信息，提示库存不足
    //   //判断下单时  是否是预订占位 如果是则余位不变
    //   if (this.orderget.occupyStatus !== 1 || this.orderget.orderStatus !== 0) {
    //     for (let i = 0; i < this.salePrice.length; i++) {
    //       // this.salePrice[i].quota = parseInt(this.salePrice[i].quota) - parseInt(this.enrolNum[i]);
    //       this.salePrice[i].quota =
    //         parseInt(this.salePrice[i].quota) - parseInt(this.enrolNum[i]);
    //       salePriceType = this.salePrice[i];
    //       // if (salePriceType.quota < 0) {
    //       //   //判断是否显示库存不足
    //       //   this.quota[i] = true;
    //       // } else {
    //       //   this.quota[i] = false;
    //       // }
    //       if (this.enrolNum[i] == undefined) {
    //         this.enrolNum[i] = "";
    //       }
    //       if (salePriceType.quota === -1) {
    //         salePriceType.quota = 0;
    //       }
    //     }
    //   }
    // },

    isEqualityFun() {
      if (this.orderget.payable !== this.payable) {
        if (
          this.orderget.orderStatus === 1 ||
          this.orderget.orderStatus === 3 ||
          this.orderget.orderStatus === 2
        ) {
          this.isChangeNumber = true;
          // this.orderget.orderStatus = 10;
          // this.orderget.occupyStatus = 3;
        }
      }
    },
    // peoNumBlur(num) {
    //     for(let i = 0;i < num;i++) {
    //       console.log(1)
    //       this.peoNum()
    //     }
    // },
    peoNum(index, enrollID, enrollName, price_01, price_02, nums) {
      // console.log(index, enrollID, enrollName, num);
      // this.isChangeNumber = true; 
      let arrLength; 
      let preLength; 
      preLength = this.preLength[index]; 
      let enrollDetailNum = [...this.preLength];
      arrLength = this.enrolNum[index]; 
      this.preLength[index] = this.enrolNum[index]; 
      let len;
      
      if (this.salePriceNum[index].quota !== 0) {
        if (this.enrolNum[index] == this.salePriceNum[index].quota) {
          this.enrolNum[index] = this.salePriceNum[index].quota;
        }
      }
      if (arrLength > preLength) {
        
        len = arrLength - preLength;
        for (let i = 0; i < len; i++) {
          this.tour[index].push({
            enrollID: enrollID,
            enrollName: enrollName,
            createTime: new Date().getTime(),
            id: 0,
            isDeleted: 0,
            code: "",
            cnName: "",
            enName: "",
            sex: null,
            idCard: "",
            singlePrice: this.orderget.guests[0].singlePrice,
            mobile: "",
            bornDate: 0,
            credType: 0,
            credCode: "",
            // credTOV: 0,
            orderID: this.orderget.id,
            orderCode: this.orderget.orderCode,
            orgID: this.orderget.orgID,
            userID: this.orderget.userID,
            productType: this.orderget.productTyp
          });
        }
        this.getEnrollDetailPj(enrollDetailNum);
        enrollDetailNum[index] = this.enrolNum[index];
        this.formatData(this.enrollDetail)

        // for (let i = 0; i < nums - preLength; i++) {
        //   let price;
        //   this.isPricechange == true ? (price = price_01) : (price = price_02);
        //   price = this.toDecimal2(price);
        //   this.enrollDetail += `${enrollName}(${price} * 1),`;
        // }
      } else {
        for (let i = 0; i < preLength - nums; i++) {
          let isInfNull = this.tour[index].some((item, index, arr) => {
            return item.cnName == "";
          });
          let isInfNullIndex;
          if (isInfNull) {
            for (let i = 0; i < this.tour[index].length; i++) {
              if (this.tour[index][i].cnName == "") {
                isInfNullIndex = i;
              }
            }
          }
          // console.log("isInfNull", isInfNull);

          if (isInfNull) {
            this.tour[index].splice(isInfNullIndex, 1);
          } else {
            const num = this.tour[index].length.toString();
            this.preLength[index] = num;
            this.$set(this.enrolNum, index, num);
            this.$message.error("请手动删除表格中的出行人");
            break;
          }
        }
        
        let gap = preLength - nums;
        for (let i = this.tempresult.length - 1; i >= 0; i--) {
          if (this.tempresult[i].type == enrollName) {
            if (this.tempresult[i].number - gap == 0) {
              this.tempresult.splice(i, 1);
            } else if (this.tempresult[i].number - gap > 0) {
              this.tempresult[i].number = this.tempresult[i].number - gap;
            } else {
            }
          }
        }
        let obj = {};
        for (let i = 0; i < this.tempresult.length; i++) {
          if (JSON.stringify(obj).indexOf(this.tempresult[i].type) < 0) {
            obj[this.tempresult[i].type] = [];
            obj[this.tempresult[i].type].push([
              this.tempresult[i].price,
              this.tempresult[i].number
            ]);
          } else {
            obj[this.tempresult[i].type].push([
              this.tempresult[i].price,
              this.tempresult[i].number
            ]);
          }
        }
        this.enrollDetail = obj;
        this.formatData(this.enrollDetail)
      }
      this.compPrice();
      setTimeout(() => {
        this.isSaveBtnClick();
      }, 100);
      this.isEqualityFun();
    },
    fillTour(type, index) {
      this.winTitle = this.salePrice[type].enrollName;
      if (this.tour[type][index].cnName != "点击填写") {
        this.conForm = JSON.parse(JSON.stringify(this.tour[type][index])); 
      } else {
        this.conForm = {
          id: this.tour[type][index].id,
          isDeleted: 0,
          code: "",
          cnName: "",
          enName: "",
          sex: "",
          mobile: "",
          idCard: "", 
          bornDate: 0,
          credType: 0,
          credCode: "",
          // credTOV: 0,
          orderID: 0,
          orderCode: "string",
          orgID: 0,
          userID: 0
        };
      }
      this.tourType = type;
      this.fillIndex = index;
      this.dialogFormTour = true;
    },
    subInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let guest = JSON.parse(JSON.stringify(this.conForm));
          guest.enrollID = this.salePrice[this.tourType].enrollID; 
          guest.enrollName = this.salePrice[this.tourType].enrollName; 
          if (this.ruleForm.price == 1) {
            guest.singlePrice = this.salePrice[this.tourType].price_01; 
          } else {
            guest.singlePrice = this.salePrice[this.tourType].price_02;
          }
          this.tour[this.tourType][this.fillIndex] = guest;
          this.dialogFormTour = false;
          this.$refs[formName].resetFields();
        }
      });
    },

    cancelInfo(formName) {
      this.dialogFormTour = false;
      setTimeout(() => {
        this.$refs[formName].resetFields();
        this.$destroy();
      }, 500);
    },

    teamEnrolls(planId) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/enrolls", {
          id: planId
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.preLength = []; 
            this.enrolNum = []; 
            this.quota = []; 
            this.tour = []; 
            let data = res.data.objects;
            for (let i = 0; i < data.length; i++) {
              this.quota.push(false);
              this.tour.push([]);
            }
            // let guest = this.orderget.guests;
            // // console.log("guest", guest);
            // let j = 0;
            // for (let i = 0; i < guest.length; i++) {
            //   if (i > 0 && guest[i].enrollName != guest[i - 1].enrollName) {
            //     this.tour[j + 1].push(guest[i]);
            //     j += 1;
            //   } else {
            //     this.tour[j].push(guest[i]);
            //   }
            // }
            let guest = this.orderget.guests;
            for (let g = 0; g < data.length; g++) {
              for (let i = 0; i < guest.length; i++) {
                if (guest[i].enrollName == data[g].enrollName) {
                  //console.log(g,"g")
                  this.tour[g].push(guest[i]);
                } else {
                  this.tour.push();
                }
              }
            }
             
            for (let i = 0; i < this.tour.length; i++) {
              this.applyInfomations.push(this.tour[i].length);
              this.preLength.push(this.tour[i].length);
              this.enrolNum.push(this.tour[i].length);
            }
            // this.paidMaxEnrolNum = [...this.enrolNum];
            for (let i = 0; i < data.length; i++) {
              if (
                data[i].quota == 0 ||
                data[i].quota > this.teampreviewData.remaining
              ) {
                data[i].quota = this.teampreviewData.remaining;
              } else {
                // data[i].quota =
                //   parseInt(data[i].quota) + parseInt(this.enrolNum[i]);
                data[i].quota =
                  parseInt(data[i].quota) - parseInt(this.preLength[i]);
              }
            }
            this.salePrice = data;
            this.salePriceNum = data;
            for (let i = 0; i < this.salePriceNum.length; i++) {
              this.salePriceNum[i].quota =
                parseInt(this.salePriceNum[i].quota) +
                parseInt(this.preLength[i]);
            }
          }
        });
    },
    teampreview(planId) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/teampreview", {
          id: planId
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.teampreviewData = res.data.object;
            this.teamEnrolls(planId);
          }
        });
    },

    priceChangeEvent(val) {
      // console.log(this.propPriceType,this.isPricechange)
      if (val == true) {
        this.priceChange = "直客";
        this.propPriceType = 1;
        this.compPrice();
      } else {
        this.priceChange = "同业";
        this.propPriceType = 2;
        this.compPrice();
      }
    },
    comPriceBlur(item, index) {
      let { price }= this.favourableProto[index];
      if (item.price == "") {
        item.price = 0;
      }
    },

    compPrice(type, index) {
      if (type == 2) {
        this.isChangeNumber = true; 
        if (
          typeof this.ruleForm.favourable[index].price == "number" &&
          this.ruleForm.favourable[index].price == ""
        ) {
          return;
        }
        // if (
        //   typeof this.ruleForm.favourable[index].price !== "number" &&
        //   this.ruleForm.favourable[index].price != ""
        // ) {
        //   return;
        // }
        
      }

       // begin
      this.payable = 0
       for (let i = 0; i < this.tempresult.length; i++) {
         this.payable += (this.tempresult[i].number * this.tempresult[i].price)
      }
      // this.payable = this.payable - this.prePayable
      
      // end

      // console.log(type,"type")
      // this.payable = 0;
      // for (let i = 0; i < this.enrolNum.length; i++) {
      //   this.payable +=
      //     this.enrolNum[i] *
      //     (this.propPriceType == 1
      //       ? this.salePrice[i].price_01
      //       : this.salePrice[i].price_02);
      // }
      if (this.orderget.favourable[0]) {
        this.payable += parseInt(
          this.orderget.favourable[0].price
            ? this.orderget.favourable[0].price
            : 0
        );
      }
      if (this.orderget.favourable[1]) {
        this.payable -= parseInt(
          this.orderget.favourable[1].price
            ? this.orderget.favourable[1].price
            : 0
        );
      }
      if (this.payable <= 0) {
        this.$message.error("总订单金额为0");
      }
      this.isSaveBtnClick();
      this.addInfoFun();
    },
    ordersave(id, occupyStatus) {
      
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.orderget));
          obj.contact =
            '{"Name":"' +
            this.ruleForm.contactName +
            '","Tel":"' +
            this.ruleForm.contactPhone +
            '"}';

          if (occupyStatus == 1) {
            obj.occupyStatus = 2;
          } else if (occupyStatus == 2) {
            obj.occupyStatus = 3;
          } //++++++

          // if (this.orderget.payable !== this.payable) {
          //   if (
          //     this.orderget.orderStatus === 1 ||
          //     this.orderget.orderStatus === 3 ||
          //     this.orderget.orderStatus === 2
          //   ) {
          //     // this.isChangeNumber = true;
          //     this.orderget.orderStatus = 10;
          //     this.orderget.occupyStatus = 3;
          //   }
          // }

          /*
          obj.number = this.number;
          for (let i = 0; i < this.enrolNum.length; i++) {
            if (this.enrolNum[i]) {
              obj.number += parseInt(this.enrolNum[i]);
            }
          }

          let t_num =
            this.teampreviewData.count - this.teampreviewData.remaining;
          let n_num = obj.number - t_num;
          if (obj.number == 0) {
            (this.enrolNumsWarn = "报名人数不能为空"), (this.enrolNums = true);
            return false;
          } else if (n_num > this.teampreviewData.remaining) {
            (this.enrolNumsWarn = "报名总人数不能超过余位"),
              (this.enrolNums = true);
            return false;
          } else {
            this.enrolNums = false;
          }
          let guest = [];
          for (let i = 0; i < this.tour.length; i++) {
            for (let j = 0; j < this.tour[i].length; j++) {
              guest.push(this.tour[i][j]);
            }
          }
          for (let i = 0; i < guest.length; i++) {
            if (this.occupyStatus == 3 && this.orderget.orderStatus === 1) {
              if (guest[i].cnName == "点击填写") {
                this.$message.error("请补全游客资料");
                return;
              }
            }
            guest[i].bornDate = new Date(guest[i].bornDate).getTime(); //时间格式转换
            if (guest[i].sex == null) guest[i].sex = 2; //出行人没有填写时传值性别为2 要不报错  正确的 0 男  1 女
            // // guest[i].credTOV = new Date(guest[i].credTOV).getTime();
          }
          */

          if (
            this.isChangeNumber === true &&
            (this.orderget.orderStatus === 1 ||
              this.orderget.orderStatus === 2 ||
              this.orderget.orderStatus === 3)
          ) {
            obj.orderStatus = 10;
          }

          // enrollDetail拼接
          // this.getEnrollDetailPj();
          if (id === 3) {
            obj.orderStatus = 3;
          }

          if (id === 1) {
            obj.orderStatus = 1;
          }

          if (this.propPriceType == 1) {
            obj.priceType = 1;
          } else {
            obj.priceType = 2;
          }

          let sum = 0;
          this.enrolNum.forEach(item => {
            sum += item;
          });

          
          let guest = [];
          for (let i = 0; i < this.salePrice.length; i++) {
            for (let j = 0; j < this.salePrice[i].length; j++) {
              guest.push(this.salePrice[i][j]);
            }
          }
          obj.number= guest.length;
          if(typeof id=== 'object' && 'altKey' in id){
            let timestamp= Date.now();
            this.newEnrollList.forEach(el => {
              el.createTime= timestamp;
            })
          }

          console.log(obj,'那来的1')
          // if (sum !== guest.length ) {
          if (0) {
            this.$message.error("报名人数与出行人信息不符，请修改出行人信息");
          } else {
            // obj.enrollDetail = JSON.stringify(this.enrollDetail);
            obj.enrollDetail= this.enrollsDetailStr;
            // obj.payable = this.prePayable + (this.payable - this.prePayable);
            obj.payable= this.totalPrice+ this.changedPrice;
            console.log("RefundStatus",guest)
            obj.guests = guest;
            obj.teamID = this.orderget.teamID
            obj.planID = this.orderget.planID
            this.$http
              .post(this.GLOBAL.serverSrc + "/order/all/api/ordersave", {
                object: obj
              })
              .then(res => {
                if (res.data.isSuccess == true) {
                  this.$message({
                    message: "更改成功",
                    type: "success"
                  });
                  this.$emit("orderPage");
                  this.$emit("childByValue", this.showContent);
                  this.cancle();
                }
              });
          }
        }
      });
    },

    delTravel(type, index, enrollName) {
      if (this.tour[index][type].cnName != "") {
        this.$confirm("是否删除该条出行人信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(res => {
          this.tour[index].splice(type, 1); 
          this.enrolNum[index] = this.tour[index].length; 
          this.preLength[index] = this.enrolNum[index];
          this.applyEnrollDetail(enrollName, index);
        });
      } else {
        this.tour[index].splice(type, 1); 
        this.enrolNum[index] = this.tour[index].length; 
        this.preLength[index] = this.enrolNum[index];
        this.applyEnrollDetail(enrollName, index);
      }
    },
    applyEnrollDetail(enrollName, index) {
      // let _arr = this.enrollDetail.split(",");
      // for (let i = _arr.length - 1; i => 0; i--) {
      //   if (_arr[i].indexOf(enrollName) != -1) {
      //     _arr.splice(i, 1);
      //     this.enrollDetail = _arr.toString();
      //     break;
      //   }
      // }
      let salePrice = this.salePrice[index];
      let enrolNum = this.enrolNum[index];
      this.peoNum(
        index,
        salePrice.enrollID,
        salePrice.enrollName,
        salePrice.price_01,
        salePrice.price_02,
        enrolNum[index]
      );
    },
    getEnrollDetailPj(enrollDetailNum) {
      let price;
      this.salePrice.forEach((ele, idx) => {
        if (this.isPricechange) {
          price = this.toDecimal2(ele.price_01);
        } else {
          price = this.toDecimal2(ele.price_02);
        }
        if (
          this.enrolNum[idx] !== 0 ||
          this.enrolNum[idx] > enrollDetailNum[idx]
        ) {
          if (this.enrolNum[idx] - enrollDetailNum[idx] > 0) {
            if (enrollDetailNum[idx] == 0) {
              this.enrollDetail[ele.enrollName] = [];
              this.enrollDetail[ele.enrollName].push([
                price,
                this.enrolNum[idx]
              ]);
            } else {
              if (this.enrolNum[idx] - this.applyInfomations[idx] >= 2) {
                let arr = this.enrollDetail[ele.enrollName];
                arr[arr.length - 1][1] += 1;
              } else {
                this.enrollDetail[ele.enrollName].push([
                  price,
                  this.enrolNum[idx] - enrollDetailNum[idx]
                ]);
              }
            }
          }
        }
      });
      // this.enrollDetail = JSON.stringify(this.enrollDetail);
    },

    orderSourceFun(orderChannel) {
      if (orderChannel !== 1) return true;
    },

    // replenishInfoToastFun(orderChannel) {
    //   if (this.orderSourceFun(orderChannel) == true) {
    //     if (this.payable > this.paid) {
    //       this.isLowPrice = true;
    //     }
    //   }
    // },
    replenishInfoToastFun(orderChannel) {
      if (this.orderSourceFun(orderChannel) == true) {
        this.isLowPrice = (this.totalPrice + this.changedPrice) > this.paid;
      }
    },

    toDecimal2(x) {
      let f = Math.round(x * 100) / 100;
      var s = f.toString();
      var rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 2) {
        s += "0";
      }
      return s;
    },

    openDiolog() {
      this.disperseOrderDisabled=false
      this.isCancelBtn = false
    },

    cancle() {
      this.isChangeNumber = false;
      this.enrolNums = false;
      this.$refs["ruleForm"].resetFields();
      this.dialogFormProcess = false;
      this.isLowPrice = false;
      this.isSaveBtn = false;
      this.applyInfomations = [];
      this.enrollDetail = "";
      this.enrollDetailShow = "";
      this.isPricechange = null;
      this.prePayable = 0;
      this.payable = 0;
      this.$parent.orderPage();
    }
  }
};
</script>

<style scoped>
.applyinfoParent {
  margin-top: 30px;
}

.applyinfo {
  margin-right: 10px;
  list-style: none;
}

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
.confirm-time {
  position: absolute;
  top: 40px;
  left: 375px;
}

.confirmPrompt {
  position: absolute;
  top: 40px;
  left: 375px;
  color: #f75454;
  font-size: 12px;
}

.yuwei {
  margin: 20px 0;
}
.demo-ruleForm {
  margin-top: 20px;
}
.demo-ruleForm .el-form-item {
  margin-bottom: 13px;
}
.num-req {
  color: red;
}
.registration {
  display: inline-block;
  margin: 40px 15px 40px 3px;
  text-align: center;
}
.el-input-number--medium {
  width: 170px;
}
.input-num {
  margin: 10px 0;
}
.ml13 {
  margin-left: 13px;
}
.multi-wrap {
  text-align: center;
  display: -webkit-box !important;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  width: 150px;
  min-height: 46.6px;
}
.input {
  width: 200px;
  margin: -15px 0 0 0px;
}
.input1 {
  width: 200px;
  margin: -15px 0 0 15px;
}
.other-cost {
  clear: both;
  height: 85px;
}
.otherCost-mark {
  float: left;
  margin-top: 40px;
}
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
.contact {
  float: left;
  margin: 35px 50px 0 0;
  height: 95px;
}
.contact .el-input {
  width: 300px;
}
.confirm {
  margin-left: 20px;
}
.tourist {
  margin-left: 13px;
  float: left;
  width: 600px;
}
.tourist span {
  display: inline-block;
  width: 110px;
  background-color: #f6f6f6;
  text-align: center;
  border: 0;
  height: 40px;
  margin-left: 15px;
  margin: 1px 10px 10px 10px;
}
.tour-til {
  float: left;
  margin-left: 13px;
  margin-right: -8px;
  width: 80px;
}
.red {
  color: red;
}
.text {
  font-size: 14px;
}
.travelMessage {
  line-height: 40px;
  margin: 0 0 0 10px;
  font-size: 17px;
}
.blue {
  color: #2e94f9;
}
.disableColor {
  color: #c0c4cc;
}
.cursor {
  cursor: pointer;
  border: none;
  width: 70px;
}
.costTable {
  width: 800px;
  margin: 0 0 0 2px;
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
.oh {
  overflow: hidden;
}
ul {
  margin: 0;
  padding: 0;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix:after,
.clearfix:before {
  content: "";
  display: table;
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1;
}
.cb {
  clear: both;
}
.dialog-footer {
  text-align: left;
  margin: -40px 0 20px 265px;
}
</style>