<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <el-row style="margin-bottom: 20px;">
        <el-col :span="8">
          <div class="status">
            <span class="header">基本信息</span><br><br>
            <el-button type="info" round size="mini" v-if="statusBtn == 1">未认款</el-button>
            <el-button type="warning" round size="mini" v-if="statusBtn == 2">认款申请</el-button>
            <el-button type="danger" round size="mini" v-if="statusBtn == 3">认款待修改</el-button>
            <el-button type="success" round size="mini" v-if="statusBtn == 4">认款通过</el-button>
            <el-button type="warning" round size="mini" v-if="statusBtn == 5">报账中</el-button>
            <el-button type="danger" round size="mini" v-if="statusBtn == 6">报账驳回</el-button>
            <el-button type="success" round size="mini" v-if="statusBtn == 7">已报账</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="button"></div>
        </el-col>
        <el-col :span="8">
          <div class="button">
            <el-button class="el-button" @click="closeAdd">取 消</el-button>
            <el-button class="el-button" type="primary" @click="toPreview">预览报账单</el-button>
            <!--<el-button class="el-button" type="primary" @click="submitForm">保 存</el-button>-->
            <el-button class="el-button" type="primary" @click="delInfo" v-if="statusBtn != 7">提交报账单</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>报账团期 :</p>{{msg.tour_no}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>操作人：</p> {{msg.op_id}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>报账日期：</p>{{msg.billTime}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>团队人数：</p>{{msg.team_num}}人
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>全程天数：</p>{{msg.days}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>总收入：</p>{{msg.total_income}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>总支出：</p>{{msg.total_cost}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>毛利额：</p>{{msg.gross_profit}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>毛利率：</p>{{msg.gross_rate}}%
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>成本项目：</p>{{msg.product_name}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info"></div>
        </el-col>
        <el-col :span="8">
          <div class="info"></div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;margin-bottom: 40px;">
        <el-col :span="8">
          <div class="header">
            认款信息
          </div>
        </el-col>
        <el-col :span="8">
          <div class="button"></div>
        </el-col>
        <el-col :span="8">
          <div class="button">
          </div>
        </el-col>
      </el-row>
      <div class="totalMoney"><i class="el-icon-info"></i>&nbsp;&nbsp;总计：{{totalMoney}}元 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;人数：{{number}}</div>
      <div class="footer">
        <div class="table_trip" style="width: 95%;">
          <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass" :cell-style="cellStyle">
            <el-table-column prop="serial_sn" label="收款编码/发票" align="center">
            </el-table-column>
            <el-table-column prop="handler" label="收入来源" align="center">
            </el-table-column>
            <el-table-column prop="basics" label="基础信息" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.invoiceinfo.title">
                  <span>发票抬头：{{scope.row.invoiceinfo.title}}</span><br>
                  <span>纳税人识别号：{{scope.row.invoiceinfo.pay_taxes_no}}</span><br>
                  <span>手机号：{{scope.row.invoiceinfo.phone}}</span><br>
                  <span>地址：{{scope.row.invoiceinfo.address}}</span><br>
                  <span>开户行：{{scope.row.invoiceinfo.bank}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="people_num" label="人数" align="center" style="color:red">
              <template slot-scope="scope" slot="header">
                <el-tooltip effect="light" content="订单可能在不同的收款编码(或发票)。人数会重复增加，需要请修改警示框内的人数" placement="top" >
                 <span>人数<i class="el-icon-warning" style="color: red;margin-left: 6px;"></i></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="income" label="金额" align="center">
            </el-table-column>
            <el-table-column prop="option" label="操作" align="center" width="220" v-if="statusBtn != 7">
              <template slot-scope="scope">
                <!--<el-button @click="toUpddateIncome(scope.row)" type="primary" size="small" class="table_details">更改人数</el-button>-->
                <el-button @click="toUpddateSource(scope.row)" type="primary" size="small" class="table_details">设置收入来源</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--<el-dialog title="提示" :visible.sync="saveDialogVisible" width="30%">-->
        <!--<span><i class="el-icon-info"></i>是否保存后退出</span>-->
        <!--<span slot="footer" class="dialog-footer">-->
          <!--<el-button @click="saveDialogVisible = false">取 消</el-button>-->
          <!--<el-button type="primary" @click="saveDialogVisible = false">直接退出</el-button>-->
          <!--<el-button type="primary" @click="saveExit">保存退出</el-button>-->
        <!--</span>-->
      <!--</el-dialog>-->
      <GetOrder :dialogFormVisible="dialogFormVisible" @close="close2" :info="info"></GetOrder>
      <ToUpddateSource :dialogFormVisible="dialogFormVisible2" @close="close2" :info="updateSource"></ToUpddateSource>
      <ToUpddateIncome :dialogFormVisible="dialogFormVisible3" @close="close2" :info="info"></ToUpddateIncome>
      <ToPreview :dialogFormVisible="dialogFormVisible4" @close="close2" :info="msg"></ToPreview>
    </div>
  </div>
</template>
<script type="text/javascript">
import GetOrder from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/getOrder'
import ToUpddateSource from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/toUpddateSource'
import ToUpddateIncome from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/toUpddateIncome'
import ToPreview from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/toPreview'
import {formatDate} from '@/js/libs/publicMethod.js'
export default {
  name: "scenicTicketingBillReporting",
  components: {
    GetOrder,
    ToUpddateSource,
    ToUpddateIncome,
    ToPreview
  },
  data() {
    return {
      param: '',
      statusBtn: '',
      msg: {
        tour_no: '',
        op_id: '',
        billTime: '',
        team_num: '',
        days: '',
        total_income: '',
        total_cost: '',
        gross_profit: '',
        gross_rate: '',
        product_name: '',
        startTime: '',
        endTime: '',
        reduce_num: '',
        guide: '',
        associations: '',
        org_id: ''
      },

      activeName: '1',
      currentRow: true,
      pid: '',
      info: '',
      totalMoney: 0,
      number: 0,
      transmit: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      tableData: [],
      updateSource: ''
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {

  },
  methods: {
    cellStyle(data) {
      if (data.columnIndex == 3) {
        return "background-color:#FFFF00;";
      }
    },
    handleClick() {
      this.transmit = !this.transmit;
      this.pid = '';
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    //认款
    pledging(row) {
      this.$router.push({ path: "/scenicTicketingPledging?id=" + this.$route.query.id });
    },
    closeAdd() {
      this.$router.push({ path: "/regimentPlan/scenicTicketingList" });
    },

    delInfo() {
      const that = this;
      this.$confirm('是否提交此报账单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/savebill", {
          "tour_no": this.msg.tour_no,
          "bill_status": '5',
          "mark": '',
          "create_uid": sessionStorage.getItem('id'),
          "org_id": this.msg.org_id
        }, ).then(function(response) {
          console.log(response);
          if (response.data.code == '200') {
            that.$message({
              type: 'success',
              message: '提交成功'
            });
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning('提交失败');
            }
          }
        }).catch(function(error) {
          console.log(error);
          that.$message.warning("提交失败~");
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        });
      });
    },
    toUpddateSource(row) {
      this.updateSource = row.rec_id;
      this.dialogFormVisible2 = true;
    },
    toUpddateIncome(row) {
      this.dialogFormVisible3 = true;
    },
    toPreview() {
//      this.info = this.param;
      this.dialogFormVisible4 = true;
    },
    getOrder(row) {
      this.dialogFormVisible = true;
    },
    close2() {
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = false;
      this.dialogFormVisible3 = false;
      this.dialogFormVisible4 = false;
      this.loadData();
      this.updateSource = '';
    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['tour']
    },
    submitForm() {
      this.saveDialogVisible = true
    },
    saveExit() {
      this.$message({
        type: 'success',
        message: '保存成功!'
      });
      this.saveDialogVisible = false
    },
    loadData(){
      const that = this;
//      获取基本信息
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/viewbill", {
        "id": this.param
      }, ).then(function(response) {
          if (response.data.code == '200') {
          console.log("基本信息",response);
          let billTime = '', startTime = '', endTime = '';
          const dataList = response.data.data;
          if(response.data.data.bill_at){
            billTime = formatDate(new Date(response.data.data.bill_at*1000));
          }else{
            billTime = '';
          }
          if(response.data.data.start_at){
            startTime = formatDate(new Date(response.data.data.start_at*1000)).split(" ")[0];
            endTime = formatDate(new Date(response.data.data.back_at*1000)).split(" ")[0];
          }

          that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
            "id": response.data.data.op_id
          },{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
          }).then(function(response) {

            if (response.data.isSuccess) {
              that.msg = {
                tour_no: dataList.tour_no,
                op_id: response.data.object.name,
                billTime: billTime,
                team_num: dataList.team_num,
                days: dataList.days,
                total_income: dataList.total_income,
                total_cost: dataList.total_cost,
                gross_profit: dataList.gross_profit,
                gross_rate: dataList.gross_rate,
                product_name: dataList.product_name,
                startTime: startTime,
                endTime: endTime,
                reduce_num: dataList.reduce_num,
                guide: dataList.guide,
                associations: dataList.associations,
                org_id: dataList.org_id
              };
            } else {
              that.$message.success("加载数据失败~");
            }
          }).catch(function(error) {
            console.log(error);
          });


        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
//      获取认款信息
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/recinfo", {
        "id": this.param
      }, ).then(function(response) {
        console.log("认款信息",response);
        if (response.data.code == '200') {
          console.log(response);
          that.tableData = response.data.data;
          that.totalMoney = 0;
          that.number = 0;
          that.tableData.forEach(function (item, index, arr) {
            that.totalMoney += parseFloat(item.income);
            that.number += parseInt(item.people_num);
          });
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {
    console.log('params',this.$route.params);
    if(this.$route.params.id){
      this.param = this.$route.params.id;
      this.statusBtn = this.$route.params.bill_status;
      this.loadData();
    }else{
      this.closeAdd();
    }
  },
  mounted() {}
}

</script>
<style lang="scss" scoped>
.button {
  float: right;
  margin-right: -90%;
}

.info {
  p {
    width: 20%;
    margin-left: 5%;
    display: inline-block;
  }
}

.header {
  font-size: 22px;
  font-weight: 900;
}

.footer {
  margin: 20px 0px 20px 30px;

}

.totalMoney {
  width: 95%;
  background-color: #E6F3FC;
  height: 30px;
  line-height: 30px;
  margin: 0 30px;
}

</style>
