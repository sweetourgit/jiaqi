<template>
  <div class="supplierArrearsClass">
    <span class="supplierName">{{this.supplierCurrentRow.supplierName}}</span>
    <el-button class="close" plain @click="$emit('closeSupplier', false)">关闭</el-button>
    <div class="league-span"><span>团期信息</span></div>
    <div class="search_dom">
      <span class="keyword">团期信息</span>
      <el-input class="search_input" clearable v-model="leagueList" placeholder="请输入供应商"></el-input>
      <el-button class="search_button" type="primary">重置</el-button>
    </div>
    <el-button plain style="width: 85px;" v-if="leagueCurrentRow == ''" disabled class="see_button">查看</el-button>
    <el-button plain style="width: 85px;border:1px solid #3095fa;color:#3095fa;" v-else class="see_button" @click="handelList">查看</el-button>

    <!-- 供应商欠款表格 -->
    <el-table
      :data="supplierTable"
      class="supplier-table"
      border
      highlight-current-row
      @current-change="handleChange"
      :headerRowStyle="tableHead" :cellStyle="tableHeight" :header-cell-style="getRowClass">
      <el-table-column prop="league" label="团期" header-align="center" min-width="180"></el-table-column>
      <el-table-column prop="total" label="总欠款" header-align="center"></el-table-column>
      <el-table-column prop="orderTotal" label="订单总额" header-align="center"></el-table-column>
      <el-table-column prop="approvedTotal" label="已审批总额" header-align="center"></el-table-column>
      <el-table-column prop="approvalTotal" label="审批中总额" header-align="center"></el-table-column>
      <el-table-column prop="incomeTotal" label="已收入总额" header-align="center"></el-table-column>
      <el-table-column prop="arrearsTotal" label="供应商欠款总额" header-align="center"></el-table-column>
    </el-table>
    <!-- 供应商欠款表格END -->


    <!-- 无收入借款和预付款信息 -->
    <el-dialog width='1200px' append-to-body top='10vh' title="" :visible.sync="dialogPaymentVisible" :show-close="false">
      <div>
        <el-button class="closePayment" plain @click="dialogPaymentVisible = false">关闭</el-button>
        <div class="league-div"><span>无收入借款和预付款信息</span></div>
        <el-button plain style="width: 85px;" v-if="currentRowPayment == ''" disabled class="see_button">查看</el-button>
        <el-button plain style="width: 85px;border:1px solid #3095fa;color:#3095fa;" v-else class="see_button" @click="handePaymentlList">查看</el-button>

        <el-table
          :data="paymentTable"
          class="payment-table"
          border
          highlight-current-row
          @current-change="handlePaymentChange"
          :headerRowStyle="tableHead" :cellStyle="tableHeight" :header-cell-style="getRowClass">
          <el-table-column prop="id" label="关联单号" header-align="center" min-width="60"></el-table-column>
          <el-table-column prop="launchDate" label="发起时间" header-align="center"></el-table-column>
          <el-table-column prop="supplierName" label="供应商名称" header-align="center"></el-table-column>
          <el-table-column prop="type" label="类型" header-align="center"></el-table-column>
          <el-table-column prop="money" label="金额" header-align="center"></el-table-column>
          <el-table-column prop="apple" label="申请组织" header-align="center"></el-table-column>
          <el-table-column prop="applePeople" label="申请人" header-align="center"></el-table-column>
        </el-table>

      </div>
    </el-dialog>
    <!-- 无收入借款和预付款信息END -->

    <!-- 借款和付款信息 -->
    <el-dialog width='1200px' append-to-body top='10vh' title="借款和付款信息" :visible.sync="dialogLoanVisible" :show-close="false">
      <div>
        <el-button class="closeLoan" plain @click="dialogLoanVisible = false">关闭</el-button>
        
        <!-- 借款人信息 -->
        <el-form class="form-list" ref="form" label-position="left" :model="loanPeopleForm" :label-width="formLabelWidth">
          <el-form-item class="form-item" :label-width='formLabelWidth' label="借款人">
            <span class="redStar">*</span>
            <div class="destination-input">
              <el-tag type="info" style="float: left; margin: 4px 4px 0 4px;" :key="index" v-for="(tag, index) in loanPeopleForm.loanPeople"  :disable-transitions="false">
                {{tag.name}}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item class="form-item" :label-width='formLabelWidth' label="团期计划">
            <span class="redStar">*</span>
            <el-input class="form-input" v-model="loanPeopleForm.leagueLeft" disabled></el-input>
            <el-input style="margin-left: 20px;" class="form-input" v-model="loanPeopleForm.leagueright" disabled></el-input>
          </el-form-item>
          <el-form-item class="form-item" :label-width='formLabelWidth' label="供应商">
            <el-input class="form-input" v-model="loanPeopleForm.supplierName" disabled></el-input>
          </el-form-item>
          <el-form-item class="form-item" :label-width='formLabelWidth' label="类型">
            <span class="redStar">*</span>
            <el-select class="form-input" v-model="loanPeopleForm.type" disabled></el-select>
          </el-form-item>
          <el-form-item class="form-item" :label-width='formLabelWidth' label="借款金额">
            <span class="redStar">*</span>
            <el-input class="form-input" v-model="loanPeopleForm.loanMoney" disabled></el-input>
          </el-form-item>
          <el-form-item class="form-item" :label-width='formLabelWidth' label="摘要">
            <span class="redStar">*</span>
            <el-input class="form-abstract" v-model="loanPeopleForm.abstract" disabled></el-input>
          </el-form-item>
          <el-form-item class="form-item" :label-width='formLabelWidth' label="账号">
            <span class="redStar">*</span>
            <el-input class="form-input" v-model="loanPeopleForm.account" disabled></el-input>
          </el-form-item>
          <el-form-item class="form-item" :label-width='formLabelWidth' label="开户行">
            <span class="redStar">*</span>
            <el-input class="form-input" v-model="loanPeopleForm.openBank" disabled></el-input>
          </el-form-item>
          <el-form-item class="form-item" :label-width='formLabelWidth' label="开户名">
            <span class="redStar">*</span>
            <el-input class="form-input" v-model="loanPeopleForm.openName" disabled></el-input>
          </el-form-item>
          <el-form-item class="form-item" :label-width='formLabelWidth' label="付款方式">
            <span class="redStar">*</span>
            <el-select class="form-input" v-model="loanPeopleForm.payment" disabled></el-select>
          </el-form-item>
          <el-form-item class="enclosure" :label-width='formLabelWidth' label="附件">
            <div class="form-enclosure">
              <span>123.bmp</span>
            </div>
            <div class="form-enclosure">
              <span>123.bmp</span>
            </div>
          </el-form-item>
        </el-form>
        <!-- 借款人信息END -->

        <!-- 审批流程 -->
        <div class="prePayment">
          <span>审批流程</span>
          <el-table
            :data="approvalTable"
            class="approval-table"
            border
            :headerRowStyle="tableHead" :cellStyle="tableHeight" :header-cell-style="getRowClass">
            <el-table-column prop="approvalPeople" label="审批人" header-align="center" min-width="50"></el-table-column>
            <el-table-column prop="approvalResult" label="审批结果" header-align="center"></el-table-column>
            <el-table-column prop="approvalOpinion" label="审批意见" header-align="center"></el-table-column>
            <el-table-column prop="approvalDate" label="审批时间" header-align="center"></el-table-column>
          </el-table>
        </div>
        <!-- 审批流程END -->

      </div>
    </el-dialog>
    <!-- 借款和付款信息END -->


  </div>
