<template>
  <div>
    <el-dialog
      title="转团"
      :visible.sync="dialogFormTransfer"
      custom-class="city_list dialogOrder"
      style="margin-top:-100px"
      width="1000px"
      @close="cancelInfoOrder('ruleForm')"
    >
      <div class="main1">
        <div class="order-title">
          <h2>订单信息</h2>
        </div>
        <div class="pro-info">
          <table>
            <tr>
              <td width="80">产 品 ：</td>
              <td>{{teampreviewData.title}}</td>
            </tr>
            <tr>
              <td>团期计划：</td>
              <td>{{teampreviewData.groupCode}}</td>
            </tr>
            <tr>
              <td>套餐名称：</td>
              <td>{{teampreviewData.package}}</td>
            </tr>
            <tr>
              <td>出 发 地 ：</td>
              <td>{{teampreviewData.pod}}</td>
            </tr>
            <tr>
              <td>目 的 地 ：</td>
              <td>{{teampreviewData.destination}}</td>
            </tr>
            <tr>
              <td>出发日期：</td>
              <td>{{teampreviewData.date}}</td>
            </tr>
            <tr>
              <td>报名人数：</td>
              <td>成人 * 3，儿童 * 1</td>
            </tr>
            <tr>
              <td>总 价 ：</td>
              <td></td>
            </tr>
          </table>
        </div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="产品名称" prop="productName" class="fl cb">
            <el-input v-model="ruleForm.productName" class="ml13 w200" type="text"></el-input>
          </el-form-item>
          <el-form-item label="套餐" prop="setMeal" class="fl">
            <el-select v-model="ruleForm.setMeal" placeholder="请选择">
              <el-option label="套餐1" :value="1" />
              <el-option label="套餐2" :value="2" />
              <el-option label="套餐3" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="团期计划" prop="productName" class="cb">
            <el-input v-model="ruleForm.orderCode" class="ml13 w200" type="text"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price" class="cb price">
            <el-radio-group v-model="ruleForm.price">
              <span
                v-for="(item,index) in salePrice"
                :key="index"
                style="margin:14px 18px 0 13px"
              >{{item.enrollName}}：￥{{item.price_01}}</span>
              <br />
              <!--
                 <el-radio label="1" class="radiomar">销售价：<span v-for="item in salePrice">{{item.enrollName}}（￥{{item.price_01}}）</span></el-radio><br/>
                 <el-radio label="2" class="radiomar">同业价：<span v-for="item in salePrice">{{item.enrollName}}（￥{{item.price_02}}）</span></el-radio><br/>
                 <el-radio label="自定义" class="radiomar">自定义：
                       成人<el-form-item prop="price1" class="disib"><el-input v-model="ruleForm.price1" class="pricew"></el-input></el-form-item>
                       儿童<el-form-item prop="price2" class="disib"><el-input v-model="ruleForm.price2" class="pricew"></el-input></el-form-item>
                       老人<el-form-item prop="price3" class="disib"><el-input v-model="ruleForm.price3" class="pricew"></el-input></el-form-item>
                       单房差<el-form-item prop="price4" class="disib"><el-input v-model="ruleForm.price4" class="pricew"></el-input></el-form-item>
              </el-radio>-->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="报名人数" class="fl">
            <div class="num-req">*</div>
          </el-form-item>
          <div class="fl">
            <table style="margin:-7px 0 17px 13px">
              <tr v-for="(item,index) in salePrice" :key="index">
                <td height="45">{{item.enrollName}}</td>
                <td height="45">
                  <el-input
                    v-model="enrolNum[index]"
                    class="numw"
                    @input="peoNum(index,item.enrollID,item.enrollName)"
                    type="number"
                    :min="0"
                  ></el-input>
                  <span v-bind:class="{red:quota[index]}">
                    余（{{item.quota}}）
                    ￥
                    <span v-show="ruleForm.price==1">{{item.price_01}}</span>
                    <span v-show="ruleForm.price==2">{{item.price_02}}</span>
                    <span v-show="quota[index]">库存不足</span>
                  </span>
                </td>
              </tr>
            </table>
            <div class="red ml13" style="margin-top:-30px" v-show="enrolNums">报名人数不能为空</div>
          </div>
          <!--
            <el-form-item label="" prop="">
              <div class="ml13">单房差 ￥340</div>
            </el-form-item>
          -->
          <el-form-item label="其他费用" prop="otherCost" class="fl cb">
            <el-input v-model="ruleForm.otherCost" class="numw" type="number" :min="0"></el-input>
          </el-form-item>
          <div class="fl">
            备注
            <el-input v-model="ruleForm.otherCostRemark" class="cost-remark"></el-input>
          </div>
          <el-form-item label="整体优惠" prop="allDiscount" class="cb fl">
            <el-input v-model="ruleForm.allDiscount" class="numw" type="number" :min="0"></el-input>
          </el-form-item>
          <div class="fl">
            备注
            <el-input v-model="ruleForm.allDisRemark" class="cost-remark"></el-input>
          </div>
          <el-form-item label="总计" prop="totalPrice" class="cb">
            <div class="ml13">{{ruleForm.totalPrice}}</div>
          </el-form-item>
          <el-form-item label="订单联系人" prop="contactName" class="fl">
            <span class="ml13">姓名</span>
            <el-input v-model="ruleForm.contactName" class="numw" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item prop="contactPhone" class="fl" style="margin-left:-80px">
            电话
            <el-input v-model="ruleForm.contactPhone" class="numw" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="出行人信息" class="cb">
            <div class="oh" v-for="(item,indexPrice) in salePrice" :key="indexPrice">
              <div class="tour-til">{{item.enrollName}}</div>
              <div class="tourist">
                <input
                  v-for="(item,index) in tour[indexPrice]"
                  :key="index"
                  placeholder="点击填写"
                  v-model="item.cnName"
                  @click="fillTour(indexPrice,index)"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="备注" prop>
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6}"
              class="remark"
              placeholder="请输入内容"
              v-model="ruleForm.remark"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="ml13" @click="cancelInfoOrder('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" class="ml13">下单</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="'出行人信息（'+winTitle+'）'"
      :visible.sync="dialogFormTour"
      class="city_list"
      @close="cancelInfo('conForm')"
      width="700px"
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
    <el-dialog title="提示" :visible.sync="orderSuc" width="500px">
      <h3 class="ordersuc-title">下单成功</h3>
      <div class="text item">订单号：{{orderCode}}</div>
      <div class="text item">产品名称：{{teampreviewData.title}}</div>
      <div class="text item">团期计划：{{teampreviewData.groupCode}}</div>
      <el-button type="primary" style="margin:20px 0 10px 200px" @click="orderSuc = false">关闭</el-button>
    </el-dialog>
    <!-- </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  props: {
    // planId: 0,
    orderId: {
      type: Number
    },
    a_variable: 0,
    dialogType: 0
  },
  data() {
    return {
      dialogFormTransfer: false,
      ruleForm: {
        productName: "",
        setMeal: "",
        orderCode: "",
        price: "1",
        price1: "",
        price2: "",
        price3: "",
        price4: "",
        otherCost: 0,
        otherCostRemark: "",
        allDiscount: 0,
        allDisRemark: "",
        totalPrice: 0,
        contactName: "",
        contactPhone: "",
        remark: ""
      },
      quota: [], 
      enrolNum: [], 
      enrolNums: false, 
      dialogFormTour: false,
      salePrice: [], 
      salePriceNum: [], 
      tourType: 0, 
      fillIndex: 0, 
      preLength: [], 
      tour: [], 
      winTitle: "", 
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
        credTOV: 0,
        orderID: 0,
        orderCode: "string",
        orgID: sessionStorage.getItem("orgID"),
        userID: sessionStorage.getItem("id")
      },
      orderSuc: false,
      teampreviewData: {},
      orderCode: "",
      ifOrderInsert: true,
      rules: {
        productName: [
          { required: true, message: "请输入产品名称", trigger: "blur" }
        ],
        setMeal: [{ required: true, message: "请选择套餐", trigger: "change" }],
        orderCode: [{ required: true, message: "请输入团号", trigger: "blur" }],
        price: [{ required: true, message: "请选择价格", trigger: "change" }],
        price1: [{ pattern: /^[+]{0,1}(\d+)$/, message: "价格必须为数字值" }],
        price2: [{ pattern: /^[+]{0,1}(\d+)$/, message: "价格必须为数字值" }],
        price3: [{ pattern: /^[+]{0,1}(\d+)$/, message: "价格必须为数字值" }],
        price4: [{ pattern: /^[+]{0,1}(\d+)$/, message: "价格必须为数字值" }],
        totalPrice: [{ required: true, message: "价格不能为空" }],
        otherCost: [
          { required: true, message: "请输入其他费用", trigger: "blur" },
          {
            pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/,
            message: "必须为数字值，并且不允许是负数"
          }
        ],
        allDiscount: [
          { required: true, message: "请输入整体优惠", trigger: "blur" },
          {
            pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/,
            message: "必须为数字值，并且不允许是负数"
          }
        ],
        num: [{ required: true, message: "请输入数量", trigger: "blur" }],
        contactName: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "请输入联系人电话", trigger: "blur" }
        ],
        cnName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        enName: [
          { required: true, message: "请输入姓（拼音）", trigger: "blur" },
          {
            pattern: /(a[io]?|ou?|e[inr]?|ang?|ng|[bmp](a[io]?|[aei]ng?|ei|ie?|ia[no]|o|u)|pou|me|m[io]u|[fw](a|[ae]ng?|ei|o|u)|fou|wai|[dt](a[io]?|an|e|[aeio]ng|ie?|ia[no]|ou|u[ino]?|uan)|dei|diu|[nl](a[io]?|ei?|[eio]ng|i[eu]?|i?ang?|iao|in|ou|u[eo]?|ve?|uan)|nen|lia|lun|[ghk](a[io]?|[ae]ng?|e|ong|ou|u[aino]?|uai|uang?)|[gh]ei|[jqx](i(ao?|ang?|e|ng?|ong|u)?|u[en]?|uan)|([csz]h?|r)([ae]ng?|ao|e|i|ou|u[ino]?|uan)|[csz](ai?|ong)|[csz]h(ai?|uai|uang)|zei|[sz]hua|([cz]h|r)ong|y(ao?|[ai]ng?|e|i|ong|ou|u[en]?|uan))/,
            message: "姓（拼音）格式不正确"
          }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            message: "手机号格式不正确"
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
    a_variable: function() {
      if (this.dialogType == 4) {
        console.log();
        // this.teamEnrolls(9); //this.planId?
        this.teamEnrolls(this.orderId)
        this.teampreview(9); //this.planId?
        this.dialogFormTransfer = true;
        this.enrolNums = false;
        this.ruleForm.remark = "";
        this.ruleForm.otherCostRemark = "";
        this.ruleForm.allDisRemark = "";
      }
    },
    enrolNum: function(val) {
      this.changeQuota();
      this.compPrice();
    },
    "ruleForm.otherCost": function(val) {
      this.compPrice();
    },
    "ruleForm.allDiscount": function(val) {
      this.compPrice();
    }
  },
  methods: {
    changeQuota() {
      this.salePrice = JSON.parse(JSON.stringify(this.salePriceNum));
      let salePriceType = {};
      for (let i = 0; i < this.salePrice.length; i++) {
        this.salePrice[i].quota =
          parseInt(this.salePrice[i].quota) - parseInt(this.enrolNum[i]);
        salePriceType = this.salePrice[i];
        if (salePriceType.quota < 0) {
          this.quota[i] = true;
        } else {
          this.quota[i] = false;
        }
      }
    },
    teamEnrolls(ID) {
      // console.log(ID)
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/enrolls", {
          id: ID
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.salePrice = res.data.objects;
            this.salePriceNum = res.data.objects;
            this.preLength = [];
            this.enrolNum = [];
            this.quota = [];
            this.tour = [];
            for (let i = 0; i < res.data.objects.length; i++) {
              this.preLength.push("0");
              this.enrolNum.push(0);
              this.quota.push(false);
              this.tour.push([]);
            }
          }
        });
    },
    teampreview(ID) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/teampreview", {
          id: ID
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.teampreviewData = res.data.object;
          }
        });
    },
    peoNum(index, enrollID, enrollName) {
      let arrLength; 
      let preLength; 
      preLength = this.preLength[index]; 
      arrLength = this.enrolNum[index]; 
      this.preLength[index] = this.enrolNum[index];
      var len;
      if (arrLength > preLength) {
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
            sex: 0,
            idCard: "string",
            singlePrice: 0,
            mobile: "string",
            bornDate: 0,
            credType: 0,
            credCode: "string",
            credTOV: 0,
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
      this.winTitle = this.salePrice[type].enrollName; 

      if (this.tour[type][index].cnName != "点击填写") {
        this.conForm = JSON.parse(JSON.stringify(this.tour[type][index])); 
      }
      this.tourType = type;
      this.fillIndex = index;
      this.dialogFormTour = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        var blooen = "0";
        for (let i = 0; i < this.quota.length; i++) {
          if (this.quota[i] == true) {
            blooen = "1";
          }
        }
        if (blooen == "1") {
          return false;
        }
        let number = 0;
        for (let i = 0; i < this.enrolNum.length; i++) {
          if (this.enrolNum[i]) {
            number += parseInt(this.enrolNum[i]);
          }
        }
        if (number == 0) {
          this.enrolNums = true;
          return false;
        } else {
          this.enrolNums = false;
        }
        let guestAll = []; 
        if (valid) {
          for (let i = 0; i < this.tour.length; i++) {
            for (let j = 0; j < this.tour[i].length; j++) {
              guestAll.push(this.tour[i][j]);
            }
          }

          let guest = [];
          for (let i = 0; i < guestAll.length; i++) {
            if (guestAll[i].cnName != "点击填写") {
              guest.push(guestAll[i]);
              guest[i].bornDate = new Date(guest[i].bornDate).getTime(); 
              guest[i].credTOV = new Date(guest[i].credTOV).getTime();
            } else {
              guest.push(guestAll[i]);
            }
          }
          if (this.ifOrderInsert == false) {
            return false;
          }
          this.ifOrderInsert = false;
          this.$http
            .post(this.GLOBAL.serverSrc + "/order/all/api/orderinsert", {
              object: {
                id: 0,
                isDeleted: 0,
                code: "",
                orderCode: "",
                proID: this.teampreviewData.teamID,
                // planID: this.planId,
                planID: this.orderId,
                orderStatus: 0, 
                refundStatus: 0, 
                occupyStatus: this.ruleForm.type, 
                payable: this.ruleForm.totalPrice, 
                favourable: [
                  {
                    id: 0,
                    orderID: 0,
                    price: this.ruleForm.otherCost,
                    title: "其他费用",
                    favMode: 1,
                    mark: this.ruleForm.otherCostRemark
                  },
                  {
                    id: 0,
                    orderID: 0,
                    price: this.ruleForm.allDiscount,
                    title: "整体优惠",
                    favMode: 2,
                    mark: this.ruleForm.allDisRemark
                  }
                ],
                contact:
                  '{"Name":"' +
                  this.ruleForm.contactName +
                  '","Tel":"' +
                  this.ruleForm.contactPhone +
                  '"}',
                endTime:
                  this.ruleForm.type == 1
                    ? 0
                    : new Date().getTime() / 1000 + 24 * 60 * 60,
                orderChannel: this.ruleForm.orderRadio,
                orgID: sessionStorage.getItem("orgID"),
                userID: sessionStorage.getItem("id"),
                mark: this.ruleForm.remark,
                guest: guest,
                number: number
              }
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message.success("提交成功");
                let data = JSON.parse(res.data.result.details);
                this.orderCode = data.OrderCode;
                this.orderSuc = true;
                this.$refs[formName].resetFields();
                this.dialogFormTransfer = false;
                this.ifOrderInsert = true;
                this.startUpWorkFlowForJQ(
                  data.OrderID,
                  data.FlowModel,
                  data.FlowModelName,
                  data.Usercode
                );
              } else {
                _this.$message.success("下单失败");
                this.ifOrderInsert = true;
              }
            });
        } else {
          console.log("error submit!!");
          this.ifOrderInsert = true;
          return false;
        }
      });
    },
    startUpWorkFlowForJQ(OrderID, FlowModel, FlowModelName, Usercode) {
      this.$http
        .post(this.GLOBAL.jqUrl + "/JQ/StartUpWorkFlowForJQ", {
          jQ_ID: OrderID,
          jQ_Type: FlowModel,
          workflowCode: FlowModelName,
          userCode: Usercode
        })
        .then(res => {
          this.submitWAForJQ(Usercode, JSON.parse(res.data).data.workItemID);
        });
    },
    submitWAForJQ(Usercode, workItemID) {
      this.$http
        .post(this.GLOBAL.jqUrl + "/JQ/GettingUnfinishedTasksForJQ", {
          userCode: Usercode,
          workItemID: workItemID,
          commentText: "测试"
        })
        .then(res => {});
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
      this.$refs[formName].resetFields();
    },
    cancelInfoOrder(formName) {
      this.dialogFormTransfer = false;
      this.$refs[formName].resetFields();
    },
    compPrice() {
      this.ruleForm.totalPrice = 0;
      for (let i = 0; i < this.enrolNum.length; i++) {
        this.ruleForm.totalPrice +=
          this.enrolNum[i] *
          (this.ruleForm.price == 1
            ? this.salePrice[i].price_01
            : this.salePrice[i].price_02);
      }
      this.ruleForm.totalPrice += parseInt(this.ruleForm.otherCost);
      this.ruleForm.totalPrice -= parseInt(this.ruleForm.allDiscount);
    }
  }
};
</script>

