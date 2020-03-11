<template>
  <div class="distributor-content">
    <div class="buttonsDv">
      <el-button @click="submitBtn" type="primary" :disabled="clickable">确认</el-button>
      <el-button @click="closeBtn" type="primary" plain>取消</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="中国银行" name="first">
        <el-table :data="tableData1" ref="multipleTable1" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content1" @row-click="handleRowClick1" @selection-change="selectionChange1">
          <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInit">
          </el-table-column>
          <el-table-column prop="id" label="明细ID" align="center">
          </el-table-column>
          <el-table-column prop="surplus_Amount" label="剩余金额" align="center">
          </el-table-column>
          <el-table-column prop="id" label="暂存款状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.is_ZCK == 0">未设置</span>
              <span v-if="scope.row.is_ZCK == 1">已设置</span>
            </template>
          </el-table-column>
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
        <div class="block">
          <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page.sync="pageCurrent1" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize1" layout="total, sizes, prev, pager, next, jumper" :total='total1'>
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="兴业银行" name="second">
        <el-table :data="tableData2" ref="multipleTable2" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content2" @row-click="handleRowClick2" @selection-change="selectionChange2">
          <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInit">
          </el-table-column>
          <el-table-column prop="surplus_Amount" label="剩余金额" align="center">
          </el-table-column>
          <el-table-column prop="id" label="暂存款状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.is_ZCK == 0">未设置</span>
              <span v-if="scope.row.is_ZCK == 1">已设置</span>
            </template>
          </el-table-column>
          <el-table-column prop="purpose_fee" label="手续费" align="center">
          </el-table-column>
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
        <div class="block">
          <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page.sync="pageCurrent2" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total='total2'>
          </el-pagination>
        </div>
      </el-tab-pane>
      <!-- ++++++农业银行+++++++ -->
       <el-tab-pane label="农业银行" name="third">
        <el-table :data="tableData2" ref="multipleTable2" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content2" @row-click="handleRowClick2" @selection-change="selectionChange2">
          <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInit">
          </el-table-column>
          <el-table-column prop="surplus_Amount" label="剩余金额" align="center">
          </el-table-column>
          <el-table-column prop="id" label="暂存款状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.is_ZCK == 0">未设置</span>
              <span v-if="scope.row.is_ZCK == 1">已设置</span>
            </template>
          </el-table-column>
          <el-table-column prop="bank_serial_number" label="银行流水号" align="center">
          </el-table-column>
          <el-table-column prop="transaction_Date" label="交易时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.transaction_Date.split('T')[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="purpose" label="收入金额" align="center">
          </el-table-column>
          <el-table-column prop="credit_amount" label="支出金额" align="center">
          </el-table-column>
          <el-table-column prop="account_number" label="账户余额" align="center">
          </el-table-column>
          <el-table-column prop="account_name" label="交易行名" align="center">
          </el-table-column>
          <el-table-column prop="certificate_code" label="对方省市" align="center">
          </el-table-column>
          <el-table-column prop="currency" label="对方账号" align="center">
          </el-table-column>
          <el-table-column prop="cash_or_transfer" label="对方户名" align="center">
          </el-table-column>
          <el-table-column prop="debit_amount" label="交易用途" align="center">
          </el-table-column>
          
        </el-table>
        <div class="block">
          <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page.sync="pageCurrent2" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total='total2'>
          </el-pagination>
        </div>
      </el-tab-pane>
       <!-- ++++++招商银行+++++++ -->
          <el-tab-pane label="招商银行" name="forth">
        <el-table :data="tableData2" ref="multipleTable2" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content2" @row-click="handleRowClick2" @selection-change="selectionChange2">
          <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInit">
          </el-table-column>
          <el-table-column prop="surplus_Amount" label="剩余金额" align="center">
          </el-table-column>
          <el-table-column prop="id" label="暂存款状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.is_ZCK == 0">未设置</span>
              <span v-if="scope.row.is_ZCK == 1">已设置</span>
            </template>
          </el-table-column>
         <el-table-column prop="" label="交易流水号" align="center">
      </el-table-column>
       <el-table-column prop="" label="交易日" align="center">
      </el-table-column>
      <el-table-column prop="" label="交易时间" align="center">
      </el-table-column>
       <el-table-column prop="" label="起息日" align="center">
      </el-table-column>
       <el-table-column prop="" label="交易类型" align="center">
      </el-table-column>
       <el-table-column prop="" label="借方金额" align="center">
      </el-table-column>
       <el-table-column prop="" label="贷方金额" align="center">
      </el-table-column>
       <el-table-column prop="" label="余额" align="center">
      </el-table-column>
       <el-table-column prop="" label="用途" align="center">
      </el-table-column>
        <el-table-column prop="" label="流程实例号" align="center">
      </el-table-column>
      <el-table-column prop="" label="业务名称" align="center">
      </el-table-column>
      <el-table-column prop="" label="业务参考号" align="center">
      </el-table-column>
      <el-table-column prop="" label="业务摘要" align="center">
      </el-table-column>
      <el-table-column prop="" label="其他摘要" align="center">
      </el-table-column>
      <el-table-column prop="" label="收(付)方分行名" align="center">
      </el-table-column>
      <el-table-column prop="" label="收(付)方名称" align="center">
      </el-table-column>
      <el-table-column prop="" label="收(付)方账号" align="center">
      </el-table-column>
      <el-table-column prop="" label="收(付)方开户行行号" align="center">
      </el-table-column>
      <el-table-column prop="" label="收(付)方开户行名" align="center">
      </el-table-column>
       <el-table-column prop="" label="收(付)方开户行地址" align="center">
      </el-table-column>
      <el-table-column prop="" label="收(付)母(子)公司账号分行名" align="center">
      </el-table-column>
      <el-table-column prop="" label="母(子)公司账号" align="center">
      </el-table-column>
      <el-table-column prop="" label="母(子)公司名称" align="center">
      </el-table-column>
      <el-table-column prop="" label="信息标志" align="center">
      </el-table-column>
      <el-table-column prop="" label="有否附件信息" align="center">
      </el-table-column>
      <el-table-column prop="" label="冲账标志" align="center">
      </el-table-column>
      <el-table-column prop="" label="扩展摘要" align="center">
      </el-table-column>
      <el-table-column prop="" label="交易分析码" align="center">
      </el-table-column>
      <el-table-column prop="" label="票据号" align="center">
      </el-table-column>
      <el-table-column prop="" label="商务支付订单号" align="center">
      </el-table-column>
       <el-table-column prop="" label="内部编号" align="center">
      </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page.sync="pageCurrent2" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total='total2'>
          </el-pagination>
        </div>
      </el-tab-pane>
      <!-- ++++++建设银行+++++++ -->
          <el-tab-pane label="建设银行" name="fifth">
        <el-table :data="tableData2" ref="multipleTable2" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content2" @row-click="handleRowClick2" @selection-change="selectionChange2">
          <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInit">
          </el-table-column>
          <el-table-column prop="surplus_Amount" label="剩余金额" align="center">
      </el-table-column>
      <el-table-column prop="is_ZCK" label="暂存款状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.is_ZCK == 0">未设置</span>
          <span v-if="scope.row.is_ZCK == 1">已设置</span>
        </template>
      </el-table-column>
      <el-table-column prop="purpose_fee" label="交易时间" align="center">
      </el-table-column>
      <el-table-column prop="bank_serial_number" label="借方发生额/元(支取)" align="center">
      </el-table-column>
      <el-table-column prop="reference" label="贷方发生额/元(收入)" align="center">
      </el-table-column>
      <el-table-column prop="transaction_Date" label="余额" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.transaction_Date.split('T')[0]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transaction_Date" label="币种" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.transaction_Date.split('T')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purpose" label="对方户名" align="center">
      </el-table-column>
      <el-table-column prop="credit_amount" label="对方账号" align="center">
      </el-table-column>
      <el-table-column prop="account_number" label="对方开户机构" align="center">
      </el-table-column>
      <el-table-column prop="account_name" label="记账日期" align="center">
      </el-table-column>
      <el-table-column prop="certificate_code" label="摘要" align="center">
      </el-table-column>
      <el-table-column prop="currency" label="备注" align="center">
      </el-table-column>
      <el-table-column prop="cash_or_transfer" label="账户明细编号-交易流水号" align="center">
      </el-table-column>
      <el-table-column prop="debit_amount" label="企业流水号" align="center">
      </el-table-column>
      <el-table-column prop="account_number_other" label="凭证种类" align="center">
      </el-table-column>
      <el-table-column prop="account_name_other" label="凭证号" align="center">
      </el-table-column>
      <el-table-column prop="bank_other" label="剩余金额" align="center">
      </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page.sync="pageCurrent2" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total='total2'>
          </el-pagination>
        </div>
      </el-tab-pane>
         <!-- ++++++中信银行+++++++ -->
             <el-tab-pane label="中信银行" name="sixth">
        <el-table :data="tableData2" ref="multipleTable2" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content2" @row-click="handleRowClick2" @selection-change="selectionChange2">
          <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInit">
          </el-table-column>
      <el-table-column prop="surplus_Amount" label="剩余金额" align="center">
      </el-table-column>
      <el-table-column prop="is_ZCK" label="暂存款状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.is_ZCK == 0">未设置</span>
          <span v-if="scope.row.is_ZCK == 1">已设置</span>
        </template>
      </el-table-column>
      <el-table-column prop="purpose_fee" label="交易日期" align="center">
      </el-table-column>
      <el-table-column prop="bank_serial_number" label="交易时间" align="center">
      </el-table-column>
      <el-table-column prop="reference" label="对方账号" align="center">
      </el-table-column>
      <el-table-column prop="transaction_Date" label="对方账户名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.transaction_Date.split('T')[0]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transaction_Date" label="对方账号开户网点名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.transaction_Date.split('T')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purpose" label="借方发生额" align="center">
      </el-table-column>
      <el-table-column prop="credit_amount" label="贷方发生额" align="center">
      </el-table-column>
      <el-table-column prop="account_number" label="账户余额" align="center">
      </el-table-column>
      <el-table-column prop="account_name" label="摘要" align="center">
      </el-table-column>
      <el-table-column prop="certificate_code" label="退汇标识" align="center">
      </el-table-column>
      <el-table-column prop="currency" label="退汇日期" align="center">
      </el-table-column>
      <el-table-column prop="cash_or_transfer" label="柜员交易号" align="center">
      </el-table-column>
      <el-table-column prop="debit_amount" label="附言" align="center">
      </el-table-column>
      <el-table-column prop="account_number_other" label="币种" align="center">
      </el-table-column>
      <el-table-column prop="account_name_other" label="交易账号" align="center">
      </el-table-column>
      <el-table-column prop="bank_other" label="交易账号开户网点名称" align="center">
      </el-table-column>
      <el-table-column prop="bank_other" label="对账编号" align="center">
      </el-table-column>
      <el-table-column prop="bank_other" label="单位结算卡号" align="center">
      </el-table-column>
      <el-table-column prop="bank_other" label="剩余金额" align="center">
      </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page.sync="pageCurrent2" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total='total2'>
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">

