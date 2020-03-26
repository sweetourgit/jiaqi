/*
 * @Author: WZJ 
 * @Date: 2020-03-25 14:55:44 
 * @Last Modified by:   WZJ 
 * @Last Modified time: 2020-03-25 14:55:44 
 */
<template>
  <div class="distributor-content">
    <div class="buttonsDv">
      <el-button @click="closeBtn" type="primary">关闭</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content">
      <el-table-column label="操作" width="100" align="center" fixed>
        <template slot-scope="scope">
          <el-button @click="orderDetail(scope.row)" type="text" size="small" class="table_details">查看订单</el-button>
          <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.surplus_Amount == scope.row.transaction_amount">删除</el-button>
        </template>
      </el-table-column>
       <el-table-column prop="id" label="明细ID" align="center">
      </el-table-column>
      <el-table-column prop="settlementDate" label="清算日期" align="center">
      </el-table-column>
      <el-table-column prop="transactionDate" label="交易日期" align="center">
      </el-table-column>
      <el-table-column prop="transactionTime" label="交易时间" align="center">
      </el-table-column>
      <el-table-column prop="transactionAmount" label="交易金额" align="center">
      </el-table-column>
      <el-table-column prop="terminalNumber" label="终端号" align="center">
      </el-table-column>
      <el-table-column prop="settlementAmount" label="清算金额" align="center">
      </el-table-column>
      <el-table-column prop="purpose_fee" label="手续费" align="center">
      </el-table-column>
      <el-table-column prop="referenceNumber" label="流水号" align="center">
      </el-table-column>
      <el-table-column prop="transactionType" label="交易类型" align="center">
      </el-table-column>
      <el-table-column prop="refNumber" label="参考号" align="center">
      </el-table-column>
      <el-table-column prop="cardNum" label="卡号" align="center">
      </el-table-column>
      <el-table-column prop="cardBank" label="发卡行" align="center">
      </el-table-column>
      <el-table-column prop="cardType" label="卡类型" align="center">
      </el-table-column>
      <el-table-column prop="merchantOrderNumber" label="商户订单号" align="center">
      </el-table-column>
      <el-table-column prop="silverMerchantOrdNum" label="银商订单号" align="center">
      </el-table-column>
      <el-table-column prop="subOrdNum" label="子订单号" align="center">
      </el-table-column>
      <el-table-column prop="refundOrdNum" label="退货订单号" align="center">
      </el-table-column>
      <el-table-column prop="paymentType" label="支付类型" align="center">
      </el-table-column>
      <el-table-column prop="actualAmount" label="实际支付金额" align="center">
      </el-table-column>
      <el-table-column prop="remark	" label="备注" align="center">
      </el-table-column>
      <el-table-column prop="paymentPostscript" label="付款附言" align="center">
      </el-table-column>
      <el-table-column prop="preferentialAmount" label="钱包优惠金额" align="center">
      </el-table-column>
      <el-table-column prop="merchantPreferentialAmount" label="商户优惠金额" align="center">
      </el-table-column>
      <el-table-column prop="otherPreferentialAmount" label="其他优惠金额" align="center">
      </el-table-column>
      <el-table-column prop="installmentNumber" label="分期期数" align="center">
      </el-table-column>
      <el-table-column prop="installmentFee" label="分期手续费" align="center">
      </el-table-column>
      <el-table-column prop="installmentServer" label="分期服务方" align="center">
      </el-table-column>
      <el-table-column prop="installmentPayFee" label="分期付息方" align="center">
      </el-table-column>
      <!-- <el-table-column prop="remark" label="所属公司" align="center">
      </el-table-column> -->
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageCurrent" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
    <!-- 表格 END -->
    <orderDetail :dialogFormVisible="dialogFormVisible" @close="close" :info="info"></orderDetail>
  </div>
</template>

<script type="text/javascript">
import orderDetail from '@/page/Finance/bankStatement/orderDetails.vue'

export default {
  components: {
    orderDetail
  },
  data() {
    return {
      tableData: [], // 表格数据

      pageCurrent: 1,
      pageSize: 10,
      total: 0,

      info: '',
      dialogFormVisible: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    closeBtn(){
      this.$router.push({
        path: '/bankStatement',
        name: '银行流水单管理',
        params: {
          tabStatus: 'fifth'
        }
      });
    },
    orderDetail(row){
      this.dialogFormVisible = true;
      this.info = {
        id: row.id,
        type: 7
      };
      
    },
    close(){
      this.dialogFormVisible = false;
      this.info = '';
    },
    deleteFun(row){
      const that = this;
      this.$confirm('是否需要删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrc + "/finance/wapaymentccb/api/delete", {
          "id": row.id,
        }).then(function(response) {
          if (response.data.isSuccess) {
            that.loadData();
            that.$message({
              type: 'info',
              message: '已删除'
            });
          } else {
            if(response.data.message){
              that.$message.warning(response.data.result.message);
            }else{
              that.$message.warning("删除失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
          that.$message.warning("删除失败~");
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.pageCurrent = 1;
      this.loadData();
    },
    handleCurrentChange(val){
      this.pageCurrent = val;
      this.loadData();
    },
    loadData(){
      const that = this;
      // console.log(this.$route.query)
      this.$http.post(this.GLOBAL.serverSrc + "/finance/wapaymentccb/api/search", {
        "pageIndex": this.pageCurrent,
        "pageSize": this.pageSize,
        "object": {
          "purpose_Merchant_cod": this.$route.query.purpose_Merchant_code,
          // "purpose_Date": this.$route.query.purpose_Date,
          "creditAmount":this.$route.query.creditAmount,
          "remarkStartDate":this.$route.query.remarkStartDate,
          "remarkEndDate":this.$route.query.remarkEndDate
        }
      }).then(function (obj) {
        if(obj.data.isSuccess){
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          // that.tableDataNBSK.forEach(function (item, index, arr) {
          //   item.collectionTime = item.collectionTime.split('T')[0];
          // });
          // that.loadingNBSK = false;
        }else{
          // that.loadingNBSK = false;
          that.total = 0;
          that.tableData = [];
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
  .distributor-content{
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    #form-content{
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .buttonForm{
        text-align: end;
      }
      .el-select{
        width: 100% !important;
      }
      .line{
        text-align: center;
      }
    }
    .buttonsDv{
      width: 98%;
      margin-top: 10px;
      text-align: end;
    }
    #table-content{
      width: 98%;
      margin: 40px auto 20px;
      th, td{
        min-width: 60px;
      }
    }
    .block{
      width: 100%;
      text-align: center;
      margin: 30px auto;
    }
  }

</style>
