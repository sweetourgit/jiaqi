<template>
  <div class="vivo" style="position:relative;">
    <!--报账单-->
    <el-dialog title="沈阳甜程国际旅行社有限公司旅游团队报账单" :visible="dialogFormVisible" width=70% @close="closeAdd" style="font-size: 20px; font-weight: 700;">
      <div class="operation" v-if="info.checkType == 0">
        <el-button @click="goDetail" type="primary" size="small" class="table_details">团期详情</el-button>
        <el-button @click="dialogVisiblePass = true" type="success" size="small" class="table_details">通过</el-button>
        <el-button @click="dialogVisibleReject = true" type="warning" size="small" class="table_details">驳回</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
      <div class="operation" v-if="info.checkType == 1">
        <el-button @click="print" type="success" size="small" class="table_details">打印</el-button>
        <el-button @click="goDetail" type="primary" size="small" class="table_details">团期详情</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
      <p class="dateP">报账日期：<span>2019年3月19日</span></p>
      <section ref="print" class="print">
        <el-row>
          <el-col :span="2" class="title">
            部门
          </el-col>
          <el-col :span="3" class="content">
            甜程周边
          </el-col>
          <el-col :span="2" class="title">
            操作人
          </el-col>
          <el-col :span="3" class="content">
            阳阳
          </el-col>
          <el-col :span="2" class="title">
            导陪
          </el-col>
          <el-col :span="3" class="content">
            阳阳2
          </el-col>
          <el-col :span="2" class="title">
            接团社
          </el-col>
          <el-col :span="7" class="content">
            界社团123
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="title">
            团号
          </el-col>
          <el-col :span="8" class="content">
            LCSZ-1810-BXSD
          </el-col>
          <el-col :span="2" class="title">
            线路名称
          </el-col>
          <el-col :span="12" class="content">
            我是线路
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="title">
            团队人数
          </el-col>
          <el-col :span="3" class="content">
            83
          </el-col>
          <el-col :span="2" class="title">
            减免人数
          </el-col>
          <el-col :span="3" class="content">
            3
          </el-col>
          <el-col :span="2" class="title">
            出发日期
          </el-col>
          <el-col :span="3" class="content">
            2019-07-24
          </el-col>
          <el-col :span="2" class="title">
            返回日期
          </el-col>
          <el-col :span="3" class="content">
            2019-07-31
          </el-col>
          <el-col :span="2" class="title">
            全程天数
          </el-col>
          <el-col :span="2" class="content">
            3
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="title">
            团队收入成本结算
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="title">
            总收入
          </el-col>
          <el-col :span="3" class="content">
            63510.00
          </el-col>
          <el-col :span="2" class="title">
            总支出
          </el-col>
          <el-col :span="3" class="content">
            58192.00
          </el-col>
          <el-col :span="2" class="title">
            毛利额
          </el-col>
          <el-col :span="3" class="content">
            5318.00
          </el-col>
          <el-col :span="2" class="title">
            毛利率
          </el-col>
          <el-col :span="7" class="content">
            8.37%
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="content">
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="title">
            序号
          </el-col>
          <el-col :span="5" class="title">
            收入
          </el-col>
          <el-col :span="5" class="title">
            经手人
          </el-col>
          <el-col :span="3" class="title">
            人数
          </el-col>
          <el-col :span="3" class="title">
            实收款
          </el-col>
          <el-col :span="3" class="title">
            发票号码
          </el-col>
          <el-col :span="3" class="title">
            备注
          </el-col>
        </el-row>
        <template v-for="(bill,index) in billReporting">
          <el-row>
            <el-col :span="2" class="content">
              {{bill.id}}
            </el-col>
            <el-col :span="5" class="content">
              {{bill.income}}
            </el-col>
            <el-col :span="5" class="content">
              {{bill.user}}
            </el-col>
            <el-col :span="3" class="content">
              {{bill.number}}
            </el-col>
            <el-col :span="3" class="content">
              {{bill.receivables}}
            </el-col>
            <el-col :span="3" class="content">
              {{bill.invoice}}
            </el-col>
            <el-col :span="3" class="content">
              {{bill.remarks}}
            </el-col>
          </el-row>
        </template>
        <el-row>
          <el-col :span="12" class="title">
            合计：
          </el-col>
          <el-col :span="3" class="content">
            {{billTotalNumber}}
          </el-col>
          <el-col :span="3" class="content">
            {{billTotalReceivables}}
          </el-col>
          <el-col :span="3" class="content">
            {{billTotalInvoice}}
          </el-col>
          <el-col :span="3" class="content">
            {{billTotalRmarks}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="title">
            团队成本明细
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="title">
            序号
          </el-col>
          <el-col :span="3" class="title">
            成本项目
          </el-col>
          <el-col :span="4" class="title">
            供应商
          </el-col>
          <el-col :span="2" class="title">
            人数
          </el-col>
          <el-col :span="3" class="title">
            成本合计
          </el-col>
          <el-col :span="3" class="title">
            已支付
          </el-col>
          <el-col :span="3" class="title">
            挂账
          </el-col>
          <el-col :span="3" class="title">
            备注
          </el-col>
        </el-row>
        <template v-for="(cost,index) in costDetails">
          <el-row>
            <el-col :span="3" class="content">
              {{cost.id}}
            </el-col>
            <el-col :span="3" class="content">
              {{cost.costItems}}
            </el-col>
            <el-col :span="4" class="content">
              {{cost.supplier}}
            </el-col>
            <el-col :span="2" class="content">
              {{cost.number}}
            </el-col>
            <el-col :span="3" class="content">
              {{cost.totalCost}}
            </el-col>
            <el-col :span="3" class="content">
              {{cost.paymented}}
            </el-col>
            <el-col :span="3" class="content">
              {{cost.bill}}
            </el-col>
            <el-col :span="3" class="content">
              {{cost.remarks}}
            </el-col>
          </el-row>
        </template>
        <el-row>
          <el-col :span="3" class="title">
            合计
          </el-col>
          <el-col :span="6" class="title">
          </el-col>
          <el-col :span="3" class="title">
            {{costTotalNumber}}
          </el-col>
          <el-col :span="3" class="title">
            {{costTotalCost}}
          </el-col>
          <el-col :span="3" class="title">
            {{costPaymented}}
          </el-col>
          <el-col :span="3" class="title">
            挂账
          </el-col>
          <el-col :span="3" class="title">
            备注
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="title">
            审批人
          </el-col>
          <el-col :span="3" class="title" style="border-bottom:0px solid #ccc;z-index: 99">
            <div style="position:relative;z-index: 99;height: 68px;line-height: 68px;">计调</div>
          </el-col>
          <el-col :span="4" class="">
          </el-col>
          <el-col :span="3" class="title" style="border-bottom:0px solid #ccc;z-index: 99">
            <div style="position:relative;z-index: 99;height: 68px;line-height: 68px;">财务部</div>
          </el-col>
          <el-col :span="4" class="">
          </el-col>
          <el-col :span="3" class="title" style="border-bottom:0px solid #ccc;z-index: 99">
            <div style="position:relative;z-index: 99;height: 68px;line-height: 68px;">总经理</div>
          </el-col>
          <el-col :span="4" class="">
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="title">
            签字
          </el-col>
          <el-col :span="3" class="title" style="border-top:0px solid #ccc;z-index: 10">
          </el-col>
          <el-col :span="4" class="" style="border-top:0px solid #ccc;z-index: 10">
          </el-col>
          <el-col :span="3" class="title" style="border-top:0px solid #ccc;z-index: 10">
          </el-col>
          <el-col :span="4" class="" style="border-top:0px solid #ccc;z-index: 10">
          </el-col>
          <el-col :span="3" class="title" style="border-top:0px solid #ccc;z-index: 10">
          </el-col>
          <el-col :span="4" class="" style="border-top:0px solid #ccc;z-index: 10">
          </el-col>
        </el-row>
        <!-- <div class="no-print">不要打印我</div> -->
      </section>
      <div>
        <el-dialog
          style="text-align: left;"
          title="审批通过"
          :visible.sync="dialogVisiblePass"
          width="30%"
          top="20vh"
          append-to-body
        >
          <div>
            <p class="areaP">通过说明：</p>
            <el-input
              class="areaIn"
              type="textarea"
              :rows="3"
              placeholder="请输入内容(选填)"
              v-model="areaIn">
            </el-input>
          </div>
          <div slot="footer" style="overflow: hidden;">
            <el-button @click="dialogVisiblePass = false">取 消</el-button>
            <el-button type="primary" @click="passSubmit()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div>
        <el-dialog
          style="text-align: left;"
          title="审批驳回"
          :visible.sync="dialogVisibleReject"
          width="30%"
          top="20vh"
          append-to-body
        >
          <div>
            <p class="areaP">驳回意见：</p>
            <el-input
              class="areaIn"
              type="textarea"
              :rows="3"
              placeholder="请输入内容(选填)"
              v-model="areaIn">
            </el-input>
          </div>
          <div slot="footer" style="overflow: hidden;">
            <el-button @click="dialogVisibleReject = false">取 消</el-button>
            <el-button type="primary" @click="rejectSubmit()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "checkSheetPreview",
  components: {},
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
      dialogVisiblePass: false,
      dialogVisibleReject: false,
      areaIn: '',
      billReporting: [{
        id: 1,
        income: '线下',
        user: '经手人1',
        number: '80',
        receivables: '63500.00',
        invoice: '123456',
        remarks: '',
      }, {
        id: 2,
        income: '线下',
        user: '经手人2',
        number: '1',
        receivables: '5.00',
        invoice: '123456',
        remarks: '',
      }, {
        id: 3,
        income: '线下',
        user: '经手人2',
        number: '2',
        receivables: '5.00',
        invoice: '123456',
        remarks: '',
      }],
      billTotalNumber: '83',
      billTotalReceivables: '63510.00',
      billTotalInvoice: '',
      billTotalRmarks: '',
      costDetails: [{
        id: 1,
        costItems: '门票',
        supplier: '经手人1',
        number: '83',
        totalCost: '58192.00',
        paymented: '58192.00',
        bill: '',
        remarks: '',
      }, {
        id: 2,
        costItems: '',
        supplier: '',
        number: '',
        totalCost: '',
        paymented: '',
        bill: '',
        remarks: '',
      }, ],
      costTotalNumber: '83',
      costTotalCost: '58192.00',
      costPaymented: '58192.00',
      ruleForm: {
        days: ''
      },
      rules: {
        days: [{ required: true, message: '天数不能为空!', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '天数必须是正整数!' }
        ],
      },
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    info: {
      handler:function(){
        this.loadData()
      }
    }
  },
  methods: {
    closeAdd() {
      this.$emit('close');
    },
    print(formName) {
      this.$print(this.$refs.print)
    },
    loadData(){
      console.log(this.info);
    },
    goDetail(){
      this.$router.push({path: "/scenicTicketingDetails?id=1"});
    },
    passFun(){

    },
    rejectFun(){

    },
    passSubmit(){

    },
    rejectSubmit(){

    }
  },
  created() {},
  mounted() {}
}

</script>
<style lang="scss" scoped>
  .dateP{
    width: 100%;
    text-align: right;
    color: #000000;
    font-size: 14px;
    box-sizing: border-box;
    padding-right: 20px;
  }
.operation {
  position: relative;
  width: 100%;
  float: right;
  height: 45px;
}
.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}
.inputWidth {
  width: 300px;
}
.totalMoney {
  margin: 0 30px;
}
//打印开始
.print {
  width: 99%;
  color: black;
  margin: 0 auto 20px;
  overflow: hidden;
}
.title {
  background-color: #CCCCCC;
  color: black;
}
.content {
  background-color: white;
}
.el-row {
  height: 34px;
  line-height: 33px;

  &:first-child {}

  .el-col {
    border: 1px solid black;
    border-bottom: 0px solid black;
    border-right: 0px solid black;
    height: 34px;
    line-height: 34px;
    text-align: center;

    &:last-child {
      border-right: 1px solid black;
    }
  }

  &:last-child {
    .el-col {
      border-bottom: 1px solid black;
    }
  }
}
.areaP{
  width: 18%;
  display: inline-block;
  vertical-align: top;
  margin: 0;
}
.areaIn{
  width: 80%;
}
</style>
