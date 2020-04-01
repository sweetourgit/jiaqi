<template>
  <div class="distributor-content">
    <div class="buttonsDv">
      <div style="margin-left:20px"><h1>{{this.$route.query.company}}</h1></div>
      <div>  <el-button @click="closeBtn" type="primary">关闭</el-button></div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      :highlight-current-row="true"
      :header-cell-style="getRowClass"
      :stripe="true"
      id="table-content"
    >
      <el-table-column label="操作" width="100" align="center" fixed>
        <template slot-scope="scope">
          <el-button
            @click="orderDetail(scope.row)"
            type="text"
            size="small"
            class="table_details"
          >查看订单</el-button>
          <el-button
            @click="deleteFun(scope.row)"
            type="text"
            size="small"
            class="table_details"
            v-if="scope.row.surplus_Amount == scope.row.transaction_amount"
          >删除</el-button>
        </template>
      </el-table-column>
      <template v-if="this.$route.query.company=='辽宁大运通'">
        <el-table-column prop="id" label="明细ID" align="center"></el-table-column>
        <el-table-column prop="surplus_Amount" label="剩余金额" align="center"></el-table-column>
        <el-table-column prop="transaction_time" label="交易时间" align="center">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.transaction_time.}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="transaction_amount" label="交易金额" align="center"></el-table-column>
        <el-table-column prop="preferential_amount" label="优惠金额" align="center"></el-table-column>
        <el-table-column prop="actual_amount" label="实收金额" align="center"></el-table-column>
        <el-table-column prop="refund_amount" label="退款金额" align="center"></el-table-column>
        <el-table-column prop="merchant_order_number" label="商户订单号" align="center"></el-table-column>
        <el-table-column prop="platform_order_number" label="平台订单号" align="center"></el-table-column>
        <el-table-column prop="channel" label="所属渠道" align="center"></el-table-column>
        <el-table-column prop="merchant_code" label="商户编号" align="center"></el-table-column>
        <el-table-column prop="merchant_name" label="商户名称" align="center"></el-table-column>
        <el-table-column prop="payment_type" label="支付类型" align="center"></el-table-column>
        <el-table-column prop="trading_status" label="交易状态" align="center"></el-table-column>
        <el-table-column prop="currency" label="币种" align="center"></el-table-column>
        <el-table-column prop="transaction_type" label="交易类型" align="center"></el-table-column>
        <el-table-column prop="transaction_issuer" label="交易发卡行" align="center"></el-table-column>
        <el-table-column prop="terminal_type" label="终端类型" align="center"></el-table-column>
        <el-table-column prop="trade_name" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="operator_number" label="操作员编号" align="center"></el-table-column>
        <el-table-column prop="device_number" label="设备号" align="center"></el-table-column>
        <el-table-column prop="shop_number" label="门店编号" align="center"></el-table-column>
        <el-table-column prop="third_party_merchant_number" label="第三方商户号" align="center"></el-table-column>
        <el-table-column prop="apPid" label="appID" align="center"></el-table-column>
        <el-table-column prop="third_party_order_number" label="第三方订单号" align="center"></el-table-column>
        <el-table-column prop="remark" label="付款备注" align="center"></el-table-column>
      </template>
      <template v-if="this.$route.query.company=='吉林大运通'">
        <el-table-column prop="id" label="明细ID" align="center"></el-table-column>
        <el-table-column prop="surplus_Amount" label="剩余金额" align="center"></el-table-column>
        <el-table-column prop="transaction_time" label="交易时间" align="center">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.transaction_time.split('T')[0] + ' ' + scope.row.transaction_time.split('T')[1]}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="merchant_code" label="商户编码" align="center"></el-table-column>
        <el-table-column prop="merchant_name" label="商户名称" align="center"></el-table-column>
        <el-table-column prop="payment_type" label="支付类型" align="center"></el-table-column>
        <el-table-column prop="transaction_amount" label="交易金额" align="center"></el-table-column>
        <el-table-column prop="refund_amount" label="退款金额" align="center"></el-table-column>
        <el-table-column prop="net_payment" label="支付净额" align="center"></el-table-column>
        <el-table-column prop="merchant_rate" label="商户费率(‰)" align="center"></el-table-column>
        <el-table-column prop="purpose_fee" label="商户手续费" align="center"></el-table-column>
        <el-table-column prop="separate_amount" label="分账金额" align="center"></el-table-column>
        <el-table-column prop="draw_amount" label="划账金额" align="center"></el-table-column>
      </template>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageCurrent"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 表格 END -->
    <orderDetail :dialogFormVisible="dialogFormVisible" @close="close" :info="info"></orderDetail>
  </div>
</template>
 
