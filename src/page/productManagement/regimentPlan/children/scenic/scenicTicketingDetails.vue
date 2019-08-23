<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <el-row style="margin-bottom: 20px;">
        <el-col :span="8">
          <div class="status">
            <span class="header">基本信息</span>
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
            <el-button class="el-button" type="primary" @click="toUpdate" v-if="statusBtn == 1 || (statusBtn == 3 && approved != 1)">修 改</el-button>
            <el-button class="el-button" type="primary" @click="pledging" v-if="statusBtn == 1 || statusBtn == 3">认 款</el-button>
            <el-button class="el-button" type="danger" @click="delInfo" v-if="statusBtn == 1 || (statusBtn == 3 && approved != 1)">删 除</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>报账团期 :</p>{{baseInfo.basic_info.tour_no}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>操作人：</p> {{baseInfo.basic_info.create_uid || ""}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>创建时间：</p>{{baseInfo.basic_info.created_at || ""}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>产品名称：</p>{{baseInfo.basic_info.product_name || ""}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>出发日期：</p>{{baseInfo.basic_info.begin_at || ""}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>返回日期：</p>{{baseInfo.basic_info.end_at || ""}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>关联订单：</p>{{baseInfo.basic_order_info.order_num || ""}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>收入：</p>{{baseInfo.basic_order_info.total_income || ""}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>成本：</p>{{baseInfo.basic_order_info.total_cost || ""}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>毛利率：</p>{{baseInfo.basic_order_info.gross_rate || ""}}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info"></div>
        </el-col>
        <el-col :span="8">
          <div class="info"></div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
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
      <div class="footer">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="订单" name="order">
            <div class="table_trip" style="width: 88%;">
              <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
                <el-table-column prop="id" label="订单ID" align="center" width="80%">
                </el-table-column>
                <el-table-column prop="product_name" label="产品名称" align="center">
                </el-table-column>
                <el-table-column prop="distributor" label="分销商" align="center">
                </el-table-column>
                <el-table-column label="客人信息" align="center" width="180px;">
                  <template slot-scope="scope">
                    <span>取票人:{{scope.row.contact_name}}</span><br>
                    <span>手机:{{scope.row.contact_phone}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量" align="center">
                </el-table-column>
                <el-table-column prop="cost" label="成本" align="center">
                </el-table-column>
                <el-table-column prop="income" label="收入" align="center">
                </el-table-column>
                <el-table-column prop="proce_amount" label="未处理金额" align="center">
                </el-table-column>
                <el-table-column prop="collectionCode" label="收款编码" align="center">
                  <template slot-scope="scope">
                    <p v-for="item in scope.row.receipt_code" @click="turnTab2" style="cursor: pointer">{{item.rec_sn}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="invoice" label="发票" align="center">
                  <template slot-scope="scope">
                    <p v-for="item in scope.row.invoice" @click="turnTab3" style="cursor: pointer">{{item.rec_sn}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center" width="100" v-if="statusBtn == 1 || statusBtn == 3">
                  <template slot-scope="scope">
                    <el-button @click="unbinding(scope.row)" type="danger" size="small" class="table_details">解绑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="收款编码" name="code">
            <div class="table_trip" style="width: 80%;">
              <el-table ref="singleTable" :data="tableData2" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
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
                    <el-button @click="getOrder(scope.row)" type="primary" size="small" class="table_details">查看订单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="发票" name="invoice">
            <div class="table_trip" style="width: 80%;">
              <el-table ref="singleTable" :data="tableData3" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
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
                    <p v-for="item in scope.row.file">
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
                    <el-button @click="getOrder(scope.row)" type="primary" size="small" class="table_details">查看订单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ToUpdate :dialogFormVisible="dialogFormVisible2" @close="close2" :info="info"></ToUpdate>
      <GetOrder :dialogFormVisible="dialogFormVisible" @close="close2" :info="info"></GetOrder>
    </div>
  </div>
</template>
<script type="text/javascript">
import GetOrder from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/getOrder'
import ToUpdate from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/toUpdate'
import {formatDate} from '@/js/libs/publicMethod.js'
export default {
  name: "scenicTicketingDetails",
  components: {
    GetOrder,
    ToUpdate
  },
  data() {
    return {
//      传参
      param: '',
      paramTour: '',
//      基本信息
      baseInfo: {
        basic_info: {},
        basic_order_info: {}
      },
//      报账状态
      statusBtn: '',
      approved: '',

      activeName: 'order',
      currentRow: true,
      pid: '',
      info: '',
      transmit: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      status: {
        1: '审批中',
        2: '驳回',
        3: '通过',
      },
      tableData: [],
      tableData2: [],
      tableData3: [],
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {

  },
  methods: {
    handleClick() {
      this.transmit = !this.transmit;
      this.pid = '';
    },
//    定位到收款编码
    turnTab2(){
      this.activeName = "code";
    },
//    定位到发票
    turnTab3(){
      this.activeName = "invoice";
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
      this.$router.push({
        path: "/scenicTicketingPledging",
        name: "产品管理  /团期计划  /认款",
        params: this.$route.params
      });
    },
    closeAdd() {
      this.$router.push({ path: "/regimentPlan/scenicTicketingList" });
    },
    toUpdate() {
      this.dialogFormVisible2 = true;

    },
    delInfo() {
      const that = this;
      this.$confirm('是否删除此团期计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/del", {
          "id": this.param,
        }, ).then(function(response) {
          if (response.data.code == '200') {
            that.$message({
              type: 'info',
              message: '已删除'
            });
            that.closeAdd();
          } else {
            that.$message.success("删除失败~");
          }
        }).catch(function(error) {
          console.log(error);
          that.$message.success("删除失败~");
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    unbinding(row) {
      console.log(row);
      const that = this;
      this.$confirm('是否解绑此订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/unbind", {
          "order_sn": row['order_sn']
        }, ).then(function(response) {
          console.log(response);
          if (response.data.code == '200') {
            console.log(response);
            that.$message({
              type: 'success',
              message: '解绑成功!'
            });
            that.getBaseInfo();
            that.getTableData();
            that.loadDatabyNum(1);
            that.loadDatabyNum(2);
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消解绑'
        });
      });
    },
    getOrder(row) {
      this.info = row;
      this.dialogFormVisible = true;
    },
    close2() {
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = false;
    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['tour']
    },
    getBaseInfo(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/viewgroup", {
        "id": this.param,
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          response.data.data.basic_info.created_at = formatDate(new Date(response.data.data.basic_info.created_at*1000));
          response.data.data.basic_info.begin_at = formatDate(new Date(response.data.data.basic_info.begin_at *1000));
          response.data.data.basic_info.end_at = formatDate(new Date(response.data.data.basic_info.end_at*1000));
          that.baseInfo = response.data.data;
          that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
            "id": that.baseInfo.basic_info.create_uid
          },{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
          }).then(function(response) {

            if (response.data.isSuccess) {
              that.baseInfo.basic_info.create_uid = response.data.object.name
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
    },
    getTableData(){
      const that = this;
//      console.log(this.param);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recognitionlist", {
        "tour_no": this.paramTour,
        "order_sn": '',
        "product_name": '',
        "unprocessedOrders": '',
        "source_id": '',
        "contact_name": '',
        "limit": 0
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          that.tableData = response.data.data.list;
          that.total = response.data.data.total - 0;
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {ao
        console.log(error);
      });
    },
    loadDatabyNum(num){
      const that = this;
//      console.log(this.param);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/receiptlist", {
        "tour_no": this.paramTour,
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
              for(var i = 0; i < item.file.length; i++){
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
    }
  },
  created() {
//    console.log(this.$route.params);
    this.param = this.$route.params.id;
    this.statusBtn = this.$route.params.bill_status;
    this.paramTour = this.$route.params.tour_no;
    this.approved = this.$route.params.approved;

    this.getBaseInfo();
    this.getTableData();
    this.loadDatabyNum(1);
    this.loadDatabyNum(2);
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
  margin: 10px 0px 40px 25px;

}
.status .el-button--mini{
  position: relative;
  top: -4px;
  left: 6px;
}
</style>
