<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="回冲无收入借款单" :visible="dialogFormVisible" width=80% @close="closeAdd">
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="关联" name="first">
            <el-button class="topButton" type="primary" @click="connect" :disabled="tableDataNoConnectChoose.length == 0">关联</el-button>
            <el-table ref="multipleTable" :data="tableDataNoConnect" border style="width: 100%" :header-cell-style="getRowClass" @selection-change="selectionChange">
              <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInit">
              </el-table-column>
              <el-table-column prop="order_sn" label="订单ID" align="center" width="80%">
              </el-table-column>
              <el-table-column prop="distributor" label="分销商" align="center">
              </el-table-column>
              <el-table-column prop="distributor_remark" label="分销商备注" align="center">
              </el-table-column>
              <el-table-column prop="product_name" label="产品名称" align="center">
              </el-table-column>
              <el-table-column prop="order_type" label="类别" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.order_type == 1">门票</p>
                  <p v-if="scope.row.order_type == 2">线路</p>
                  <p v-if="scope.row.order_type == 3">酒店</p>
                  <p v-if="scope.row.order_type == 4">套票</p>
                </template>
              </el-table-column>
              <el-table-column prop="sale_at" label="下单时间" align="center">
              </el-table-column>
              <el-table-column prop="income" label="费用" align="center">
                <template slot-scope="scope">
                  <span>收入：{{scope.row.income}}</span><br>
                  <span>单票成本：{{scope.row.single_cost}}</span><br>
                  <span>总成本：{{scope.row.cost}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" align="center">
              </el-table-column>
              <el-table-column prop="information" label="客人信息" align="center">
                <template slot-scope="scope">
                  <span>取票人：{{scope.row.contact_name}}</span><br>
                  <span>手机：{{scope.row.contact_phone}}</span>
                  <!-- <span>备注：{{scope.row.invoiceinfo.pay_taxes_no}}</span> -->
                </template>
              </el-table-column>
              <el-table-column prop="check_at" label="验证时间" align="center">
              </el-table-column>
              <el-table-column prop="pay_type" label="卖出支付方式" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.pay_type == 1">产品自销</p>
                  <p v-if="scope.row.pay_type == 2">授信支付</p>
                  <p v-if="scope.row.pay_type == 3">微信</p>
                  <p v-if="scope.row.pay_type == 4">易宝云企付</p>
                  <p v-if="scope.row.pay_type == 5">余额支付</p>
                  <p v-if="scope.row.pay_type == 6">支付宝</p>
                  <p v-if="scope.row.pay_type == 7">自采</p>
                </template>
              </el-table-column>
              <el-table-column prop="buy_type" label="买入支付方式" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.buy_type == 1">余额支付</p>
                  <p v-if="scope.row.buy_type == 2">授信支付</p>
                  <p v-if="scope.row.buy_type == 3">成本</p>
                </template>
              </el-table-column>
              <el-table-column prop="supplier" label="上级供应商" align="center">
              </el-table-column>
              <el-table-column prop="import_at" label="导入时间" align="center">
              </el-table-column>
              <el-table-column prop="number" label="关联产品" align="center">
                <template slot-scope="scope">
                  <span>产品名称：{{scope.row.product_name}}</span><br>
                  <span>团期计划：{{scope.row.tour_no}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="information" label="报账状态" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.bill_status == 1">未认款</p>
                  <p v-if="scope.row.bill_status == 2">认款申请</p>
                  <p v-if="scope.row.bill_status == 3">认款待修改</p>
                  <p v-if="scope.row.bill_status == 4">认款通过</p>
                  <p v-if="scope.row.bill_status == 5">报账中</p>
                  <p v-if="scope.row.bill_status == 6">报账驳回</p>
                  <p v-if="scope.row.bill_status == 7">已报账</p>
                  <p v-if="scope.row.bill_status == 8">已报账</p>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="已关联" name="second">
            <el-button class="topButton" type="primary" @click="toUndo" :disabled="tableDataConnectChoose.length == 0">取消关联</el-button>
            <el-table ref="singleTable" :data="tableDataConnect" border style="width: 100%" :header-cell-style="getRowClass" @selection-change="selectionChange1">
              <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInit1">
              </el-table-column>
              <el-table-column prop="order_sn" label="订单ID" align="center" width="80%">
              </el-table-column>
              <el-table-column prop="distributor" label="分销商" align="center">
              </el-table-column>
              <el-table-column prop="distributor_remark" label="分销商备注" align="center">
              </el-table-column>
              <el-table-column prop="product_name" label="产品名称" align="center">
              </el-table-column>
              <el-table-column prop="order_type" label="类别" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.order_type == 1">门票</p>
                  <p v-if="scope.row.order_type == 2">线路</p>
                  <p v-if="scope.row.order_type == 3">酒店</p>
                  <p v-if="scope.row.order_type == 4">套票</p>
                </template>
              </el-table-column>
              <el-table-column prop="sale_at" label="下单时间" align="center">
              </el-table-column>
              <el-table-column prop="income" label="费用" align="center">
                <template slot-scope="scope">
                  <span>收入：{{scope.row.income}}</span><br>
                  <span>单票成本：{{scope.row.single_cost}}</span><br>
                  <span>总成本：{{scope.row.cost}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" align="center">
              </el-table-column>
              <el-table-column prop="information" label="客人信息" align="center">
                <template slot-scope="scope">
                  <span>取票人：{{scope.row.contact_name}}</span><br>
                  <span>手机：{{scope.row.contact_phone}}</span>
                  <!-- <span>备注：{{scope.row.invoiceinfo.pay_taxes_no}}</span> -->
                </template>
              </el-table-column>
              <el-table-column prop="check_at" label="验证时间" align="center">
              </el-table-column>
              <el-table-column prop="pay_type" label="卖出支付方式" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.pay_type == 1">产品自销</p>
                  <p v-if="scope.row.pay_type == 2">授信支付</p>
                  <p v-if="scope.row.pay_type == 3">微信</p>
                  <p v-if="scope.row.pay_type == 4">易宝云企付</p>
                  <p v-if="scope.row.pay_type == 5">余额支付</p>
                  <p v-if="scope.row.pay_type == 6">支付宝</p>
                  <p v-if="scope.row.pay_type == 7">自采</p>
                </template>
              </el-table-column>
              <el-table-column prop="buy_type" label="买入支付方式" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.buy_type == 1">余额支付</p>
                  <p v-if="scope.row.buy_type == 2">授信支付</p>
                  <p v-if="scope.row.buy_type == 3">成本</p>
                </template>
              </el-table-column>
              <el-table-column prop="supplier" label="上级供应商" align="center">
              </el-table-column>
              <el-table-column prop="import_at" label="导入时间" align="center">
              </el-table-column>
              <el-table-column prop="number" label="关联产品" align="center">
                <template slot-scope="scope">
                  <span>产品名称：{{scope.row.product_name}}</span><br>
                  <span>团期计划：{{scope.row.tour_no}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="information" label="报账状态" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.bill_status == 1">未认款</p>
                  <p v-if="scope.row.bill_status == 2">认款申请</p>
                  <p v-if="scope.row.bill_status == 3">认款待修改</p>
                  <p v-if="scope.row.bill_status == 4">认款通过</p>
                  <p v-if="scope.row.bill_status == 5">报账中</p>
                  <p v-if="scope.row.bill_status == 6">报账驳回</p>
                  <p v-if="scope.row.bill_status == 7">已报账</p>
                  <p v-if="scope.row.bill_status == 8">已报账</p>
                </template>
              </el-table-column>
              <el-table-column prop="number" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="toPreview(scope.row)" type="text">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="footer">
        <el-button @click="saveFun" type="primary" size="small" class="table_details">保存</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
      <el-dialog :title="topTotle" :visible="dialogFormVisible1" width=60% @close="closeJK" append-to-body>
        <p v-if="topTotle == '关联'">订单总成本：{{costTotal}}</p>
        <div class="table_trip" style="width: 100%;">
          <el-table ref="singleTable" :data="tableDataJK" border style="width: 100%;margin-bottom: 28px;" :highlight-current-row="true" :header-cell-style="getRowClass" @selection-change="selectionChangeJK">
            <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInitJK" v-if="topTotle == '关联'">
            </el-table-column>
            <el-table-column prop="id" label="借款单号" align="center">
            </el-table-column>
            <el-table-column prop="approval_status" label="状态" align="center">
              <template slot-scope="scope">
                <p v-if="scope.row.approval_status == 1">审批中</p>
                <p v-if="scope.row.approval_status == 2">驳回</p>
                <p v-if="scope.row.approval_status == 3">通过</p>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="申请时间" align="center">
            </el-table-column>
            <el-table-column prop="recoil_supplier_code" label="供应商名称" align="center">
              <template slot-scope="scope">
                <p v-if="supplier">{{supplier}}</p>
                <p v-else>{{scope.row.recoil_supplier_code}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="loan_type" label="类型" align="center">
              <template slot-scope="scope">
                <p v-if="scope.row.loan_type == 1">无收入借款</p>
                <p v-if="scope.row.loan_type == 2">预付款借款</p>
                <p v-if="scope.row.loan_type == 3">余额支付借款</p>
              </template>
            </el-table-column>
            <el-table-column prop="loan_money" label="借款金额" align="center">
            </el-table-column>
            <el-table-column prop="reimbursed_money" label="已报销金额" align="center">
            </el-table-column>
            <el-table-column prop="account_type" label="对公/对私" align="center">
              <template slot-scope="scope">
                <p v-if="scope.row.account_type == 1">对公</p>
                <p v-if="scope.row.account_type == 2">对私</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer" style="text-align: right;">
          <el-button class="el-button" type="warning" size="small" @click="closeJK">取 消</el-button>
          <el-button class="el-button" type="primary" size="small" @click="connectFun" :disabled="tableDataJKChoose.length == 0" v-if="topTotle == '关联'">确 认</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import {formatDate} from '@/js/libs/publicMethod.js'
export default {
  name: "recoilLoan",
  components: {},
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
      activeName: 'first',
      tableDataConnect: [],
      tableDataConnectChoose: [],
      tableDataNoConnect: [],
      tableDataNoConnectChoose: [],
      topTotle: '',
      dialogFormVisible1: false,
      tableDataJK: [],
      tableDataJKChoose: [],
      costTotal: '',
      supplier: ''
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    info: {
      handler: function () {
        // alert(this.info);
        if(this.info){
          this.loadData();
          this.loadData1();
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
    selectionChange(val){
      const that = this;
      this.tableDataNoConnectChoose = val;
      let flagItem = true;
      this.tableDataNoConnectChoose.forEach(function(item, index, arr){
        that.tableDataNoConnectChoose.forEach(function(item1, index1, arr1){
          if(item.supplier_id != item1.supplier_id){
            flagItem = false;
            return;
          }
        })
      })
      if(flagItem){
        this.tableDataNoConnectChoose = val;
      }else{
        this.$message.warning("不同上级供应商不能同时选择！");
        this.$refs.multipleTable.clearSelection();
        this.tableDataNoConnectChoose = [];
      }
    },
    selectInit(row, index){
      if(row.supplier_id){
        let flagItem = true;
        this.tableDataNoConnectChoose.forEach(function(item, index, arr){
          if(row.supplier_id != item.supplier_id){
            flagItem = false;
          }
        })
        return flagItem;
      }
      return true;
    },
    connect(){
      this.dialogFormVisible1 = true;
      this.topTotle = "关联";
      let num = 0;
      this.tableDataNoConnectChoose.forEach(function(item, index, arr){
        num += parseFloat(item.cost);
      })
      this.costTotal = num.toFixed(2);
      this.loadDataJK();
      this.loadSupplier(this.tableDataNoConnectChoose[0].supplier_id);
    },
    connectFun(){
      const that = this;
      let totalJK = 0, loanArr = [];
      if(this.tableDataJKChoose.length > 0){
        this.tableDataJKChoose.forEach(function(item, index, arr){
          totalJK += parseFloat(item.loan_money - item.reimbursed_money);
          loanArr.push({
            "loan_id": item.id
          })
        })
        if(totalJK < this.costTotal){
          this.$message.warning("借款金额不够回冲！");
          return;
        }
      }

      let orderArr = [];
      this.tableDataNoConnectChoose.forEach(function(item, index, arr){
        orderArr.push({
          "order_id": item.id
        })
      })
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/recoilnoincomeloan", {
        "tour_no": this.info,
        "supplier_id": this.tableDataNoConnectChoose[0].supplier_id,
        "order_cost": this.costTotal,
        "order": orderArr,
        "loan": loanArr
      }, ).then(function(response) {
        // console.log(response);
        if (response.data.code == '200') {
          that.$message.success("回冲成功！");
          that.closeJK();
          that.loadData();
          that.loadData1();
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
          
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    selectionChange1(val){
      this.tableDataConnectChoose = val;
    },
    selectInit1(){
      return true;
    },
    toPreview(row){
      this.dialogFormVisible1 = true;
      this.topTotle = "查看";
      this.loadDataJK1(row);
    },
    toUndo(){
      let orderArr = [];
      if(this.tableDataConnectChoose.length != 0){
        this.tableDataConnectChoose.forEach(function(item, index, arr){
          orderArr.push({
            "order_id": item.id
          })
        })
      }
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/untyieloanorder", {
        "order": orderArr
      }, ).then(function(response) {
        // console.log(response);
        if (response.data.code == '200') {
          that.loadData();
          that.loadData1();
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    closeAdd() {
      this.$emit('close', false);
    },
    closeJK(){
      this.dialogFormVisible1 = false;
    },
    selectInitJK(){
      return true;
    },
    selectionChangeJK(val){
      this.tableDataJKChoose = val;
    },
    saveFun(){
      this.$message.success("保存成功！");
      this.closeAdd();
    },
    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/recoilgetorder", {
        "tour_no": this.info
      }, ).then(function(response) {
        // console.log(response);
        if (response.data.code == '200') {
          that.tableDataNoConnect = response.data.data.list;
          that.tableDataNoConnect.forEach(function(item, index, arr){
            item.sale_at = formatDate(new Date(item.sale_at*1000))
            item.check_at = formatDate(new Date(item.check_at*1000))
            item.import_at = formatDate(new Date(item.import_at*1000))
          })
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },

    loadData1(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/incomegetorder", {
        "tour_no": this.info
      }, ).then(function(response) {
        // console.log(response);
        if (response.data.code == '200') {
          that.tableDataConnect = response.data.data.list;
          that.tableDataConnect.forEach(function(item, index, arr){
            item.sale_at = formatDate(new Date(item.sale_at*1000))
            item.check_at = formatDate(new Date(item.check_at*1000))
            item.import_at = formatDate(new Date(item.import_at*1000))
          })
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },

    loadDataJK(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/noincomeloan", {
        "supplier_id": this.tableDataNoConnectChoose[0].supplier_id
      }, ).then(function(response) {
        // console.log(response);
        if (response.data.code == '200') {
          that.tableDataJK = response.data.data.list;
          that.tableDataJK.forEach(function(item, index, arr){
            item.created_at = formatDate(new Date(item.created_at*1000))
          })
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },

    loadDataJK1(row){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/incomegetloan", {
        "order": [
          {
            "order_id": row.id
          }
        ]
      }, ).then(function(response) {
        // console.log(response);
        if (response.data.code == '200') {
          that.tableDataJK = response.data.data.list;
          that.tableDataJK.forEach(function(item, index, arr){
            item.created_at = formatDate(new Date(item.created_at*1000))
          })
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    loadSupplier(code){
      // 获取供应商名称
      const that = this;
      that.$http.post(that.GLOBAL.serverSrcZb + "/universal/supplier/api/supplierget", {
        "id": code
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(function(response) {
        // console.log(response);
        if (response.data.isSuccess) {
          that.supplier = response.data.object.name
        } else {
          if(response.data.result.message){
            that.$message.warning(response.data.result.message);
          }else{
            that.$message.warning("获取供应商名称失败~");
          }
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
.topButton{
  margin: 8px;
}
.el-tabs{
  margin-bottom: 20px;
}
.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: -10px;
  .el-button {
    bottom: 1%;
    right: 1%;
    float: right;
    margin: 0 10px;
  }
}


</style>