</template>

<script>
export default {
  name: "supplierArrearsList",
  props: ['supplierCurrentRow'],
  data() {
    return {
      formLabelWidth: '90px',
      tableHead:{height: '40px', color: '#808080'},
      tableHeight:{padding: '0', height: '40px'},
      leagueList: '', // 团期信息搜索
      leagueCurrentRow: '', // 供应商欠款表格选中的值
      dialogPaymentVisible: false, // 无收入借款和预付款信息弹窗
      dialogLoanVisible: false,    // 借款和欠款信息
      currentRowPayment: '', // 无收入借款和预付款信息表格选中的值
      // 供应商欠款表格
      supplierTable: [{
        league: 'TC-GTY-1001-01-180806-01', // 团期
        total: '20000.00',                  // 总欠款
        orderTotal: '20000.00',             // 订单总额
        approvedTotal: '5000.00',           // 已审批总额
        approvalTotal: '0.00',              // 审批中总额
        incomeTotal: '20000.00',            // 已收入总额
        arrearsTotal: '0.00'                // 供应商欠款总额
      },{
        league: 'TC-GTY-1001-01-180806-01', // 团期
        total: '20000.00',                  // 总欠款
        orderTotal: '20000.00',             // 订单总额
        approvedTotal: '5000.00',           // 已审批总额
        approvalTotal: '0.00',              // 审批中总额
        incomeTotal: '20000.00',            // 已收入总额
        arrearsTotal: '0.00'                // 供应商欠款总额
      }],
      // 无收入借款和预付款信息表格
      paymentTable: [{
        id: '1', // id
        launchDate: '2019-01-09 09:37', // 发起时间
        supplierName: '国旅',           // 供应商名称
        type: '签证',                   // 类型
        money: '17800.00',              // 金额
        apple: '辽宁大运通-国内部',      // 申请组织
        applePeople: '央鸯',                // 申请人
      },{
        id: '1', // id
        launchDate: '2019-01-09 09:37', // 发起时间
        supplierName: '国旅',           // 供应商名称
        type: '签证',                   // 类型
        money: '17800.00',              // 金额
        apple: '辽宁大运通-国内部',      // 申请组织
        applePeople: '央鸯',                // 申请人
      }],
      // 审批流程
      approvalTable: [{
        approvalPeople: '央鸯', // 审批人
        approvalResult: '结果', // 审批结果
        approvalOpinion: '意见', // 审批意见
        approvalDate: '审批时间', // 审批时间
      }],
      // 借款人信息
      loanPeopleForm: {
        loanPeople: [{         // 借款人
          id: 1,
          name: '大运通-日本部'
        },{
          id: 2,
          name: '央鸯'
        }],
        leagueLeft: 'TC-GTY-1001-01-180806-01',  // 团期计划左
        leagueright: '13025-雪域云端 5 日定制游', // 团期计划右
        supplierName: '国旅',    // 供应商
        type: '地接',            // 类型
        loanMoney: '10000.00',   // 借款金额
        abstract: '地接款',      // 摘要
        account: '1234 1234 1234', // 账号
        openBank: '建行',        // 开户行
        openName: '央鸯',        // 开户名
        payment: '网银'          // 付款方式
      },

    }
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7'
      } else {
        return ''
      }
    },
    // 供应商欠款表格选中触发的事件
    handleChange(val) {
      if (val) this.leagueCurrentRow = val;
    },
    // 无收入借款和预付款表格选中触发的事件
    handlePaymentChange(val) {
      if (val) this.currentRowPayment = val;
    },
    // 查看供应商欠款关联数据
    handelList() {
      this.dialogPaymentVisible = true;
    },
    // 查看借款和付款信息
    handePaymentlList() {
      this.dialogLoanVisible = true;
    }

  }
  
}
</script>

