<template>
  <div>
    <el-dialog title="退款" :visible.sync="dialogOrderRefund" custom-class="city_list" style="margin-top:-100px;" width="1200px"
      @close="cancelOrder()">
      <div class="pa">
        <el-button class="ml13" @click="cancelOrder()">取 消</el-button>
        <el-button class="ml13" type="primary">申 请</el-button>
      </div>
      <div class="border">
        <div class="title"><span class="ml13">订单详情</span></div>
        <div class="ml13">
          <table width="100%">
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">订单总额:</div>
                <div class="fl ml13">{{refundList.id}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">已付金额:</div>
                <div class="fl ml13">{{refundList.userName}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">未付金额:</div>
                <div class="fl ml13">{{refundList.createTime}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">其他费用:</div>
                <div class="fl ml13">{{refundList.id}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">整体优惠:</div>
                <div class="fl ml13">{{refundList.userName}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">退款金额:</div>
                <div class="fl ml13">{{refundList.createTime}}</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm refund">
        <el-form-item label="退款方式" prop="refundWay">
          <el-radio label="1" class="radiomar" v-model="ruleForm.refundWay">全退</el-radio>
          <el-radio label="2" class="radiomar" v-model="ruleForm.refundWay">部分退</el-radio>
        </el-form-item>
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
      dialogOrderRefund:true,
      refundList:{},
      ruleForm:{
        refundWay:'1',// 退款方式
        originally:'', // 原由
        cardNumber:'', // 汇款卡号
        cardBank:'', // 汇款开户行
        cardPeople:'', // 汇款开户人
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
      },
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
    cancelOrder(){
      this.dialogOrderRefund = false;
    },
  }
};
</script>

<style scoped lang="scss">
.ml13{margin-left:13px;}
.border{border:1px solid #e6e6e6; border-radius:5px; overflow:hidden;line-height:40px; }
.pa{position: absolute; top: 8px; right: 10px;}
.title{line-height:40px; background:#f6f6f6;font-weight:bold;}
.refund{margin:20px 0 0 0;}
.Words{width:300px;}
.Numbers{margin:0 0 0 10px;}
</style>


