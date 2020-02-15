<template>
  <div>
    <el-dialog title="退款" :visible.sync="dialogOrderRefund" custom-class="city_list" style="margin-top:-100px;" width="1200px"
      @close="cancelOrder('ruleForm')">
      <div class="pa">
        <el-button class="ml13" @click="cancelOrder('ruleForm')">取 消</el-button>
        <el-button :disabled="forbidden" class="ml13" @click="applyRefund('ruleForm')" type="primary">申 请</el-button>
      </div>
      <div class="border">
        <div class="title"><span class="ml13">订单详情</span></div>
        <div class="ml13">
          <table width="100%">
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">订单总额:</div>
                <div class="fl ml13">{{orderList.payable | numFilter}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">已付金额:</div>
                <div class="fl ml13">{{orderList.paid | numFilter}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">未付金额:</div>
                <div class="fl ml13">{{nonPayment > 0 ? nonPayment : 0 | numFilter}}</div>
              </td>
            </tr> 
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">其他费用:</div>
                <div class="fl ml13">{{orderList.otherPrice | numFilter}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">整体优惠:</div>
                <div class="fl ml13">{{orderList.entiretyFav | numFilter}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">退款金额:</div>
                <div class="fl ml13">{{orderList.realRefundPrice | numFilter}}</div>
                <!-- <div class="fl ml13">{{nonPayment < allRefundPrice ? (allRefundPrice - nonPayment) : 0 | numFilter}}</div> -->
                <!-- <div class="fl ml13">{{orderList.allRefundPrice | numFilter}}</div> -->
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="way" @change="clickTab('ruleForm')">
        <div style="float:left; width:100px; margin:0 0 0 30px;">退款方式</div>
        <div style="float:left;margin:0 0 0 -30px;">
          <el-radio label="2" class="radiomar" v-model="ruleForm.refundWay">全退</el-radio>
          <el-radio label="1" class="radiomar" v-model="ruleForm.refundWay">部分退</el-radio>
        </div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm refund">
        <!--全退-->
        <div v-if="ruleForm.refundWay == 2">
          <el-form-item label="申请原由" prop="originally">
            <el-input :disabled="forbidden" v-model="ruleForm.originally" class="Words" placeholder="请输入申请原由" :title="reasonList[0].reason"></el-input>
            <span class="Numbers">{{ruleForm.originally.length}}/100字</span>
          </el-form-item>
          <el-form-item label="汇款卡号" prop="cardNumber">
            <el-input :disabled="forbidden" v-model="ruleForm.cardNumber" class="Words" placeholder="请输入汇款卡号" :title="reasonList[0].remittanceCode"></el-input>
            <span class="Numbers">{{ruleForm.cardNumber.length}}/80字</span>
          </el-form-item>
          <el-form-item label="汇款开户行" prop="cardBank">
            <el-input :disabled="forbidden" v-model="ruleForm.cardBank" class="Words" placeholder="请输入汇款开户行" :title="reasonList[0].remittanceBank"></el-input>
            <span class="Numbers">{{ruleForm.cardBank.length}}/40字</span>
          </el-form-item>
          <el-form-item label="汇款开户人" prop="cardPeople">
            <el-input :disabled="forbidden" v-model="ruleForm.cardPeople" class="Words" placeholder="请输入汇款开户人" :title="reasonList[0].remittancePerson"></el-input>
            <span class="Numbers">{{ruleForm.cardPeople.length}}/40字</span>
          </el-form-item>
        </div>
        <!--部分退-->
        <div v-if="ruleForm.refundWay == 1">
          <el-form-item label="还需退款" prop="needRefund">
            <el-input :disabled="forbidden" @change="needShow()" v-model="ruleForm.needRefund" class="Words" placeholder="请输入还需退款"></el-input>
            <div class="red" v-show="needRefundPriceShow">还需退款金额不能为空</div>
            <div class="red" v-show = "needRefundShow">还需退款金额不能大于总订单金额</div>
          </el-form-item>
          <el-form-item label="申请原由" prop="partPriginally">
            <el-input :disabled="forbidden" v-model="ruleForm.partPriginally" class="Words" placeholder="请输入申请原由" :title="reasonList[0].reason"></el-input>
            <span class="Numbers">{{ruleForm.partPriginally.length}}/100字</span>
          </el-form-item>
          <el-form-item label="汇款卡号" prop="partCardNumber">
            <el-input :disabled="forbidden" v-model="ruleForm.partCardNumber" class="Words" placeholder="请输入汇款卡号" :title="reasonList[0].remittanceCode"></el-input>
            <span class="Numbers">{{ruleForm.partCardNumber.length}}/80字</span>
          </el-form-item>
          <el-form-item label="汇款开户行" prop="partCardBank">
            <el-input :disabled="forbidden" v-model="ruleForm.partCardBank" class="Words" placeholder="请输入汇款开户行" :title="reasonList[0].remittanceBank"></el-input>
            <span class="Numbers">{{ruleForm.partCardBank.length}}/40字</span>
          </el-form-item>
          <el-form-item label="汇款开户人" prop="partCardPeople">
            <el-input :disabled="forbidden" v-model="ruleForm.partCardPeople" class="Words" placeholder="请输入汇款开户人" :title="reasonList[0].remittancePerson"></el-input>
            <span class="Numbers">{{ruleForm.partCardPeople.length}}/40字</span>
          </el-form-item>
          <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass" @selection-change="changeFun" @row-click="clickRow" :row-style="rowClass">
            <el-table-column prop="enrollName" label="报名类型" align="center"></el-table-column>
            <el-table-column prop="singlePrice" label="价钱" align="center"></el-table-column>
            <el-table-column prop="cnName" label="姓名" align="center"></el-table-column>
            <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
            <el-table-column prop="idCard" label="身份证" align="center"></el-table-column>
            <el-table-column prop="sex" label="性别" align="center"></el-table-column>
            <el-table-column label="选择退款客人信息" align="center">
              <template slot-scope="scope">
                <el-button type="text"v-if="scope.row.refundStatus == 0" :disabled="forbidden" @click="choose(scope.$index)">选择</el-button>
                <!-- <span v-if="scope.row.refundStatus == 0" :disabled="forbidden" class="cursor blue" @click="choose(scope.$index)">选择</span> -->
                <span v-if="scope.row.refundStatus == 5||scope.row.refundStatus == 10" :disabled="forbidden">
                  <span class="blue">已选</span>
                  <span v-if="scope.row.refundStatus != 10">
                    <span class="em">|</span>
                    <span class="cursor blue" @click="undo(scope.$index)">撤销</span>
                  </span>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="money">总退款：￥{{allRefundPrice | numFilter}}</div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    orderRefundID:0,
    orderRefund:0,
    dialogType:0,
    orderRefundDialog:0,
  },
  data() {
    return {
      dialogOrderRefund:false,
      orderList:{},
      reasonList:{}, // 获取原由数组
      ruleForm:{
        refundWay:'2',// 退款方式
        originally:'', // 全退原由
        cardNumber:'', // 全退汇款卡号
        cardBank:'', // 全退汇款开户行
        cardPeople:'', // 全退汇款开户人
        needRefund:'',// 还需退款金额
        partPriginally:'', // 部分退款原由
        partCardNumber:'', // 部分退汇款卡号
        partCardBank:'', // 部分退汇款开户行
        partCardPeople:'', // 部分退汇款开户人
      },
      refundType:'', // 点击get获取到退款方式
      rules:{
        refundWay: [
          { required: true, message: "请选择退款方式", trigger: "change" }
        ],
        originally: [
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'change' }
        ],
        cardNumber: [
          { required: true, message: '请输入汇款卡号', trigger: 'change' },
          { min: 1, max: 80, message: '长度在 1 到 80 个字符', trigger: 'change' }
        ],
        cardBank: [
          { required: true, message: '请输入汇款开户行', trigger: 'change' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'change' }
        ],
        cardPeople: [
          { required: true, message: '请输入汇款开户人', trigger: 'change' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'change' }
        ],
        partPriginally: [
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'change' }
        ],
        partCardNumber: [
          { min: 1, max: 80, message: '长度在 1 到 80 个字符', trigger: 'change' }
        ],
        partCardBank: [
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'change' }
        ],
        partCardPeople: [
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'change' }
        ],
      },
      tableDate:[],
      nonPayment:"", //未支付金额
      orderCode:"", // 获取订单号来判断是否有收款
      forbidden: false,
      indentID:"", // 获取订单ID
      orderAmount:"", // 获取订单金额
      productType:0, //获取产品类型
      show1:true,
      show2:false,
      typeID:0, // 部分退款，选择下方报个ID
      multipleSelection: [], //选中的list
      otherFees: 0 ,// 其他费用
      overallDiscount:0 ,// 整体优惠
      positiveNumber: 0 , //还需退款是正数时，实际退款金额
      negativeNumber: 0 , //还需退款是负数时，实际退款金额
      guests :[], // 获取报名信息
      singlePrice:0, // 获取报名信息价格
      allRefundPrice:0, // 总退款
      needRefundShow:false, // 验证还需退款是否超过订单总额
      refundStatus:0,
      needRefundPriceShow:false,
      needRefund01:0,
      needRefund02:0,
      needRefund03:0,
      totalRefund:0, // 获取当前id的总退款
      statusRefund:'', // 获取当前订单的退款状态

    };
  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  },
  watch: {
    orderRefund: function() {
      if (this.dialogType == 5) { // 订单详情
        setTimeout(() => {
           this.getOrder(this.orderRefundID);
        },200);
        this.dialogOrderRefund = true;
      }
    },
    "ruleForm.needRefund": function(val) {
      this.price();
    },
  },
  created() {
  },
  methods: {
    price(){ // 总金额算法
      if(this.ruleForm.needRefund != '' || this.typeID !=0){
        this.needRefundPriceShow = false;
      }
      this.allRefundPrice = 0 ;
      this.allRefundPrice += Number(this.ruleForm.needRefund);
      for( var i = 0 ; i < this.guests.length ; i ++){
        if(this.guests[i].refundStatus == 5 || this.guests[i].refundStatus == 10){
          this.allRefundPrice += Number(this.guests[i].singlePrice);
        }
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {//表格头部颜色
      if (rowIndex == 0) {
        return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
      } else {
        return "";
      }
    },
    getCellClass() {
      return "textAlign:center";
    },
    changeFun(val) {
      //保存选中项的数据
      this.multipleSelection = val;
      //console.log(val.length)
    },
    clickRow(row) {
      //选中行复选框勾选
      this.$refs.multipleTable.clearSelection(); //清空用户的选择,注释掉可多选
      this.$refs.multipleTable.toggleRowSelection(row);
      this.typeID = this.multipleSelection[0].id;
      this.singlePrice = this.multipleSelection[0].singlePrice;
      this.refundStatus = this.multipleSelection[0].refundStatus;
      console.log(this.singlePrice)
      console.log(this.typeID)
    },
    rowClass({ row, rowIndex }) {
      //选中行样式改变
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].id == row.id) {
          return { "background-color": "#ecf5ff" };
        }
      }
    },
    needShow(){ // 判断只退钱的时候还需退款大于订单总额验证
      if(this.ruleForm.needRefund > this.orderAmount && this.ruleForm.needRefund != ''){
        this.needRefundShow = true;
      }else {
        this.needRefundShow = false;
      }
    },
    clickTab(formName){ // 切换退款方式清空表单
      if(this.forbidden == false){
        this.$refs[formName].resetFields();
      }
    },
    cancelOrder(formName){ // 关闭退款弹窗
      this.ruleForm.refundWay = '2';
      this.dialogOrderRefund = false;
      this.$refs[formName].resetFields();
      this.tableDate = [];
      this.forbidden = false;
      this.ruleForm.needRefund = '';
      this.ruleForm.originally = ''; // 全退申请原由
      this.ruleForm.cardNumber = '';
      this.ruleForm.cardBank = '';
      this.ruleForm.cardPeople = '';
      this.ruleForm.partPriginally = '';
      this.ruleForm.partCardNumber = '';
      this.ruleForm.partCardBank = '';
      this.ruleForm.partCardPeople = '';
    },
    getOrder(ID){ // 点击退款获取详情信息
      this.$http.post(this.GLOBAL.serverSrc + "/order/refund/api/get", {
              id:ID,
              //id: 1812 // 无收款
              //id: 21 // 有收款
      }).then(res => {
        if (res.data.isSuccess == true) 
          this.orderList = res.data.object;
          this.tableDate = res.data.object.guests;
          this.tableDate.forEach(function (v,k,arr) {
            if(arr[k]['sex'] == 0){
              arr[k]['sex'] = '男'
            }else if(arr[k]['sex'] == 1) {
              arr[k]['sex'] = '女'
            }else if(arr[k]['sex'] == 3) {
              arr[k]['sex'] = '未选择'
            }
          })
          if(this.orderList.orderStatus==5){
             this.nonPayment = res.data.object.payable - res.data.object.paid; // 获取未付款金额
          }else{
             this.nonPayment = res.data.object.payable - (res.data.object.paid - res.data.object.realRefundPrice);
          }
          this.nonPayment=this.nonPayment>0?this.nonPayment:0;
          
          this.orderCode = res.data.object.orderCode; // 获取该团期订单号
          this.indentID = res.data.object.id; // 获取该团期订单ID
          this.orderAmount = res.data.object.payable; // 获取该团期订单金额
          this.productType = res.data.object.productType; // 获取该团期产品类型 
          this.otherFees = res.data.object.otherPrice; // 其他费用
          this.overallDiscount = res.data.object.entiretyFav; // 整体优惠
          this.guests = res.data.object.guests ; // 获取报名人退款状态
          this.guests.forEach(el => el.refundStatus==5?el.refundStatus=10:'');
          this.totalRefund = res.data.object.allRefundPrice; // 获取总退款
          this.statusRefund = res.data.object.refundStatus ; // 获取订单的退款状态
          this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/list", {
             object:{
               "orderCode":this.orderCode
             }
            }).then(res => {
                if(res.data.isSuccess == true){
                  this.reasonList = res.data.objects;
                  this.refundType = res.data.objects[0].refundType;
                  this.ruleForm.refundWay = res.data.objects[0].refundType + '';
                  if(this.refundType == 2){ // 全退
                    this.ruleForm.originally = res.data.objects[0].reason; // 全退申请原由
                    this.ruleForm.cardNumber = res.data.objects[0].remittanceCode;
                    this.ruleForm.cardBank = res.data.objects[0].remittanceBank;
                    this.ruleForm.cardPeople = res.data.objects[0].remittancePerson;
                  }else if(this.refundType == 1){ // 部分退
                    this.ruleForm.needRefund = res.data.objects[0].needRefundPrice; // 全退申请原由
                    this.ruleForm.partPriginally = res.data.objects[0].reason;
                    this.ruleForm.partCardNumber = res.data.objects[0].remittanceCode;
                    this.ruleForm.partCardBank = res.data.objects[0].remittanceBank;
                    this.ruleForm.partCardPeople = res.data.objects[0].remittancePerson;
                  }
                }
            });
          if(res.data.object.refundStatus==5){
            this.forbidden = true;
            this.$message.error("订单已经存在退款");
            return;
          }
          this.collection(); // 判断是否有收款方法
        }
      );
      
      
    },
    collection(){ // 有收款就不允许退款了
      this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/iscollection", {
        orderCode: this.orderCode
      }).then(res => {
        if (res.data.isSuccess == false){
          this.forbidden = true ;
          this.$message.error("订单已经确认收款或审批中");
        }
      });
    },
    choose(index){ // 点击选择客人退款
      this.$confirm("是否选择该客人退款?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        //this.singlePrice = this.guests[index].singlePrice;
        this.guests[index].refundStatus = 5;
        this.price();
        })
        .catch(res => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    undo(index){ // 点击撤销客人退款
      this.$confirm("是否撤销该客人退款?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        this.guests[index].refundStatus = 0;
        this.price();
        })
        .catch(res => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    amount(){
      //this.allRefundPrice = this.typeID = 0 ? this.ruleForm.needRefund : this.ruleForm.needRefund + this.singlePrice;
      if(this.typeID !== 0){
        if(this.ruleForm.needRefund < 0){
          this.negativeNumber = this.otherFees - this.ruleForm.needRefund;
        }else if(this.ruleForm.needRefund >= 0){
          this.positiveNumber = this.overallDiscount + this.ruleForm.needRefund;
        }
      }
      this.needRefund01 = this.ruleForm.needRefund >= 0 ? this.positiveNumber : this.negativeNumber;
      this.needRefund02 = this.typeID == 0 ? this.ruleForm.needRefund : this.needRefund01;
      this.needRefund03 = this.orderList.paid - this.allRefundPrice;

    },
    applyRefund(formName){ // 申请退款
      //this.amount();
      if(this.allRefundPrice<0){
        this.$message.error("总退款金额不能小于0");
        return;
      }
      if(this.allRefundPrice > this.orderAmount){
        this.$message.error("总退款金额大于总订单总额，无法申请");
        return;
      }
      if(this.typeID == 0 && this.ruleForm.refundWay == 1){
        if(this.ruleForm.needRefund < 0){ // 只退金额不退人还需还款金额必须为正数
          this.$message.error("还需退款金额为正数");
          return;
        } else if(this.ruleForm.needRefund == ''){
          this.$message.error("总退款金额不能小于0");
          this.needRefundPriceShow = true;
          return;
        }else {
          this.needRefundPriceShow = false;
        }
      }
      let bbb = this.allRefundPrice - this.nonPayment;
      let aaa = bbb >= 0 ? bbb : 0;
      this.$refs[formName].validate((valid) => {
         // if(this.ruleForm.refundWay == 2&&this.orderList.paid==0){
         //    valid=true;
        //  }
          if (valid) {
            this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/insert",{
                object: {
                  "id": 0, // 退款单
                  "refundCode": this.orderCode, // 退款单号
                  "userID": sessionStorage.getItem("id"), // 申请人ID
                  "name": sessionStorage.getItem("name"), // 申请人姓名
                  "orgID": sessionStorage.getItem("orgID"), // 申请人部门ID
                  "orgName": sessionStorage.getItem("orgName"), // 申请人部门名称
                  "orderID": this.indentID,  // 订单ID
                  "orderCode": this.orderCode, // 订单号
                  "refundType": this.ruleForm.refundWay, // 退款方式 1=部分退款 2=全部退款
                  "reason": this.ruleForm.refundWay == 2 ? this.ruleForm.originally : this.ruleForm.partPriginally, // 退款申请理由
                  "needRefundPrice": this.ruleForm.needRefund=='' ? 0 :this.ruleForm.needRefund, // 还需退款
                  "allRefundPrice": this.ruleForm.refundWay == 1 ? this.allRefundPrice:this.orderList.payable, // 总退款
                  "realRefundPrice":this.ruleForm.refundWay == 1 ? aaa : (Number(this.orderList.paid)-Number(this.orderList.realRefundPrice)),
                  //"realRefundPrice":this.ruleForm.refundWay == 1 ?(this.typeID == 0 ? this.ruleForm.needRefund : (this.ruleForm.needRefund >= 0 ? this.positiveNumber : this.negativeNumber)):(Number(this.orderList.paid)-Number(this.allRefundPrice)), // 实际退款金额(还需退款-未付金额)
                  "payID": 0, // 支付账户
                  "remittanceCode": this.ruleForm.refundWay == 2 ? this.ruleForm.cardNumber : this.ruleForm.partCardNumber,// 汇款卡号
                  "remittanceBank": this.ruleForm.refundWay == 2 ? this.ruleForm.cardBank : this.ruleForm.partCardBank, // 汇款开户行
                  "remittancePerson": this.ruleForm.refundWay == 2 ? this.ruleForm.cardPeople : this.ruleForm.partCardPeople, // 汇款开户人
                  "isDeleted": 0,
                  "payable": this.orderAmount, // 订单金额
                  "refundStateType": 0, // 退款状态 0 申请退款 ，1退款完成，2拒绝退款
                  "createTime": moment(new Date()).format('YYYY-MM-DD'), // 申请时间
                  "startTime": "2020-01-14T05:53:42.552Z", // 开始时间
                  "endTime": "2020-01-14T05:53:42.552Z", // 结束时间
                  "productType": 1,
                  "refundPeo": this.ruleForm.refundWay == 1 ? (this.typeID > 0 ? 1 : 0) : 1
                  //"productType": this.productType // 产品类型

                  //全退   总退款=已付金额-退款金额      还需退款=0    实际退款=已付金额-退款金额
                }
              })
              .then(res => {
                if(res.data.isSuccess == true){
                   if(this.ruleForm.refundWay == 2&&this.orderList.paid==0){
                       this.$parent.orderPage();
                   }else{
                       this.$parent.axiosListOneInfo(this.orderRefundID);
                   }
                   this.dialogOrderRefund = false
                   this.$refs[formName].resetFields();
                   this.$message.success("申请退款成功");
                   this.allRefundPrice = 0 ;
                   this.ruleForm.needRefund = '';
                   this.ruleForm.originally = ''; // 全退申请原由
                   this.ruleForm.cardNumber = '';
                   this.ruleForm.cardBank = '';
                   this.ruleForm.cardPeople = '';
                   this.ruleForm.partPriginally = '';
                   this.ruleForm.partCardNumber = '';
                   this.ruleForm.partCardBank = '';
                   this.ruleForm.partCardPeople = '';
                   if(this.typeID !== 0){
                    this.updateUndo();
                   }
                }else{
                   this.$message.success("申请失败");
                }
            })
          } else {
            return false;
          }
      });
    },
    updateUndo(){ // 撤销业务接口
      let updata = [];
      this.guests.forEach(function (v,k,arr) {
        if(arr[k]['sex'] == '男'){
          arr[k]['sex'] = 0
        }else if(arr[k]['sex'] == '女') {
          arr[k]['sex'] = 1
        }else if(arr[k]['sex'] == '未选择') {
          arr[k]['sex'] = 3
        }
      })
      for(var i= 0 ; i < this.guests.length ; i ++){
        if(this.guests[i].refundStatus == 5||this.guests[i].refundStatus == 10){
          this.guests[i].refundStatus = 5;
          updata.push(this.guests[i]);
        }
      }
      this.$http.post(this.GLOBAL.serverSrc + "/order/guest/refundstat/update",{
        objects:updata
      }).then(res => {
        
      })
    },
  }
};
</script>

<style scoped lang="scss">
.ml13{margin-left:13px;}
.border{border:1px solid #e6e6e6; border-radius:5px; overflow:hidden;line-height:40px; }
.pa{position: absolute; top: 8px; right: 10px;}
.title{line-height:40px; background:#f6f6f6;font-weight:bold;}
.refund{padding:20px 0 0 0;clear: both;overflow:hidden;}
.Words{width:300px;}
.Numbers{margin:0 0 0 10px;}
.way{margin:20px 0 20px 0 ; font-size:14px;}
.table{width:1100px;margin:0 0 0 10px;}
.fl{float:left;}
.blue {color: #2e94f9;}
.cursor {cursor: pointer;}
.money{float:right; margin:30px 50px 0 0;font-size:14pt; font-weight:bold;}
.red{color:red;}
</style>


