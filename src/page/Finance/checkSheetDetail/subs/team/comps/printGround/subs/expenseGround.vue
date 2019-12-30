<style scoped>
  @import "~@/page/Finance/checkSheetDetail/subs/team/comps/printGround/print.css";
</style>
<template>
  <table cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td class="base label" colspan="8">
        <div class="cell">团队成本明细</div>
      </td>
    </tr>
    <tr>
      <td class="base label">
        <div class="cell">序号</div>
      </td>
      <td class="base label">
        <div class="cell">成本项目</div>
      </td>
      <td class="base label" style="width: 20%;">
        <div class="cell">供应商</div>
      </td>
      <td class="base label">
        <div class="cell">人数</div>
      </td>
      <td class="base label">
        <div class="cell">成本合计</div>
      </td>
      <td class="base label">
        <div class="cell">已支付</div>
      </td>
      <td class="base label">
        <div class="cell">挂账</div>
      </td>
      <td class="base label" style="width: 20%;">
        <div class="cell">备注</div>
      </td>
    </tr>
    <tr v-show="expenses.length=== 0">
      <td class="base">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
    </tr>
    <tr 
      v-for="(expense, i) in expenses"
      :key="i">
      <td class="base">
        <div class="cell">{{ i + 1 }}</div>
      </td>
      <td class="base">
        <div class="cell">{{ expense.title }}</div>
      </td>
      <td class="base">
        <div class="cell">{{ expense.supplier }}</div>
      </td>
      <td class="base">
        <div class="cell">{{ expense.peopleCount }}</div>
      </td>
      <td class="base">
        <div class="cell">{{ expense.price | priceFilter }}</div>
      </td>
      <td class="base">
        <div class="cell">{{ expense.payPrice | priceFilter }}</div>
      </td>
      <td class="base">
        <div class="cell">{{ expense.arrearsPrice | priceFilter }}</div>
      </td>
      <td class="base">
        <div class="cell">{{ expense.mark }}</div>
      </td>
    </tr>
    <tr>
      <td class="base label">
        <div class="cell">合计</div>
      </td>
      <td class="base" colspan="3">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell">{{ total | priceFilter }}</div>
      </td>
      <td class="base" colspan="3">
        <div class="cell"></div>
      </td>
    </tr>
  </table>
</template>

<script>
export default {

  data(){
    return {
      expenses: [],
      total: 0
    }
  },

  filters: {
    priceFilter(val){
      if(!val) return 0;
      return val.toFixed(2);
    }
  },

  methods: {
    init(expenses){
      this.expenses= expenses;
      this.getPrice();
    },

    getPrice(){
      let total= 0;
      this.expenses.forEach(expense => total+= expense.price);
      this.total= total;
      return total;
    }
  },

}
</script>