<style scoped>
.close {
  float: right;
  width: 100px;
  margin-top: -65px;
}
.supplierName {
  float: left;
  position: relative;
  top: -48px;
  left: 145px;
  color: #999999;
}
.league-span {
  border-left: solid 2px #666666;
  height: 15px;
  margin-top: -10px;
}
.league-span span {
  position: relative;
  left: 6px;
}
.search_dom {
  margin: 20px 0 0 8px;
}
.search_input {
  width: 220px;
  margin-left: 20px;
}
.search_button {
  margin-left: 30px;
  width: 85px;
}
.see_button {
  margin: 40px 0 0 10px;
}
.supplier-table {
  text-align: center;
  margin: 20px 0 0 10px;
  width: 1000px;
}
.closePayment {
  float: right;
  width: 100px;
  margin-top: -38px;
}
.closeLoan {
  float: right;
  width: 100px;
  margin-top: -70px;
}
.league-div {
  border-left: solid 2px #666666;
  height: 15px;
  margin-top: -10px;
}
.league-div span {
  position: relative;
  left: 5px;
  top: -2px;
}
.payment-table {
  text-align: center;
  margin: 20px 0 0 10px;
  width: 1000px;
}
.form-list {
  margin-left: 20px;
}
.redStar{ color: #f56c6c; float: left; margin-left:-98px;}
.form-input {
  float: left;
  width: 250px;
}
.destination-input {
  height: 40px;
  min-width: 250px;
  float: left;
  padding-bottom:-0.5px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.form-abstract {
  float: left;
  width: 520px;
}
.form-abstract {
  float: left;
  width: 520px;
}
.enclosure :not(:first-of-type){
  margin-top: 30px;
}
.form-enclosure {
  width: 250px;
  height: 40px;
  border: 1px solid #dcdfe6;
  background: #F5F7FA;
}
.form-enclosure span {
  padding: 10px;
}
.prePayment {
  margin: 50px 0 0 20px;
}
.approval-table {
  text-align: center;
  margin-top: 20px;
  width: 700px;
}
</style>

