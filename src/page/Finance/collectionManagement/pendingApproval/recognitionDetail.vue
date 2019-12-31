<template>
  <div class="vivo" style="position:relative">
    <!--认收款-->
    <el-dialog title="查看认款详情" :visible="dialogFormVisible3" width=90% @close="closeAdd" append-to-body>
      <div class="tableDv">
        <!-- 中国银行认款信息 -->
        <el-table v-if="isShowZH" :data="tableDataZH" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content1">
          <!-- <el-table-column label="操作" width="100" align="center" fixed>
            <template slot-scope="scope">
              <el-button @click="chooseRecognition(scope.row)" type="text" size="small" class="table_details">选择</el-button>
              <el-button type="text" size="small" class="table_details" disabled>已选</el-button>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="surplus_Amount" label="剩余金额" align="center">
          </el-table-column> -->
          <el-table-column prop="transaction_reference_number" label="交易流水号" align="center">
          </el-table-column>
          <el-table-column prop="transaction_Date" label="交易日期" align="center">
          </el-table-column>
          <el-table-column prop="transaction_Time" label="交易时间" align="center">
          </el-table-column>
          <el-table-column prop="trade_Currency" label="交易货币" align="center">
          </el-table-column>
          <el-table-column prop="trade_Amount" label="交易金额" align="center">
          </el-table-column>
          <el-table-column prop="value_Date" label="起息日期" align="center">
          </el-table-column>
          <el-table-column prop="exchange_rate" label="汇率" align="center">
          </el-table-column>
          <el-table-column prop="record_ID" label="记录标识号" align="center">
          </el-table-column>
          <el-table-column prop="reference" label="摘要" align="center">
          </el-table-column>
          <el-table-column prop="purpose" label="用途" align="center">
          </el-table-column>
          <el-table-column prop="remark" label="交易附言" align="center">
          </el-table-column>
          <el-table-column prop="transaction_Type" label="交易类型" align="center">
          </el-table-column>
          <el-table-column prop="business_type" label="业务类型" align="center">
          </el-table-column>
          <el-table-column prop="account_holding_bank_number_of_payer" label="付款人开户行号" align="center">
          </el-table-column>
          <el-table-column prop="payer_account_bank" label="付款人开户行名" align="center">
          </el-table-column>
          <el-table-column prop="debit_Account_No" label="付款人账号" align="center">
          </el-table-column>
          <el-table-column prop="payer_s_Name" label="付款人姓名" align="center">
          </el-table-column>
          <el-table-column prop="account_holding_bank_number_of_beneficiary" label="收款人开户行号" align="center">
          </el-table-column>
          <el-table-column prop="beneficiary_account_bank" label="收款人开户行名" align="center">
          </el-table-column>
          <el-table-column prop="payee_s_Account_Number" label="收款人账号" align="center">
          </el-table-column>
          <el-table-column prop="payee_s_Name" label="收款人姓名" align="center">
          </el-table-column>
        </el-table>

        <!-- 兴业银行认款信息 -->
        <el-table v-if="isShowXY" :data="tableDataXY" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content2">
          <!-- <el-table-column label="操作" width="140" align="center" fixed>
            <template slot-scope="scope">
              <el-button @click="choose(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.reference != '收付直通车支付结算'">选择</el-button>
              <el-button @click="payDetail(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.reference == '收付直通车支付结算'">查看微信支付宝明细</el-button>
              <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details" disabled>已选</el-button>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="account_balance" label="剩余金额" align="center">
          </el-table-column> -->
          <!-- <el-table-column prop="purpose_fee" label="手续费" align="center">
          </el-table-column> -->
          <el-table-column prop="bank_serial_number" label="银行流水号" align="center">
          </el-table-column>
          <el-table-column prop="reference" label="摘要" align="center">
          </el-table-column>
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
          <el-table-column prop="purpose" label="用途" align="center">
          </el-table-column>
          <el-table-column prop="credit_amount" label="贷方金额" align="center">
          </el-table-column>
          <el-table-column prop="account_number" label="账号" align="center">
          </el-table-column>
          <el-table-column prop="account_name" label="户名" align="center">
          </el-table-column>
          <el-table-column prop="certificate_code" label="凭证代号" align="center">
          </el-table-column>
          <el-table-column prop="currency" label="币种" align="center">
          </el-table-column>
          <el-table-column prop="cash_or_transfer" label="现/转" align="center">
          </el-table-column>
          <el-table-column prop="debit_amount" label="借方金额" align="center">
          </el-table-column>
          <el-table-column prop="account_number_other" label="对方账号" align="center">
          </el-table-column>
          <el-table-column prop="account_name_other" label="对方户名" align="center">
          </el-table-column>
          <el-table-column prop="bank_other" label="对方银行" align="center">
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center">
          </el-table-column>
        </el-table>

        <!-- 微信支付宝明细认款信息 -->
        <el-table v-if="isShowMX" :data="tableDataMX" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content3">
          <!-- <el-table-column label="操作" width="100" align="center" fixed>
            <template slot-scope="scope">
              <el-button @click="orderDetail(scope.row)" type="text" size="small" class="table_details">选择</el-button>
              <el-button type="text" size="small" class="table_details" disabled>已选</el-button>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="surplus_Amount" label="剩余金额" align="center">
          </el-table-column> -->
          <el-table-column prop="transaction_time" label="交易时间" align="center">
          </el-table-column>
          <el-table-column prop="transaction_amount" label="交易金额" align="center">
          </el-table-column>
          <el-table-column prop="preferential_amount" label="优惠金额" align="center">
          </el-table-column>
          <el-table-column prop="actual_amount" label="实收金额" align="center">
          </el-table-column>
          <el-table-column prop="refund_amount" label="退款金额" align="center">
          </el-table-column>
          <el-table-column prop="merchant_order_number" label="商户订单号" align="center">
          </el-table-column>
          <el-table-column prop="platform_order_number" label="平台订单号" align="center">
          </el-table-column>
          <el-table-column prop="channel" label="所属渠道" align="center">
          </el-table-column>
          <el-table-column prop="merchant_code" label="商户编号" align="center">
          </el-table-column>
          <el-table-column prop="merchant_name" label="商户名称" align="center">
          </el-table-column>
          <el-table-column prop="payment_type" label="支付类型" align="center">
          </el-table-column>
          <el-table-column prop="trading_status" label="交易状态" align="center">
          </el-table-column>
          <el-table-column prop="currency" label="币种" align="center">
          </el-table-column>
          <el-table-column prop="transaction_type" label="交易类型" align="center">
          </el-table-column>
          <el-table-column prop="transaction_issuer" label="交易发卡行" align="center">
          </el-table-column>
          <el-table-column prop="terminal_type" label="终端类型" align="center">
          </el-table-column>
          <el-table-column prop="trade_name" label="商品名称" align="center">
          </el-table-column>
          <el-table-column prop="operator_number" label="操作员编号" align="center">
          </el-table-column>
          <el-table-column prop="device_number" label="设备号" align="center">
          </el-table-column>
          <el-table-column prop="shop_number" label="门店编号" align="center">
          </el-table-column>
          <el-table-column prop="third_party_merchant_number" label="第三方商户号" align="center">
          </el-table-column>
          <el-table-column prop="apPid" label="appID" align="center">
          </el-table-column>
          <el-table-column prop="third_party_order_number" label="第三方订单号" align="center">
          </el-table-column>
          <el-table-column prop="remark" label="付款备注" align="center">
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button class="el-button" type="warning" @click="closeAdd">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">

  export default {
    name: "recognitionDetail",
    components: {
    },
    props: {
      dialogFormVisible3: false,
      msg: '',
    },
    data() {
      return {
        tableDataZH: [],
        isShowZH: false,
        tableDataXY: [],
        isShowXY: false,
        tableDataMX: [],
        isShowMX: false
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      dialogFormVisible3: {
        handler: function () {
          console.log('this.msg',this.msg);
          if(this.msg == ''){
            this.closeAdd();
          }else{
            this.isShowZH = false;
            this.isShowXY = false;
            this.isShowMX = false;
            this.loadData();
          }

        }
      }
    },
    created(){
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

      closeAdd(){
        this.$emit('close', false);
      },

      loadData(){
        const that = this;
        console.log(this.msg.id);

        this.$http.post(this.GLOBAL.serverSrc + "/finance/bankofchina/api/FindFlow", {
          "id": this.msg.id
        }, ).then(function(response) {
          console.log(response.data);
          if (response.data.isSuccess) {
            if(response.data.object.type === 0){
              that.tableDataZH[0] = response.data.object.data;
              that.isShowZH = true;
            }else if(response.data.object.type === 1){
              that.tableDataXY[0] = response.data.object.data;
              that.isShowXY = true;
            }else if(response.data.object.type === 2){
              that.tableDataMX[0] = response.data.object.data;
              that.isShowMX = true;
            }
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning("认款提交失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
        });
      }
    },
    created(){

    }
  }

</script>
<style lang="scss" scoped>
  .footer{
    text-align: right;
    margin-top: 18px;
  }
</style>
