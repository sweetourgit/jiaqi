<template>
  <div>
    <!--流程管理弹窗-->
    <el-dialog
      title="流程管理"
      :visible.sync="dialogFormProcess"
      :close-on-click-modal="false"
      class="city_list"
      width="870px"
      style="margin-top:-50px"
      @close="cancle"
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
            v-if="orderget.occupyStatus==1||orderget.occupyStatus==2"
          >{{endTimeStamp}}</span>
          <!-- 补充资料 订单来源为线下直客时订单总额不等于已付金额时 动态按钮置灰并且出现提示语（已付金额低于订单总额不能进行下一状态） -->
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
      <!--订单状态end-->

      <!--报名信息begin-->
      <ul class="clearfix applyinfoParent">
        <li class="fl applyinfo">报名信息：{{enrollDetailShow}}</li>
        <!-- <li class="fl applyinfo" v-for="(item,index) in salePrice" :key="index">
          <span
            v-show="applyInfomations[index] !== 0 ? true: false"
          >{{item.enrollName}}￥{{item.price_01}}*{{applyInfomations[index]}}</span>
        </li>-->
      </ul>
      <!--报名信息end-->

      <p class="yuwei">余位：{{teampreviewData.remaining}}</p>

      <!-- switch 更改价格(直客价和同业价) beign-->
      <p>当前使用{{priceChange}}价格</p>
      <el-switch
        v-model="isPricechange"
        active-color="#409eff"
        inactive-color="#dcdfe6"
        @change="priceChangeEvent(isPricechange)"
        :disabled="orderget.orderStatus===4||orderget.orderStatus===6||orderget.orderStatus===9"
      ></el-switch>
      <!-- switch 更改价格(直客价和同业价) end-->

      <!--报名人数-->
      <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm cb" :rules="rules">
        <div>
          <span class="num-req">*</span>
          报名人数
        </div>
        <div class="registration" v-for="(item,index) in salePrice" :key="'a'+index">
          {{item.enrollName}}￥
          <!-- <span v-show="ruleForm.price==1">{{item.price_01}}*{{enrolNum[index]}}</span>
          <span v-show="ruleForm.price==2">{{item.price_02}}*{{enrolNum[index]}}</span>-->
          <span v-show="propPriceType==1">{{item.price_01}}*{{enrolNum[index]}}</span>
          <span v-show="propPriceType==2">{{item.price_02}}*{{enrolNum[index]}}</span>
          <div>
            <!-- 后期收款后 的报名人数显示 不可增加但是可以减少  减少后再增加的人数不可超过收款时的报名人数  :max="paidMaxEnrolNum[index]"-->
            <el-input-number
              class="input-num"
              v-model="enrolNum[index]"
              @change="peoNum(index,item.enrollID,item.enrollName,item.price_01,item.price_02)"
              :min="0"
              :max="salePriceNum[index].quota"
              size="medium"
              :disabled="orderget.orderStatus==4||orderget.orderStatus==5||orderget.orderStatus==6||orderget.orderStatus==9"
            ></el-input-number>
          </div>
          <!-- <div> -->
          <!-- 余位{{item.quota}} -->
          <!-- <span v-show="quota[index]">库存不足</span>  v-bind:class="{red:quota[index]}" -->
          <!-- </div> -->
        </div>
        <div class="red cb" v-show="enrolNums">{{enrolNumsWarn}}</div>
        <!--其他费用-->
        <div v-for="(item,index) in ruleForm.favourable" :key="index" class="other-cost">
          <el-form-item class="fl" :prop="'favourable.'+ index +'.price'" :rules="rules.otherCost">
            <div>{{item.title}}</div>
            <el-input
              v-model="item.price"
              placeholder="请输入金额"
              class="input"
              :disabled="orderget.orderStatus == 4 || orderget.orderStatus == 6||orderget.orderStatus===9"
              @input="compPrice(2,index)"
              @blur="comPriceBlur(item,index)"
            ></el-input>
          </el-form-item>
          <el-form-item class="otherCost-mark" v-if="index == 0">
            <el-input
              v-model="item.mark"
              placeholder="请输入摘要"
              class="input1"
              :disabled="orderget.orderStatus == 4 || orderget.orderStatus == 6||orderget.orderStatus===9"
            ></el-input>
          </el-form-item>
        </div>
        <!--总价-->
        <div class="price">
          <!-- <p class="totle">总价：￥{{toDecimal2(payable)}}</p> -->
          <p class="totle" v-if="payable > 0">
            总价：￥
            <span v-if="payable-prePayable > 0">{{prePayable}} + {{payable-prePayable}}</span>
            <span v-if="payable-prePayable == 0">{{prePayable}}</span>
            <span v-if="payable-prePayable < 0">{{prePayable}} - {{prePayable-payable}}</span>
          </p>
          <p class="totle" v-if="payable <= 0">总价：￥ 0</p>
          <p
            class="surplus"
            v-if="orderget.orderChannel===1&&settlementType===1"
          >剩余预存款和额度：￥{{toDecimal2(deposit+balance)}}</p>
        </div>
        <hr />
        <!--订单联系人-->
        <el-form-item label="订单联系人" class="contact" prop="contactName">
          <br />
          <el-input
            v-model="ruleForm.contactName"
            placeholder="请输入"
            class="input"
            :disabled="orderget.orderStatus==4||orderget.orderStatus==5||orderget.orderStatus==6||orderget.orderStatus==9"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" class="contact" prop="contactPhone">
          <br />
          <el-input
            v-model="ruleForm.contactPhone"
            placeholder="请输入"
            class="input"
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

        <!-- 出行人表格后加 begin -->
        <div class="travelMessage">出行人信息</div>
        <table
          :class="['costList',orderget.orderStatus == 4 || orderget.orderStatus == 6||orderget.orderStatus===9 ? 'disableColor':'']"
          v-for="(item,indexPrice) in salePrice"
          :key="item.id + indexPrice"
          border="1"
          cellpadding="0"
          cellspacing="0"
        >
          <tr class="costList_01">
            <td width="120">姓名</td>
            <td width="100">报名类型</td>
            <td width="120">电话</td>
            <td width="180">身份证</td>
            <td width="80">性别</td>
            <td width="140">操作</td>
          </tr>
          <tr v-for="(item,index) in tour[indexPrice]" :key="'b'+index">
            <td>{{item.cnName}}</td>
            <td>{{item.enrollName}}</td>
            <td>{{item.mobile}}</td>
            <td>{{item.idCard}}</td>
            <td>
              <div v-if="item.sex=='0'">男</div>
              <div v-if="item.sex=='1'">女</div>
            </td>
            <td class="tc">
              <el-button
                class="fl cursor"
                @click="fillTour(indexPrice,index)"
                :disabled="orderget.orderStatus == 4 || orderget.orderStatus == 6"
              >编辑</el-button>
              <span class="fl">|</span>
              <el-button
                class="fl cursor"
                @click="delTravel(index,indexPrice)"
                :disabled="orderget.orderStatus == 4 || orderget.orderStatus == 6"
              >删除</el-button>
            </td>
          </tr>
        </table>
        <!-- 出行人表格后加end -->
      </el-form>
      <!--按钮-->
      <hr />
      <div style="height:50px;margin-top:25px">
        <el-button
          class="fl"
          @click="dialogVisible = true"
          v-if="orderget.orderStatus!=4&&orderget.orderStatus!=5&&orderget.orderStatus!=6&&orderget.orderStatus!=9"
        >取消订单</el-button>
        <!-- 修改订单状态按钮:disabled="isChangeNumber || isLowPrice"-->
        <!-- 订单来源为线下直客的时候订单总额不等于已付金额时 加上islowPrice -->
        <el-button
          type="primary"
          v-if="orderget.orderStatus==0||orderget.orderStatus==10||orderget.orderStatus==1"
          @click="orderModification(orderget.orderStatus,orderget.occupyStatus)"
          :disabled="isChangeNumber || isLowPrice"
          class="confirm fr"
        >{{statusNext}}</el-button>
        <!--保存游客信息按钮-->
        <el-button
          type="primary"
          v-if="orderget.orderStatus!=4&&orderget.orderStatus!=5&&orderget.orderStatus!=6&&orderget.orderStatus!=9"
          @click="ordersave"
          :disabled="isSaveBtn"
          class="confirm fr"
        >保存更改</el-button>
        <!--取消按钮-->
        <el-button class="fr" @click="cancle">取消</el-button>
      </div>
      <!-- 更改的end -->
    </el-dialog>

    <!--取消订单弹框 @click="dialogVisible = false"-->
    <el-dialog title="提示" :visible.sync="dialogVisible" :modal-append-to-body="false" width="500px">
      <span>是否需要取消该订单</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="orderModification(orderget.orderStatus,0)">确 定</el-button> -->
        <el-button type="primary" @click="orderModification(9,0)">确 定</el-button>
      </span>
    </el-dialog>

    <!--填写游客信息-->
    <el-dialog
      :title="'出行人信息（'+winTitle+'）'"
      :visible.sync="dialogFormTour"
      class="city_list"
      @close="cancelInfo('conForm')"
      width="700px"
      height="500"
    >
      <el-form :model="conForm" :rules="rules" ref="conForm">
        <el-form-item label="中文姓名" prop="cnName" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.cnName" class="w200 fl"></el-input>
        </el-form-item>
        <el-form-item label="英文姓名" prop="enName" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.enName" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" label-width="110px" class="fl" style="width:310px">
          <el-radio-group v-model="conForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.mobile" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idCard" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.idCard" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="bornDate" label-width="110px" class="fl">
          <el-date-picker v-model="conForm.bornDate" type="date" placeholder="选择日期" class="w200"></el-date-picker>
        </el-form-item>
        <el-form-item label="证件类型" prop="credType" label-width="110px" class="fl">
          <el-select v-model="conForm.credType" placeholder="请选择">
            <el-option label="请选择" :value="0" />
            <el-option label="护照" :value="1" />
            <el-option label="港澳通行证" :value="2" />
            <el-option label="军官证" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="credCode" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.credCode" class="w200"></el-input>
        </el-form-item>
        <!-- <el-form-item label="证件有效期" prop="credTOV" label-width="110px" class="fl">
          <el-date-picker v-model="conForm.credTOV" type="date" placeholder="选择日期" class="w200"></el-date-picker>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer cb">
        <el-button @click="cancelInfo('conForm')">取 消</el-button>
        <el-button type="primary" @click="subInfo('conForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    orderId: 0,
    variable: 0,
    dialogType: 0,
    orderCode: "",
    paid: 0, //已付金额
    priceType: 0, //价格类型
    settlementType: 0, //同业社的结算方式 1为月结 2为非月结
    balance: 0, //剩余额度
    deposit: 0 //剩余预存款
  },
  data() {
    return {
      //流程管理弹窗
      propPriceType: this.priceType, //接收父组件传值的priceType，要不报错
      showContent: null, //保存更改传个父组件的值 为了list折叠
      dialogVisible: false,
      dialogFormProcess: false,
      orderget: {}, //保存单个订单信息
      teampreviewData: {}, //团期计划订单信息预览
      statusNow: "",
      statusNext: "",
      statusEnd: "",
      ruleForm: {
        //流程管理
        contactName: "",
        contactPhone: "",
        price: "1", //价格类型  1直客 2同业
        favourable: []
      },
      priceChange: "", //同业价格好还是直客价格
      isPricechange: null, //true为直客   false为同业价格
      isChangeNumber: false, //判断动态按钮是否可点击 数量和价格有变化的时候为true
      isLowPrice: false, //确认订单状态时 已付金额低于订单总价时为true
      isSaveBtn: false, //同业月结总价大于剩余额度和预存款时为true
      //游客信息
      quota: [], //余位信息负数红色提示
      endTimeStamp: "00天00时00分00秒", //倒计时
      enrolNum: [], //报名人数[1,3]形式
      // paidMaxEnrolNum: [], //已经金额后显示的 输入框的max
      enrolNums: false, //报名人数是否为空提示
      enrolNumsWarn: "",
      number: 0, //报名总人数
      prePayable: 0, //记录最开始的订单总价
      payable: 0, //总价
      dialogFormTour: false,
      salePrice: [], //报名类型价格列表数据
      salePriceNum: [], //报名类型价格列表数据副本,显示余位用
      tourType: 0, //报名类型索引
      fillIndex: 0, //报名类型下游客list索引
      preLength: [], //记录上一次报名人数[1,3]形式
      applyInfomations: [], //报名信息
      tour: [], //总游客信息,二维数组
      winTitle: "", //弹窗标题
      enrollDetail: "", //报名信息传给后台的格式
      enrollDetailShow: "", //报名信息展示在页面的格式
      conForm: {
        id: 0,
        isDeleted: 0,
        code: "",
        cnName: "",
        enName: "",
        sex: "",
        mobile: "",
        idCard: "", //身份证
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
        //变更数量
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

  watch: {
    variable() {
      if (this.dialogType == 1) {
        this.processManage(this.orderId);
        this.dialogFormProcess = true;
      }
    },
    enrolNum(val) {
      this.changeQuota();
      this.compPrice(1);
    },
    priceType() {
      this.propPriceType = this.priceType;
    }
  },

  methods: {
    //流程管理
    processManage(orderId) {
      //查询一条订单信息
      this.$http
        .post(this.GLOBAL.serverSrc + "/order/all/api/orderget", {
          id: orderId
        })
        .then(res => {
          //   let str =
          //     "成人(1323.00*1),成人(5000.00*1),成人(1323.00*1),人(1323.00*1),成人(5000.00*1),哈(1323.00*1),人(1323.00*1)";
          // let _arr = str.split(",");
          //  for( let i = _arr.length - 1;  i > 0;  i--){
          //    if( _arr[i].indexOf("成人") != -1) {
          //      _arr.splice(i,1)
          //      return _arr
          //    }
          //  }
          //  console.log(_arr)

          if (res.data.isSuccess == true) {
            this.orderget = res.data.object;
            this.payable = res.data.object.payable;
            // 报名信息
            this.enrollDetail = res.data.object.enrollDetail;
            this.ruleForm.favourable = this.orderget.favourable;
            this.getOrderStatus(
              this.orderget.orderStatus,
              this.orderget.endTime,
              this.orderget.occupyStatus,
              this.orderget.orderChannel
            );
            this.propPriceType == 1
              ? (this.isPricechange = true)
              : (this.isPricechange = false);
            this.propPriceType == 1
              ? (this.priceChange = "直客")
              : (this.priceChange = "同业");
            this.occupyStatus = this.orderget.occupyStatus; // 唐 占位状态
            //联系人信息
            this.Timechange(this.orderget.endTime);
            this.ruleForm.contactName = JSON.parse(
              res.data.object.contact
            ).Name;
            this.ruleForm.contactPhone = JSON.parse(
              res.data.object.contact
            ).Tel;
            this.orderSourceFun(res.data.object.orderChannel);
            this.dialogFormProcess = true;
            this.teampreview(res.data.object.planID);
            // 记录最开始的总价 isSaveBtnClick需要
            this.prePayable = this.orderget.payable;
            this.enrollDetail = this.enrollDetail.replace(/\s*/g,'')
            let _arr = this.enrollDetail.split(",");
            // console.log(res.data.object.enrollDetail.split(","),"this.enrolldetail")
            _arr.splice(_arr.length - 1, 1);
            let _res = []; //
            _arr.sort();
            for (let i = 0; i < _arr.length; ) {
              let count = 0;
              for (let j = i; j < _arr.length; j++) {
                if (_arr[i] == _arr[j]) {
                  count++;
                }
              }
              _res.push([_arr[i], count]);
              i += count;
            }
            //_res 二维数维中保存了 值和值的重复数
            let _newArr = [];
            for (let i = 0; i < _res.length; i++) {
              let a = _res[i][0].split("*");
              _newArr.push(a[0] + "x" + _res[i][1] + ")");
            }
            this.enrollDetailShow = _newArr.toString();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //同业的订单（月结的）记录以前的订单总价 改变后的总价差和剩余预存款和额度作对比 超过则不可保存更改
    isSaveBtnClick() {
      if (this.orderget.orderChannel === 1 && this.settlementType === 1) {
        if (this.payable - this.prePayable > this.deposit + this.balance) {
          return (this.isSaveBtn = true);
        } else {
          this.isSaveBtn = false;
        }
        if (this.payable === this.prePayable) {
          return (this.isSaveBtn = false);
        }
      }
    },
    //唐时间转换
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
        this.payable < this.balance + this.deposit &&
        status !== 9
      ) {
        this.$message.error("总价超过剩余预存款和额度");
      } else {
        // console.log(status)
        //订单修改保存
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
              for (let j = 0; j < this.tour[i].length; j++) {
                if (this.tour[i][j].cnName == "") {
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
        // 订单工作流状态更新-作废订单
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
              // 取消订单按钮
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
    //列表订单状态显示
    getOrderStatus(status, endTime, occupyStatus, orderChannel) {
      // console.log("订单来源是直客还是同业",orderChannel)
      if (status == 2) {
        status = 3; //没有电子合同，直接跳到待出行
      }
      switch (status) {
        case 0: //订单状态0，暂按未确认处理
          switch (occupyStatus) {
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
    // 补充资料状态下监听动态按钮 价格变革则不能点击
    addInfoFun() {
      if (this.orderget.payable !== this.payable) {
        this.isChangeNumber = true; //数量有变动 则动态按钮不可点击 + 补充信息的时候必须保存后修改
      } else {
        this.isChangeNumber = false;
      }
    },
    changeQuota() {
      //余位变化方法
      this.salePrice = JSON.parse(JSON.stringify(this.salePriceNum));
      let salePriceType = {};
      // 实时减少相关余位信息，提示库存不足
      //判断下单时  是否是预订占位 如果是则余位不变
      if (this.orderget.occupyStatus !== 1 || this.orderget.orderStatus !== 0) {
        for (let i = 0; i < this.salePrice.length; i++) {
          // this.salePrice[i].quota = parseInt(this.salePrice[i].quota) - parseInt(this.enrolNum[i]);
          this.salePrice[i].quota =
            parseInt(this.salePrice[i].quota) - parseInt(this.enrolNum[i]);
          salePriceType = this.salePrice[i];
          // if (salePriceType.quota < 0) {
          //   //判断是否显示库存不足
          //   this.quota[i] = true;
          // } else {
          //   this.quota[i] = false;
          // }
          if (this.enrolNum[i] == undefined) {
            this.enrolNum[i] = "";
          }
          if (salePriceType.quota === -1) {
            salePriceType.quota = 0;
          }
        }
      }
    },

    // 订单是否需要跳转回确认占位的状态
    isEqualityFun() {
      // get的总价不等于更改后的总价时
      if (this.orderget.payable !== this.payable) {
        // 如果是补充资料状态下  价格有变动 则动态按钮置灰 点击保存修改然后跳转到确认占位状态 (待出行修改价格变动也要跳转到确认占位状态)
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

    peoNum(index, enrollID, enrollName, price_01, price_02) {
      // this.isChangeNumber = true; //数量有变动 则动态按钮不可点击 + 补充信息的时候必须保存后修改
      //填写报名人数
      let arrLength; //报名人数
      let preLength; //记录上一次报名人数
      preLength = this.preLength[index]; //获取上一次报名人数
      arrLength = this.enrolNum[index]; //获取当前报名人数
      this.preLength[index] = this.enrolNum[index]; //记录上一次报名人数为当前报名人数
      let len;
      // 如果报名类型有配额 则输入的数字不可超过配额
      if (this.salePriceNum[index].quota !== 0) {
        if (this.enrolNum[index] == this.salePriceNum[index].quota) {
          this.enrolNum[index] = this.salePriceNum[index].quota;
        }
      }
      if (arrLength > preLength) {
        //修改数量时，如果增加数量，直接填充数组，否则从数组末尾减去多余对象
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
        // 报名信息增加enrollDetail拼接
        let price;
        this.isPricechange == true ? (price = price_01) : (price = price_02);
        price = this.toDecimal2(price);
        this.enrollDetail += `${enrollName}(${price} * 1),`;
      } else {
        // 循环判断表格中的出行人信息是否有没填写的如果有则自动删除 没有则提示手动删除
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
          // console.log(isInfNullIndex)
        }
        if (isInfNull) {
          this.tour[index].splice(isInfNullIndex, 1);
        } else {
          const num = this.tour[index].length.toString();
          this.$set(this.enrolNum, index, num);
          this.$message.error("请手动删除表格中的出行人");
        }
        // 报名信息减少enrollDetail拼接
        let _arr = this.enrollDetail.split(",");
        for (let i = _arr.length - 1; i > 0; i--) {
          if (_arr[i].indexOf(enrollName) != -1) {
            _arr.splice(i, 1);
            return this.enrollDetail = _arr.toString();
          }
        }

        // let tour = this.tour[index];
        // if (tour[tour.length - 1].cnName != "") {
        //   const num = this.tour[index].length.toString()
        //   this.$set(this.enrolNum,index,num)
        //   this.$message.error("请手动删除表格中的出行人");
        // } else {
        //   this.tour[index].splice(arrLength - preLength, preLength - arrLength);
        // }
      }
      setTimeout(() => {
        this.isSaveBtnClick();
      }, 100);
      this.isEqualityFun();
    },
    fillTour(type, index) {
      this.winTitle = this.salePrice[type].enrollName; //编辑游客信息弹窗标题
      if (this.tour[type][index].cnName != "点击填写") {
        this.conForm = JSON.parse(JSON.stringify(this.tour[type][index])); //如果已填完信息，把信息显示出来
      } else {
        this.conForm = {
          id: this.tour[type][index].id,
          isDeleted: 0,
          code: "",
          cnName: "",
          enName: "",
          sex: "",
          mobile: "",
          idCard: "", //身份证
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
    //游客信息保存
    subInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let guest = JSON.parse(JSON.stringify(this.conForm));
          guest.enrollID = this.salePrice[this.tourType].enrollID; //填充报名类型
          guest.enrollName = this.salePrice[this.tourType].enrollName; //填充报名类型name
          if (this.ruleForm.price == 1) {
            guest.singlePrice = this.salePrice[this.tourType].price_01; //填充价格
          } else {
            guest.singlePrice = this.salePrice[this.tourType].price_02;
          }
          this.tour[this.tourType][this.fillIndex] = guest;
          this.dialogFormTour = false;
          this.$refs[formName].resetFields();
        }
      });
    },

    //游客信息取消
    cancelInfo(formName) {
      this.dialogFormTour = false;
      setTimeout(() => {
        this.$refs[formName].resetFields();
      }, 500);
    },

    teamEnrolls(planId) {
      //获取报名类型列表数据
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/enrolls", {
          id: planId
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.preLength = []; //记录上一次报名人数[1,3]形式
            this.enrolNum = []; //报名人数[1,3]形式
            this.quota = []; //余位信息负数红色提示
            this.tour = []; //总游客信息,二维数组
            let data = res.data.objects;
            for (let i = 0; i < data.length; i++) {
              this.quota.push(false);
              this.tour.push([]);
            }
            //出游人信息转换格式,二维数组，通过类型分类,便于页面分类型显示出游人
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
                  // console.log(g,"g")
                  this.tour[g].push(guest[i]);
                } else {
                  this.tour.push();
                }
              }
            }
            //设置报名人数
            for (let i = 0; i < this.tour.length; i++) {
              this.applyInfomations.push(this.tour[i].length);
              this.preLength.push(this.tour[i].length);
              this.enrolNum.push(this.tour[i].length);
            }
            // 后期收款后 的报名人数显示 不可增加但是可以减少  减少后再增加的人数不可超过收款时的报名人数
            // this.paidMaxEnrolNum = [...this.enrolNum];
            for (let i = 0; i < data.length; i++) {
              //如果配额为0或者配额大于库存，余位显示总库存
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
      //团期计划订单信息预览
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

    // switch 开关监听价格显示事件 true为直客价格 false为同业价格  price_01是直客价格 price_01是同业价格
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
    //什么都不填写然后失去光标变为0
    comPriceBlur(item, index) {
      if (item.price == "") {
        item.price = 0;
      }
    },

    compPrice(type, index) {
      //计算总价
      if (type == 2) {
        this.isChangeNumber = true; //数量有变动 则动态按钮不可点击
        // 其他费用和优惠 随时监听 然后总价变化
        if (
          typeof this.ruleForm.favourable[index].price == "number" &&
          this.ruleForm.favourable[index].price == ""
        ) {
          return;
        }
        // 原先的 没看懂 留着
        // if (
        //   typeof this.ruleForm.favourable[index].price !== "number" &&
        //   this.ruleForm.favourable[index].price != ""
        // ) {
        //   return;
        // }
        // 原先结束
      }
      this.payable = 0;
      for (let i = 0; i < this.enrolNum.length; i++) {
        this.payable +=
          this.enrolNum[i] *
          (this.propPriceType == 1
            ? this.salePrice[i].price_01
            : this.salePrice[i].price_02);
      }
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
      //更新订单，补充游客信息
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

          // get的总价不等于更改后的总价时 补充资料待出行都要跳转回到确认中占位状态
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

          //获取报名总人数
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
          //出游人信息
          let guest = [];
          for (let i = 0; i < this.tour.length; i++) {
            for (let j = 0; j < this.tour[i].length; j++) {
              guest.push(this.tour[i][j]);
            }
          }
          // 补充资料前未填写出行人信息是可以点击动态按钮和保存更改的
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

          // 补充资料和待出行 信息更改跳转回到确认占位状态
          if (
            this.isChangeNumber === true &&
            (this.orderget.orderStatus === 1 ||
              this.orderget.orderStatus === 2 ||
              this.orderget.orderStatus === 3)
          ) {
            obj.orderStatus = 10;
          }

          // 拼接字段 enrollDetail报名类型详情
          // let enrollDetail = "";
          // let price;
          // this.salePrice.forEach((ele, idx) => {
          //   if (this.isPricechange) {
          //     price = this.toDecimal2(ele.price_01);
          //   } else {
          //     price = this.toDecimal2(ele.price_02);
          //   }
          //   if (this.enrolNum[idx] !== 0) {
          //     enrollDetail += `${ele.enrollName} ( ${price} * ${this.enrolNum[idx]} ),`;
          //   }
          // });

          // 签署订单按钮
          if (id === 3) {
            obj.orderStatus = 3;
          }

          // 补充资料按钮
          if (id === 1) {
            obj.orderStatus = 1;
          }

          // 保存的时候用的直客价格还是同业的价格 swatch
          if (this.propPriceType == 1) {
            obj.priceType = 1;
          } else {
            obj.priceType = 2;
          }

          obj.enrollDetail = this.enrollDetail;
          obj.guests = guest;
          obj.payable = this.payable;
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
      });
    },

    // 出行人信息表单中的删除
    delTravel(type, index) {
      //删除单条表格数据
      if (this.tour[index][type].cnName != "") {
        this.$confirm("是否删除该条出行人信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(res => {
          this.tour[index].splice(type, 1); //手动删除单条出行人信息
          this.enrolNum[index] = this.tour[index].length; //删除出行人信息后，表格长度和报名人数相等
          this.preLength[index] = this.enrolNum[index];
        });
      } else {
        this.tour[index].splice(type, 1); //手动删除单条出行人信息
        this.enrolNum[index] = this.tour[index].length; //删除出行人信息后，表格长度和报名人数相等
        this.preLength[index] = this.enrolNum[index];
      }
    },

    // 监听订单来源是同业社还是直客下单  是直客则返回true 等于1就是同业
    orderSourceFun(orderChannel) {
      if (orderChannel !== 1) return true;
    },

    // 当订单来源为线下直客，订单总额不等于已付金额的时候 补充资料下方出现提示语
    replenishInfoToastFun(orderChannel) {
      if (this.orderSourceFun(orderChannel) == true) {
        if (this.payable > this.paid) {
          this.isLowPrice = true;
        }
      }
    },

    //整数转浮点数
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

    cancle() {
      this.isChangeNumber = false;
      this.enrolNums = false;
      this.$refs["ruleForm"].resetFields();
      this.dialogFormProcess = false;
      this.isLowPrice = false;
      this.isSaveBtn = false;
      this.applyInfomations = [];
      this.enrollDetail = "";
    }
  }
};
</script>

<style scoped>
/* 报名信息 */
.applyinfoParent {
  margin-top: 30px;
}

.applyinfo {
  margin-right: 10px;
  list-style: none;
}

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

/* 余位 */
.yuwei {
  margin: 20px 0;
}
/*报名人数*/
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
  float: left;
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
/*费用*/
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
/*按钮*/
.confirm {
  margin-left: 20px;
}
/*游客信息*/
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
.w200 {
  width: 200px;
}
.text {
  font-size: 14px;
}
/* 出行人表格begin后加 */
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
/* 出行人表格end后加 */
.oh {
  overflow: hidden;
}
/*通用*/
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