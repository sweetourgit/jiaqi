<template>
  <div class="distributor-content">
    <div class="buttonsDv">
      <el-button @click="submitBtn" type="primary" :disabled="clickable">确认</el-button>
      <el-button @click="closeBtn" type="primary" plain>取消</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 改天再拆 -->
      <!-- <el-tab-pane label="中国银行" name="first">
        <BankOfChinaZCK  @updateSelectionChange="updateSelectionChange1"></BankOfChinaZCK>
      </el-tab-pane>-->

      <el-tab-pane label="中国银行" name="first">
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
          <el-table-column
            prop="account_holding_bank_number_of_payer"
            label="付款人开户行号"
            align="center"
          ></el-table-column>
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
      </el-tab-pane>
      <el-tab-pane label="兴业银行" name="second">
        <el-table
          :data="tableData2"
          ref="multipleTable2"
          border
          :highlight-current-row="true"
          :header-cell-style="getRowClass"
          :stripe="true"
          id="table-content2"
          @row-click="handleRowClick2"
          @selection-change="selectionChange2"
        >
          <el-table-column prop="id" label fixed type="selection" :selectable="selectInit"></el-table-column>、
          <el-table-column prop="id" label="明细ID" align="center"></el-table-column>
          <el-table-column prop="surplus_Amount" label="剩余金额" align="center"></el-table-column>
          <el-table-column prop="id" label="暂存款状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.is_ZCK == 0">未设置</span>
              <span v-if="scope.row.is_ZCK == 1">已设置</span>
            </template>
          </el-table-column>
          <el-table-column prop="purpose_fee" label="手续费" align="center"></el-table-column>
          <el-table-column prop="bank_serial_number" label="银行流水号" align="center"></el-table-column>
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
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page.sync="pageCurrent2"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSize2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total2"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <!-- ++++++农业银行+++++++ -->
      <el-tab-pane label="农业银行" name="third">
        <el-table
          :data="tableDataForNY"
          ref="multipleTableForNY"
          border
          :highlight-current-row="true"
          :header-cell-style="getRowClass"
          :stripe="true"
          id="table-contentForNY"
          @row-click="handleRowClickForNY"
          @selection-change="selectionChangeForNY"
        >
          <el-table-column prop="id" label fixed type="selection" :selectable="selectInit"></el-table-column>
          <el-table-column prop="id" label="明细ID" align="center"></el-table-column>
          <el-table-column prop="surplusPrice" label="剩余金额" align="center"></el-table-column>
          <el-table-column prop="abcBank_ZCK" label="暂存款状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.abcBank_ZCK == 0">未设置</span>
              <span v-if="scope.row.abcBank_ZCK == 1">已设置</span>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="银行流水号" align="center"></el-table-column>
          <el-table-column prop="createTime" label="交易时间" align="center"></el-table-column>
          <el-table-column prop="incomePrice" label="收入金额" align="center"></el-table-column>
          <el-table-column prop="expensesPrice" label="支出金额" align="center"></el-table-column>
          <el-table-column prop="accountBalance" label="账户余额" align="center"></el-table-column>
          <el-table-column prop="bankName" label="交易行名" align="center"></el-table-column>
          <el-table-column prop="customerCity" label="对方省市" align="center"></el-table-column>
          <el-table-column prop="accountNumber" label="对方账号" align="center"></el-table-column>
          <el-table-column prop="accountName" label="对方户名" align="center"></el-table-column>
          <el-table-column prop="use" label="交易用途" align="center"></el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChangeForNY"
            @current-change="handleCurrentChangeForNY"
            :current-page.sync="pageCurrentForNY"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSizeForNY"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalForNY"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <!-- ++++++招商银行+++++++ -->
      <el-tab-pane label="招商银行" name="forth">
        <el-table
          :data="tableDataForZS"
          ref="multipleTableForZS"
          border
          :highlight-current-row="true"
          :header-cell-style="getRowClass"
          :stripe="true"
          id="table-contentForZS"
          @row-click="handleRowClickForZS"
          @selection-change="selectionChangeForZS"
        >
          <el-table-column prop="id" label fixed type="selection" :selectable="selectInit"></el-table-column>
          <el-table-column prop="id" label="明细ID" align="center"></el-table-column>
          <el-table-column prop="surplusAmount" label="剩余金额" align="center"></el-table-column>
          <el-table-column prop="is_ZCK" label="暂存款状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.is_ZCK == 0">未设置</span>
              <span v-if="scope.row.is_ZCK == 1">已设置</span>
            </template>
          </el-table-column>
          <el-table-column prop="referenceNumber" label="交易流水号" align="center"></el-table-column>
          <el-table-column prop="JYR" label="交易日" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.transactionDateTime.split('T')[0]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="JYSJ" label="交易时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.transactionDateTime.split('T')[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="valueDate" label="起息日" align="center"></el-table-column>
          <el-table-column prop="transactionType" label="交易类型" align="center"></el-table-column>
          <el-table-column prop="debitAmount" label="借方金额" align="center"></el-table-column>
          <el-table-column prop="creditAmount" label="贷方金额" align="center"></el-table-column>
          <el-table-column prop="balance" label="余额" align="center"></el-table-column>
          <el-table-column prop="purpose" label="用途" align="center"></el-table-column>
          <el-table-column prop="processInstanceNumber" label="流程实例号" align="center"></el-table-column>
          <el-table-column prop="businessName" label="业务名称" align="center"></el-table-column>
          <el-table-column prop="businessReferenceNumber" label="业务参考号" align="center"></el-table-column>
          <el-table-column prop="businessSummary" label="业务摘要" align="center"></el-table-column>
          <el-table-column prop="otherSummary" label="其他摘要" align="center"></el-table-column>
          <el-table-column prop="payerDebitBank" label="收(付)方分行名" align="center"></el-table-column>
          <el-table-column prop="payerDebitName" label="收(付)方名称" align="center"></el-table-column>
          <el-table-column prop="payerDebitAccount" label="收(付)方账号" align="center"></el-table-column>
          <el-table-column prop="payerDebitBankNumber" label="收(付)方开户行行号" align="center"></el-table-column>
          <el-table-column prop="payerDebitBankName" label="收(付)方开户行名" align="center"></el-table-column>
          <el-table-column prop="payerDebitBankAddress" label="收(付)方开户行地址" align="center"></el-table-column>
          <el-table-column prop="parentSubAccountBank" label="收(付)母(子)公司账号分行名" align="center"></el-table-column>
          <el-table-column prop="parentSubAccount" label="母(子)公司账号" align="center"></el-table-column>
          <el-table-column prop="parentSubName" label="母(子)公司名称" align="center"></el-table-column>
          <el-table-column prop="informationSign" label="信息标志" align="center"></el-table-column>
          <el-table-column prop="attachmentInformation" label="有否附件信息" align="center"></el-table-column>
          <el-table-column prop="rushMark" label="冲账标志" align="center"></el-table-column>
          <el-table-column prop="extendedAbstract" label="扩展摘要" align="center"></el-table-column>
          <el-table-column prop="transactionAnalysisCode" label="交易分析码" align="center"></el-table-column>
          <el-table-column prop="billNumber" label="票据号" align="center"></el-table-column>
          <el-table-column prop="businesPayOrderNum" label="商务支付订单号" align="center"></el-table-column>
          <el-table-column prop="internalNumber" label="内部编号" align="center"></el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChangeForZS"
            @current-change="handleCurrentChangeForZS"
            :current-page.sync="pageCurrentForZS"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSizeForZS"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalForZS"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <!-- ++++++建设银行+++++++ -->
      <el-tab-pane label="建设银行" name="fifth">
        <el-table
          :data="tableDataForJS"
          ref="multipleTableForJS"
          border
          :highlight-current-row="true"
          :header-cell-style="getRowClass"
          :stripe="true"
          id="table-contentForJS"
          @row-click="handleRowClickForJS"
          @selection-change="selectionChangeForJS"
        >
          <el-table-column prop="id" label fixed type="selection" :selectable="selectInit"></el-table-column>
          <el-table-column prop="surplusAmount" label="剩余金额" align="center"></el-table-column>
          <el-table-column prop="is_ZCK" label="暂存款状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.is_ZCK == 0">未设置</span>
              <span v-if="scope.row.is_ZCK == 1">已设置</span>
            </template>
          </el-table-column>
          <el-table-column prop="transactionTime" label="交易时间" align="center">
            <!-- <template slot-scope="scope">
              <span>{{scope.row.transactionTime.replace("T",' ')}}</span>
            </template>-->
          </el-table-column>
          <el-table-column prop="debitAmount" label="借方发生额/元(支取)" align="center"></el-table-column>
          <el-table-column prop="creditAmount" label="贷方发生额/元(收入)" align="center"></el-table-column>
          <el-table-column prop="balance" label="余额" align="center"></el-table-column>
          <el-table-column prop="currency" label="币种" align="center"></el-table-column>
          <el-table-column prop="accountNameOther" label="对方户名" align="center"></el-table-column>
          <el-table-column prop="accountNumberOther" label="对方账号" align="center"></el-table-column>
          <el-table-column prop="accountAgencyOther" label="对方开户机构" align="center"></el-table-column>
          <el-table-column prop="accountingDate" label="记账日期" align="center"></el-table-column>
          <el-table-column prop="reference" label="摘要" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column prop="transactionReferenceNumber" label="账户明细编号-交易流水号" align="center"></el-table-column>
          <el-table-column prop="enterpriseReferenceNumber" label="企业流水号" align="center"></el-table-column>
          <el-table-column prop="certificateType" label="凭证种类" align="center"></el-table-column>
          <el-table-column prop="certificateCode" label="凭证号" align="center"></el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChangeForJS"
            @current-change="handleCurrentChangeForJS"
            :current-page.sync="pageCurrentForJS"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSizeForJS"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalForJS"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <!-- ++++++中信银行+++++++ -->
      <el-tab-pane label="中信银行" name="sixth">
        <el-table
          :data="tableDataForZX"
          ref="multipleTableForZX"
          border
          :highlight-current-row="true"
          :header-cell-style="getRowClass"
          :stripe="true"
          id="table-contentForZX"
          @row-click="handleRowClickForZX"
          @selection-change="selectionChangeForZX"
        >
          <el-table-column prop="id" label fixed type="selection" :selectable="selectInit"></el-table-column>
          <el-table-column prop="id" label="明细ID" align="center"></el-table-column>

          <el-table-column prop="surplusPrice" label="剩余金额" align="center"></el-table-column>
          <el-table-column prop="is_ZCK" label="暂存款状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.is_ZCK == 0">未设置</span>
              <span v-if="scope.row.is_ZCK == 1">已设置</span>
            </template>
          </el-table-column>
          <el-table-column prop="citiC_Day" label="交易日期" align="center"></el-table-column>
          <el-table-column prop="citiC_Time" label="交易时间" align="center"></el-table-column>
          <el-table-column prop="guestAccount" label="对方账号" align="center"></el-table-column>
          <el-table-column prop="accountName" label="对方账户名称" align="center"></el-table-column>
          <el-table-column prop="openAccountBankName" label="对方账号开户网点名称" align="center"></el-table-column>
          <el-table-column prop="jF_Price" label="借方发生额" align="center"></el-table-column>
          <el-table-column prop="dF_Price" label="贷方发生额" align="center"></el-table-column>
          <el-table-column prop="accountSurplus" label="账户余额" align="center"></el-table-column>
          <el-table-column prop="reference" label="摘要" align="center"></el-table-column>
          <el-table-column prop="tK_Sign" label="退汇标识" align="center"></el-table-column>
          <el-table-column prop="tK_DateTime" label="退汇日期" align="center"></el-table-column>
          <el-table-column prop="gyjY_Number" label="柜员交易号" align="center"></el-table-column>
          <el-table-column prop="postscript" label="附言" align="center"></el-table-column>
          <el-table-column prop="currency" label="币种" align="center"></el-table-column>
          <el-table-column prop="jY_Number" label="交易账号" align="center"></el-table-column>
          <el-table-column prop="jY_AccountBankName" label="交易账号开户网点名称" align="center"></el-table-column>
          <el-table-column prop="dzbh" label="对账编号" align="center"></el-table-column>
          <el-table-column prop="jskh" label="单位结算卡号" align="center"></el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChangeForZX"
            @current-change="handleCurrentChangeForZX"
            :current-page.sync="pageCurrentForZX"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSizeForZX"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalForZX"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <!-- ++++++吉林中信银行+++++++ -->
      <el-tab-pane label="吉林中信银行" name="seventh">
        <el-table
          :data="tableDataForJLZX"
          ref="multipleTableForJLZX"
          border
          :highlight-current-row="true"
          :header-cell-style="getRowClass"
          :stripe="true"
          id="table-contentJLZX"
          @row-click="handleRowClickForJLZX"
          @selection-change="selectionChangeForJLZX"
        >
          <el-table-column prop="id" label fixed type="selection" :selectable="selectInit"></el-table-column>
          <el-table-column prop="id" label="明细ID" align="center"></el-table-column>
          <el-table-column prop="surplus_Amount" label="剩余金额" align="center"></el-table-column>
          <el-table-column prop="is_ZCK" label="暂存款状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.is_ZCK == 0">未设置</span>
              <span v-if="scope.row.is_ZCK == 1">已设置</span>
            </template>
          </el-table-column>
          <el-table-column label="交易时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.transaction_time.split('T')[0]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount_of_income" label="收入金额" align="center"></el-table-column>
          <el-table-column prop="amount_of_expenditure" label="支出金额" align="center"></el-table-column>
          <el-table-column prop="account_balance" label="账户余额" align="center"></el-table-column>
          <el-table-column prop="other_Name" label="对方名称" align="center"></el-table-column>
          <el-table-column prop="other_Account" label="对方账号" align="center"></el-table-column>
          <el-table-column prop="receiving_body" label="受理机构" align="center"></el-table-column>
          <el-table-column prop="abstract" label="摘要" align="center"></el-table-column>
          <el-table-column prop="transaction_serial_number" label="交易流水号" align="center"></el-table-column>
          <el-table-column prop="transaction_card_number" label="交易卡号" align="center"></el-table-column>
          <el-table-column prop="state" label="交易状态" align="center"></el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChangeForJLZX"
            @current-change="handleCurrentChangeForJLZX"
            :current-page.sync="pageCurrentForJLZX"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSizeForJLZX"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalForJLZX"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
 