<style scoped>
* {
  font-size: 14px;
}
.main1 {
  overflow: hidden;
  width: 70%;
  min-width: 900px;
  margin-top: -20px;
}
.order-title {
  overflow: hidden;
}
.optionw {
  width: 280px;
}
.order-title h2 {
  font-size: 17px;
  font-weight: normal;
  float: left;
  margin: 10px 30px;
}
.pro-info {
  font-size: 14px;
  background-color: #e6e6e6;
  margin: 0 30px 10px 30px;
  line-height: 25px;
  padding: 10px 20px;
}
.demo-ruleForm {
  margin-left: 10px;
}
.fl {
  float: left;
}
.cb {
  clear: both;
}
.num-req {
  position: absolute;
  top: 2px;
  left: -77px;
  color: red;
}
.price .pricew {
  width: 90px;
  text-align: center;
  margin: -5px 15px;
}
.numw {
  width: 150px;
  text-align: center;
  margin: 0 15px;
}
.cost-remark {
  width: 300px;
  text-align: center;
  margin: 0 15px;
}
.radiomar {
  margin: 12px 13px;
}
.ml13 {
  margin-left: 13px;
}
.mb17 {
  margin-bottom: 17px;
}
.tourist {
  margin-left: 13px;
  float: left;
  width: 85%;
}
.tourist input {
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
.oh {
  overflow: hidden;
}
.disib {
  display: inline-block;
}
.remark {
  width: 70%;
  margin-left: 12px;
}
.w200 {
  width: 200px;
}
.text {
  font-size: 14px;
}
.item {
  margin: 0 20px 18px 20px;
}
.ordersuc-title {
  text-align: center;
  font-size: 16px;
  margin: 0 0 30px 0;
}
.red {
  color: red;
}
.dialog-footer {
  text-align: left;
  margin: 20px 0 20px 108px;
}
</style>
