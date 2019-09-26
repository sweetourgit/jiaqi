<template>
  <div class="vivo" style="position:relative">
    <!--认收款信息-->
    <div class="main" style="width: 88%;text-align: right;">
      <el-button type="primary" @click="cancalBtn" plain>取消</el-button>
      <el-button type="primary"  @click="submitBtn">确认</el-button>
    </div>
    <div class="tableDv">
      <div class="table_trip" style="width: 88%;">
        <el-table ref="multipleTable" :data="tableData" border style="width: 100%;" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center">
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="type_name" label="类别" align="center" width="60">
          </el-table-column>
          <el-table-column prop="sale_at" label=" 下单时间" align="center">
          </el-table-column>
          <el-table-column prop="" label="费用" align="center" width="160">
            <template slot-scope="scope">
              <span>收入:{{scope.row.income}}</span><br>
              <span>单票成本:{{scope.row.single_cost}}</span><br>
              <span>总成本:{{scope.row.cost}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center" width="50">
          </el-table-column>
          <el-table-column prop="" label="客人信息" align="center" width="145">
            <template slot-scope="scope">
              <span>取票人:{{scope.row.contact_name}}</span><br>
              <span>手机:{{scope.row.contact_phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="check_at" label="验证时间" align="center">
          </el-table-column>
          <el-table-column prop="pay_type" label="卖出支付方式" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.pay_type == 1">产品自销</p>
              <p v-if="scope.row.pay_type == 2">授信支付</p>
              <p v-if="scope.row.pay_type == 3">微信支付</p>
              <p v-if="scope.row.pay_type == 4">易宝云企付</p>
              <p v-if="scope.row.pay_type == 5">余额支付</p>
              <p v-if="scope.row.pay_type == 6">支付宝</p>
              <p v-if="scope.row.pay_type == 7">自采</p>
            </template>
          </el-table-column>
          <el-table-column prop="import_at" label="导入时间" align="center">
          </el-table-column>
          <el-table-column prop="bill_status" label="匹配/未匹配" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.is_match == 1">未匹配</p>
              <p v-if="scope.row.is_match == 2">已匹配</p>
            </template>
          </el-table-column>
          <el-table-column prop="option" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="showBtn(scope.row)" v-if="scope.row.is_match == 2">查看</el-button>
              <el-button type="text" @click="undoBtn(scope.row)" v-if="scope.row.is_match == 2">撤销</el-button>
              <el-button type="text" @click="recognitionBtn(scope.row)" v-if="scope.row.is_match == 1">认收款</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <recognitionSee :dialogFormVisible4="dialogFormVisible4" @close="close" :orderID="orderID"></recognitionSee>
    <recognitionDo :dialogFormVisible2="dialogFormVisible2" @close="close" :info="info"></recognitionDo>
  </div>
</template>
<script type="text/javascript">
  import recognitionSee from '@/page/orderManagement/externalOrderList/recognitionMsg/recognitionSee'// 查看匹配信息
  import recognitionDo from '@/page/orderManagement/externalOrderList/recognitionMsg/recognitionDo'// 认收款
  import {formatDate} from '@/js/libs/publicMethod.js' //时间转化

  export default {
    name: "externalOrderList",
    components: {
      recognitionSee,
      recognitionDo
    },
    data() {
      return {
        dialogFormVisible4: false,// 查看匹配信息显示隐藏
        dialogFormVisible2: false,// 认收款操作显示隐藏
        info: '',// 认收款操作数据传递
        orderID: '',// 查看匹配信息数据传递

        tableData: [],// 认收款table
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {},
    methods: {
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
//      取消按钮事件
      cancalBtn(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/canclerec", {
          "order_sn": this.$route.query.ids
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log('取消认款',response);
            that.$message({
              type: 'success',
              message: '取消成功!'
            });
            that.$router.push({ path: "/externalOrderList/noRecognition" });
          } else {
            if(response.data.message){
              that.$message.success(response.data.message);
            }else{
              that.$message.success("失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
        });

      },
//      确认按钮事件
      submitBtn(){
        //...
        const that = this;
        let orderStr = '';
        let isMatch = true;
        this.tableData.forEach(function (item, index, arr) {
          if(item.is_match == 2){
            orderStr += item.order_sn + ',';
          }else {
            isMatch = false;
          }
        });
        orderStr = orderStr.substr(0, orderStr.length - 1);
        if(isMatch){
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/confirmrec", {
            "order_sn": orderStr
          }, ).then(function(response) {
            if (response.data.code == '200') {
              console.log('提交认款批量',response);
              that.$message({
                type: 'success',
                message: '提交成功!'
              });
              that.$router.push({ path: "/externalOrderList/noRecognition" });
            } else {
              if(response.data.message){
                that.$message.success(response.data.message);
              }else{
                that.$message.success("失败~");
              }
            }
          }).catch(function(error) {
            console.log(error);
          });
        }else{
          that.$message.warning("存在未匹配订单~");
        }

      },
//      查看
      showBtn(row){
        this.orderID = row.order_sn;
        this.dialogFormVisible4 = true;
      },
//      关闭弹窗
      close(){
        this.dialogFormVisible4 = false;
        this.dialogFormVisible2 = false;
        this.orderID = '';
        this.info = '';
        this.loadData();
      },
//      撤销
      undoBtn(row){
        const that = this;
        this.$confirm('是否撤销该笔认款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/revokerec", {
            "order_sn": row.order_sn
          }, ).then(function(response) {
            if (response.data.code == '200') {
              console.log('撤销',response);
              that.$message({
                type: 'success',
                message: '撤销成功!'
              });
              that.loadData();
            } else {
              if(response.data.message){
                that.$message.warning(response.data.message);
              }else{
                that.$message.warning("失败~");
              }
            }
          }).catch(function(error) {
            console.log(error);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销'
          });
        });
      },
//      认收款
      recognitionBtn(row){
        this.info = row.order_sn;
        this.dialogFormVisible2 = true;
      },
//      认收款自动匹配
      initData(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/recmatch", {
          "order_sn": this.$route.query.ids
        }, ).then(function(response) {
          that.loadData();
        }).catch(function(error) {
          console.log(error);
        });
      },
