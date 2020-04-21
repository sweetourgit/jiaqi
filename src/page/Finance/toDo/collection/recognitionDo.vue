<template>
  <div class="oppo" style="position:relative">
    <el-drawer direction="rtl" size="60%" :show-close="false" :visible="dialogVisibleDo" @close="closeAdd">
      <el-divider class="mb-40">认收款</el-divider>
      <div class="recognitionCls el-drawer-content">
        <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
        <!-- 报销还款begin -->
        <div class="topMsg" v-if="collectionType === 6">
          <p class="inputLabel">
            <span>收款账户：</span>
            {{baseInfo.collectionNumber}}
          </p>
          <p class="inputLabel">
            <span>借款单号：</span>
            {{baseInfo.loan}}
          </p>
          <p class="inputLabel">
            <span>报销单号：</span>
            {{baseInfo.reimbursement}}
          </p>
          <p class="inputLabel">
            <span>收款金额：</span>
            {{baseInfo.price}}
          </p>
        </div>
        <!-- 报销还款end -->
        <!-- 非报销还款显示的begin -->
        <div v-if="collectionType !== 6">
          <!-- 顶部基础信息 -->
          <div class="topMsg">
            <p class="inputLabel" v-if="collectionType === 2">
              <span>同业社名称：</span>
              {{baseInfo.localCompName}}
            </p>
            <p class="inputLabel" v-if="collectionType === 1">
              <span>交易流水号：</span>
              {{baseInfo.orderNumber}}
            </p>
            <p class="inputLabel" v-if="collectionType === 5">
              <span>分销商：</span>
              {{baseInfo.distributor}}
            </p>
            <p class="inputLabel">
              <span>收款金额：</span>
              {{baseInfo.price}}
            </p>
            <p class="inputLabel">
              <span>收款账户：</span>
              {{baseInfo.collectionNumber}}
            </p>
            <p class="inputLabel" v-if="collectionType === 1 || collectionType === 2">
              <span>收款时间：</span>
              {{baseInfo.collectionTime.split('T')[0]}}
            </p>
            <p class="inputLabel">
              <span>摘要：</span>
              {{baseInfo.abstract}}
            </p>
            <div class="inputLabel">
              <span>凭证：</span>
              <ul>
                <li v-for="item in fileList" :key="item.index">
                  <a :href="item.url" target="_blank">{{item.name}}</a>
                </li>
              </ul>
            </div>
          </div>

          <!-- 订单信息table -->
          <el-divider content-position="left" class='title-margin'>订单信息</el-divider>
          <el-table
            ref="multipleTable"
            :data="tableDataOrder"
            border
            style="width: 100%;"
            :header-cell-style="getRowClass"
          >
            <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
            <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
            <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
            <el-table-column prop="date" label=" 下单时间" align="center"></el-table-column>
            <el-table-column prop="matchingPrice" label="本次收款金额" align="center"></el-table-column>
          </el-table>
        </div>
        <!-- 非报销还款显示的end -->
        <!-- 认款table -->
        <el-divider content-position="left" class='title-margin'>认款银行</el-divider>
        <div class="recognition">
          <el-tabs :tab-position="tabPosition" v-model="activeName">
            <el-tab-pane label="中国银行" name="bankZH">
              <el-form
                :model="ruleFormZH"
                ref="ruleFormZH"
                label-width="110px"
                class="form-content"
              >
                <el-row class="row-bg">
                  <el-col :span="5">
                    <el-form-item prop="dateStart" label="起息日期：">
                      <el-date-picker
                        type="date"
                        placeholder="选择日期"
                        v-model="ruleFormZH.dateStart"
                        style="width: 100%;"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="付款人姓名：" prop="code">
                      <el-input v-model="ruleFormZH.name" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="交易金额：" prop="money">
                      <el-row>
                        <el-col :span="11">
                          <el-input v-model="ruleFormZH.moneyMin" placeholder="请输入"></el-input>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                          <el-input v-model="ruleFormZH.moneyMax" placeholder="请输入"></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item class="buttonForm">
                      <el-button @click="searchHandInsideZH" type="primary" icon="el-icon-search">搜索</el-button>
                      <el-button @click="emptyButtonInsideZH" type="primary" icon="el-icon-s-open" plain>重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-table :data="tableDataZH" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true">
                <el-table-column label="操作" width="100" align="center" fixed>
                  <template slot-scope="scope">
                    <el-button @click="chooseRecognition(scope.row, 0)" icon="el-icon-finished" type="primary" plain size="small" class="table_details" :disabled="canClick">选择</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="surplus_Amount" label="剩余金额" align="center"></el-table-column>
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
                <el-table-column prop="account_holding_bank_number_of_beneficiary" label="收款人开户行号" align="center"></el-table-column>
                <el-table-column prop="beneficiary_account_bank" label="收款人开户行名" align="center"></el-table-column>
                <el-table-column prop="payee_s_Account_Number" label="收款人账号" align="center"></el-table-column>
                <el-table-column fixed="right" prop="payee_s_Name" label="收款人姓名" align="center"></el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  @size-change="handleSizeChangeZH"
                  @current-change="handleCurrentChangeZH"
                  :current-page.sync="pageCurrentZH"
                  :page-sizes="[5, 10, 50, 100]"
                  :page-size="pageSizeZH"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalZH"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="兴业银行" name="bankXY">
              <el-form :model="ruleFormZH" ref="ruleFormXY" label-width="110px" class="form-content">
                <el-row type="flex" class="row-bg">
                  <el-col :span="10">
                    <el-form-item label="贷方金额：" prop="money">
                      <el-col :span="11">
                        <el-input v-model="ruleFormXY.moneyMin" placeholder="请输入"></el-input>
                      </el-col>
                      <el-col class="line" :span="2">-</el-col>
                      <el-col :span="11">
                        <el-input v-model="ruleFormXY.moneyMax" placeholder="请输入"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7" :offset="7">
                    <el-form-item class="buttonForm">
                      <el-button @click="searchHandInsideXY()" type="primary" icon="el-icon-search">搜索</el-button>
                      <el-button @click="emptyButtonInsideXY()" type="primary" plain icon="el-icon-s-open">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-table :data="tableDataXY" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true">
                <el-table-column label="操作" width="145" align="center" fixed>
                  <template slot-scope="scope">
                    <el-button @click="chooseRecognition(scope.row, 1)" icon="el-icon-finished" type="primary" plain size="small" class="table_details" v-if="scope.row.reference !== '收付直通车支付结算'" :disabled="canClick">选择</el-button>
                    <el-button @click="payDetail(scope.row)" icon="el-icon-finished" type="primary" plain size="small" class="table_details" v-if="scope.row.reference === '收付直通车支付结算'">查看微信支付宝明细</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="surplus_Amount" label="剩余金额" align="center"></el-table-column>
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
                  @size-change="handleSizeChangeXY"
                  @current-change="handleCurrentChangeXY"
                  :current-page.sync="pageCurrentXY"
                  :page-sizes="[5, 10, 50, 100]"
                  :page-size="pageSizeXY"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalXY"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="农业银行" name="bankNY">
              <el-form :model="ruleFormZH" ref="ruleFormNY" label-width="110px" class="form-content">
                <el-row type="flex" class="row-bg">
                  <el-col :span="10">
                    <el-form-item label="收入金额：" prop="money">
                      <el-col :span="11">
                        <el-input v-model="ruleFormNY.moneyMin" placeholder="请输入"></el-input>
                      </el-col>
                      <el-col class="line" :span="2">-</el-col>
                      <el-col :span="11">
                        <el-input v-model="ruleFormNY.moneyMax" placeholder="请输入"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7" :offset="7">
                    <el-form-item class="buttonForm">
                      <el-button @click="searchHandInsideNY()" type="primary" icon="el-icon-search">搜索</el-button>
                      <el-button @click="emptyButtonInsideNY()" type="primary" plain icon="el-icon-s-open">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-table :data="tableDataNY" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true">
                <el-table-column label="操作" width="145" align="center" fixed>
                  <template slot-scope="scope">
                    <el-button @click="chooseRecognition(scope.row, 1)" icon="el-icon-finished" type="primary" plain size="small" class="table_details" v-if="scope.row.reference !== '收付直通车支付结算'" :disabled="canClick">选择</el-button>
                    <el-button @click="payDetail(scope.row)" icon="el-icon-finished" type="primary" plain size="small" class="table_details" v-if="scope.row.reference === '收付直通车支付结算'">查看微信支付宝明细</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="surplusPrice" label="剩余金额" align="center"></el-table-column>
                <el-table-column prop="abcBank_ZCK" label="暂存款状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.abcBank_ZCK == 0">未设置</span>
                    <span v-if="scope.row.abcBank_ZCK == 1">已设置</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="code" label="交易流水号" align="center"></el-table-column> -->
                <el-table-column prop="createTime" label="交易时间" align="center">
                  <template slot-scope="scope">
                    <span> {{scope.row.createTime.split('T')[0]}}<br/>{{scope.row.createTime.split('T')[1]}}</span>
                  </template>
                </el-table-column>
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
                  @size-change="handleSizeChangeNY"
                  @current-change="handleCurrentChangeNY"
                  :current-page.sync="pageCurrentNY"
                  :page-sizes="[5, 10, 50, 100]"
                  :page-size="pageSizeNY"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalNY"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="招商银行" name="bankZS">
              <el-form :model="ruleFormZH" ref="ruleFormZS" label-width="110px" class="form-content">
                <el-row type="flex" class="row-bg">
                  <el-col :span="10">
                    <el-form-item label="贷方金额：" prop="money">
                      <el-col :span="11">
                        <el-input v-model="ruleFormZS.moneyMin" placeholder="请输入"></el-input>
                      </el-col>
                      <el-col class="line" :span="2">-</el-col>
                      <el-col :span="11">
                        <el-input v-model="ruleFormZS.moneyMax" placeholder="请输入"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7" :offset="7">
                    <el-form-item class="buttonForm">
                      <el-button @click="searchHandInsideZS()" type="primary" icon="el-icon-search">搜索</el-button>
                      <el-button @click="emptyButtonInsideZS()" type="primary" plain icon="el-icon-s-open">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-table :data="tableDataZS" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true">
                <el-table-column label="操作" width="145" align="center" fixed>
                  <template slot-scope="scope">
                    <el-button @click="chooseRecognition(scope.row, 1)" icon="el-icon-finished" type="primary" plain size="small" class="table_details" v-if="scope.row.reference !== '收付直通车支付结算'" :disabled="canClick">选择</el-button>
                    <el-button @click="payDetail(scope.row)" icon="el-icon-finished" type="primary" plain size="small" class="table_details" v-if="scope.row.reference === '收付直通车支付结算'">查看微信支付宝明细</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="surplusAmount" label="剩余金额" align="center"></el-table-column>
                <el-table-column prop="is_ZCK" label="暂存款状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_ZCK == 0">未设置</span>
                    <span v-if="scope.row.is_ZCK == 1">已设置</span>
                  </template>
                </el-table-column>
                <el-table-column prop="referenceNumber" label="交易流水号" align="center"></el-table-column>
                <el-table-column label="交易日" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.transactionDateTime.split('T')[0]}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="交易时间" align="center">
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
                <el-table-column prop="parentSubAccountBank" label="母(子)公司账号分行名" align="center"></el-table-column>
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
                  @size-change="handleSizeChangeZS"
                  @current-change="handleCurrentChangeZS"
                  :current-page.sync="pageCurrentZS"
                  :page-sizes="[5, 10, 50, 100]"
                  :page-size="pageSizeZS"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalZS"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="建设银行" name="bankJS">
              <el-form :model="ruleFormZH" ref="ruleFormJS" label-width="110px" class="form-content">
                <el-row type="flex" class="row-bg">
                  <el-col :span="10">
                    <el-form-item label="贷方发生额/元(收入)：" prop="money">
                      <el-col :span="11">
                        <el-input v-model="ruleFormJS.moneyMin" placeholder="请输入"></el-input>
                      </el-col>
                      <el-col class="line" :span="2">-</el-col>
                      <el-col :span="11">
                        <el-input v-model="ruleFormJS.moneyMax" placeholder="请输入"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7" :offset="7">
                    <el-form-item class="buttonForm">
                      <el-button @click="searchHandInsideJS()" type="primary" icon="el-icon-search">搜索</el-button>
                      <el-button @click="emptyButtonInsideJS()" type="primary" plain icon="el-icon-s-open">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-table :data="tableDataJS" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true">
                <el-table-column label="操作" width="145" align="center" fixed>
                  <template slot-scope="scope">
                    <el-button @click="chooseRecognition(scope.row, 1)" icon="el-icon-finished" type="primary" plain size="small" class="table_details" v-if="scope.row.reference !== '收付直通车支付结算'" :disabled="canClick">选择</el-button>
                    <el-button @click="payDetail(scope.row)" icon="el-icon-finished" type="primary" plain size="small" class="table_details" v-if="scope.row.reference === '收付直通车支付结算'">查看微信支付宝明细</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="surplusAmount" label="剩余金额" align="center"></el-table-column>
                <el-table-column prop="is_ZCK" label="暂存款状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_ZCK == 0">未设置</span>
                    <span v-if="scope.row.is_ZCK == 1">已设置</span>
                  </template>
                </el-table-column>
                <!--<el-table-column prop="transactionTime" label="交易时间" align="center">
                  <template slot-scope="scope">
                    <span> {{scope.row.transactionTime.split('T')[0]}}<br/>{{scope.row.transactionTime.split('T')[1]}}</span>
                  </template>
                </el-table-column>-->
                <el-table-column prop="debitAmount" label="借方发生额/元(支取)" align="center"></el-table-column>
                <el-table-column prop="creditAmount" label="贷方发生额/元(收入)" align="center"></el-table-column>
                <el-table-column prop="balance" label="余额" align="center"></el-table-column>
                <el-table-column prop="currency" label="币种" align="center"></el-table-column>
                <el-table-column prop="accountNameOther" label="对方户名" align="center"></el-table-column>
                <el-table-column prop="accountNumberOther" label="对方账号" align="center"></el-table-column>
                <el-table-column prop="accountAgencyOther" label="对方开户机构" align="center"></el-table-column>
                <el-table-column prop="accountingDate" label="记账日期" align="center"></el-table-column>
                <el-table-column prop="reference" label="摘要" align="center"></el-table-column>
                <!-- 接口返还【备注日期，备注开始日期，备注结束日期，备注手续费】原型图并没有则不显示 -->
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="transactionReferenceNumber" label="账户明细编号-交易流水号" align="center"></el-table-column>
                <el-table-column prop="enterpriseReferenceNumber" label="企业流水号" align="center"></el-table-column>
                <el-table-column prop="certificateType" label="凭证种类" align="center"></el-table-column>
                <el-table-column prop="certificateCode" label="凭证号" align="center"></el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  @size-change="handleSizeChangeJS"
                  @current-change="handleCurrentChangeJS"
                  :current-page.sync="pageCurrentJS"
                  :page-sizes="[5, 10, 50, 100]"
                  :page-size="pageSizeJS"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalJS"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="所选明细" v-if="isShow" name="bankMX">
              <el-table :data="tableDataMX" border max-height="700" :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true">
                <el-table-column label="操作" width="100" align="center" fixed>
                  <template slot-scope="scope">
                    <el-button @click="chooseRecognition(scope.row, 2)" type="text" size="small" class="table_details" :disabled="canClick">选择</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="surplus_Amount" label="剩余金额" align="center"></el-table-column>
                <el-table-column prop="transaction_time" label="交易时间" align="center">
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
                <el-table-column prop="remark" label="付款备注" align="center"></el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  @size-change="handleSizeChangeMX"
                  @current-change="handleCurrentChangeMX"
                  :current-page.sync="pageCurrentMX"
                  :page-sizes="[5, 10, 50, 100]"
                  :page-size="pageSizeMX"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalMX"
                ></el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!--手续费弹窗-->
      <div>
        <el-dialog style="text-align: left;" title="手续费" :visible.sync="dialogVisibleSXF" width="30%" top="20vh" append-to-body>
          <div>
            <p class="areaP">手续费：</p>
            <el-input class="areaIn" v-model="service_charge" :disabled="noEdit"></el-input>
          </div>
          <div slot="footer" style="overflow: hidden;">
            <el-button @click="dialogVisibleSXF = false">取 消</el-button>
            <el-button type="primary" @click="chargeSubmit()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-drawer>
  </div>
