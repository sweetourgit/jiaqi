/*
 * @Author: WZJ
 * @Last Modified by:   WZJ
 */
<!-- 2020-3-31 -->
<style scoped>
/* 这个样式要给打印用，所以不使用scss了 */
* {
  font-weight: normal;
  box-sizing: border-box;
}
.review-collection{
  margin:0px;
}
.review-collection>div{
  font-size: 16px;
}
table {
  width: 100%;
}
.print-ground {
  font-size: 14px;
  line-height: normal;
  text-align: center;
  font-weight: normal;
}
.print-ground > header .title {
  font-size: 18px;
  line-height: 36px;
}
.print-ground > header .time {
  line-height: 2.5;
  text-align: right;
}
.cell {
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 5px;
  padding-left: 5px;
}
.base {
  width: 10%;
  padding: 5px 0;
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  vertical-align: middle;
}
.label {
  background-color: #ccc;
  color: #000;
}
.base:last-child {
  border-right: 1px solid #000;
}
</style>

<template>
  <div class="print-ground">
    <!-- <div style="white-space:pre-wrap" v-html="printData"></div> -->
    <header>
      <div class="title"><h1>{{ pd.topOrgName }}旅游团队报账单</h1></div>
       <el-divider content-position="left"  class="review-collection">报账单详情</el-divider>
      <div class="time" v-if="pd.checkTime=== pd.createTime">报账时间：{{ dateFormator(pd.checkTime) }}</div>
    </header>
    <main>
      <table cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td class="base label">
            <div class="cell">部门</div>
          </td>
          <td class="base">
            <div class="cell">{{ pd.orgName }}</div>
          </td>
          <td class="base label">
            <div class="cell">操作人</div>
          </td>
          <td class="base">
            <div class="cell">{{ pd.userName }}</div>
          </td>
          <td class="base label">
            <div class="cell">导陪</div>
          </td>
          <td class="base">
            <div class="cell">{{ pd.guideName }}</div>
          </td>
          <td class="base label">
            <div class="cell">接团社</div>
          </td>
          <td class="base" colspan="4">
            <div class="cell">{{ pd.localName }}</div>
          </td>
        </tr>

        <tr>
          <td class="base label">
            <div class="cell">团号</div>
          </td>
          <td class="base" colspan="3">
            <div class="cell">{{ pd.groupCode }}</div>
          </td>
          <td class="base label">
            <div class="cell">产品名称</div>
          </td>
          <td class="base" colspan="6">
            <div class="cell">{{ pd.teamProTitle }}</div>
          </td>
        </tr>

        <tr>
          <td class="base label">
            <div class="cell">团队人数</div>
          </td>
          <td class="base">
            <div class="cell">{{ incomesJoin.people }}</div>
          </td>
          <td class="base label">
            <div class="cell">减免人数</div>
          </td>
          <td class="base" colspan="1">
            <div class="cell"></div>
          </td>
          <td class="base label" colspan="1">
            <div class="cell">出发日期</div>
          </td>
          <td class="base" colspan="1">
            <div class="cell">{{ pd.date | dateFilter }}</div>
          </td>
          <td class="base label" colspan="1">
            <div class="cell">返回日期</div>
          </td>
          <td class="base" colspan="1">
            <div class="cell">{{ pd.returnDate | dateFilter }}</div>
          </td>
          <td class="base label" colspan="1">
            <div class="cell">全程天数</div>
          </td>
          <td class="base" colspan="1">
            <div class="cell">{{ pd.day }}</div>
          </td>
        </tr>

        <tr>
          <td class="base label" colspan="10">
            <div class="cell">团队收入成本结算</div>
          </td>
        </tr>

        <tr>
          <td class="base label">
            <div class="cell">总收入</div>
          </td>
          <td class="base">
            <div class="cell">{{ incomeSum }}</div>
          </td>
          <td class="base label">
            <div class="cell">总支出</div>
          </td>
          <td class="base">
            <div class="cell">{{ expenseSum }}</div>
          </td>
          <td class="base label">
            <div class="cell">毛利额</div>
          </td>
          <td class="base">
            <div class="cell">{{ profitSum }}</div>
          </td>
          <td class="base label">
            <div class="cell">毛利率</div>
          </td>
          <td class="base" colspan="3">
            <div class="cell">{{ profitRate }}</div>
          </td>
        </tr>
      </table>

      <table cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td class="base label" style="width:5%;">
            <div class="cell">序号</div>
          </td>
          <td class="base label">
            <div class="cell">订单号</div>
          </td>
          <td class="base label">
            <div class="cell">来源</div>
          </td>
          <td class="base label" style="width:5%;">
            <div class="cell">类型</div>
          </td>
          <td class="base label">
            <div class="cell">联团人</div>
          </td>
          <td class="base label" style="width:5%;">
            <div class="cell">人数</div>
          </td>
          <td class="base label" style="width:5%;">
            <div class="cell">订单收入</div>
          </td>
          <td class="base label" style="width:5%;">
            <div class="cell">已收款</div>
          </td>
          <td class="base label" style="width:5%;">
            <div class="cell">欠款</div>
          </td>
          <td class="base label">
            <div class="cell">订单毛利</div>
          </td>
          <td class="base label">
            <div class="cell">收款单号</div>
          </td>
          <td class="base label">
            <div class="cell">发票号码</div>
          </td>
          <td class="base label">
            <div class="cell">备注</div>
          </td>
        </tr>

        <income-bar
          v-for="(item, i) in incomes"
          :key="i"
          :proto="item"
          :rank="i"
          :page-type="pageType"
          @wakeup-mark="wakeupMark"
        ></income-bar>

        <tr>
          <td class="base label" colspan="5">
            <div class="cell">合计</div>
          </td>
          <td class="base" style="width:5%;">
            <div class="cell">{{ incomesJoin.people }}</div>
          </td>
          <td class="base" style="width:5%;">
            <div class="cell">{{ incomesJoin.totalPrice | priceFilter }}</div>
          </td>
          <td class="base" colspan="6">
            <div class="cell"></div>
          </td>
        </tr>
      </table>

      <otherGround ref="otherGround" @change="changeHandler"></otherGround>

      <expenseGround ref="expenseGround" @change="changeHandler"></expenseGround>

      <table cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td class="base label" style="width:15%;">
            <div class="cell">审批人</div>
          </td>
          <td class="base" rowspan="2" style="border-bottom: 1px solid #000;width: 85%;">
            <div
              class="cell"
              style="text-align: left;padding-left: 5%; font-weight: bold;"
            >{{ finishedListStr }}</div>
          </td>
        </tr>
        <tr>
          <td class="base label" style="width:15%;border-right:none;border-bottom: 1px solid #000;">
            <div class="cell">签字</div>
          </td>
        </tr>
      </table>
    </main>
    <footer>
      <!-- 基本信息编辑 -->
      <basic-form ref="basicForm" @save-action="basicSave"></basic-form>
      <!-- 挂账信息编辑 -->
      <expense-form ref="expenseForm" @wakeup-edit="awakeEditForm" @remove="removeExpense"></expense-form>
      <expense-edit-form ref="expenseEditForm" @save-action="expenseSave"></expense-edit-form>
      <!-- 注释编辑 -->
      <mark-form ref="markForm"></mark-form>
    </footer>
    <Review>

    </Review>
  </div>
