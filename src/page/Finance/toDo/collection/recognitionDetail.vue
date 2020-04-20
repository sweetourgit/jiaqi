<template>
  <div style="position:relative">
    <el-drawer direction="rtl" size="60%" :show-close="false" :visible="dialogVisibleDel" @close="closeAdd">
      <el-divider class="mb-40">查看认款详情</el-divider>
      <div class="el-drawer-content">
        <el-table v-if="isShowZH" :data="tableDataZH" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content1">
          <el-table-column prop="transaction_reference_number" label="交易流水号" align="center" fixed="left"></el-table-column>
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
          <el-table-column prop="account_holding_bank_number_of_beneficiary" label="收款人开户行号" align="center"></el-table-column>
          <el-table-column prop="beneficiary_account_bank" label="收款人开户行名" align="center"></el-table-column>
          <el-table-column prop="payee_s_Account_Number" label="收款人账号" align="center"></el-table-column>
          <el-table-column prop="payee_s_Name" label="收款人姓名" align="center" fixed="right"></el-table-column>
        </el-table>

        <el-table v-if="isShowXY" :data="tableDataXY" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content2">
          <el-table-column prop="bank_serial_number" label="银行流水号" align="center" fixed="left"></el-table-column>
          <el-table-column prop="reference" label="摘要" align="center"></el-table-column>
          <el-table-column prop="transaction_Date" label="交易日期" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.transaction_Date.split('T')[0]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="transaction_Date" label="交易时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.transaction_Date.split('T')[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="purpose" label="用途" align="center"></el-table-column>
          <el-table-column prop="credit_amount" label="贷方金额" align="center"></el-table-column>
          <el-table-column prop="account_number" label="账号" align="center"></el-table-column>
          <el-table-column prop="account_name" label="户名" align="center"></el-table-column>
          <el-table-column prop="certificate_code" label="凭证代号" align="center"></el-table-column>
          <el-table-column prop="currency" label="币种" align="center"></el-table-column>
          <el-table-column prop="cash_or_transfer" label="现/转" align="center"></el-table-column>
          <el-table-column prop="debit_amount" label="借方金额" align="center"></el-table-column>
          <el-table-column prop="account_number_other" label="对方账号" align="center"></el-table-column>
          <el-table-column prop="account_name_other" label="对方户名" align="center"></el-table-column>
          <el-table-column prop="bank_other" label="对方银行" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center" fixed="right"></el-table-column>
        </el-table>

        <el-table v-if="isShowMX" :data="tableDataMX" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content3">
          <el-table-column prop="transaction_time" label="交易时间" align="center" fixed="left">
            <template slot-scope="scope">
              <span>{{scope.row.transaction_time.split('T')[0] + ' ' + scope.row.transaction_time.split('T')[1]}}</span>
            </template>
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
          <el-table-column prop="remark" label="付款备注" align="center" fixed="right"></el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: "recognitionDetail",
    props: {
      dialogVisibleDel: false,
      msg: '',
    },
    data () {
      return {
        tableDataZH: [],
        isShowZH: false,
        tableDataXY: [],
        isShowXY: false,
        tableDataMX: [],
        isShowMX: false
      }
    },
    watch: {
      dialogVisibleDel: {
        handler: function () {
          if (this.msg === '') {
            this.closeAdd();
          } else {
            this.isShowZH = false;
            this.isShowXY = false;
            this.isShowMX = false;
            this.loadData();
          }
        }
      }
    },
    methods: {
      getRowClass ({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      closeAdd () {
        this.$emit('close', false);
      },
      loadData () {
        let _this = this;
        let data = JSON.parse(localStorage.getItem(this.msg.id));
        let keepType = data.type;
        if (keepType === 0) {
          _this.tableDataZH[0] = data.row;
          _this.isShowZH = true;
        } else if (keepType === 1) {
          _this.tableDataXY[0] = data.row;
          _this.isShowXY = true;
        } else if (keepType === 2) {
          _this.tableDataMX[0] = data.row;
          _this.isShowMX = true;
        }
      }
    },
  }

</script>

<style lang="scss" scoped>
  .el-drawer-content{
    width: 96%;
    margin: 0 auto;
  }
  .footer{
    text-align: right;
    margin-top: 18px;
  }
</style>