</template>

<script type="text/javascript">
  import moment from "moment";

  export default {
    name: "recognitionDo",
    props: {
      dialogVisibleDo: false,
      msg: ""
    },
    data () {
      return {
        canClick: false,
        baseInfo: {}, // 基础信息
        fileList: [], // 基础信息，凭证信息
        collectionType: "", // 认款订单类型（同业，直客，内部收款）
        tableDataOrder: [], // 订单table
        tabPosition: "top", // tab位置
        activeName: "bankZH", // 当前选中tab
        tableDataZH: [], // 中行table(当前页数，每页条数，总条数)
        pageCurrentZH: 1,
        pageSizeZH: 10,
        totalZH: 0,
        ruleFormZH: {
          // 中行搜索项
          dateStart: "",
          name: "",
          moneyMin: "",
          moneyMax: ""
        },
        tableDataNY: [], //  农业银行的table
        pageCurrentNY: 1,
        pageSizeNY: 10,
        totalNY: 0,
        ruleFormNY: {
          moneyMin: "",
          moneyMax: ""
        },
        tableDataJS: [], //  建设银行的table
        pageCurrentJS: 1,
        pageSizeJS: 10,
        totalJS: 0,
        ruleFormJS: {
          moneyMin: "",
          moneyMax: ""
        },
        tableDataZS: [], //  招商银行的table
        pageCurrentZS: 1,
        pageSizeZS: 10,
        totalZS: 0,
        ruleFormZS: {
          moneyMin: "",
          moneyMax: ""
        },
        tableDataXY: [], // 兴业银行table(当前页数，每页条数，总条数)
        pageCurrentXY: 1,
        pageSizeXY: 10,
        totalXY: 0,
        ruleFormXY: {
          // 兴业银行搜索项
          moneyMin: "",
          moneyMax: ""
        },
        tableDataMX: [], // 微信支付宝明细table(当前页数，每页条数，总条数)
        pageCurrentMX: 1,
        pageSizeMX: 10,
        totalMX: 0,
        isShow: false, // 微信支付宝明细显示隐藏
        // 设置手续费弹框
        dialogVisibleSXF: false,
        service_charge: "",
        rowMsg: [],
        rowType: "",
        noEdit: true,
        keepRow: null
      };
    },
    watch: {
      dialogVisibleDo: {
        handler: function() {
          if (this.msg === "") {
            this.closeAdd();
          } else {
            this.baseInfo = this.msg.baseInfo;
            let tableDataOrder = [];
            tableDataOrder[0] = this.msg.tableDataOrder;
            this.tableDataOrder = tableDataOrder;
            this.collectionType = this.msg.collectionType;
            this.fileList = this.msg.fileList;
            this.loadDataZH();
            this.loadDataXY();
            this.loadDataNY();
            this.loadDataZS();
            this.loadDataJS();
            this.isShow = false;
            this.canClick = false;
            this.activeName = "bankZH";
          }
        }
      }
    },
    methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return "background:#F7F7F7;color:rgb(85, 85, 85);";
        } else {
          return "";
        }
      },
      closeAdd () {
        this.$emit("close", "success");
      },
      payDetail (row) {
        this.keepRow = row
        this.isShow = true;
        this.loadDataMX(row);
        this.activeName = "bankMX";
      },
      chooseRecognition (row, type) {
        if (row.surplus_Amount < this.tableDataOrder[0].matchingPrice) {
          if (this.collectionType !== 6) {
            if (type === 2) {
              this.$message.warning("不能进行选择，剩余金额不足~");
            } else {
              this.dialogVisibleSXF = true;
              this.rowMsg = row;
              this.rowType = type;
              this.service_charge = Math.abs(
                this.tableDataOrder[0].matchingPrice - row.surplus_Amount
              );
              this.service_charge = this.service_charge.toFixed(2);
            }
          } else {
            this.$message.warning("不能进行选择，剩余金额不足~");
          }
        } else {
          this.canClick = true;
          const dateStr = JSON.stringify({
            row: row,
            type: type,
            hasCharge: false
          });
          localStorage.setItem(this.tableDataOrder[0].id, dateStr);
          this.closeAdd("success");
        }
      },
      commitAxios (row, type) {
        let _this = this;
        this.$http.post(this.GLOBAL.serverSrc + "/finance/CollectionBank/api/insert", {
          object: {
            arrID: _this.tableDataOrder[0].id,
            price: _this.tableDataOrder[0].matchingPrice,
            bangID: row.id,
            type: type
          }
        })
        .then(res => {
          if (res.data.isSuccess) {
            _this.getColl();
          } else {
            if (res.data.message) {
              _this.$message.warning(res.result.message);
            } else {
              _this.$message.warning("认款提交失败~");
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
      },
      // 认款接口 -- 将关联欠款的状态改成3(认款)
      getColl () {
        let _this = this;
        const date = this.getMoment();
        this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/getCollIDTG", {
          datetime: date,
          spname: sessionStorage.getItem("name"),
          spstate: "认款",
          spcontent: "",
          checktype: 3,
          id: _this.tableDataOrder[0].id,
          'SpCode': sessionStorage.getItem('userCode')
        })
        .then(res => {
          if (res.data.isSuccess) {
            _this.$message.success("认款提交成功~");
            _this.closeAdd();
          } else {
            if (res.data.message) {
              _this.$message.warning(res.data.message);
            } else {
              _this.$message.warning("认款提交失败~");
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
      },
      // 插入一条手续费
      chargeSubmit () {
        const dataStr = JSON.stringify({
          row: this.rowMsg,
          type: this.rowType,
          hasCharge: true,
          charge: this.service_charge
        });
        localStorage.setItem(this.tableDataOrder[0].id, dataStr);
        this.dialogVisibleSXF = false;
        this.closeAdd("success");
      },
      // 加载认款数据(中国银行) -- 当前页数减一查询，后台分页从零开始
      handleSizeChangeZH (val) {
        this.pageSizeZH = val;
        this.pageCurrentZH = 1;
        this.loadDataZH();
      },
      handleCurrentChangeZH (val) {
        this.pageCurrentZH = val;
        this.loadDataZH();
      },
      searchHandInsideZH () {
        this.pageCurrentZH = 1;
        this.loadDataZH();
      },
      emptyButtonInsideZH () {
        this.ruleFormZH = {
          dateStart: "",
          name: "",
          moneyMin: "",
          moneyMax: ""
        };
        this.pageCurrentZH = 1;
        this.loadDataZH();
      },
      loadDataZH () {
        let _this = this;
        let dateStart = 0;
        if (this.ruleFormZH.dateStart) {
          dateStart = moment(this.ruleFormZH.dateStart).format("YYYYMMDD");
        }
        this.$http.post(this.GLOBAL.serverSrc + "/finance/bankofchina/api/Search", {
          pageIndex: this.pageCurrentZH - 1,
          pageSize: this.pageSizeZH,
          object: {
            matching_State: 2,
            transaction_reference_number: "",
            begin: "1970-05-16",
            end: "2099-05-16",
            seachType: 0,
            import_State: 0,
            value_Date: dateStart ? dateStart : 0,
            payer_s_Name: this.ruleFormZH.name,
            trade_Amount1: this.ruleFormZH.moneyMin ? this.ruleFormZH.moneyMin : 0,
            trade_Amount2: this.ruleFormZH.moneyMax ? this.ruleFormZH.moneyMax : 0
          }
        })
        .then(res => {
          // console.log('中国银行',res);
          if (res.data.isSuccess) {
            _this.totalZH = res.data.total;
            _this.tableDataZH = res.data.objects;
          } else {
            _this.tableDataZH = [];
          }
        });
      },
      // 加载认款数据(兴业银行) -- 当前页数减一查询，后台分页从零开始
      handleSizeChangeXY (val) {
        this.pageSizeXY = val;
        this.pageCurrentXY = 1;
        this.loadDataXY();
      },
      handleCurrentChangeXY (val) {
        this.pageCurrentXY = val;
        this.loadDataXY();
      },
      // 搜索
      searchHandInsideXY () {
        this.pageCurrentXY = 1;
        this.loadDataXY();
      },
      // 重置
      emptyButtonInsideXY () {
        this.ruleFormXY = {
          moneyMin: "",
          moneyMax: ""
        };
        this.pageCurrentXY = 1;
        this.loadDataXY();
      },
      loadDataXY () {
        let _this = this;
        this.$http.post(this.GLOBAL.serverSrc + "/finance/industrialbank/api/Search", {
          pageIndex: this.pageCurrentXY - 1,
          pageSize: this.pageSizeXY,
          object: {
            matching_State: 2,
            transaction_reference_number: "",
            begin: "1970-01-11",
            end: "2099-05-16",
            seachType: 0,
            import_State: 0,
            credit_amount1: this.ruleFormXY.moneyMin ? this.ruleFormXY.moneyMin : 0,
            credit_amount2: this.ruleFormXY.moneyMax ? this.ruleFormXY.moneyMax : 0
          }
        })
        .then(res => {
          // console.log('兴业银行',res);
          if (res.data.isSuccess) {
            _this.totalXY = res.data.total;
            _this.tableDataXY = res.data.objects;
          } else {
            _this.totalXY = 0;
            _this.tableDataXY = [];
          }
        });
      },
      // 农业
      handleSizeChangeNY (val) {
        this.pageSizeNY = val;
        this.pageCurrentNY = 1;
        this.loadDataNY();
      },
      handleCurrentChangeNY (val) {
        this.pageCurrentNY = val;
        this.loadDataNY();
      },
      // 搜索
      searchHandInsideNY () {
        this.pageCurrentNY = 1;
        this.loadDataNY();
      },
      // 重置
      emptyButtonInsideNY () {
        this.ruleFormNY = {
          moneyMin: "",
          moneyMax: ""
        };
        this.pageCurrentNY = 1;
        this.loadDataNY();
      },
      loadDataNY () {
        let _this = this;
        this.$http.post(this.GLOBAL.serverSrc + "/finance/ABCBank/api/Search", {
          pageIndex: this.pageCurrentNY - 1,
          pageSize: this.pageSizeNY,
          object: {
            matching_State: 2,
            transaction_reference_number: "",
            begin: "1970-01-11",
            end: "2099-05-16",
            seachType: 0,
            import_State: 0,
            credit_amount1: this.ruleFormNY.moneyMin ? this.ruleFormNY.moneyMin : 0,
            credit_amount2: this.ruleFormNY.moneyMax ? this.ruleFormNY.moneyMax : 0
          }
        })
        .then(res => {
          if (res.data.isSuccess) {
            _this.totalNY = res.data.total;
            _this.tableDataNY = res.data.objects;
          } else {
            _this.totalXY = 0;
            _this.tableDataNY = [];
          }
        });
      },
      // 建行
      handleSizeChangeJS (val) {
        this.pageSizeJS = val;
        this.pageCurrentJS = 1;
        this.loadDataJS();
      },
      handleCurrentChangeJS (val) {
        this.pageCurrentJS = val;
        this.loadDataJS();
      },
      // 搜索
      searchHandInsideJS () {
        this.pageCurrentJS = 1;
        this.loadDataJS();
      },
      // 重置
      emptyButtonInsideJS () {
        this.ruleFormJS = {
          moneyMin: "",
          moneyMax: ""
        };
        this.pageCurrentJS = 1;
        this.loadDataJS();
      },
      loadDataJS () {
        let _this = this;
        let company=sessionStorage.getItem('topName')
        let topID=parseInt(sessionStorage.getItem('topID'))
        this.$http.post(this.GLOBAL.serverSrc + "/finance/chinamerchantsbank/api/search",
          {
            pageIndex: this.pageCurrentJS - 1,
            pageSize: this.pageSizeJS,
            object: {
              matching_State: 0,
              transaction_reference_number: '',
              begin: "2000-05-16",
              end: "2099-05-16",
              seachType: 0,
              userid: 0,// data4D.userID, // 暂无数据 想看改成0,
              orgid:0,// data4D.orgID, // 暂无数据 想看改成0,
              topid: topID, // 暂无数据 想看改成0,
              company: company,
            }
          })
          .then(function(obj) {
            if (obj.data.isSuccess) {
              _this.totalJS = obj.data.total;
              _this.tableDataJS = obj.data.objects;

            } else {
              _this.totalJS = 0;
              _this.tableDataJS = [];
            }
          });
      },
      // 招商
      handleSizeChangeZS (val) {
        this.pageSizeZS = val;
        this.pageCurrentZS = 1;
        this.loadDataZS();
      },
      handleCurrentChangeZS (val) {
        this.pageCurrentZS = val;
        this.loadDataZS();
      },
      // 搜索
      searchHandInsideZS () {
        this.pageCurrentZS = 1;
        this.loadDataZS();
      },
      // 重置
      emptyButtonInsideZS () {
        this.ruleFormZS = {
          moneyMin: "",
          moneyMax: ""
        };
        this.pageCurrentZS = 1;
        this.loadDataZS();
      },
      loadDataZS () {
        let _this = this;
        let company=sessionStorage.getItem('topName')
        let topID=parseInt(sessionStorage.getItem('topID'))
        this.$http.post(this.GLOBAL.serverSrc + "/finance/chinaconstbank/api/search", {
          "pageIndex": this.pageCurrentZS- 1,
          "pageSize": this.pageSizeZS,
          "object": {
            "matching_State": 0,
            "transaction_reference_number": '',
            "begin": "2000-05-16",
            "end": "2099-05-16",
            "seachType": 0,
            "userid": 0,
            "orgid":0,
            "topid": topID, // 暂无数据 想看改成0,
            "company": company,
          }
        }).then(function (obj) {
          if(obj.data.isSuccess){
            _this.totalZS = obj.data.total;
            _this.tableDataZS = obj.data.objects;
          }
        })
      },
      // 加载认款数据(微信支付宝明细)
      handleSizeChangeMX (val) {
        this.pageSizeMX = val;
        this.pageCurrentMX = 1;
        this.loadDataMX();
      },
      handleCurrentChangeMX (val) {
        this.pageCurrentMX = val;
        this.loadDataMX();
      },
      loadDataMX () {
        let _this = this;
        this.$http.post(this.GLOBAL.serverSrc + "/finance/wa_payment/api/Search", {
          pageIndex: this.pageCurrentMX,
          pageSize: this.pageSizeMX,
          object: {
            purpose_Merchant_code: this.keepRow.purpose_Merchant_code,
            purpose_Date: this.keepRow.purpose_Date
          }
        })
        .then(res => {
          // console.log("微信支付宝明细", res);
          if (res.data.isSuccess) {
            _this.totalMX = res.data.total;
            _this.tableDataMX = res.data.objects;
          } else {
            _this.totalMX = 0;
            _this.tableDataMX = [];
          }
        });
      },
      submitFun () {},
      // 获取当前年月日 string
      getMoment () {
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString();
        const day = now.getDate().toString();
        return year + month + day;
      }
    },
  };
</script>

<style lang="scss">
  .el-drawer{
    overflow-y: auto !important;
  }
  .el-divider__text{
    font-size: 16px !important;
  }
</style>

<style lang="scss" scoped>
  .el-drawer-content{
    width: 96%;
    margin: 0 auto;
  }
  .mb-40{
    margin-bottom: 40px;
  }
.recognitionCls {
  .title-margin{
    margin-top: 50px;
  }
  .topMsg {
    width: 94%;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    .inputLabel {
      width: 33.33%;
      font-size: 14px;
      span{
        color: #909399;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: inline-block;
      }
    }
  }
  .recognition {
    margin: 20px auto;
    .block {
      text-align: center;
      margin: 10px auto;
    }
  }
}
.form-content {
  background-color: #f7f7f7;
  padding: 20px 10px 0;
  margin-bottom: 10px;
  .line {
    text-align: center;
  }
}
.footer {
  text-align: right;
  overflow: hidden;
}
</style>