<script type="text/javascript">
import orderDetail from "@/page/Finance/bankStatement/orderDetails.vue";

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

      info: "",
      dialogFormVisible: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F7F7F7;color:rgb(85, 85, 85);";
      } else {
        return "";
      }
    },
    closeBtn() {
      this.$router.push({
        path: "/bankStatement",
        name: "银行流水单管理",
        params: {
          tabStatus: "second"
        }
      });
    },
    orderDetail(row) {
      let type=0
      switch(this.$route.query.company){
        case '辽宁大运通' :
          type=2;
          break;
          case '吉林大运通' :
            type=3

      }
      this.dialogFormVisible = true;
      this.info = {
        id: row.id,
        type: type
      };
    },
    close() {
      this.dialogFormVisible = false;
      this.info = "";
    },
    deleteFun(row) {
      const that = this;
      let deleteURL = "";
      switch (this.$route.query.company) {
        case "辽宁大运通":
          deleteURL = this.GLOBAL.serverSrc + "/finance/wa_payment/api/delete";
          break;
        case "吉林大运通":
          deleteURL = this.GLOBAL.serverSrc + "/finance/wa_payment_jl/api/delete";
      }
      console.log('deleteURL',deleteURL)
        console.log('rowID',row.id)
      this.$confirm("是否需要删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(deleteURL, {
              id: row.id
            })
            .then(function(response) {
              if (response.data.isSuccess) {
                that.loadData();
                that.$message({
                  type: "info",
                  message: "已删除"
                });
              } else {
                if (response.data.message) {
                  that.$message.warning(response.data.result.message);
                } else {
                  that.$message.warning("删除失败~");
                }
              }
            })
            .catch(function(error) {
              console.log(error);
              that.$message.warning("删除失败~");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageCurrent = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.loadData();
    },
    loadData() {
      const that = this;
      console.log("id", this.$route.query);
      let url = "";
      console.log('company',this.$route.query.company)
      switch (this.$route.query.company) {
        case "辽宁大运通":
          url = this.GLOBAL.serverSrc + "/finance/wa_payment/api/Search";
          break;
        case "吉林大运通":
          url = this.GLOBAL.serverSrc + "/finance/wa_payment_jl/api/Search";
      }
      console.log('url',url)
      this.$http
        .post(url, {
          pageIndex: this.pageCurrent,
          pageSize: this.pageSize,
          object: {
            purpose_Merchant_code: this.$route.query.purpose_Merchant_code,
            purpose_Date: this.$route.query.purpose_Date,
            creditAmount:this.$route.query.creditAmount
            // bankID:this.$route.query.id,
            // type:this.$route.query.type
          }
        })
        .then(function(obj) {
          console.log("微信支付宝明细", obj);
          if (obj.data.isSuccess) {
            that.total = obj.data.total;
            that.tableData = obj.data.objects;
            // that.tableDataNBSK.forEach(function (item, index, arr) {
            //   item.collectionTime = item.collectionTime.split('T')[0];
            // });
            // that.loadingNBSK = false;
          } else {
            // that.loadingNBSK = false;
            that.total = 0;
            that.tableData = [];
          }
        });
      // console.log(this.$route.query)
      // this.$http.post(this.GLOBAL.serverSrc + "/finance/wa_payment/api/Search", {
      //   "pageIndex": this.pageCurrent,
      //   "pageSize": this.pageSize,
      //   "object": {
      //     "purpose_Merchant_code": this.$route.query.purpose_Merchant_code,
      //     "purpose_Date": this.$route.query.purpose_Date
      //   }
      // }).then(function (obj) {
      //   // console.log('微信支付宝明细',obj);
      //   if(obj.data.isSuccess){
      //     that.total = obj.data.total;
      //     that.tableData = obj.data.objects;
      //     // that.tableDataNBSK.forEach(function (item, index, arr) {
      //     //   item.collectionTime = item.collectionTime.split('T')[0];
      //     // });
      //     // that.loadingNBSK = false;
      //   }else{
      //     // that.loadingNBSK = false;
      //     that.total = 0;
      //     that.tableData = [];
      //   }
      // })
    }
  }
};
</script>
<style lang="scss" scoped>
.distributor-content {
  width: 99%;
  margin: 25px auto;
  height: auto;
  border: 1px solid #e6e6e6;
  #form-content {
    background: #f7f7f7;
    padding: 20px 10px;
    margin: 20px 10px;
    .buttonForm {
      text-align: end;
    }
    .el-select {
      width: 100% !important;
    }
    .line {
      text-align: center;
    }
  }
  .buttonsDv {
    width: 98%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #table-content {
    width: 98%;
    margin: 40px auto 20px;
    th,
    td {
      min-width: 60px;
    }
  }
  .block {
    width: 100%;
    text-align: center;
    margin: 30px auto;
  }
}
</style>
