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
          <el-radio label="1" class="radiomar"v-if="orderList.payable - (orderList.paid - orderList.realRefundPrice) == 0 " v-model="ruleForm.refundWay">部分退</el-radio>
        </div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm refund">
        <div v-if="ruleForm.refundWay == 2">
          <el-form-item label="申请原由" prop="originally">
            <el-input :disabled="forbidden" v-model="ruleForm.originally" class="Words" placeholder="请输入申请原由" :title="ruleForm.originally"></el-input>
            <span class="Numbers">{{ruleForm.originally.length}}/100字</span>
          </el-form-item>
          <el-form-item label="汇款卡号" prop="cardNumber">
            <el-input :disabled="forbidden" v-model="ruleForm.cardNumber" class="Words" placeholder="请输入汇款卡号" :title="ruleForm.cardNumber"></el-input>
            <span class="Numbers">{{ruleForm.cardNumber.length}}/80字</span>
          </el-form-item>
          <el-form-item label="汇款开户行" prop="cardBank">
            <el-input :disabled="forbidden" v-model="ruleForm.cardBank" class="Words" placeholder="请输入汇款开户行" :title="ruleForm.cardBank"></el-input>
            <span class="Numbers">{{ruleForm.cardBank.length}}/40字</span>
          </el-form-item>
          <el-form-item label="汇款开户人" prop="cardPeople">
            <el-input :disabled="forbidden" v-model="ruleForm.cardPeople" class="Words" placeholder="请输入汇款开户人" :title="ruleForm.cardPeople"></el-input>
            <span class="Numbers">{{ruleForm.cardPeople.length}}/40字</span>
          </el-form-item>
        </div>
        <div v-if="ruleForm.refundWay == 1">
          <el-form-item label="还需退款" prop="needRefund">
            <el-input :disabled="forbidden" @change="needShow()" v-model="ruleForm.needRefund" class="Words" placeholder="请输入还需退款"></el-input>
            <div class="red" v-show="needRefundPriceShow">还需退款金额不能为空</div>
            <div class="red" v-show = "needRefundShow">还需退款金额不能大于总订单金额</div>
          </el-form-item>
          <el-form-item label="申请原由" prop="partPriginally">
            <el-input :disabled="forbidden" v-model="ruleForm.partPriginally" class="Words" placeholder="请输入申请原由" :title="ruleForm.partPriginally"></el-input>
            <span class="Numbers">{{ruleForm.partPriginally.length}}/100字</span>
          </el-form-item>
          <el-form-item label="汇款卡号" prop="partCardNumber">
            <el-input :disabled="forbidden" v-model="ruleForm.partCardNumber" class="Words" placeholder="请输入汇款卡号" :title="ruleForm.partCardNumber"></el-input>
            <span class="Numbers">{{ruleForm.partCardNumber.length}}/80字</span>
          </el-form-item>
          <el-form-item label="汇款开户行" prop="partCardBank">
            <el-input :disabled="forbidden" v-model="ruleForm.partCardBank" class="Words" placeholder="请输入汇款开户行" :title="ruleForm.partCardBank"></el-input>
            <span class="Numbers">{{ruleForm.partCardBank.length}}/40字</span>
          </el-form-item>
          <el-form-item label="汇款开户人" prop="partCardPeople">
            <el-input :disabled="forbidden" v-model="ruleForm.partCardPeople" class="Words" placeholder="请输入汇款开户人" :title="ruleForm.partCardPeople"></el-input>
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
                <el-button type="text"v-if="scope.row.refundStatus == 0 || scope.row.refundStatus == 2" :disabled="forbidden" @click="choose(scope.$index)">选择</el-button>
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
      reasonList:{}, 
      ruleForm:{
        refundWay:'2',
        originally:'', 
        cardNumber:'', 
        cardBank:'', 
        cardPeople:'', 
        needRefund:'',
        partPriginally:'', 
        partCardNumber:'', 
        partCardBank:'', 
        partCardPeople:'', 
      },
      refundType:'', 
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
      nonPayment:"", 
      orderCode:"", 
      forbidden: false,
      indentID:"", 
      orderAmount:"", 
      productType:0, 
      show1:true,
      show2:false,
      typeID:0, 
      multipleSelection: [], 
      otherFees: 0 ,
      overallDiscount:0 ,
      positiveNumber: 0 , 
      negativeNumber: 0 , 
      guests :[], 
      singlePrice:0, 
      allRefundPrice:0, 
      needRefundShow:false, 
      refundStatus:0,
      needRefundPriceShow:false,
      needRefund01:0,
      needRefund02:0,
      needRefund03:0,
      totalRefund:0,
      statusRefund:'', 
    };
  },
  filters: {
    numFilter (value) {
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  },
  watch: {
    orderRefund: function() {
      if (this.dialogType == 5) {
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
    price(){ 
      this.getTypeId();
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
    getRowClass({ row, column, rowIndex, columnIndex }) {
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
      this.multipleSelection = val;
      //console.log(val.length)
    },
    getTypeId(){
      this.typeID = 0;
      for(var i= 0 ; i < this.guests.length ; i ++){
        if(this.guests[i].refundStatus == 5){
          this.typeID = 1;
          break;
        }
      }
    },
    clickRow(row) {
      this.$refs.multipleTable.clearSelection(); 
      this.$refs.multipleTable.toggleRowSelection(row);
      //this.typeID = this.multipleSelection[0].id;
      this.singlePrice = this.multipleSelection[0].singlePrice;
      this.refundStatus = this.multipleSelection[0].refundStatus;
      console.log(this.singlePrice)
      console.log(this.typeID)
    },
    rowClass({ row, rowIndex }) {
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].id == row.id) {
          return { "background-color": "#ecf5ff" };
        }
      }
    },
    needShow(){ 
      if(this.ruleForm.needRefund > this.orderAmount && this.ruleForm.needRefund != ''){
        this.needRefundShow = true;
      }else {
        this.needRefundShow = false;
      }
    },
    clickTab(formName){ 
      if(this.forbidden == false){
        this.$refs[formName].resetFields();
      }
    },
    cancelOrder(formName){
      this.ruleForm.refundWay = '2';
      this.dialogOrderRefund = false;
      this.$refs[formName].resetFields();
      this.tableDate = [];
      this.forbidden = false;
      this.ruleForm.needRefund = '';
      this.ruleForm.originally = ''; 
      this.ruleForm.cardNumber = '';
      this.ruleForm.cardBank = '';
      this.ruleForm.cardPeople = '';
      this.ruleForm.partPriginally = '';
      this.ruleForm.partCardNumber = '';
      this.ruleForm.partCardBank = '';
      this.ruleForm.partCardPeople = '';
    },
    getOrder(ID){ 
      this.$http.post(this.GLOBAL.serverSrc + "/order/refund/api/get", {
        id:ID,
        //id: 1812 
        //id: 21
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
             this.nonPayment = res.data.object.payable - res.data.object.paid; 
          }else{
             this.nonPayment = res.data.object.payable - (res.data.object.paid - res.data.object.realRefundPrice);
          }
          this.nonPayment=this.nonPayment>0?this.nonPayment:0;
          this.orderCode = res.data.object.orderCode; 
          this.indentID = res.data.object.id; 
          this.orderAmount = res.data.object.payable; 
          this.productType = res.data.object.productType;  
          this.otherFees = res.data.object.otherPrice; 
          this.overallDiscount = res.data.object.entiretyFav; 
          this.guests = res.data.object.guests ; 
          this.guests.forEach(el => el.refundStatus==5?el.refundStatus=10:'');
          this.totalRefund = res.data.object.allRefundPrice; 
          this.statusRefund = res.data.object.refundStatus ;
          this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/list", {
             object:{
               "orderCode":this.orderCode
             }
            }).then(res => {
                if(res.data.isSuccess == true){
                  this.reasonList = res.data.objects;
                  this.refundType = res.data.objects[0].refundType;
                  this.ruleForm.refundWay = res.data.objects[0].refundType + '';
                  if(this.refundType == 2){ 
                    this.ruleForm.originally = res.data.objects[0].reason; 
                    this.ruleForm.cardNumber = res.data.objects[0].remittanceCode;
                    this.ruleForm.cardBank = res.data.objects[0].remittanceBank;
                    this.ruleForm.cardPeople = res.data.objects[0].remittancePerson;
                  }else if(this.refundType == 1){ 
                    this.ruleForm.needRefund = res.data.objects[0].needRefundPrice; 
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
          this.collection(); 
        }
      );
    },
    collection(){ 
      this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/iscollection", {
        orderCode: this.orderCode
      }).then(res => {
        if (res.data.isSuccess == false){
          this.forbidden = true ;
          this.$message.error("订单已经确认收款或审批中");
        }
      });
    },
    choose(index){ 
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
    undo(index){ 
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
    applyRefund(formName){ 
      this.getTypeId();
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
        if(this.ruleForm.needRefund < 0){ 
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
                  "refundCode": this.orderCode, 
                  "userID": sessionStorage.getItem("id"), 
                  "name": sessionStorage.getItem("name"), 
                  "orgID": sessionStorage.getItem("orgID"), 
                  "orgName": sessionStorage.getItem("orgName"), 
                  "orderID": this.indentID, 
                  "orderCode": this.orderCode, 
                  "refundType": this.ruleForm.refundWay, 
                  "reason": this.ruleForm.refundWay == 2 ? this.ruleForm.originally : this.ruleForm.partPriginally, 
                  "needRefundPrice": this.ruleForm.needRefund=='' ? 0 :this.ruleForm.needRefund, 
                  "allRefundPrice": this.ruleForm.refundWay == 1 ? this.allRefundPrice:this.orderList.payable, 
                  "realRefundPrice":this.ruleForm.refundWay == 1 ? aaa : (Number(this.orderList.paid)-Number(this.orderList.realRefundPrice)),
                  //"realRefundPrice":this.ruleForm.refundWay == 1 ?(this.typeID == 0 ? this.ruleForm.needRefund : (this.ruleForm.needRefund >= 0 ? this.positiveNumber : this.negativeNumber)):(Number(this.orderList.paid)-Number(this.allRefundPrice)), 
                  "payID": 0, 
                  "remittanceCode": this.ruleForm.refundWay == 2 ? this.ruleForm.cardNumber : this.ruleForm.partCardNumber,
                  "remittanceBank": this.ruleForm.refundWay == 2 ? this.ruleForm.cardBank : this.ruleForm.partCardBank, 
                  "remittancePerson": this.ruleForm.refundWay == 2 ? this.ruleForm.cardPeople : this.ruleForm.partCardPeople, 
                  "isDeleted": 0,
                  "payable": this.orderAmount, 
                  "refundStateType": 0, 
                  "createTime": moment(new Date()).format('YYYY-MM-DD'), 
                  "startTime": "2020-01-14T05:53:42.552Z", 
                  "endTime": "2020-01-14T05:53:42.552Z", 
                  "productType": 1,
                  "Mark":JSON.stringify(this.getGuests()),
                  "refundPeo": this.ruleForm.refundWay == 1 ? (this.typeID !=0 ? 1 : 0) : 1,
                  "isEBS":0
                  //"productType": this.productType 
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
                   this.ruleForm.originally = ''; 
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
                   this.$message.error("申请失败");
                }
            })
          } else {
            return false;
          }
      });
    },
    getGuests(){
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
      return updata;
    },
    updateUndo(){ 
      this.$http.post(this.GLOBAL.serverSrc + "/order/guest/refundstat/update",{
        objects:this.getGuests()
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