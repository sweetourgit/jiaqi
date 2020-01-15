<template>
  <div>
    <el-dialog title="退款" :visible.sync="dialogOrderRefund" custom-class="city_list" style="margin-top:-100px;" width="1200px"
      @close="cancelOrder('ruleForm')">
      <div class="pa">
        <el-button class="ml13" @click="cancelOrder('ruleForm')">取 消</el-button>
        <el-button class="ml13" @click="applyRefund('ruleForm')" type="primary">申 请</el-button>
      </div>
      <div class="border">
        <div class="title"><span class="ml13">订单详情</span></div>
        <div class="ml13">
          <table width="100%">
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">订单总额:</div>
                <div class="fl ml13">{{orderList.payable}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">已付金额:</div>
                <div class="fl ml13">{{orderList.paid}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">未付金额:</div>
                <div class="fl ml13">{{nonPayment}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">其他费用:</div>
                <div class="fl ml13">{{orderList.otherPrice}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">整体优惠:</div>
                <div class="fl ml13">{{orderList.entiretyFav}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">退款金额:</div>
                <div class="fl ml13">{{orderList.allRefundPrice}}</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="way" @change="clickTab('ruleForm')">
        <div style="float:left; width:100px; margin:0 0 0 30px;">退款方式</div>
        <div style="float:left;margin:0 0 0 -30px;">
          <el-radio label="1" class="radiomar" v-model="ruleForm.refundWay">全退</el-radio>
          <el-radio label="2" class="radiomar" v-model="ruleForm.refundWay">部分退</el-radio>
        </div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm refund">
        <!--全退-->
        <el-form-item label="申请原由" v-if="ruleForm.refundWay == 1" prop="originally">
          <el-input v-model="ruleForm.originally" class="Words" placeholder="请输入申请原由"></el-input>
          <span class="Numbers">{{ruleForm.originally.length}}/100字</span>
        </el-form-item>
        <el-form-item label="汇款卡号" v-if="ruleForm.refundWay == 1" prop="cardNumber">
          <el-input v-model="ruleForm.cardNumber" class="Words" placeholder="请输入汇款卡号"></el-input>
          <span class="Numbers">{{ruleForm.cardNumber.length}}/80字</span>
        </el-form-item>
        <el-form-item label="汇款开户行" v-if="ruleForm.refundWay == 1" prop="cardBank">
          <el-input v-model="ruleForm.cardBank" class="Words" placeholder="请输入汇款开户行"></el-input>
          <span class="Numbers">{{ruleForm.cardBank.length}}/40字</span>
        </el-form-item>
        <el-form-item label="汇款开户人" v-if="ruleForm.refundWay == 1" prop="cardPeople">
          <el-input v-model="ruleForm.cardPeople" class="Words" placeholder="请输入汇款开户人"></el-input>
          <span class="Numbers">{{ruleForm.cardPeople.length}}/40字</span>
        </el-form-item>
        <!--部分退-->
        <el-form-item label="还需退款" v-if="ruleForm.refundWay == 2" prop="needRefund">
          <el-input v-model="ruleForm.needRefund" class="Words" placeholder="请输入还需退款"></el-input>
        </el-form-item>
        <el-form-item label="申请原由" v-if="ruleForm.refundWay == 2" prop="partPriginally">
          <el-input v-model="ruleForm.partPriginally" class="Words" placeholder="请输入申请原由"></el-input>
          <span class="Numbers">{{ruleForm.partPriginally.length}}/100字</span>
        </el-form-item>
        <el-form-item label="汇款卡号" v-if="ruleForm.refundWay == 2" prop="partCardNumber">
          <el-input v-model="ruleForm.partCardNumber" class="Words" placeholder="请输入汇款卡号"></el-input>
          <span class="Numbers">{{ruleForm.partCardNumber.length}}/80字</span>
        </el-form-item>
        <el-form-item label="汇款开户行" v-if="ruleForm.refundWay == 2" prop="partCardBank">
          <el-input v-model="ruleForm.partCardBank" class="Words" placeholder="请输入汇款开户行"></el-input>
          <span class="Numbers">{{ruleForm.partCardBank.length}}/40字</span>
        </el-form-item>
        <el-form-item label="汇款开户人" v-if="ruleForm.refundWay == 2" prop="partCardPeople">
          <el-input v-model="ruleForm.partCardPeople" class="Words" placeholder="请输入汇款开户人"></el-input>
          <span class="Numbers">{{ruleForm.partCardPeople.length}}/40字</span>
        </el-form-item>
        <el-table v-if="ruleForm.refundWay == 2" :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
          <el-table-column prop="enrollName" label="报名类型" align="center"></el-table-column>
          <el-table-column prop="singlePrice" label="价钱" align="center"></el-table-column>
          <el-table-column prop="cnName" label="姓名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
          <el-table-column prop="idCard" label="身份证" align="center"></el-table-column>
          <el-table-column prop="sex" label="性别" align="center"></el-table-column>
          <el-table-column prop="" label="选择退款客人信息" align="center"></el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    orderRefundID:0,
    orderRefund:0,
    orderRefundDialog:0,
  },
  data() {
    return {
      dialogOrderRefund:false,
      orderList:{},
      ruleForm:{
        refundWay:'1',// 退款方式
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
    };
  },
  watch: {
    orderRefund: function() {
      if (this.orderRefundDialog == 1) { // 订单详情
        setTimeout(() => {
          //this.getOrder(this.orderID);
        },200);
        this.dialogOrderRefund = true;
      }
    },
  },
  created() {
  },
  methods: {
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
    clickTab(formName){ // 切换退款方式清空表单
      this.$refs[formName].resetFields();
    },
    cancelOrder(formName){ // 关闭退款弹窗
      this.dialogOrderRefund = false;
      this.$refs[formName].resetFields();
      this.tableDate = [];
    },
    getOrder(ID){ // 点击退款获取详情信息
      this.$http.post(this.GLOBAL.serverSrc + "order/refund/api/get", {
        id: ID
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.orderList = res.data.object;
          this.tableDate = res.data.object.guests;
          this.nonPayment = res.data.object.payable - res.data.object.paid;
        }
      });
    },
    applyRefund(formName){ // 申请退款
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/insert",
              {
                object: {
                  "id": 0, // 退款单
                  "refundCode": "string", // 退款单号
                  "userID": sessionStorage.getItem("id"), // 申请人ID
                  "name": sessionStorage.getItem("name"), // 申请人姓名
                  "orgID": sessionStorage.getItem("orgID"), // 申请人部门ID
                  "orgName": sessionStorage.getItem("orgName"), // 申请人部门名称
                  "orderID": 0,  // 订单ID
                  "orderCode": "string", // 订单号
                  "refundType": this.ruleForm.refundWay == 1 ? 2 : 1, // 退款方式 1=部分退款 2=全部退款
                  "reason": this.ruleForm.refundWay == 1 ? this.ruleForm.originally : this.ruleForm.partPriginally, // 退款申请理由
                  "needRefundPrice": this.ruleForm.needRefund, // 还需退款
                  "allRefundPrice": 0, // 总退款
                  "realRefundPrice": 0, // 实际退款金额
                  "payID": 0, // 支付账户
                  "remittanceCode": this.ruleForm.refundWay == 1 ? this.ruleForm.cardNumber : this.ruleForm.partCardNumber,// 汇款卡号
                  "remittanceBank": this.ruleForm.refundWay == 1 ? this.ruleForm.cardBank : this.ruleForm.partCardBank, // 汇款开户行
                  "remittancePerson": this.ruleForm.refundWay == 1 ? this.ruleForm.cardPeople : this.ruleForm.partCardPeople, // 汇款开户人
                  "isDeleted": 0,
                  "payable": 0, // 订单金额
                  "refundStateType": 0, // 退款状态 0 申请退款 ，1退款完成，2拒绝退款
                  "createTime": "2020-01-14T05:53:42.552Z", // 申请时间
                  "startTime": "2020-01-14T05:53:42.552Z", // 开始时间
                  "endTime": "2020-01-14T05:53:42.552Z", // 结束时间
                  "productType": 1 // 产品类型
                }
              })
              .then(res => {
                if(res.data.isSuccess == true){
                   //this.pageList();
                   this.dialogOrderRefund = false
                   this.$refs[formName].resetFields();
                }else{
                   this.$message.success("申请失败");
                }
            })
          } else {
            return false;
          }
        });
    },
  }
};
</script>

<style scoped lang="scss">
.ml13{margin-left:13px;}
.border{border:1px solid #e6e6e6; border-radius:5px; overflow:hidden;line-height:40px; }
.pa{position: absolute; top: 8px; right: 10px;}
.title{line-height:40px; background:#f6f6f6;font-weight:bold;}
.refund{padding:20px 0 0 0;clear: both;}
.Words{width:300px;}
.Numbers{margin:0 0 0 10px;}
.way{margin:20px 0 20px 0 ; font-size:14px;}
.table{width:1100px;margin:0 0 0 10px;}
</style>