//      加载table数据
      loadData(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/reclist", {
          "order_sn": this.$route.query.ids
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log(response);
            that.tableData = response.data.data;
            that.tableData.forEach(function (item, index, arr) {
              item.sale_at = formatDate(new Date(item.sale_at*1000));
              item.sale_at = item.sale_at.split(" ")[0];
              item.check_at = formatDate(new Date(item.check_at*1000));
              item.check_at = item.check_at.split(" ")[0];
              item.import_at = formatDate(new Date(item.import_at*1000));
              item.import_at = item.import_at.split(" ")[0];
            })
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
    },
    created(){
      if(this.$route.query.ids){
        this.initData();
      }else{
        this.$router.push({ path: "/externalOrderList/noRecognition" });
      }

    }
  }

</script>
<style lang="scss" scoped>
  .vivo {
    .demo-input-suffix {
      width: auto;
      background-color: #F7F7F7;
      padding: 20px;
      min-width: 1350px;

      .search-title {
        font-size: 14px;
        margin-left: 10px;
        margin-top: 10px;
        margin-right: 20px;
        display: inline-block;
        width: 100px;
        text-align: right;
      }

      .el-input {
        width: auto;
      }

      .el-input__inner {
        width: 10%;
      }

      .demo-input-suffix {
        width: 900px
      }

      .date-line {
        width: 10px;
        border-bottom: 1px solid #e6e6e6;
        display: inline-block;
        margin: 0 3px 3px 0
      }

      .button_select {
        /*width: 1300px;*/
        display: inline-block;
        float: right;
        margin-right: 265px;
        overflow: hidden;
        padding: 10px;
        box-sizing: border-box;
      }
      .button_select button{
        float: right;
        margin-left: 20px;
      }

    }

    .main {
      margin-top: 20px;
      margin-bottom: 20px;
      text-align: left;
      //margin-left: 50px;

      .select_button {
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e9eaea;
        text-align: left;
        padding-left: 50px;
      }
    }
    .tableDv{
      width: 100%;
      overflow: hidden;
      position: relative;
      margin-bottom: 40px;
    }
  }



  .el-tabs__nav>>>.el-tabs__item {
    font-size: 30px !important;
  }

  .el-autocomplete>>>.el-input--small .el-input__inner {
    height: 35px !important;
  }

</style>