<script type="text/javascript">
import BankOfChinaZCK from "./componentsZCK/bankOfChinaZCK.vue";
import * as utils from "./utils.js";
export default {
  components: {
    BankOfChinaZCK
  },
  data() {
    return {
      activeName: "first",
      clickable: true,

      tableData1: [], // 表格数据 -- 中国银行
      pageCurrent1: 1,
      pageSize1: 10,
      total1: 0,
      multipleSelection1: [],

      tableData2: [], // 表格数据 -- 兴业银行
      pageCurrent2: 1,
      pageSize2: 10,
      total2: 0,
      multipleSelection2: [],

      totalForNY: 0,
      tableDataForNY: [],
      pageCurrentForNY: 1,
      pageSizeForNY: 10,
      multipleSelectionForNY: [],

      totalForZS: 0,
      pageCurrentForZS: 1,
      pageSizeForZS: 10,
      tableDataForZS: [],
      multipleSelectionForZS: [],

      totalForJS: 0,
      pageCurrentForJS: 1,
      pageSizeForJS: 10,
      tableDataForJS: [],
      multipleSelectionForJS: [],

      totalForZX: 0,
      pageCurrentForZX: 1,
      pageSizeForZX: 10,
      tableDataForZX: [],
      multipleSelectionForZX: [],

      totalForJLZX: 0,
      pageCurrentForJLZX: 1,
      pageSizeForJLZX: 10,
      tableDataForJLZX: [],
      multipleSelectionForJLZX: []
    };
  },
  created() {
    this.loadData1();
    this.loadData2();
    this.loadDataForNY();
    this.loadDataForZS();
    this.loadDataForJS();
    this.loadDataForZX();
    this.loadDataForJLZX();
    this.activeName = this.$route.query.searchType;
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
      if (tab.name == "first") {
        if (this.multipleSelection1.length > 0) {
          this.clickable = false;
        } else {
          this.clickable = true;
        }
      } else if (tab.name == "second") {
        if (this.multipleSelection2.length > 0) {
          this.clickable = false;
        } else {
          this.clickable = true;
        }
      } else if (tab.name == "third") {
        if (this.multipleSelectionForNY.length > 0) {
          this.clickable = false;
        } else {
          this.clickable = true;
        }
      } else if (tab.name == "forth") {
        if (this.multipleSelectionForZS.length > 0) {
          this.clickable = false;
        } else {
          this.clickable = true;
        }
      } else if (tab.name == "fifth") {
        if (this.multipleSelectionForJS.length > 0) {
          this.clickable = false;
        } else {
          this.clickable = true;
        }
      } else if (tab.name == "sixth") {
        if (this.multipleSelectionForZX.length > 0) {
          this.clickable = false;
        } else {
          this.clickable = true;
        }
      } else if (tab.name == "seventh") {
        if (this.multipleSelectionForJLZX.length > 0) {
          this.clickable = false;
        } else {
          this.clickable = true;
        }
      }
    },
    selectInit(row) {
      if (row.is_ZCK == 1) {
        return false; //不可勾选
      } else {
        return true; //可勾选
      }
    },

    // 整行点击 -- 中国银行
    handleRowClick1(row, column, event) {
      if (row.is_ZCK == 0) {
        this.$refs.multipleTable1.toggleRowSelection(row);
      }
    },
    // 选择项更改
    selectionChange1(val) {
      if (val.length > 0 && this.activeName == "first") {
        this.clickable = false;
      } else {
        this.clickable = true;
      }
      this.multipleSelection1 = val;
    },

    // 整行点击 -- 兴业银行
    handleRowClick2(row, column, event) {
      if (row.is_ZCK == 0) {
        this.$refs.multipleTable2.toggleRowSelection(row);
      }
    },
    // 选择项更改
    selectionChange2(val) {
      if (val.length > 0 && this.activeName == "second") {
        this.clickable = false;
      } else {
        this.clickable = true;
      }
      this.multipleSelection2 = val;
    },

    // 关闭当前页面
    closeBtn() {
      this.$router.push({
        path: "/bankStatement",
        name: "银行流水单管理",
        params: {
          tabStatus: this.$route.query.searchType
        }
      });
    },

    //---------------------------------------

    //修改选择项更改    拆分bankOfChina 2020 3.13 拆不动了
    updateSelectionChange1(clickable, multipleSelection) {
      this.clickable = clickable;
      this.multipleSelection1 = multipleSelection;
    },

    //---------------------------------------

    // 提交暂存款选择项
    submitBtn() {
      const that = this;
      let idsArr = [];
      if (this.activeName == "first") {
        // 中国银行暂存款提交
        this.multipleSelection1.forEach(function(item, index, arr) {
          idsArr.push(item.id);
        });
        this.$http
          .post(
            this.GLOBAL.serverSrc +
              "/finance/bankofchina/api/ChangeZCK_ImportEBS",
            {
              ids: idsArr,
              type: 0
            }
          )
          .then(function(response) {
            if (response.status == 200) {
              that.$message.success("提交暂存款成功！");
              that.loadData1();
            } else {
              if (response.statusText) {
                that.$message.warning(response.data.statusText);
              } else {
                that.$message.warning("提交暂存款失败~");
              }
            }
          })
          .catch(function(error) {
            console.log(error);
            that.$message.warning("提交暂存款失败~");
          });
      } else if (this.activeName == "second") {
        // 兴业银行暂存款提交
        this.multipleSelection2.forEach(function(item, index, arr) {
          idsArr.push(item.id);
        });
        this.$http
          .post(
            this.GLOBAL.serverSrc +
              "/finance/bankofchina/api/ChangeZCK_ImportEBS",
            {
              ids: idsArr,
              type: 1
            }
          )
          .then(function(response) {
            if (response.status == 200) {
              that.$message.success("提交暂存款成功！");
              that.loadData2();
            } else {
              if (response.statusText) {
                that.$message.warning(response.data.statusText);
              } else {
                that.$message.warning("提交暂存款失败~");
              }
            }
          })
          .catch(function(error) {
            console.log(error);
            that.$message.warning("提交暂存款失败~");
          });
      } else if (this.activeName == "seventh") {
        //此处功能暂时没有接口
        // 吉林中信银行暂存款提交
        this.multipleSelectionForJLZX.forEach(function(item, index, arr) {
          idsArr.push(item.id);
        });
        this.$http
          .post(
            this.GLOBAL.serverSrc +
              "/finance/bankofchina/api/ChangeZCK_ImportEBS",
            {
              ids: idsArr,
              type: 10
            }
          )
          .then(function(response) {
            if (response.status == 200) {
              that.$message.success("提交暂存款成功！");
              that.loadDataForJLZX();
            } else {
              if (response.statusText) {
                that.$message.warning(response.data.statusText);
              } else {
                that.$message.warning("提交暂存款失败~");
              }
            }
          })
          .catch(function(error) {
            console.log(error);
            that.$message.warning("提交暂存款失败~");
          });
      } else if (this.activeName == "fifth") {
        //此处功能暂时没有接口
        // 吉林中信银行暂存款提交
        this.multipleSelectionForJS.forEach(function(item, index, arr) {
          idsArr.push(item.id);
        });
        this.$http
          .post(
            this.GLOBAL.serverSrc +
              "/finance/bankofchina/api/ChangeZCK_ImportEBS",
            {
              ids: idsArr,
              type: 6
            }
          )
          .then(function(response) {
            if (response.status == 200) {
              that.$message.success("提交暂存款成功！");
              that.loadDataForJS();
            } else {
              if (response.statusText) {
                that.$message.warning(response.data.statusText);
              } else {
                that.$message.warning("提交暂存款失败~");
              }
            }
          })
          .catch(function(error) {
            console.log(error);
            that.$message.warning("提交暂存款失败~");
          });
      } else if (this.activeName == "forth") {
        //此处功能暂时没有接口
        // 吉林中信银行暂存款提交
        this.multipleSelectionForZS.forEach(function(item, index, arr) {
          idsArr.push(item.id);
        });
        this.$http
          .post(
            this.GLOBAL.serverSrc +
              "/finance/bankofchina/api/ChangeZCK_ImportEBS",
            {
              ids: idsArr,
              type: 5
            }
          )
          .then(function(response) {
            if (response.status == 200) {
              that.$message.success("提交暂存款成功！");
              that.loadDataForZS();
            } else {
              if (response.statusText) {
                that.$message.warning(response.data.statusText);
              } else {
                that.$message.warning("提交暂存款失败~");
              }
            }
          })
          .catch(function(error) {
            console.log(error);
            that.$message.warning("提交暂存款失败~");
          });
      } else if (this.activeName == "third") {
        //此处功能暂时没有接口
        // 吉林中信银行暂存款提交
        this.multipleSelectionForNY.forEach(function(item, index, arr) {
          idsArr.push(item.id);
        });
        this.$http
          .post(
            this.GLOBAL.serverSrc +
              "/finance/bankofchina/api/ChangeZCK_ImportEBS",
            {
              ids: idsArr,
              type: 4
            }
          )
          .then(function(response) {
            if (response.status == 200) {
              that.$message.success("提交暂存款成功！");
              that.loadDataForNY();
            } else {
              if (response.statusText) {
                that.$message.warning(response.data.statusText);
              } else {
                that.$message.warning("提交暂存款失败~");
              }
            }
          })
          .catch(function(error) {
            console.log(error);
            that.$message.warning("提交暂存款失败~");
          });
      } else if (this.activeName == "sixth") {
        this.multipleSelectionForZX.forEach(function(item, index, arr) {
          idsArr.push(item.id);
        });
        this.$http
          .post(
            this.GLOBAL.serverSrc +
              "/finance/bankofchina/api/ChangeZCK_ImportEBS",
            {
              ids: idsArr,
              type: 8
            }
          )
          .then(function(response) {
            if (response.status == 200) {
              that.$message.success("提交暂存款成功！");
              that.loadDataForZX();
            } else {
              if (response.statusText) {
                that.$message.warning(response.data.statusText);
              } else {
                that.$message.warning("提交暂存款失败~");
              }
            }
          })
          .catch(function(error) {
            console.log(error);
            that.$message.warning("提交暂存款失败~");
          });
      }
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
      let data4D = utils.getSession4D;
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
            //若传入4D则无数据 测试暂时先不传
            //   userid: data4D.userID, // 暂无数据 想看改成0,
            // orgid: data4D.orgID, // 暂无数据 想看改成0,
            // topid: data4D.topID, // 暂无数据 想看改成0,
            // company: "",
          }
        })
        .then(function(obj) {
          if (obj.data.isSuccess) {
            that.total1 = obj.data.total;
            that.tableData1 = obj.data.objects;
          } else {
            that.total1 = 0;
            that.tableData1 = [];
          }
        });
    },

    handleSizeChange2(val) {
      this.pageSize2 = val;
      this.loadData2();
    },
    handleCurrentChange2(val) {
      this.pageCurrent2 = val;
      this.loadData2();
    },
    loadData2() {
      const that = this;
      // let data4D=utils.getSession4D
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/industrialbank/api/Search", {
          pageIndex: this.pageCurrent2 - 1,
          pageSize: this.pageSize2,
          object: {
            matching_State: 0,
            transaction_reference_number: "",
            begin: "2000-05-16",
            end: "2099-05-16",
            seachType: 3
            //若传入4D则无数据 测试暂时先不传
            //   userid: data4D.userID, // 暂无数据 想看改成0,
            // orgid: data4D.orgID, // 暂无数据 想看改成0,
            // topid: data4D.topID, // 暂无数据 想看改成0,
            // company: "",
          }
        })
        .then(function(obj) {
          if (obj.data.isSuccess) {
            that.total2 = obj.data.total;
            that.tableData2 = obj.data.objects;
          } else {
            that.total2 = 0;
            that.tableData2 = [];
          }
        });
    },
    // 农业银行暂存款逻辑
    loadDataForNY() {
      const that = this;
      let data4D = utils.getSession4D();
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/ABCBank/api/Search", {
          pageIndex: this.pageCurrentForNY - 1,
          pageSize: this.pageSizeForNY,
          object: {
            type: 1,
            // transaction_reference_number: "",
            begin: "2000-05-16",
            end: "2099-05-16",
            // userid: data4D.userID, // 暂无数据 想看改成0,
            // orgid: data4D.orgID, // 暂无数据 想看改成0,
            // topid: data4D.topID, // 暂无数据 想看改成0,
            // company: "",
            seachType: 3
          }
        })
        .then(function(obj) {
          // console.log('兴业银行',obj);
          if (obj.data.isSuccess) {
            that.totalForNY = obj.data.total;
            that.tableDataForNY = obj.data.objects;
          } else {
            that.totalForNY = 0;
            that.tableDataForNY = [];
          }
        });
    },
    handleSizeChangeForNY(val) {
      this.pageSizeForNY = val;
      this.loadDataForNY();
    },
    handleCurrentChangeForNY(val) {
      this.pageCurrentForNY = val;
      this.loadDataForNY();
    },
    handleRowClickForNY(row, column, event) {
      if (row.is_ZCK == 0) {
        this.$refs.multipleTableForNY.toggleRowSelection(row);
      }
    },
    // 选择项更改
    selectionChangeForNY(val) {
      if (val.length > 0 && this.activeName == "third") {
        this.clickable = false;
      } else {
        this.clickable = true;
      }
      this.multipleSelectionForNY = val;
    },
    //+++++++++++++++++++++招商银行暂存款逻辑+++++++++++++++++++++
    loadDataForZS() {
      const that = this;
      let data4D = utils.getSession4D;
      this.$http
        .post(
          this.GLOBAL.serverSrc + "/finance/chinamerchantsbank/api/search",
          {
            pageIndex: this.pageCurrentForZS - 1,
            pageSize: this.pageSizeForZS,
            object: {
              type: 1,
              transaction_reference_number: "",
              begin: "2000-05-16",
              end: "2099-05-16",
              seachType: 3
              //若传入4D则无数据 测试暂时先不传
              //   userid: data4D.userID, // 暂无数据 想看改成0,
              // orgid: data4D.orgID, // 暂无数据 想看改成0,
              // topid: data4D.topID, // 暂无数据 想看改成0,
              // company: "",
            }
          }
        )
        .then(function(obj) {
          // console.log('兴业银行',obj);
          if (obj.data.isSuccess) {
            that.totalForZS = obj.data.total;
            that.tableDataForZS = obj.data.objects;
          } else {
            that.totalForZS = 0;
            that.tableDataForZS = [];
          }
        });
    },
    handleSizeChangeForZS(val) {
      this.pageSizeForZS = val;
      this.loadDataForZS();
    },
    handleCurrentChangeForZS(val) {
      this.pageCurrentForZS = val;
      this.loadDataForZS();
    },
    // 整行点击 -- 吉林吉林中信银行
    handleRowClickForZS(row, column, event) {
      if (row.is_ZCK == 0) {
        this.$refs.multipleTableForZS.toggleRowSelection(row);
      }
    },
    // 选择项更改
    selectionChangeForZS(val) {
      if (val.length > 0 && this.activeName == "forth") {
        this.clickable = false;
      } else {
        this.clickable = true;
      }
      this.multipleSelectionForZS = val;
    },
    //+++++++++++++++++++++建设银行暂存款逻辑+++++++++++++++++++++
    loadDataForJS() {
      const that = this;
      let data4D = utils.getSession4D;
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/chinaconstbank/api/search", {
          pageIndex: this.pageCurrentForJS - 1,
          pageSize: this.pageSizeForJS,
          object: {
            matching_State: 0,
            begin: "2000-05-16",
            end: "2099-05-16",
            seachType: 3
            //若传入4D则无数据 测试暂时先不传
            //   userid: data4D.userID, // 暂无数据 想看改成0,
            // orgid: data4D.orgID, // 暂无数据 想看改成0,
            // topid: data4D.topID, // 暂无数据 想看改成0,
            // company: "",
          }
        })
        .then(function(obj) {
          if (obj.data.isSuccess) {
            that.totalForJS = obj.data.total;
            that.tableDataForJS = obj.data.objects;
            // that.tableDataNBSK.forEach(function (item, index, arr) {
            //   item.collectionTime = item.collectionTime.split('T')[0];
            // });
            // that.loadingNBSK = false;
          } else {
            // that.loadingNBSK = false;
            that.totalForJS = 0;
            that.tableDataForJS = [];
          }
        });
    },
    handleSizeChangeForJS(val) {
      this.pageSizeForJS = val;
      this.loadDataForJS();
    },
    handleCurrentChangeForJS(val) {
      this.pageCurrentForJS = val;
      this.loadDataForJS();
    },
    // 整行点击 -- 吉林吉林中信银行
    handleRowClickForJS(row, column, event) {
      if (row.is_ZCK == 0) {
        this.$refs.multipleTableForJS.toggleRowSelection(row);
      }
    },
    // 选择项更改
    selectionChangeForJS(val) {
      if (val.length > 0 && this.activeName == "fifth") {
        this.clickable = false;
      } else {
        this.clickable = true;
      }
      this.multipleSelectionForJS = val;
    },
    //+++++++++++++++++++++中信银行暂存款逻辑+++++++++++++++++++++
    loadDataForZX() {
      const that = this;
      let data4D = utils.getSession4D;
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/citic_bank/api/search", {
          pageIndex: this.pageCurrentForJS - 1,
          pageSize: this.pageSizeForJS,
          object: {
            matching_State: 0,
            begin: "2000-05-16",
            end: "2099-05-16",
            seachType: 3
            //若传入4D则无数据 测试暂时先不传
            //   userid: data4D.userID, // 暂无数据 想看改成0,
            // orgid: data4D.orgID, // 暂无数据 想看改成0,
            // topid: data4D.topID, // 暂无数据 想看改成0,
            // company: "",
          }
        })
        .then(function(obj) {
          if (obj.data.isSuccess) {
            that.totalForZX = obj.data.total;
            that.tableDataForZX = obj.data.objects;
            // that.tableDataNBSK.forEach(function (item, index, arr) {
            //   item.collectionTime = item.collectionTime.split('T')[0];
            // });
            // that.loadingNBSK = false;
          } else {
            // that.loadingNBSK = false;
            that.totalForZX = 0;
            that.tableDataForZX = [];
          }
        });
    },
    handleSizeChangeForZX(val) {
      this.pageSizeForZX = val;
      this.loadDataForZX();
    },
    handleCurrentChangeForZX(val) {
      this.pageCurrentForZX = val;
      this.loadDataForZX();
    },
    handleRowClickForZX(row, column, event) {
      if (row.is_ZCK == 0) {
        this.$refs.multipleTableForZX.toggleRowSelection(row);
      }
    },
    // 选择项更改
    selectionChangeForZX(val) {
      if (val.length > 0 && this.activeName == "sixth") {
        this.clickable = false;
      } else {
        this.clickable = true;
      }
      this.multipleSelectionForZX = val;
    },
    //+++++++++++++++++++++吉林中信银行暂存款逻辑+++++++++++++++++++++
    loadDataForJLZX() {
      const that = this;
      let data4D = utils.getSession4D;
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/citic_bank_jl/api/Search", {
          pageIndex: this.pageCurrentForJLZX - 1,
          pageSize: this.pageSizeForJLZX,
          object: {
            matching_State: 0,
            begin: "2000-05-16",
            end: "2099-05-16"
            //若传入4D则无数据 测试暂时先不传
            //   userid: data4D.userID, // 暂无数据 想看改成0,
            // orgid: data4D.orgID, // 暂无数据 想看改成0,
            // topid: data4D.topID, // 暂无数据 想看改成0,
            // company: "",
          }
        })
        .then(function(obj) {
          if (obj.data.isSuccess) {
            that.totalForJLZX = obj.data.total;
            that.tableDataForJLZX = obj.data.objects;
            // that.tableDataNBSK.forEach(function (item, index, arr) {
            //   item.collectionTime = item.collectionTime.split('T')[0];
            // });
            // that.loadingNBSK = false;
          } else {
            // that.loadingNBSK = false;
            that.totalForJLZX = 0;
            that.tableDataForJLZX = [];
          }
        });
    },
    handleSizeChangeForJLZX(val) {
      this.pageSizeForJLZX = val;
      this.loadDataForJLZX();
    },
    handleCurrentChangeForJLZX(val) {
      this.pageCurrentForJLZX = val;
      this.loadDataForJLZX();
    },
    // 整行点击 -- 吉林吉林中信银行
    handleRowClickForJLZX(row, column, event) {
      if (row.is_ZCK == 0) {
        this.$refs.multipleTableForJLZX.toggleRowSelection(row);
      }
    },
    // 选择项更改
    selectionChangeForJLZX(val) {
      if (val.length > 0 && this.activeName == "seventh") {
        this.clickable = false;
      } else {
        this.clickable = true;
      }
      this.multipleSelectionForJLZX = val;
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
  box-sizing: border-box;
  padding: 20px;
  .buttonsDv {
    width: 98%;
    margin-top: 10px;
    text-align: end;
  }
  .block {
    width: 100%;
    text-align: center;
    margin: 30px auto;
  }
}
</style>
