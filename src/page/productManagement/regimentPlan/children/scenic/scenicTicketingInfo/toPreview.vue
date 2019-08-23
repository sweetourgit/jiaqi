<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="预览报账单" :visible="dialogFormVisible" width=50% @close="closeAdd">
      <section ref="print" class="print">
        <el-row>
          <el-col :span="2" class="title">
            部门
          </el-col>
          <el-col :span="3" class="content">
            {{info.org_id}}
          </el-col>
          <el-col :span="2" class="title">
            操作人
          </el-col>
          <el-col :span="3" class="content">
            {{info.op_id}}
          </el-col>
          <el-col :span="2" class="title">
            导陪
          </el-col>
          <el-col :span="3" class="content">
            {{info.guide}}
          </el-col>
          <el-col :span="2" class="title">
            接团社
          </el-col>
          <el-col :span="7" class="content">
            {{info.associations}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="title">
            团号
          </el-col>
          <el-col :span="8" class="content">
            {{info.tour_no}}
          </el-col>
          <el-col :span="2" class="title">
            线路名称
          </el-col>
          <el-col :span="12" class="content">
            {{info.product_name}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="title">
            团队人数
          </el-col>
          <el-col :span="3" class="content">
            {{info.team_num}}
          </el-col>
          <el-col :span="2" class="title">
            减免人数
          </el-col>
          <el-col :span="3" class="content">
            {{info.reduce_num}}
          </el-col>
          <el-col :span="2" class="title">
            出发日期
          </el-col>
          <el-col :span="3" class="content">
            {{info.startTime}}
          </el-col>
          <el-col :span="2" class="title">
            返回日期
          </el-col>
          <el-col :span="3" class="content">
            {{info.endTime}}
          </el-col>
          <el-col :span="2" class="title">
            全程天数
          </el-col>
          <el-col :span="2" class="content">
            {{info.days}}
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
            {{info.total_income}}
          </el-col>
          <el-col :span="2" class="title">
            总支出
          </el-col>
          <el-col :span="3" class="content">
            {{info.total_cost}}
          </el-col>
          <el-col :span="2" class="title">
            毛利额
          </el-col>
          <el-col :span="3" class="content">
            {{info.gross_profit}}
          </el-col>
          <el-col :span="2" class="title">
            毛利率
          </el-col>
          <el-col :span="7" class="content">
            {{info.gross_rate}}
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
              {{index + 1}}
            </el-col>
            <el-col :span="5" class="content">
              {{bill.handler}}
            </el-col>
            <el-col :span="5" class="content">
              {{bill.distributor}}
            </el-col>
            <el-col :span="3" class="content">
              {{bill.people_num}}
            </el-col>
            <el-col :span="3" class="content">
              {{bill.income}}
            </el-col>
            <el-col :span="3" class="content">
              {{bill.serial_sn}}
            </el-col>
            <el-col :span="3" class="content">
              {{bill.remark}}
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
          <el-row :style="{height: Math.ceil(cost.supplier.length/10)*33+'px'}">
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/10)*33+'px'}">
              {{index + 1}}
            </el-col>
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/10)*33+'px'}">
              {{cost.cost_type}}
            </el-col>
            <el-col :span="4" class="content" :style="{height: Math.ceil(cost.supplier.length/10)*33+'px'}">
              {{cost.supplier}}
            </el-col>
            <el-col :span="2" class="content" :style="{height: Math.ceil(cost.supplier.length/10)*33+'px'}">
              {{cost.people_num}}
            </el-col>
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/10)*33+'px'}">
              {{cost.cost}}
            </el-col>
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/10)*33+'px'}">
              {{cost.paid_cost}}
            </el-col>
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/10)*33+'px'}">
              {{cost.settle_cost}}
            </el-col>
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/10)*33+'px'}">
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
            <!--挂账-->
          </el-col>
          <el-col :span="3" class="title">
            <!--备注-->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="title">
            审批人
          </el-col>
          <el-col :span="3" class="title" style="">
            <div style="position:relative;z-index: 99;top: 16px;">计调</div>
          </el-col>
          <el-col :span="4" class="">
          </el-col>
          <el-col :span="3" class="title" style="border-bottom:0px solid #ccc;z-index: 99">
            <div style="position:relative;z-index: 99;top: 16px;">财务部</div>
          </el-col>
          <el-col :span="4" class="">
          </el-col>
          <el-col :span="3" class="title" style="">
            <div style="position:relative;z-index: 99;top: 16px;">总经理</div>
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
      <div class="footer">
        <el-button @click="print" type="primary" size="small" class="table_details">打印</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "toUpdate",
  components: {},
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
      billReporting: [],
      billTotalNumber: 0,
      billTotalReceivables: 0,
      billTotalInvoice: '',
      billTotalRmarks: '',
      costDetails: [],
      costTotalNumber: '0',
      costTotalCost: '0',
      costPaymented: '0',
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
      handler: function () {
        this.loadData();
      }
    }
  },
  methods: {
    closeAdd() {
      this.$emit('close', false);
    },
    print(formName) {
      this.$print(this.$refs.print)
    },
    loadData(){
//      if(this.info == ''){
//        return;
//      }
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/recinfo", {
        "id": this.$parent.param
      }, ).then(function(response) {
        console.log("认款信息",response);
        if (response.data.code == '200') {
          console.log(response);
          that.billReporting = response.data.data;
          that.billTotalNumber = 0;
          that.billTotalReceivables = 0;
          that.billReporting.forEach(function (item, index, arr) {
            that.billTotalNumber += parseInt(item.people_num);
            that.billTotalReceivables += parseFloat(item.income);
          });
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });

//      console.log('this.$parent.param',this.$parent.param);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/costinfo", {
        "id": this.$parent.param
      }, ).then(function(response) {
        console.log("成本信息",response);
        if (response.data.code == '200') {
//          console.log(response);
          that.costDetails = response.data.data.listInfo;
          that.costTotalNumber = response.data.data.quantity_total;
          that.costTotalCost = response.data.data.cost_total;
          that.costPaymented = response.data.data.paid_cost_total;

        } else {
          that.$message.success("加载数据失败377~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }

  },
  created() {

  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
.footer {
  position: relative;
  width: 100%;
  float: right;
  margin-top: -10px;
  height: 100px;
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
  width: 900px;
  color: black;
  margin-bottom: 30px;
}

.title {
  background-color: #CCCCCC;
  color: black;
}

.content {
  background-color: white;
}

.el-row {
  /*height: 34px;*/
  line-height: 33px;
  /*overflow: hidden;*/
  &:first-child {}

  .el-col {
    border: 1px solid black;
    border-bottom: 0px solid black;
    border-right: 0px solid black;
    min-height: 34px;
    /*height: 100%;*/
    /*line-height: 34px;*/
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

</style>
