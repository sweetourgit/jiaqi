<template>
  <div class="vivo" style="position:relative">
    <div class="">
      <el-row style="margin-bottom: 0px;">
        <el-col :span="8">
          <div class="status"></div>
        </el-col>
        <el-col :span="8">
          <div class="button"></div>
        </el-col>
        <el-col :span="8">
          <div class="button">
            <el-button class="el-button" @click="closeAdd">取 消</el-button>
            <!--<el-button class="el-button" type="primary" @click="save">保 存</el-button>-->
            <el-button class="el-button" type="primary" @click="submit">提交认款</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="footer">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="订单" name="order">
            <div class="demo-input-suffix">
              <el-row class="topRow">
                <el-col :span="1">
                  <span class="search-title">订单ID:</span>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="oid" class="input"></el-input>
                </el-col>
                <el-col :span="2">
                  <span class="search-title">产品名称:</span>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="title" class="input"></el-input>
                </el-col>
                <el-col :span="3">
                  <span class="search-title">有未处理金额订单:</span>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="isHandleOrder" placeholder="请选择">
                    <el-option key="" label="全部" value=""></el-option>
                    <el-option key="1" label="是" value="2"></el-option>
                    <el-option key="0" label="否" value="1"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="1">
                  <span class="search-title">分销商:</span>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="platform" class="input"></el-input>
                </el-col>
                <el-col :span="2">
                  <span class="search-title">取票人:</span>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="user" class="input"></el-input>
                </el-col>
                <el-col :span="8">
                  <div class="button_select">
                    <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
                    <el-button type="primary" @click="resetHand()" size="medium">重置</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="main">
              <el-button type="primary" @click="receiptCode" plain :disabled="forbidden">收款编码</el-button>
              <el-button type="primary" @click="invoice" plain :disabled="forbidden">发票</el-button>
              <el-button type="primary" @click="unbinding" plain :disabled="forbidden">解绑</el-button>
            </div>
            <div class="table_trip" style="width: 95%;">
              <el-table ref="multipleTable" :data="tableData" border style="width: 100%" :header-cell-style="getRowClass" @selection-change="selectionChange" @row-click="handleRowClick">
                <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInit"></el-table-column>
                <el-table-column prop="order_sn" label="订单ID" align="center">
                </el-table-column>
                <el-table-column prop="product_name" label="产品名称" align="center">
                </el-table-column>
                <el-table-column prop="distributor" label="分销商" align="center">
                </el-table-column>
                <el-table-column prop="cost" label="成本" align="center">
                </el-table-column>
                <el-table-column prop="income" label="收入" align="center">
                </el-table-column>
                <el-table-column prop="proce_amount" label="未处理金额" align="center">
                </el-table-column>
                <el-table-column prop="receipt_code" label="收款编码" align="center">
                  <template slot-scope="scope">
                    <p v-for="item in scope.row.receipt_code" @click="turnTab2" style="cursor: pointer">{{item.rec_sn}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="invoice" label="发票" align="center">
                  <template slot-scope="scope">
                    <p v-for="item in scope.row.invoice" @click="turnTab3" style="cursor: pointer">{{item.rec_sn}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="customer" label="客人信息" align="center">
                  <template slot-scope="scope">
                    <span>取票人:{{scope.row.contact_name}}</span><br>
                    <span>手机:{{scope.row.contact_phone}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="收款编码" name="code">
            <div class="table_trip" style="width: 95%;">
              <el-table ref="singleTable" :data="tableData2" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
                <el-table-column prop="rec_sn" label="收款编码" align="center">
                </el-table-column>
                <el-table-column prop="approval_status" label="审批状态" align="center">
                  <template slot-scope="scope">
                    {{status[scope.row.approval_status]}}
                  </template>
                </el-table-column>
                <el-table-column prop="approval_comments" label="审批意见" align="center">
                </el-table-column>
                <el-table-column prop="approval_money" label="审批金额" align="center">
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center" width="200">
                  <template slot-scope="scope">
                    <el-button @click="getOrderCode(scope.row)" type="primary" size="small" class="table_details">详情</el-button>
                    <el-button @click="delByCode(scope.row)" type="danger" size="small" class="table_details" v-if="scope.row.approval_status == 2">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="发票" name="invoice">
            <div class="table_trip" style="width: 95%;">
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
                <el-table-column prop="approval_status" label="审批状态" align="center">
                  <template slot-scope="scope">
                    {{status[scope.row.approval_status]}}
                  </template>
                </el-table-column>
                <el-table-column prop="approval_comments" label="审批意见" align="center">
                </el-table-column>
                <el-table-column prop="approval_money" label="审批金额" align="center">
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center" width="200">
                  <template slot-scope="scope">
                    <el-button @click="getOrderInvoice(scope.row)" type="primary" size="small" class="table_details">详情</el-button>
                    <el-button @click="delByCode(scope.row)" type="danger" size="small" class="table_details" v-if="scope.row.approval_status == 2">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog title="提示" :visible.sync="saveDialogVisible" width="30%">
        <span><i class="el-icon-info"></i>是否保存后退出</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDialogVisible = false">直接退出</el-button>
          <el-button type="primary" @click="saveExit">保存退出</el-button>
        </span>
      </el-dialog>
      <GetOrderCode :dialogFormVisible="dialogFormVisible" @close="close2" :info="detailInfo"></GetOrderCode>
      <GetOrderInvoice :dialogFormVisible="dialogFormVisible4" @close="close2" :info="detailInfo"></GetOrderInvoice>
      <ReceiptCode :dialogFormVisible="dialogFormVisible2" @close="close2" :info="info"></ReceiptCode>
      <Invoice :dialogFormVisible="dialogFormVisible3" @close="close2" :info="info"></Invoice>
    </div>
  </div>
</template>
<script type="text/javascript">
import GetOrderCode from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/getOrderCode'
import GetOrderInvoice from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/getOrderInvoice'
import ReceiptCode from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/receiptCode'
import Invoice from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/invoice'
export default {
  name: "scenicTicketingPledging",
  components: {
    GetOrderCode,
    GetOrderInvoice,
    ReceiptCode,
    Invoice,
  },
  data() {
    return {
      activeName: 'order',
      //搜索表单
      oid: '',
      title: '',
      isHandleOrder: '',
      platform: '',
      user: '',
      //搜索表单结束
      currentRow: true,
      pid: '',
      info: '',
      detailInfo: '',
      multipleSelection: [], //选中的list
      forbidden: true,
      transmit: false,
      isSelectAll: false,
      saveDialogVisible: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      status: {
        1: '审批中',
        2: '驳回',
        3: '通过',
      },
      tableData: [],
      tableData2: [],
      tableData3: [],
      param: ''
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
//    关闭页面
    closeAdd() {
      this.$router.push({ path: "/regimentPlan/scenicTicketingList" });
    },
//    订单解绑
    unbinding() {
      console.log(this.multipleSelection);
      const that = this;
      let orderStr = '';
      this.multipleSelection.forEach(function (item, index, arr) {
        orderStr += item.order_sn + ','
      });
      orderStr = orderStr.slice(0,orderStr.length-1);
      this.$confirm('是否解绑该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/unbind", {
          "order_sn": orderStr
        }, ).then(function(response) {
          console.log(response);
          if (response.data.code == '200') {
            console.log(response);
            that.$message({
              type: 'success',
              message: '解绑成功!'
            });
            that.loadDataOne();
            that.loadDatabyNum(1);
            that.loadDatabyNum(2);
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解绑'
        });
      });
    },
//    收款编码详情
    getOrderCode(row) {
      this.detailInfo = row;
      this.dialogFormVisible = true;
    },
//    发票详情
    getOrderInvoice(row) {
      this.detailInfo = row;
      this.dialogFormVisible4 = true
    },
//    删除发票/收款编码
    delByCode(row) {
      console.log(row);
      const that = this;
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recdel", {
          "id": row.id
        }, ).then(function(response) {
          console.log(response);
          if (response.data.code == '200') {
            if(response.data.data == ''){
              that.$message({
                type: 'success',
                message: "删除成功"
              });
              that.loadDataOne();
              that.loadDatabyNum(1);
              that.loadDatabyNum(2);
            }else{
              that.$message({
                type: 'success',
                message: response.data.data
              });
            }

          } else {
            that.$message.success("删除失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
//    关闭弹出层
    close2() {
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = false;
      this.dialogFormVisible3 = false;
      this.dialogFormVisible4 = false;
      this.loadDataOne();
      this.loadDatabyNum(1);
      this.loadDatabyNum(2);
    },
    //获取id
    clickBanle(row, event, column) {
      if (row.proce_amount > 0) {
        this.$refs.multipleTable.clearSelection(); //清空用户的选择,注释掉可多选
        this.$refs.multipleTable.toggleRowSelection(row);
        this.pid = this.multipleSelection[0].id;
      }
    },
//    判断可选不可选
    selectInit(row, index){
      if(parseFloat(row.proce_amount) > 0){
        return true  //可勾选
      }else{
        return false  //不可勾选
      }
    },
//    选择项改变触发
    selectionChange(val) {
      console.log(val);
      if(val.length > 0){
        this.forbidden = false;
      }else{
        this.forbidden = true;
      }
      this.multipleSelection = val;
    },
//    点击一行触发
    handleRowClick(row, column, event){
      if(row.proce_amount > 0){
        this.$refs.multipleTable.toggleRowSelection(row);
      }
    },
    //发票详情
    invoice() {
//      console.log(this.multipleSelection);
      this.info = this.multipleSelection;
      this.dialogFormVisible3 = true
    },
    //收款编码详情
    receiptCode() {
//      console.log(this.multipleSelection);
      this.info = this.multipleSelection;
      this.dialogFormVisible2 = true;
    },
//    保存（按钮注释掉了）
    save(){
      this.saveDialogVisible = true;
      this.closeAdd();
    },
//    保存退出（按钮注释掉了）
    saveExit(done){
      this.$message({
        type: 'success',
        message: '保存成功!'
      });
      this.saveDialogVisible = false;
      this.closeAdd();
    },
//    提交认款
    submit(){
      const that = this;
//      console.log(this.param);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/submitaudit", {
        "tour_no": this.param
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          if(response.data.data.tour_no == that.param){
            that.$message({
              type: 'success',
              message: '认款申请成功'
            });
          }else{
            that.$message({
              type: 'success',
              message: response.data.data
            });
          }
        } else {
          that.$message.success("认款提交失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
//    搜索
    searchHand() {
      this.loadDataOne();
    },
//    重置
    resetHand() {
      this.oid = "";
      this.title = "";
      this.isHandleOrder = "";
      this.platform = "";
      this.user = "";
      this.loadDataOne();
    },
//    数据加载 订单
    loadDataOne(){
      const that = this;
//      console.log(this.param);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recognitionlist", {
        "tour_no": this.param,
        "order_sn": this.oid,
        "product_name": this.title,
        "unprocessedOrders": this.isHandleOrder,
        "source_id": this.platform,
        "contact_name": this.user,
        "limit": 0
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log("dataOne",response);
          that.tableData = response.data.data.list;
          that.total = response.data.data.total - 0;
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
//    数据加载 发票/收款编码
    loadDatabyNum(num){
      const that = this;
//      console.log(this.param);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/receiptlist", {
        "tour_no": this.param,
        "apply_type": num,
        "limit": 0
      }, ).then(function(response) {
        if (response.data.code == '200') {
//          console.log(response);
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
    if(this.$route.params.tour_no){
      this.param = this.$route.params.tour_no;
      this.loadDataOne();
      this.loadDatabyNum(1);
      this.loadDatabyNum(2);
    }else{
      this.closeAdd();
    }

  },
  mounted() {}
}

</script>
<style lang="scss" scoped>
.demo-input-suffix {
  width: auto;
  background-color: #F7F7F7;
  padding: 20px;
  margin-bottom: 30px;
  margin-right: 50px;
  .topRow{
    margin-bottom: 15px!important;
  }
  .search-title {
    height: 35px;
    line-height: 35px;
    float: right;
    padding-right: 10px;
    font-size: 14px;
  }

  .button_select {
    float: right;
    margin-right: 20%;
  }

  .input {
    width: 100%;
  }

  .el-row {
    margin: 5px;
  }
}

.main {
  margin-bottom: 15px;
}

.button {
  float: right;
  margin-right: -190%;
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

</style>
