// 本想拆分bankZCK 暂时先不拆了 太难
<template>
  <div>
    <el-table
      :data="tableData1"
      ref="multipleTable1"
      border
      :highlight-current-row="true"
      :header-cell-style="getRowClass"
      :stripe="true"
      id="table-content1"
      @row-click="handleRowClick1"
      @selection-change="selectionChange1"
    >
      <el-table-column prop="id" label fixed type="selection" :selectable="selectInit"></el-table-column>
      <el-table-column prop="id" label="明细ID" align="center"></el-table-column>
      <el-table-column prop="surplus_Amount" label="剩余金额" align="center"></el-table-column>
      <el-table-column prop="id" label="暂存款状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.is_ZCK == 0">未设置</span>
          <span v-if="scope.row.is_ZCK == 1">已设置</span>
        </template>
      </el-table-column>
      <el-table-column prop="transaction_reference_number" label="交易流水号" align="center"></el-table-column>
      <el-table-column prop="transaction_Date" label="交易日期" align="center"></el-table-column>
      <el-table-column prop="transaction_Time" label="交易时间" align="center"></el-table-column>
      <el-table-column prop="trade_Currency" label="交易货币" align="center"></el-table-column>
      <el-table-column prop="trade_Amount" label="交易金额" align="center"></el-table-column>
      <el-table-column prop="value_Date" label="起息日期" align="center"></el-table-column>
      <el-table-column prop="exchange_rate" label="汇率" align="center"></el-table-column>
      <el-table-column prop="record_ID" label="记录标识号" align="center"></el-table-column>
      <el-table-column prop="reference" label="摘要" align="center"></el-table-column>
      <el-table-column prop="purpose" label="用途" align="center"></el-table-column>
      <el-table-column prop="remark" label="交易附言" align="center"></el-table-column>
      <el-table-column prop="transaction_Type" label="交易类型" align="center"></el-table-column>
      <el-table-column prop="business_type" label="业务类型" align="center"></el-table-column>
      <el-table-column prop="account_holding_bank_number_of_payer" label="付款人开户行号" align="center"></el-table-column>
      <el-table-column prop="payer_account_bank" label="付款人开户行名" align="center"></el-table-column>
      <el-table-column prop="debit_Account_No" label="付款人账号" align="center"></el-table-column>
      <el-table-column prop="payer_s_Name" label="付款人姓名" align="center"></el-table-column>
      <el-table-column
        prop="account_holding_bank_number_of_beneficiary"
        label="收款人开户行号"
        align="center"
      ></el-table-column>
      <el-table-column prop="beneficiary_account_bank" label="收款人开户行名" align="center"></el-table-column>
      <el-table-column prop="payee_s_Account_Number" label="收款人账号" align="center"></el-table-column>
      <el-table-column prop="payee_s_Name" label="收款人姓名" align="center"></el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page.sync="pageCurrent1"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pageSize1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total1"
      ></el-pagination>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "vueName",
  data() {
    return {
      tableData1: [], // 表格数据 -- 中国银行
      pageCurrent1: 1,
      pageSize1: 10,
      total1: 0,
      multipleSelection1: []
    };
  },
  created() {
    this.loadData1();
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F7F7F7;color:rgb(85, 85, 85);";
      } else {
        return "";
      }
    },
    handleClick(tab, event) {
      if (this.multipleSelection1.length > 0) {
        this.clickable = false;
      } else {
        this.clickable = true;
      }
    },
    selectInit(row) {
      if (row.is_ZCK == 1) {
        return false; //不可勾选
      } else {
        return true; //可勾选
      }
    },
    handleRowClick1(row, column, event) {
      if (row.is_ZCK == 0) {
        this.$refs.multipleTable1.toggleRowSelection(row);
      }
    },
    // 选择项更改
    selectionChange1(val) {
      console.log(val);
      if (val.length > 0 ) {
        this.clickable = false;
      } else {
        this.clickable = true;
      }
      this.$emit('updateSelectionChange', this.clickable,val)
    },
    handleSizeChange1(val) {
      this.pageSize1 = val;
      this.pageCurrent1 = 1;
      this.loadData1();
    },
    handleCurrentChange1(val) {
      this.pageCurrent1 = val;
      this.loadData1();
    },
    loadData1() {
      const that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/bankofchina/api/Search", {
          pageIndex: this.pageCurrent1 - 1,
          pageSize: this.pageSize1,
          object: {
            matching_State: 0,
            transaction_reference_number: "",
            begin: "2000-05-16",
            end: "2099-05-16",
            seachType: 3
          }
        })
        .then(function(obj) {
          // console.log('中国银行',obj);
          if (obj.data.isSuccess) {
            that.total1 = obj.data.total;
            that.tableData1 = obj.data.objects;
          } else {
            that.total1 = 0;
            that.tableData1 = [];
          }
        });
    }
  }
};
</script>
 
<style scoped lang = "less">

.block {
    width: 100%;
    text-align: center;
    margin: 30px auto;
  }
</style>