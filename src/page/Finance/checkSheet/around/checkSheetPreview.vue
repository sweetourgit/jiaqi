<template>
  <div class="vivo" style="position:relative;">
    <!--报账单-->
    <el-dialog :visible="dialogFormVisible" width=50% @close="closeAdd" style="font-size: 20px; font-weight: 700;">
      <div class="operation" v-if="info.bill_status == 5">
        <el-button @click="goDetail" type="primary" size="small" class="table_details">团期详情</el-button>
        <el-button @click="dialogVisiblePass = true" type="success" size="small" class="table_details">通过</el-button>
        <el-button @click="dialogVisibleReject = true" type="warning" size="small" class="table_details">驳回</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
      <div class="operation" v-if="info.bill_status == 7">
        <el-button @click="print" type="success" size="small" class="table_details">打印</el-button>
        <el-button @click="goDetail" type="primary" size="small" class="table_details">团期详情</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
      <div ref="print" class="print">
        <p class="titleP">{{topTitle}}</p>
        <p class="dateP">报账日期：<span>{{topData}}</span></p>
        <section>
          <el-row>
            <el-col :span="2" class="title1">
              部门
            </el-col>
            <el-col :span="3" class="content">
              {{org_name}}
            </el-col>
            <el-col :span="2" class="title1">
              操作人
            </el-col>
            <el-col :span="3" class="content">
              {{create_uid}}
            </el-col>
            <el-col :span="2" class="title1">
              导陪
            </el-col>
            <el-col :span="3" class="content">
              {{msg.guide}}
            </el-col>
            <el-col :span="2" class="title1">
              接团社
            </el-col>
            <el-col :span="7" class="content">
              {{msg.associations}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="title1">
              团号
            </el-col>
            <el-col :span="8" class="content">
              {{msg.tour_no}}
            </el-col>
            <el-col :span="2" class="title1">
              线路名称
            </el-col>
            <el-col :span="12" class="content">
              {{msg.product_name}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="title1">
              团队人数
            </el-col>
            <el-col :span="2" class="content">
              {{msg.team_num}}
            </el-col>
            <el-col :span="2" class="title1">
              减免人数
            </el-col>
            <el-col :span="2" class="content">
              {{msg.reduce_num}}
            </el-col>
            <el-col :span="2" class="title1">
              出发日期
            </el-col>
            <el-col :span="4" class="content">
              {{msg.startTime}}
            </el-col>
            <el-col :span="2" class="title1">
              返回日期
            </el-col>
            <el-col :span="4" class="content">
              {{msg.endTime}}
            </el-col>
            <el-col :span="2" class="title1">
              全程天数
            </el-col>
            <el-col :span="2" class="content">
              {{msg.days||'1'}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="title1">
              团队收入成本结算
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="title1">
              总收入
            </el-col>
            <el-col :span="3" class="content">
              {{msg.total_income}}
            </el-col>
            <el-col :span="2" class="title1">
              总支出
            </el-col>
            <el-col :span="3" class="content">
              {{msg.total_cost}}
            </el-col>
            <el-col :span="2" class="title1">
              毛利额
            </el-col>
            <el-col :span="3" class="content">
              {{msg.gross_profit}}
            </el-col>
            <el-col :span="2" class="title1">
              毛利率
            </el-col>
            <el-col :span="7" class="content">
              {{msg.gross_rate}}%
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="content">
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="title1">
              序号
            </el-col>
            <el-col :span="5" class="title1">
              收入来源
            </el-col>
            <el-col :span="5" class="title1">
              经手人
            </el-col>
            <el-col :span="3" class="title1">
              人数
            </el-col>
            <el-col :span="3" class="title1">
              实收款
            </el-col>
            <el-col :span="3" class="title1">
              发票号码
            </el-col>
            <el-col :span="3" class="title1">
              备注
            </el-col>
          </el-row>
          <template v-for="(bill,index) in billReporting">
            <el-row :style="{height: Math.ceil((bill.remark || 'zhan').length/7)*33+'px'}" :key="index">
              <el-col :span="2" class="content" :style="{height: Math.ceil((bill.remark || 'zhan').length/7)*33+'px'}">
                {{index + 1}}
              </el-col>
              <el-col :span="5" class="content" :style="{height: Math.ceil((bill.remark || 'zhan').length/7)*33+'px'}">
                {{bill.handler}}
              </el-col>
              <el-col :span="5" class="content" :style="{height: Math.ceil((bill.remark || 'zhan').length/7)*33+'px'}">
                {{bill.distributor}}
              </el-col>
              <el-col :span="3" class="content" :style="{height: Math.ceil((bill.remark || 'zhan').length/7)*33+'px'}">
                {{bill.people_num}}
              </el-col>
              <el-col :span="3" class="content" :style="{height: Math.ceil((bill.remark || 'zhan').length/7)*33+'px'}">
                {{bill.income}}
              </el-col>
              <el-col :span="3" class="content" :style="{height: Math.ceil((bill.remark || 'zhan').length/7)*33+'px'}">
                {{bill.serial_sn}}
              </el-col>
              <el-col :span="3" class="content" :style="{height: Math.ceil((bill.remark || 'zhan').length/7)*33+'px'}">
                {{bill.remark}}
              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="12" class="title1">
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
            <el-col :span="24" class="title1">
              团队成本明细
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="title1">
              序号
            </el-col>
            <el-col :span="4" class="title1">
              成本项目
            </el-col>
            <!--<el-col :span="4" class="title">-->
              <!--供应商-->
            <!--</el-col>-->
            <el-col :span="2" class="title1">
              人数
            </el-col>
            <el-col :span="3" class="title1">
              成本合计
            </el-col>
            <el-col :span="3" class="title1">
              已支付
            </el-col>
            <el-col :span="3" class="title1">
              挂账
            </el-col>
            <el-col :span="6" class="title1">
              备注
            </el-col>
          </el-row>
          <template v-for="(cost,index) in costDetails">
            <el-row :style="{height: cost.remarks ? Math.ceil(cost.remarks.length/10)*33+'px' : '33px'}" :key="index">
              <el-col :span="3" class="content" :style="{height: cost.remarks ? Math.ceil(cost.remarks.length/10)*33+'px' : '33px'}">
                {{index + 1}}
              </el-col>
              <el-col :span="4" class="content" :style="{height: cost.remarks ? Math.ceil(cost.remarks.length/10)*33+'px' : '33px'}">
                {{cost.cost_type}}
              </el-col>
              <!--<el-col :span="4" class="content" :style="{height: Math.ceil(cost.supplier.length/7)*33+'px'}">-->
                <!--{{cost.supplier}}-->
              <!--</el-col>-->
              <el-col :span="2" class="content" :style="{height: cost.remarks ? Math.ceil(cost.remarks.length/10)*33+'px' : '33px'}">
                {{cost.people_num}}
              </el-col>
              <el-col :span="3" class="content" :style="{height: cost.remarks ? Math.ceil(cost.remarks.length/10)*33+'px' : '33px'}">
                {{cost.cost}}
              </el-col>
              <el-col :span="3" class="content" :style="{height: cost.remarks ? Math.ceil(cost.remarks.length/10)*33+'px' : '33px'}">
                {{cost.paid_cost}}
              </el-col>
              <el-col :span="3" class="content" :style="{height: cost.remarks ? Math.ceil(cost.remarks.length/10)*33+'px' : '33px'}">
                {{cost.settle_cost}}
              </el-col>
              <el-col :span="6" class="content" :style="{height: cost.remarks ? Math.ceil(cost.remarks.length/10)*33+'px' : '33px'}">
                {{cost.remarks}}
              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="3" class="title1">
              合计
            </el-col>
            <el-col :span="4" class="title1">
            </el-col>
            <el-col :span="2" class="title1">
              {{costTotalNumber}}
            </el-col>
            <el-col :span="3" class="title1">
              {{costTotalCost}}
            </el-col>
            <el-col :span="3" class="title1">
              {{costPaymented}}
            </el-col>
            <el-col :span="3" class="title1">
              <!--挂账-->
            </el-col>
            <el-col :span="6" class="title1">
              <!--备注-->
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="title1">
              审批人
            </el-col>
            <el-col :span="2" class="title1" style="">
              <div style="position:relative;z-index: 99;top: 16px;">计调</div>
            </el-col>
            <el-col :span="3" class="">
            </el-col>
            <el-col :span="2" class="title1" style="">
              <div style="position:relative;z-index: 99;top: 16px;">部门经理</div>
            </el-col>
            <el-col :span="3" class="">
            </el-col>
            <el-col :span="2" class="title1" style="border-bottom:0px solid #ccc;z-index: 99">
              <div style="position:relative;z-index: 99;top: 16px;">财务部</div>
            </el-col>
            <el-col :span="3" class="">
            </el-col>
            <el-col :span="2" class="title1" style="">
              <div style="position:relative;z-index: 99;top: 16px;">总经理</div>
            </el-col>
            <el-col :span="4" class="">
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="title1">
              签字
            </el-col>
            <el-col :span="2" class="title1" style="border-top:0px solid #ccc;z-index: 10">
            </el-col>
            <el-col :span="3" class="" style="border-top:0px solid #ccc;z-index: 10">
            </el-col>
            <el-col :span="2" class="title1" style="border-top:0px solid #ccc;z-index: 10">
            </el-col>
            <el-col :span="3" class="" style="border-top:0px solid #ccc;z-index: 10">
            </el-col>
            <el-col :span="2" class="title1" style="border-top:0px solid #ccc;z-index: 10">
            </el-col>
            <el-col :span="3" class="" style="border-top:0px solid #ccc;z-index: 10">
            </el-col>
            <el-col :span="2" class="title1" style="border-top:0px solid #ccc;z-index: 10">
            </el-col>
            <el-col :span="4" class="" style="border-top:0px solid #ccc;z-index: 10">
            </el-col>
          </el-row>
          <!-- <div class="no-print">不要打印我</div> -->
        </section>
      </div>

      <div class="bottomCode">
        <el-tabs v-model="activeName">
          <el-tab-pane label="收款编码" name="code">
            <div class="table_trip" style="width: 100%;">
              <el-table ref="singleTable" :data="tableData2" border style="width: 100%" :header-cell-style="getRowClass">
                <el-table-column prop="rec_sn" label="收款编码" align="center">
                </el-table-column>
                <el-table-column prop="status" label="审批状态" align="center">
                  <template slot-scope="scope">
                    {{status[scope.row.approval_status]}}
                  </template>
                </el-table-column>
                <el-table-column prop="approval_comments" label="审批意见" align="center">
                </el-table-column>
                <el-table-column prop="approval_money" label="审批金额" align="center">
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button @click="getOrder(scope.row)" type="text" size="small" class="table_details">查看订单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="发票" name="invoice">
            <div class="table_trip" style="width: 100%;">
              <el-table ref="singleTable" :data="tableData3" border style="width: 100%" :header-cell-style="getRowClass">
                <el-table-column prop="rec_sn" label="发票" align="center">
                </el-table-column>
                <el-table-column prop="invoiceInfo" label="发票信息" align="center">
                  <template slot-scope="scope">
                    <span>发票抬头：{{scope.row.title}}</span><br>
                    <span>纳税人识别号：{{scope.row.pay_taxes_no}}</span><br>
                    <span>手机号：{{scope.row.phone}}</span><br>
                    <span>地址：{{scope.row.address}}</span><br>
                    <span>开户行：{{scope.row.bank}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="voucher" label="凭证" align="center">
                  <template slot-scope="scope">
                    <p v-for="item in scope.row.file" :key="item.index">
                      <a :href="item.url" target="_blank">{{item.name}}</a>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="审批状态" align="center">
                  <template slot-scope="scope">
                    {{status[scope.row.approval_status]}}
                  </template>
                </el-table-column>
                <el-table-column prop="approval_comments" label="审批意见" align="center">
                </el-table-column>
                <el-table-column prop="approval_money" label="审批金额" align="center">
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button @click="getOrder(scope.row)" type="text" size="small" class="table_details">查看订单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <GetOrder :dialogFormVisible1="dialogFormVisible1" @close="close2" :sendID="sendID"></GetOrder>
      <!--审批通过-->
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
      <!--审批驳回-->
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
import GetOrder from './getOrder.vue'
import {formatDate} from '@/js/libs/publicMethod.js'

export default {
  name: "checkSheetPreview",
  components: {
    GetOrder
  },
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
      topTitle: '',
      topData: '',
      dialogVisiblePass: false,
      dialogVisibleReject: false,
      areaIn1: '',
      areaIn2: '',
      msg:{},
      create_uid: '',
      org_name: '',
      billReporting: [],
      billTotalNumber: 0,
      billTotalReceivables: 0,
      billTotalInvoice: '',
      billTotalRmarks: '',
      costDetails: [],
      costTotalNumber: 0,
      costTotalCost: 0,
      costPaymented: 0,

      //收款编码，发票数据
      activeName: 'code',
      tableData2: [],
      tableData3: [],
      status: {
        1: '审批中',
        2: '驳回',
        3: '通过',
      },
      dialogFormVisible1: false,
      sendID: ''
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    dialogFormVisible: {
      handler:function(){
//        console.log('info',this.info);
        if(this.info !== '' && this.dialogFormVisible === true){
          this.loadData();
          this.loadDatabyNum(1);
          this.loadDatabyNum(2);
          if(this.info.bill_status != 7){
            this.topData = formatDate(new Date()).split(" ")[0];
          }
          this.getTitleName(this.info.createName);

        }else{
          this.closeAdd();
        }
      }
    }
  },
  methods: {
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    closeAdd() {
      this.$emit('close');
    },
    print(formName) {
      this.$print(this.$refs.print)
    },
    loadData(){
//      console.log(this.info);
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
            that.topData = billTime.split(" ")[0];
          }else{
            billTime = '';
          }
          if(response.data.data.start_at){
            startTime = formatDate(new Date(response.data.data.start_at*1000)).split(" ")[0];
            endTime = formatDate(new Date(response.data.data.back_at*1000)).split(" ")[0];
          }
          that.$http.post(that.GLOBAL.serverSrcZb + "/org/api/userget", {
            "id": response.data.data.op_id
          },{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
          }).then(function(response) {

            if (response.data.isSuccess) {
              that.create_uid = response.data.object.name
            } else {
              that.$message.success("加载数据失败~");
            }
          }).catch(function(error) {
            console.log(error);
          });
          that.$http.post(that.GLOBAL.serverSrcZb + "/org/user/api/orgshort", {
            "id": response.data.data.op_id
          },{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
          }).then(function(response) {

            if (response.data.isSuccess) {
              that.org_name = response.data.objects[0].name
            } else {
              that.$message.success("加载数据失败~");
            }
          }).catch(function(error) {
            console.log(error);
          });
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
          that.costTotalCost = response.data.data.cost_total.toFixed(2);
          that.costPaymented = response.data.data.paid_cost_total.toFixed(2);

        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    loadDatabyNum(num){
      const that = this;
//      console.log(this.param);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/receiptlist", {
        "tour_no": this.info.tour_no,
        "apply_type": num,
        "limit": 0
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          if(num == 1){
            console.log("1",response.data.data.list);
            that.tableData2 = response.data.data.list;
          }else if(num == 2){
            console.log("2",response.data.data.list);
            that.tableData3 = response.data.data.list;
            that.tableData3.forEach(function (item, index, arr) {
              item.file = JSON.parse(item.file);
              console.log(item.file);
              for(let i = 0; i < item.file.length; i++){
                item.file[i].url = that.GLOBAL.serverSrcPhp + item.file[i].url;
              }
            })
          }
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    getOrder(row) {
      this.sendID = row.id;
      this.dialogFormVisible1 = true;
    },
    close2() {
      this.sendID = '';
      this.dialogFormVisible1 = false;
    },
    goDetail(){
//      console.log(this.info);
      this.$router.push({
        path: "/scenicTicketingDetails",
        name: "产品管理  /团期计划  /详情",
        query: {
          id: this.info.tour_id,
          bill_status: this.info.bill_status,
          tour_no: this.info.tour_no,
          approved: this.info.approved,
          returnPath: this.info.path ? this.info.path : ''
        }
      });
    },
    passSubmit(){
      const that = this;
      console.log('this.msg.org_id',this.msg.org_id);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/savebill", {
        "tour_no": this.info.tour_no,
        "bill_status": '7',
        "mark": this.areaIn1,
        "create_uid": sessionStorage.getItem('id'),
        "org_id": this.msg.org_id
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
    },
    rejectSubmit(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/savebill", {
        "tour_no": this.info.tour_no,
        "bill_status": '6',
        "mark": this.areaIn2,
        "create_uid": sessionStorage.getItem('id'),
        "org_id": this.msg.org_id
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
    },

    getTitleName(id){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcZb + "/org/api/fullpath", {
        'id': id
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(function(response) {
//        console.log('公司信息',response);
        if (response.status == 200) {
          let dataCom = JSON.parse(response.data.path);
          that.topTitle = dataCom[dataCom.length - 1].Name + '旅游团队报账单';
        } else {
          this.$message.warning("加载旅行社名称失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {},
  mounted() {}
}

</script>
<style lang="scss" scoped>
  .titleP{
    width: 100%;
    text-align: center;
    font-size: 18px;
  }
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
.title1 {
  background-color: #CCCCCC;
  color: black;
  font-size: 14px;
}
.content {
  background-color: white;
}
.el-row {
  height: 34px;
  line-height: 33px;

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
