<template>
  <div class="printPage">
    <!-- 被 print 包括的是要打印的区域，关于print开头的命名样式均为打印样式 -->
    <div ref="print">
      <div class="print-title">{{ printMsg.getTopName }} - {{ printMsg.presentRouter }} - 借款单 </div>
      <!-- 基本信息 -->
      <div class="item-content print-hidden">
        <el-tag type="warning" v-if="printMsg.checkType=='0'" class="distributor-status">审批中</el-tag>
        <el-tag type="danger" v-if="printMsg.checkType=='2'" class="distributor-status">驳回</el-tag>
        <el-tag type="success" v-if="printMsg.checkType=='1'" class="distributor-status">通过</el-tag>
      </div>
      <!-- 第一行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">借款单号:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ printMsg.fundamental.id }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">申请人:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{printMsg.fundamental.orgName}}--{{ printMsg.fundamental.create_uid }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">申请时间:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ printMsg.fundamental.created_at }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第一行 END -->
      <!-- 第二行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">供应商:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ printMsg.fundamental.supplier }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">借款类型:</div></el-col>
          <el-col :span="15">
            <div class="grid-del">{{ loan_type[printMsg.fundamental.loanType] }}</div>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">借款金额:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ printMsg.fundamental.money }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第二行 END -->
      <!-- 第三行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <!-- 摘要打印时隐藏 -->
          <el-col :span="6" class="print-hidden"><div class="grid-del label-color">摘要:</div></el-col>
          <el-col :span="17" class="print-hidden"><div class="grid-del ">{{ printMsg.fundamental.remark }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第三行 END -->
      <!-- 支付账户 -->
      <el-row type="flex" class="row-bg print-acount-padding" justify="space-around">
        <el-col :span="14">
          <el-col :span="4"><div class="grid-del label-color">支付账户:</div></el-col>
          <el-col :span="19"><div class="grid-del">{{ printMsg.fundamental.accountPay }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">对公/对私:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ printMsg.fundamental.account_type }}</div></el-col>
        </el-col>
        <!-- <el-col :span="2" :offset="1"><div class="grid-del label-color">支付账户:</div></el-col>
        <el-col :span="18"><div class="grid-del">{{ printMsg.fundamental.accountPay }}</div></el-col> -->
      </el-row>
      <!-- 支付账户 -->
      <!-- 第四行 -->
      <!-- 余额支付借款没有账号信息 -->
      <el-row type="flex" class="row-bg print-acount-padding" justify="space-around" :style="printMsg.presentRouter == '余额支付借款' ? 'display:none;' : ''">
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">账号:</div></el-col>
          <el-col :span="18"><div class="grid-del ">{{ printMsg.fundamental.account }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">开户行:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ printMsg.fundamental.accountBank }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">开户名:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ printMsg.fundamental.accountName }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第四行 END -->
      <!-- 审批人 打印时输出 -->
      <el-row type="flex" class="row-bg print-approve" justify="start">
        <el-col :span="2" :offset="1"><div class="grid-del label-color">审批人:</div></el-col>
        <el-col :span="18"><div class="grid-del" v-html="printMsg.printContent"></div></el-col>
      </el-row>
      <!-- 审批人 打印时输出 END -->
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "printPage",
  components: {
    
  },
  props: {
    printMsg1: ''
  },
  data() {
    return {
      presentRouter: '',
      fundamental: {},
      printMsg: {},
      loan_type: {
        '1': '门票',
        '2': '酒店',
        '3': '地接',
        '4': '定制游(跟团游)'
      },
    }
  },
  computed: {},
  watch: {
    printMsg1: {
      handler:function(){
        console.log(this.printMsg1)
        this.printMsg = this.printMsg1;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 打印详情
    printDetails(){
      if(this.printMsg.getTopName){
        this.$print(this.$refs.print);
      }else{
        this.$message.warning("数据加载中，请稍后重试。。。");
      }
      
    },
  },
  created() {
    
  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
  .printPage{
    /*text-align: center; font-family: '微软雅黑'; font-size: 11pt;overflow: hidden; text-align: left; margin: -15px 0 100px 0;*/
    .title-margin{
      margin-bottom: 30px;
    }
    .item-content{
      margin-bottom: 20px;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    /* 先隐藏打印的时候显示 */
    .print-title{
      display: none;
    }
    .print-acount{
      display: none;
    }
    .print-approve{
      display: none;
    }
    .el-divider__text{
      font-size: 17px !important
    }
    .distributor-status{
      margin-left: 40px;
    }
    .row-bg {
      padding: 13px 0;
      .grid-del{
        text-align: left;
        font-size: 14px;
      }
      .label-color{
        color: #909399;
      }
      .doc-mt-3{
        margin-top: 3px;
      }
    }
  }
</style>