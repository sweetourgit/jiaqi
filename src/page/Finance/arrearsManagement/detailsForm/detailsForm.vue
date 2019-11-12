<template>
  <div>
    <el-button class="close" plain @click="$emit('closeButton', false)">关闭</el-button>

    <!-- 申请人信息 -->
    <el-form v-if="isForm" class="form-list" ref="form" label-position="left" :model="applePeopleForm" :label-width="formLabelWidth">
      <el-form-item class="form-item" :label-width='formLabelWidth' label="申请人">
        <span class="redStar">*</span>
        <div class="destination-input">
          <el-tag type="info" style="float: left; margin: 4px 4px 0 4px;" :key="index" v-for="(tag, index) in applePeopleForm.applePeople"  :disable-transitions="false">
            {{tag.name}}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item class="form-item" :label-width='formLabelWidth' label="团期计划">
        <span class="redStar">*</span>
        <el-input class="form-input" v-model="applePeopleForm.leagueLeft" disabled></el-input>
        <el-input style="margin-left: 20px;" class="form-input" v-model="applePeopleForm.leagueright" disabled></el-input>
      </el-form-item>
      <el-form-item class="form-item" :label-width='formLabelWidth' label="供应商">
        <el-input class="form-input" v-model="applePeopleForm.supplierName" disabled></el-input>
      </el-form-item>
      <el-form-item class="form-item" :label-width='formLabelWidth' label="类型">
        <span class="redStar">*</span>
        <el-select class="form-input" v-model="applePeopleForm.type" disabled></el-select>
      </el-form-item>
      <el-form-item class="form-item" :label-width='formLabelWidth' label="付款金额">
        <span class="redStar">*</span>
        <el-input class="form-input" v-model="applePeopleForm.arrearsMoney" disabled></el-input>
      </el-form-item>
      <el-form-item class="form-item form-number" :label-width='formLabelWidth' label="人数">
        <span class="redStar">*</span>
        <el-input class="form-input-number" v-model="applePeopleForm.number" disabled></el-input>
      </el-form-item>
      <el-form-item class="form-item" :label-width='formLabelWidth' label="摘要">
        <span class="redStar">*</span>
        <el-input class="form-abstract" v-model="applePeopleForm.abstract" disabled></el-input>
      </el-form-item>
      <el-form-item class="form-item" :label-width='formLabelWidth' label="账号">
        <span class="redStar">*</span>
        <el-input class="form-input" v-model="applePeopleForm.account" disabled></el-input>
      </el-form-item>
      <el-form-item class="form-item" :label-width='formLabelWidth' label="开户行">
        <span class="redStar">*</span>
        <el-input class="form-input" v-model="applePeopleForm.openBank" disabled></el-input>
      </el-form-item>
      <el-form-item class="form-item" :label-width='formLabelWidth' label="开户名">
        <span class="redStar">*</span>
        <el-input class="form-input" v-model="applePeopleForm.openName" disabled></el-input>
      </el-form-item>
      <el-form-item class="form-item" :label-width='formLabelWidth' label="付款方式">
        <span class="redStar">*</span>
        <el-select class="form-input" v-model="applePeopleForm.payment" disabled></el-select>
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
    <!-- 申请人信息END -->

    <!-- 借款人信息 -->
    <el-form v-else class="form-list" ref="form" label-position="left" :model="loanPeopleForm" :label-width="formLabelWidth">
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


    <!-- 订单表格 -->
    <el-table
      :data="orderTable"
      class="order-table"
      border
      :headerRowStyle="tableHead" :cellStyle="tableHeight" :header-cell-style="getRowClass">
      <el-table-column prop="orderTotal" label="订单总额" header-align="center"></el-table-column>
      <el-table-column prop="approvedTotal" label="已审批总额" header-align="center"></el-table-column>
      <el-table-column prop="approvalTotal" label="审批中总额" header-align="center"></el-table-column>
      <el-table-column prop="incomeTotal" label="已收入总额" header-align="center"></el-table-column>
      <el-table-column prop="arrearsTotal" label="欠款总额" header-align="center"></el-table-column>
    </el-table>
    <!-- 订单表格END -->

    <!-- 预付款明细表格 -->
    <div class="prePayment">
      <span>预付款明细</span>
      <el-table
        :data="paymentTable"
        class="payment-table"
        border
        :headerRowStyle="tableHead" :cellStyle="tableHeight" :header-cell-style="getRowClass">
        <el-table-column prop="id" label="ID" header-align="center" min-width="50"></el-table-column>
        <el-table-column prop="state" label="状态" header-align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.state==0" style="color: #7F7F7F" >申请中</div>
            <div v-if="scope.row.state==1" style="color: #FF4A3D" >驳回</div>
            <div v-if="scope.row.state==2" style="color: #33D174" >通过</div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" header-align="center"></el-table-column>
        <el-table-column prop="supplierName" label="供应商" header-align="center"></el-table-column>
        <el-table-column prop="arrearsMoney" label="付款金额" header-align="center"></el-table-column>
        <el-table-column prop="number" label="人数" header-align="center"></el-table-column>
        <el-table-column prop="department" label="部门" header-align="center"></el-table-column>
        <el-table-column prop="applePeople" label="申请人" header-align="center"></el-table-column>
        <el-table-column prop="date" label="日期" header-align="center" min-width="90"></el-table-column>
        <el-table-column prop="abstract" label="摘要" header-align="center"></el-table-column>
        <el-table-column prop="arrearsTotal" label="审批过程" header-align="center">
          <template slot-scope="scope">
            <el-button @click="handlePaymentClick(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="writeOffMoney" label="已核销金额" header-align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 预付款明细表格END -->

    <!-- 无收入借款明细表格 -->
    <div class="prePayment">
      <span>无收入借款明细</span>
      <el-table
        :data="noIncomeTable"
        class="noIncome-table"
        border
        :headerRowStyle="tableHead" :cellStyle="tableHeight" :header-cell-style="getRowClass">
        <el-table-column prop="id" label="ID" header-align="center" min-width="50"></el-table-column>
        <el-table-column prop="state" label="状态" header-align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.state==0" style="color: #7F7F7F" >申请中</div>
            <div v-if="scope.row.state==1" style="color: #FF4A3D" >驳回</div>
            <div v-if="scope.row.state==2" style="color: #33D174" >通过</div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" header-align="center"></el-table-column>
        <el-table-column prop="supplierName" label="供应商" header-align="center"></el-table-column>
        <el-table-column prop="loanMoney" label="借款金额" header-align="center"></el-table-column>
        <el-table-column prop="department" label="部门" header-align="center"></el-table-column>
        <el-table-column prop="applePeople" label="申请人" header-align="center"></el-table-column>
        <el-table-column prop="date" label="日期" header-align="center" min-width="90"></el-table-column>
        <el-table-column prop="abstract" label="摘要" header-align="center"></el-table-column>
        <el-table-column prop="arrearsTotal" label="审批过程" header-align="center">
          <template slot-scope="scope">
            <el-button @click="handlePaymentClick(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="writeOffMoney" label="已核销金额" header-align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 无收入借款明细表格END -->

    <!-- 收入明细 -->
    <div class="prePayment">
      <span>收入明细</span>
      <el-table
        :data="incomeTable"
        class="income-table"
        border
        :headerRowStyle="tableHead" :cellStyle="tableHeight" :header-cell-style="getRowClass">
        <el-table-column prop="id" label="订单编号" header-align="center" min-width="70"></el-table-column>
        <el-table-column prop="source" label="来源" header-align="center"></el-table-column>
        <el-table-column prop="contacts" label="联系人" header-align="center"></el-table-column>
        <el-table-column prop="number" label="人数" header-align="center"></el-table-column>
        <el-table-column prop="orderMoney" label="订单金额" header-align="center"></el-table-column>
        <el-table-column prop="accepted" label="已收" header-align="center"></el-table-column>
        <el-table-column prop="arrears" label="欠款" header-align="center"></el-table-column>
        <el-table-column prop="receipt" label="收款单号" header-align="center"></el-table-column>
        <el-table-column prop="arrearsDate" label="欠款日期" header-align="center" min-width="90"></el-table-column>
        <el-table-column prop="shouldDate" label="应还日期" header-align="center" min-width="90"></el-table-column>
      </el-table>
    </div>
    <!-- 收入明细END -->

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
</template>