</template>

<script>
import incomeBar from "./subs/incomeBar";
import otherGround from "./subs/otherGround";
import expenseGround from "./subs/expenseGround";
import basicForm from "./subs/basicForm";
import expenseForm from "./subs/expenseForm";
import expenseEditForm from "./subs/expenseEditForm";
import markForm from "./subs/markForm";
import Review from './subs/review.vue'
export default {
  components: {
    incomeBar,
    otherGround,
    expenseGround,
    basicForm,
    expenseForm,
    expenseEditForm,
    markForm,
    Review
  },

  filters: {
    dateFilter(val) {
      let year, month, day;
      year = ~~(val / 10000);
      month = ~~((val - year * 10000) / 100);
      day = val - year * 10000 - month * 100;
      // return `${year}年${month}月${day}日`
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      return `${year}.${month}.${day}`;
    },
    priceFilter(val) {
      if (!val) return 0;
      return val.toFixed(2);
    }
  },

  computed: {
    // incomes统计信息对象
    incomesJoin() {
      let people = 0;
      let price = 0;
      let totalPrice = 0;
      this.incomes.forEach(income => {
        let {
          settlementType,
          peopleCount,
          incomePrice,
          arrearsPrice,
          orderPrice
        } = income;
        people += peopleCount;
        // 总收入等于 st非1的incomePrice与st为1的arrearsPrice之和
        price +=
          settlementType === 1 ? incomePrice + arrearsPrice : incomePrice;
        totalPrice += orderPrice;
      });
      return { people, price, totalPrice };
    },

    finishedListStr() {
      return this.finishedList
        .map(finished => finished.participantName)
        .join(" >> ");
    }
  },

  data() {
    return Object.assign(
      {
        incomeSum: 0, // 总收入
        expenseSum: 0, // 总支出
        profitSum: 0, // 毛利额
        profitRate: 0, // 毛利率
        finishedList: []
      },
      {
        pd: {}, // printData缩写
        incomes: []
      }
    );
  },

  methods: {
    init(printData, pageType) {
      let {
        incomes,
        expenses,
        otherIncomes,
        finishedList,
        ...pdData
      } = printData;
      if (finishedList) this.finishedList = finishedList;
      this.pageType = pageType;
      this.pd = pdData;
      this.incomes = incomes;
      this.otherIncomes = otherIncomes;
      this.expenses = expenses;
      this.$refs.otherGround.init(otherIncomes);
      this.$refs.expenseGround.init(expenses);
      this.changeHandler();
    },

    /**
     * @description: @1383 提交需要判断非月结和线下直客订单有欠款不能提交报账单
     */
    getData() {
      let otherIncomes = this.otherIncomes;
      let expenses = this.expenses;
      let data = { ...this.pd, incomes: this.incomes, otherIncomes, expenses };
      if (this.$isNull(data.guideName) || this.$isNull(data.localName)) {
        this.$message.error("导游与接团社不能为空");
        return false;
      }
      // @1383
      let incomeSum = this.incomeSum;
      let { totalPrice } = this.incomesJoin;
      let orderPrice = otherIncomes.length === 0 ? 0 : +otherIncomes[0].price;
      if (+incomeSum !== totalPrice + orderPrice) {
        this.$message.error("有直客和非月结社订单存在欠款，不允许报账");
        return false;
      }
      return data;
    },

    dateFormator(time) {
      let date, year, month, day;
      date = new Date(time);
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
      return `${year}年${month < 10 ? "0" : ""}${month}月${day}日`;
    },

    changeHandler() {
      let { price: incomesPrice } = this.incomesJoin;
      let othersPrice = this.$refs.otherGround.getPrice();
      let expensesPrice = this.$refs.expenseGround.getPrice();
      this.incomeSum = incomesPrice + othersPrice;
      this.expenseSum = expensesPrice;
      this.profitSum = this.incomeSum - this.expenseSum;
      this.profitRate =
        this.incomeSum === 0
          ? 0
          : ((this.profitSum / this.incomeSum) * 100).toFixed(2) + "%";
      this.incomeSum = this.incomeSum.toFixed(2);
      this.expenseSum = this.expenseSum.toFixed(2);
      this.profitSum = this.profitSum.toFixed(2);
    },

    wakeupMark(index) {
      this.$refs.markForm.wakeup(this.incomes[index]);
    },
    //(groupCode)用于拼接生成储存草稿的唯一标识
    awakeBasicForm(groupCode) {
      let { id, guideName, localName } = this.pd;
      this.$refs.basicForm.wakeup(
        {
          guideName,
          localName,
          ...this.otherIncomes[0]
        },
        groupCode
      );
    },

    basicSave(payload) {
      let { sheetID } = this.pd;
      let { guideName, localName, title, price, ticket } = payload;
      let isSave = !!this.otherIncomes[0];
      // 改成提交的时候统一加sheetID和createTime
      // let assignObj= isSave? this.otherIncomes[0] : { sheetID, createTime: new Date().toISOString() };
      let assignObj = isSave ? this.otherIncomes[0] : {};
      this.pd.guideName = guideName;
      this.pd.localName = localName;
      Object.assign(assignObj, { title, price, ticket });
      // 如果填写过信息才会向otherIncomes中推入信息
      !isSave && title && this.otherIncomes.push(assignObj);
      this.changeHandler();
    },
    //(groupCode)用于拼接生成储存草稿的唯一标识
    awakeExpenseForm() {
      this.$refs.expenseForm.wakeup(this.expenses);
    },

    awakeEditForm(expense,type) {
      this.$refs.expenseEditForm.wakeup(expense, this.pd,type);
    },

    expenseSave(payload) {

      let { isSave, expense } = payload;
      if (isSave) return this.changeHandler();
      this.expenses.push(expense);
      this.changeHandler();
    },

    removeExpense(expense) {
      let result;
      let index;
      result = this.expenses.filter(item => item !== expense);
      this.expenses.splice(0);
      this.$nextTick(() => {
        this.expenses.push(...result);
        this.changeHandler();
      });
    }
  }
};
</script>
