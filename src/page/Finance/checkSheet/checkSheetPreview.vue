<template>
  <div class="vivo" style="position:relative;">
    <!--报账单-->
    <el-dialog title="沈阳甜程国际旅行社有限公司旅游团队报账单" :visible="dialogFormVisible" width=70% @close="closeAdd" style="font-size: 20px; font-weight: 700;">
      <div class="operation" v-if="info.bill_status == 5">
        <el-button @click="goDetail" type="primary" size="small" class="table_details">团期详情</el-button>
        <el-button @click="dialogVisiblePass = true" type="success" size="small" class="table_details">通过</el-button>
        <el-button @click="dialogVisibleReject = true" type="warning" size="small" class="table_details">驳回</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
      <div class="operation" v-if="info.checkType == 7">
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
            {{msg.org_id}}
          </el-col>
          <el-col :span="2" class="title">
            操作人
          </el-col>
          <el-col :span="3" class="content">
            {{msg.op_id}}
          </el-col>
          <el-col :span="2" class="title">
            导陪
          </el-col>
          <el-col :span="3" class="content">
            {{msg.guide}}
          </el-col>
          <el-col :span="2" class="title">
            接团社
          </el-col>
          <el-col :span="7" class="content">
            {{msg.associations}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="title">
            团号
          </el-col>
          <el-col :span="8" class="content">
            {{msg.tour_no}}
          </el-col>
          <el-col :span="2" class="title">
            线路名称
          </el-col>
          <el-col :span="12" class="content">
            {{msg.product_name}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="title">
            团队人数
          </el-col>
          <el-col :span="3" class="content">
            {{msg.team_num}}
          </el-col>
          <el-col :span="2" class="title">
            减免人数
          </el-col>
          <el-col :span="3" class="content">
            {{msg.reduce_num}}
          </el-col>
          <el-col :span="2" class="title">
            出发日期
          </el-col>
          <el-col :span="3" class="content">
            {{msg.startTime}}
          </el-col>
          <el-col :span="2" class="title">
            返回日期
          </el-col>
          <el-col :span="3" class="content">
            {{msg.endTime}}
          </el-col>
          <el-col :span="2" class="title">
            全程天数
          </el-col>
          <el-col :span="2" class="content">
            {{msg.days}}
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
            {{msg.total_income}}
          </el-col>
          <el-col :span="2" class="title">
            总支出
          </el-col>
          <el-col :span="3" class="content">
            {{msg.total_cost}}
          </el-col>
          <el-col :span="2" class="title">
            毛利额
          </el-col>
          <el-col :span="3" class="content">
            {{msg.gross_profit}}
          </el-col>
          <el-col :span="2" class="title">
            毛利率
          </el-col>
          <el-col :span="7" class="content">
            {{msg.gross_rate}}
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
          <el-row :style="{height: Math.ceil(cost.supplier.length/14)*33+'px'}">
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/14)*33+'px'}">
              {{index + 1}}
            </el-col>
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/14)*33+'px'}">
              {{cost.cost_type}}
            </el-col>
            <el-col :span="4" class="content" :style="{height: Math.ceil(cost.supplier.length/14)*33+'px'}">
              {{cost.supplier}}
            </el-col>
            <el-col :span="2" class="content" :style="{height: Math.ceil(cost.supplier.length/14)*33+'px'}">
              {{cost.people_num}}
            </el-col>
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/14)*33+'px'}">
              {{cost.cost}}
            </el-col>
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/14)*33+'px'}">
              {{cost.paid_cost}}
            </el-col>
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/14)*33+'px'}">
              {{cost.settle_cost}}
            </el-col>
            <el-col :span="3" class="content" :style="{height: Math.ceil(cost.supplier.length/14)*33+'px'}">
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
              v-model="areaIn1">
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
              v-model="areaIn2">
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
import {formatDate} from '@/js/libs/publicMethod.js'

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
      areaIn1: '',
      areaIn2: '',
      msg:{},
      billReporting: [],
      billTotalNumber: 0,
      billTotalReceivables: 0,
      billTotalInvoice: '',
      billTotalRmarks: '',
      costDetails: [],
      costTotalNumber: 0,
      costTotalCost: 0,
      costPaymented: 0,
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
      const that = this;