<script>
export default {
  name: "detailsForm",
  props: ['currentRow'],
  data() {
    return {
      formLabelWidth: '90px',
      tableHead:{height: '40px', color: '#808080'},
      tableHeight:{padding: '0', height: '40px'},
      isForm: true, // 判断是否是申请人信息

      // 申请人信息
      applePeopleForm: {
        applePeople: [{         // 申请人
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
        arrearsMoney: '1000.00', // 付款金额
        number: '1000',          // 人数
        abstract: '地接款',      // 摘要
        account: '1234 1234 1234', // 账号
        openBank: '建行',        // 开户行
        openName: '央鸯',        // 开户名
        payment: '网银'          // 付款方式
      },
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
      // 订单表格
      orderTable: [{
        orderTotal: '20000.00',   // 订单总额
        approvedTotal: '5000.00', // 已审批总额
        approvalTotal: '0.00',    // 审批中总额
        incomeTotal: '20000.00',  // 已收入总额
        arrearsTotal: '0.00'      // 欠款总额
      }],
      // 预付款明细
      paymentTable: [{
        id: 1,                   // id
        state: 2,                // 状态
        type: '消费',            // 类型
        supplierName: '国旅',    // 供应商
        arrearsMoney: '1000.00', // 付款金额
        number: '1000',          // 人数
        department: '国内部',     // 部门
        applePeople: '央鸯',      // 申请人
        date: '2019-1-14',        // 日期
        abstract: '小费款',       // 摘要
        writeOffMoney: '0.00'     // 已核销金额
      }],
      // 无收入借款明细
      noIncomeTable: [{
        id: 1, // id
        state: 1,                // 状态
        type: '小费',            // 类型
        supplierName: '国旅',    // 供应商
        loanMoney: '1000.00',    // 欠款金额
        department: '国内部',     // 部门
        applePeople: '央鸯',      // 申请人
        date: '2019-10-14',        // 日期
        abstract: '小费款',       // 摘要
        writeOffMoney: '0.00'     // 已核销金额
      }],
      // 收入明细
      incomeTable: [{
        id: 1, // id
        source: '线上直客',      // 来源
        contacts: '央鸯',       // 联系人
        number: '4',            // 人数
        orderMoney: '10000.00', // 订单金额
        accepted: '10000.00',   // 已收
        arrears: '0.00',        // 欠款
        receipt: '124152',      // 收款单号
        arrearsDate: '2019-01-20', // 欠款日期
        shouldDate: '2019-01-28', // 应还日期
      }],
      // 审批流程
      approvalTable: [{
        approvalPeople: '央鸯', // 审批人
        approvalResult: '结果', // 审批结果
        approvalOpinion: '意见', // 审批意见
        approvalDate: '审批时间', // 审批时间
      }],
    }
  },
  created() {
    this.getData();
  },
  watch: {
    currentRow() {
      this.getData();
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
    // 预付款明细-审核过程查看
    handlePaymentClick(row) {

    },
    // 数据获取
    getData() {
      
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
.redStar{ color: #f56c6c; float: left; margin-left:-98px;}
.form-list {
  margin-left: 20px;
}
.form-number {
  margin-left:370px;
  margin-top: -62px;
}
.form-input-number {
  float: left;
  margin-left: -30px;
  width: 180px;
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
.order-table {
  text-align: center;
  margin: 100px 0 0 20px;
  width: 700px;
}
.prePayment {
  margin: 50px 0 0 20px;
}
.payment-table {
  text-align: center;
  margin-top: 20px;
  width: 1100px;
}
.noIncome-table {
  text-align: center;
  margin-top: 20px;
  width: 1000px;
}
.income-table {
  text-align: center;
  margin-top: 20px;
  width: 900px;
}
.approval-table {
  text-align: center;
  margin-top: 20px;
  width: 700px;
}
</style>
