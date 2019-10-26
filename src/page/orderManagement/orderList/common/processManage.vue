<template>
  <div>
    <!--流程管理弹窗-->
    <el-dialog title="流程管理" :visible.sync="dialogFormProcess" :close-on-click-modal="false" class="city_list" width="850px" style="margin-top:-50px" @close="cancle">
      <!--订单状态-->
      <div style="position:relative;height:50px">
        <el-button type="primary" plain icon="el-icon-check" circle size="medium"></el-button>
        <span class="sta-title">{{statusNow}}</span>
        <span v-if="statusNext!=''">
          <em class="line line1"></em>
          <el-button type="primary" circle size="medium">&nbsp;2&nbsp;</el-button>
          <span class="sta-title">{{statusNext}}</span>
          <span class="confirm-time" v-if="false">10:19:00</span>
        </span>
        <span v-if="statusEnd!=''">
          <em class="line line2"></em>
          <el-button circle size="medium">&nbsp;3&nbsp;</el-button>
          <span class="sta-title">{{statusEnd}}</span>
        </span>
      </div>
      <!-- switch 更改价格(直客价和同业价) beign-->
      <p>使用{{priceChange}}价格</p>
      <el-switch v-model="isPricechange" active-color="#409eff" inactive-color="#dcdfe6" @change="priceChangeEvent(isPricechange)">
      </el-switch>
      <!-- switch 更改价格(直客价和同业价) end-->
      <!--报名人数-->
      <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm cb" :rules="rules">
        <div>
          <span class="num-req">*</span>
          报名人数
        </div>
        <div class="registration" v-for="(item,index) in salePrice" :key="index">
          {{item.enrollName}}￥
          <span v-show="ruleForm.price==1">{{item.price_01}}*{{enrolNum[index]}}</span>
          <span v-show="ruleForm.price==2">{{item.price_02}}*{{enrolNum[index]}}</span>
          <div>
            <el-input-number
              class="input-num"
              v-model="enrolNum[index]"
              @change="peoNum(index,item.enrollID,item.enrollName)"
              :min="0"
              :max="salePriceNum[index].quota"
              size="medium"
              :disabled="orderget.orderStatus==2||orderget.orderStatus==4||orderget.orderStatus==5||orderget.orderStatus==6||orderget.orderStatus==9"
            ></el-input-number>
          </div>
          <div v-bind:class="{red:quota[index]}">
            余位{{item.quota}}
            <span v-show="quota[index]">库存不足</span>
          </div>
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
              @input="compPrice(2,index)"
            ></el-input>
          </el-form-item>
          <el-form-item class="otherCost-mark" v-if="index == 0">
            <el-input v-model="item.mark" placeholder="请输入摘要" class="input1"></el-input>
          </el-form-item>
        </div>
        <!--总价-->
        <div class="price">
          <p class="totle">总价：￥{{orderget.payable}}</p>
          <p class="surplus" v-if="false">剩余额度：￥400,000.00</p>
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
        <el-form-item label="出行人信息" class="cb">
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
        </el-form-item>
      </el-form>
      <!--按钮-->
      <hr />
      <div style="height:50px;margin-top:25px">
        <!--取消订单按钮-->
        <el-button
          class="fl"
          @click="orderModification(orderget.orderStatus,1)"
          v-if="orderget.orderStatus!=4&&orderget.orderStatus!=5&&orderget.orderStatus!=6&&orderget.orderStatus!=9"
        >取消订单</el-button>
        <!--修改订单状态按钮-->
        <el-button
          type="primary"
          v-if="orderget.orderStatus!=2&&orderget.orderStatus!=3&&orderget.orderStatus!=4&&orderget.orderStatus!=5&&orderget.orderStatus!=6&&orderget.orderStatus!=9"
          @click="orderModification(orderget.orderStatus)"
          class="confirm fr"
        >{{statusNext=="签订合同"?"已签合同":statusNext}}</el-button>
        <!--保存游客信息按钮-->
        <el-button
          type="primary"
          v-if="orderget.orderStatus!=4&&orderget.orderStatus!=5&&orderget.orderStatus!=6&&orderget.orderStatus!=9"
          @click="ordersave"
          class="confirm fr"
        >保存更改</el-button>
        <!--取消按钮-->
        <el-button class="fr" @click="cancle">取消</el-button>
      </div>
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
        <el-form-item label="证件有效期" prop="credTOV" label-width="110px" class="fl">
          <el-date-picker v-model="conForm.credTOV" type="date" placeholder="选择日期" class="w200"></el-date-picker>
        </el-form-item>
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
    orderCode:""
  },
  data() {
    return {
      //流程管理弹窗
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
      priceChange: '直客',//同业价格好还是直客价格
      isPricechange: true, //true为直客   false为同业价格
      //游客信息
      quota: [], //余位信息负数红色提示
      enrolNum: [], //报名人数[1,3]形式
      enrolNums: false, //报名人数是否为空提示
      enrolNumsWarn: "",
      number: 0, //报名总人数
      dialogFormTour: false,
      salePrice: [], //报名类型价格列表数据
      salePriceNum: [], //报名类型价格列表数据副本,显示余位用
      tourType: 0, //报名类型索引
      fillIndex: 0, //报名类型下游客list索引
      preLength: [], //记录上一次报名人数[1,3]形式
      tour: [], //总游客信息,二维数组
      winTitle: "", //弹窗标题
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
        credTOV: "",
        orderID: 0,
        orderCode: "string",
        orgID: 0,
        userID: 0
      },
      rules: {
        //变更数量
        price: [{ required: true, message: "请选择价格", trigger: "change" }],
        contactName: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
          {
            pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            message: "电话号格式不正确",
            trigger: "blur"
          }
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
    variable: function() {
      if (this.dialogType == 1) {
        this.processManage(this.orderId);
        this.dialogFormProcess = true;
      }
    },
    enrolNum: function(val) {
      this.changeQuota();
      this.compPrice(1);
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
          console.log("查询一条订单信息", res);
          if (res.data.isSuccess == true) {
            this.orderget = res.data.object;
            this.ruleForm.favourable = this.orderget.favourable;
            this.getOrderStatus(this.orderget.orderStatus);
            //联系人信息
            this.ruleForm.contactName = JSON.parse(
              res.data.object.contact
            ).Name;
            this.ruleForm.contactPhone = JSON.parse(
              res.data.object.contact
            ).Tel;

            this.dialogFormProcess = true;
            this.teampreview(res.data.object.planID);
            // setTimeout(() => {
            //   this.teamEnrolls(res.data.object.planID);
            // },500)
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    orderModification(status, cancle) {
      //订单修改保存
      let url = "/order/stat/api";
      switch (status) {
        case 0:
        case 7:
          url += "/confirmed";
          break;
        case 10:
          url += "/material";
          break;
        case 1:
          url += "/econtract";
          break;
        case 2:
          url += "/signcontract";
          break;
      }
      if (cancle) {
        url = "/order/stat/api/invalid";
      }
      this.$http
        .post(this.GLOBAL.serverSrc + url, {
          object: {
            id: this.orderget.id
          }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.$emit("orderPage");
            this.cancle();
          }
        });
    },
    //列表订单状态显示
    getOrderStatus(status) {
      switch (status) {
        case 0: //订单状态0，暂按未确认处理
          this.statusNow = "未确认";
          this.statusNext = "订单确认";
          this.statusEnd = "补充资料";
          break;
        case 1:
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
          this.statusNow = "待出行";
          this.statusNext = "出行中";
          this.statusEnd = "待点评";
          break;
        case 4:
          this.statusNow = "出行中";
          this.statusNext = "待点评";
          this.statusEnd = "订单完成";
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
          this.statusNow = "未确认";
          this.statusNext = "订单确认";
          this.statusEnd = "补充资料";
          break;
        case 9:
          this.statusNow = "作废订单";
          this.statusNext = "";
          this.statusEnd = "";
          break;
        case 10:
          this.statusNow = "订单确认";
          this.statusNext = "补充资料";
          this.statusEnd = "签订合同";
          break;
      }
    },
    changeQuota() {
      //余位变化方法
      this.salePrice = JSON.parse(JSON.stringify(this.salePriceNum));
      // console.log('//余位变化方法', this.salePrice)
      let salePriceType = {};
      // 实时减少相关余位信息，提示库存不足
      for (let i = 0; i < this.salePrice.length; i++) {
        // this.salePrice[i].quota = parseInt(this.salePrice[i].quota) - parseInt(this.enrolNum[i]);
        this.salePrice[i].quota = parseInt(this.salePrice[i].quota) - parseInt(this.enrolNum[i]);
        salePriceType = this.salePrice[i];
        // console.log(salePriceType)
        if (salePriceType.quota < 0) {
          //判断是否显示库存不足
          this.quota[i] = true;
        } else {
          this.quota[i] = false;
        }
      }
    },
    peoNum(index, enrollID, enrollName) {
      //填写报名人数
      let arrLength; //报名人数
      let preLength; //记录上一次报名人数
      preLength = this.preLength[index]; //获取上一次报名人数
      arrLength = this.enrolNum[index]; //获取当前报名人数
      // console.log(preLength,'获取上一次报名人数')
      // console.log(arrLength,'获取当前报名人数')
      this.preLength[index] = this.enrolNum[index]; //记录上一次报名人数为当前报名人数
      var len;
      if (arrLength > preLength) {
        //修改数量时，如果增加数量，直接填充数组，否则从数组末尾减去多余对象
        len = arrLength - preLength;
        for (var i = 0; i < len; i++) {
          this.tour[index].push({
            enrollID: enrollID,
            enrollName: enrollName,
            id: 0,
            isDeleted: 0,
            code: "string",
            cnName: "点击填写",
            enName: "string",
            sex: "0",
            idCard: "string",
            singlePrice: 0,
            mobile: "string",
            bornDate: 0,
            credType: 0,
            credCode: "string",
            credTOV: "",
            orderID: 0,
            orderCode: "string",
            orgID: 0,
            userID: 0
          });
        }
      } else {
        this.tour[index].splice(arrLength - preLength, preLength - arrLength);
      }
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
          credTOV: "",
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
      // console.log("subinfo是否走")
      this.$refs[formName].validate(valid => {
        if (valid) {
          let guest = JSON.parse(JSON.stringify(this.conForm));
          // console.log(guest.bornDate);
          // console.log(this.salePrice[this.tourType],'this.salePrice[this.tourType]')
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
      // console.log(planId)
      //获取报名类型列表数据
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/enrolls", {
          id: planId
        })
        .then(res => {
          console.log('teamEnrolls',res)
          if (res.data.isSuccess == true) {
            this.preLength = []; //记录上一次报名人数[1,3]形式
            this.enrolNum = []; //报名人数[1,3]形式
            this.quota = []; //余位信息负数红色提示
            this.tour = []; //总游客信息,二维数组
            let data = res.data.objects;
            // console.log(data)
            for (let i = 0; i < data.length; i++) {
              this.quota.push(false);
              this.tour.push([]);
            }
            // console.log(this.quota,"this.quota")
            //出游人信息转换格式,二维数组，通过类型分类,便于页面分类型显示出游人
            var guest = this.orderget.guests;
            // console.log('guest' , guest)
            var j = 0;
            //  if (this.orderget.guest !== undefined) {
            for (let i = 0; i < guest.length; i++) {
              if (guest[i].credTOV == 0) {
                guest[i].credTOV = ""; //转为空字符，日历日期显示当前月份
              }
              if (i > 0 && guest[i].enrollName != guest[i - 1].enrollName) {
                this.tour[j + 1].push(guest[i]);
              } else {
                this.tour[j].push(guest[i]);
              }
            }
            //  }
            // console.log('this.tourt',this.tour)
            //设置报名人数
            for (let i = 0; i < this.tour.length; i++) {
              this.preLength.push(this.tour[i].length);
              this.enrolNum.push(this.tour[i].length);
            }
            // console.log(this.teampreviewData.remaining,'this.teampreviewData.remaining')
            for (let i = 0; i < data.length; i++) {
              if (
                data[i].quota == 0 ||
                data[i].quota > this.teampreviewData.remaining
              ) {
                //如果配额为0或者配额大于库存，余位显示总库存
                data[i].quota = this.teampreviewData.remaining;
              } else {
                data[i].quota =
                  parseInt(data[i].quota) + parseInt(this.enrolNum[i]);
              }
            }
            this.salePrice = data;
            this.salePriceNum = data;
            for(let i = 0; i < this.salePriceNum.length; i++) {
              this.salePriceNum[i].quota =  parseInt(this.salePriceNum[i].quota) + parseInt(this.preLength[i]);
            }
            // console.log(this.salePriceNum)
            // console.log(this.salePrice,'enrollssalePrice')
            // console.log(this.salePriceNum,'enrollssalePriceNum')
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
            console.log(res,'团期计划订单信息预览teampreviewData')
            this.teampreviewData = res.data.object;
            this.teamEnrolls(planId);
          }
        });
    },

     // switch 开关监听价格显示事件 true为直客价格 false为同业价格  price_01是直客价格 price_01是同业价格
    priceChangeEvent(val) {
      if(val == true) {
        this.priceChange = "直客"
        this.ruleForm.price = "1"
        console.log()
        this.compPrice()
      } else {
        this.priceChange = "同业"
        this.ruleForm.price = "2"
        this.compPrice()
      }
    },

    compPrice(type, index) {
      //计算总价
      if (type == 2) {
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
      this.orderget.payable = 0;
      for (let i = 0; i < this.enrolNum.length; i++) {
        // console.log(this.salePrice[i].price_01)
        this.orderget.payable +=
          this.enrolNum[i] *
          (this.ruleForm.price == 2
            ? this.salePrice[i].price_01
            : this.salePrice[i].price_02);
      }
      if (this.orderget.favourable[0]) {
        this.orderget.payable += parseInt(
          this.orderget.favourable[0].price
            ? this.orderget.favourable[0].price
            : 0
        );
      }
      if (this.orderget.favourable[1]) {
        this.orderget.payable -= parseInt(
          this.orderget.favourable[1].price
            ? this.orderget.favourable[1].price
            : 0
        );
      }
    },
    ordersave() {
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

          //获取报名总人数
          obj.number = this.number;
          for (let i = 0; i < this.enrolNum.length; i++) {
            if (this.enrolNum[i]) {
              obj.number += parseInt(this.enrolNum[i]);
            }
          }
          if (obj.number == 0) {
            (this.enrolNumsWarn = "报名人数不能为空"), (this.enrolNums = true);
            return false;
          } else if (obj.number > this.teampreviewData.remaining) {
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
          for (let i = 0; i < guest.length; i++) {
            if (guest[i].cnName == "点击填写") {
              this.$message.error("请补全游客资料");
              return;
            }
            guest[i].bornDate = new Date(guest[i].bornDate).getTime(); //时间格式转换
            guest[i].credTOV = new Date(guest[i].credTOV).getTime();
          }

          obj.guests = guest;
          this.$http
            .post(this.GLOBAL.serverSrc + "/order/all/api/ordersave", {
              object: obj
            })
            .then(res => {
              console.log('保存',res)
              if (res.data.isSuccess == true) {
                this.$message({
                  message: "更改成功",
                  type: "success"
                });
                this.$parent.orderPage();
                // this.$emit("orderPage");
                this.cancle();
                // this.processManage(this.orderId);
              }
            });
        }
      });
    },
    cancle() {
      this.enrolNums = false;
      this.$refs["ruleForm"].resetFields();
      this.dialogFormProcess = false;
    }
  }
};
</script>

<style scoped>
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
  top: 30px;
  left: 394px;
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
.oh {
  overflow: hidden;
}
/*通用*/
.fl {
  float: left;
}
.fr {
  float: right;
}
.cb {
  clear: both;
}
.dialog-footer {
  text-align: left;
  margin: -40px 0 20px 265px;
}
</style>