export default {
  components: {
  },
  data() {
    return {
      activeName: 'first',
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
      multipleSelection2: []
    }
  },
  created () {
    this.loadData1();
    this.loadData2();
    this.activeName = this.$route.query.searchType;
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    handleClick(tab, event){
      if(tab.name == 'first'){
        if(this.multipleSelection1.length > 0){
          this.clickable = false;
        }else{
          this.clickable = true;
        }
      }else if(tab.name == 'second'){
        if(this.multipleSelection2.length > 0){
          this.clickable = false;
        }else{
          this.clickable = true;
        }
      }
    },
    selectInit(row){
      if(row.is_ZCK == 1){
        return false  //不可勾选
      }else{
        return true  //可勾选
      }
    },

    // 整行点击 -- 中国银行
    handleRowClick1(row, column, event){
      if(row.is_ZCK == 0){
        this.$refs.multipleTable1.toggleRowSelection(row);
      }
    },
    // 选择项更改
    selectionChange1(val) {
      // console.log(val);
      if(val.length > 0 && this.activeName == 'first'){
        this.clickable = false;
      }else{
        this.clickable = true;
      }
      this.multipleSelection1 = val;
    },

    // 整行点击 -- 兴业银行
    handleRowClick2(row, column, event){
      if(row.is_ZCK == 0){
        this.$refs.multipleTable2.toggleRowSelection(row);
      }
    },
    // 选择项更改
    selectionChange2(val) {
      // console.log(val);
      if(val.length > 0 && this.activeName == 'second'){
        this.clickable = false;
      }else{
        this.clickable = true;
      }
      this.multipleSelection2 = val;
    },

    
    // 关闭当前页面
    closeBtn(){
      this.$router.push({
        path: '/bankStatement',
        name: '银行流水单管理',
        params: {
          tabStatus: this.$route.query.searchType
        }
      });
    },
    // 提交暂存款选择项
    submitBtn(){
      const that = this;
      let idsArr = [];
      if(this.activeName == 'first'){ // 中国银行暂存款提交
        this.multipleSelection1.forEach(function(item, index, arr){
          idsArr.push(item.id);
        })
        this.$http.post(this.GLOBAL.serverSrc + "/finance/bankofchina/api/ChangeZCK_ImportEBS", {
          "ids": idsArr,
          "type": 0
        }).then(function(response) {
          // console.log(response)
          if (response.status == 200) {
            that.$message.success('提交暂存款成功！');
            that.loadData1();
          } else {
            if(response.statusText){
              that.$message.warning(response.data.statusText);
            }else{
              that.$message.warning("提交暂存款失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
          that.$message.warning("提交暂存款失败~");
        });
      }else if(this.activeName == 'second'){ // 兴业银行暂存款提交
        this.multipleSelection2.forEach(function(item, index, arr){
          idsArr.push(item.id);
        })
        this.$http.post(this.GLOBAL.serverSrc + "/finance/bankofchina/api/ChangeZCK_ImportEBS", {
          "ids": idsArr,
          "type": 1
        }).then(function(response) {
          // console.log(response)
          if (response.status == 200) {
            that.$message.success('提交暂存款成功！');
            that.loadData2();
          } else {
            if(response.statusText){
              that.$message.warning(response.data.statusText);
            }else{
              that.$message.warning("提交暂存款失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
          that.$message.warning("提交暂存款失败~");
        });
      }

      
    },
    
    handleSizeChange1(val){
      this.pageSize1 = val;
      this.pageCurrent1 = 1;
      this.loadData1();
    },
    handleCurrentChange1(val){
      this.pageCurrent1 = val;
      this.loadData1();
    },
    loadData1(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/bankofchina/api/Search", {
        "pageIndex": this.pageCurrent1 - 1,
        "pageSize": this.pageSize1,
        "object": {
          "matching_State": 0,
          "transaction_reference_number": '',
          "begin": "2000-05-16",
          "end": "2099-05-16",
          "seachType": 3,
        }
      }).then(function (obj) {
        // console.log('中国银行',obj);
        if(obj.data.isSuccess){
          that.total1 = obj.data.total;
          that.tableData1 = obj.data.objects;
        }else{
          that.total1 = 0;
          that.tableData1 = [];
        }
      })
    },

    handleSizeChange2(val){
      this.pageSize2 = val;
      this.pageCurrent1 = 2;
      this.loadData2();
    },
    handleCurrentChange2(val){
      this.pageCurrent2 = val;
      this.loadData2();
    },
    loadData2(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/industrialbank/api/Search", {
        "pageIndex": this.pageCurrent2 - 1,
        "pageSize": this.pageSize2,
        "object": {
          "matching_State": 0,
          "transaction_reference_number": '',
          "begin": "2000-05-16",
          "end": "2099-05-16",
          "seachType": 3
        }
      }).then(function (obj) {
        // console.log('兴业银行',obj);
        if(obj.data.isSuccess){
          that.total2 = obj.data.total;
          that.tableData2 = obj.data.objects;
        }else{
          that.total2 = 0;
          that.tableData2 = [];
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
    box-sizing: border-box;
    padding: 20px;
    .buttonsDv{
      width: 98%;
      margin-top: 10px;
      text-align: end;
    }
    .block{
      width: 100%;
      text-align: center;
      margin: 30px auto;
    }
  }

</style>