//      获取基本信息
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/viewbill", {
        "id": this.info.tour_id
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log("基本信息",response);
          let billTime = '', startTime = '', endTime = '';
          if(response.data.data.bill_at){
            billTime = formatDate(new Date(response.data.data.bill_at*1000));
          }else{
            billTime = '';
          }
          if(response.data.data.start_at){
            startTime = formatDate(new Date(response.data.data.start_at*1000)).split(" ")[0];
            endTime = formatDate(new Date(response.data.data.back_at*1000)).split(" ")[0];
          }
          that.msg = {
            tour_no: response.data.data.tour_no,
            op_id: response.data.data.op_id,
            billTime: billTime,
            team_num: response.data.data.team_num,
            days: response.data.data.days,
            total_income: response.data.data.total_income,
            total_cost: response.data.data.total_cost,
            gross_profit: response.data.data.gross_profit,
            gross_rate: response.data.data.gross_rate,
            product_name: response.data.data.product_name,
            startTime: startTime,
            endTime: endTime,
            reduce_num: response.data.data.reduce_num,
            guide: response.data.data.guide,
            associations: response.data.data.associations,
            org_id: response.data.data.org_id
          };
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
//      获取认款信息
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/recinfo", {
        "id": this.info.tour_id
      }, ).then(function(response) {
        console.log("认款信息",response);
        if (response.data.code == '200') {
          console.log(response);
          that.billReporting = response.data.data;
          that.billTotalReceivables = 0;
          that.billTotalNumber = 0;
          that.billReporting.forEach(function (item, index, arr) {
            that.billTotalReceivables += parseFloat(item.income);
            that.billTotalNumber += parseInt(item.people_num);
          })
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
//      获取成本信息
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/costinfo", {
        "id": this.info.tour_id
      }, ).then(function(response) {
//        console.log("成本信息",response);
        if (response.data.code == '200') {
//          console.log(response);
          that.costDetails = response.data.data.listInfo;
          that.costTotalNumber = response.data.data.quantity_total;
          that.costTotalCost = response.data.data.cost_total;
          that.costPaymented = response.data.data.paid_cost_total;

        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    goDetail(){
      this.$router.push({
        path: "/scenicTicketingDetails",
        name: "产品管理  /团期计划  /详情",
        params: this.info
      });
    },
    passSubmit(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/savebill", {
        "tour_no": this.info.tour_no,
        "bill_status": '7',
        "mark": this.areaIn1,
        "create_uid": sessionStorage.getItem('id'),
        "org_id": '1'//this.msg.org_id
      }, ).then(function(response) {
        console.log(response);
        if (response.data.code == '200') {
          that.$message({
            type: 'success',
            message: '提交成功'
          });
          that.dialogVisiblePass = false;
          that.closeAdd();
        } else {
          that.$message.warning(response.data.message);
        }
      }).catch(function(error) {
        console.log(error);
        that.$message.warning("提交失败~");
      });
    },
    rejectSubmit(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/savebill", {
        "tour_no": this.info.tour_no,
        "bill_status": '6',
        "mark": this.areaIn2,
        "create_uid": sessionStorage.getItem('id'),
        "org_id": '1'//this.msg.org_id
      }, ).then(function(response) {
        console.log(response);
        if (response.data.code == '200') {
          that.$message({
            type: 'success',
            message: '提交成功'
          });
          that.dialogVisibleReject = false;
          that.closeAdd();
        } else {
          that.$message.warning(response.data.message);
        }
      }).catch(function(error) {
        console.log(error);
        that.$message.warning("提交失败~");
      });
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
