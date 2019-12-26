<style scoped>
/* 这个样式要给打印用，所以不使用scss了 */
*{
  font-weight: normal;
  box-sizing: border-box;
}
table{
  width: 100%;
}
.print-ground{
  font-size: 14px;
  line-height: normal;
  text-align: center;
  font-weight: normal;
}
.print-ground>header .title{
    font-size: 18px;
}
.print-ground>header .time{
  line-height: 2.5;
  text-align: right;
}
.cell{
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 5px;
  padding-left: 5px;
}
.base{
  width: 10%;
  padding: 5px 0;
  border-top: 1px solid #000;
  border-left: 1px solid #000;
}
.label{
  background-color: #ccc;
  color: #000;
}
.base:last-child{
  border-right: 1px solid #000;
}
</style>

<template>
  <div class="print-ground" v-if="inited">
    <!-- <div style="white-space:pre-wrap" v-html="printData"></div> -->
    <header>
      <div class="title">沈阳甜程国际旅行社有限公司旅游团队报账单</div>
      <div class="time">报账时间：{{ dateFormator(pd.checkTime) }}</div>
    </header>
    <main>

      <table cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td class="base label">
            <div class="cell">部门</div>
          </td>
          <td class="base">
            <div class="cell"></div>
          </td>
          <td class="base label">
            <div class="cell">操作人</div>
          </td>
          <td class="base">
            <div class="cell"></div>
          </td>
          <td class="base label">
            <div class="cell">导陪</div>
          </td>
          <td class="base">
            <div class="cell"></div>
          </td>
          <td class="base label">
            <div class="cell">接团社</div>
          </td>
          <td class="base" style="width: 30%;">
            <div class="cell"></div>
          </td>
        </tr>
      </table>

      <table cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td class="base label">
            <div class="cell">团号</div>
          </td>
          <td class="base" style="width:30%;">
            <div class="cell"></div>
          </td>
          <td class="base label">
            <div class="cell">产品名称</div>
          </td>
          <td class="base" style="width:50%;">
            <div class="cell"></div>
          </td>
        </tr>
      </table>

      <table cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td class="base label">
            <div class="cell">团队人数</div>
          </td>
          <td class="base">
            <div class="cell"></div>
          </td>
          <td class="base label">
            <div class="cell">减免人数</div>
          </td>
          <td class="base">
            <div class="cell"></div>
          </td>
          <td class="base label">
            <div class="cell">出发日期</div>
          </td>
          <td class="base">
            <div class="cell"></div>
          </td>
          <td class="base label">
            <div class="cell">返回日期</div>
          </td>
          <td class="base">
            <div class="cell"></div>
          </td>
          <td class="base label">
            <div class="cell">全程天数</div>
          </td>
          <td class="base">
            <div class="cell"></div>
          </td>
        </tr>
      </table>

      <table cellspacing="0" cellpadding="0" border="0">
        <td class="base label">
          <div class="cell">团队收入成本结算</div>
        </td>
      </table>

      <table cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td class="base label">
            <div class="cell">总收入</div>
          </td>
          <td class="base">
            <div class="cell"></div>
          </td>
          <td class="base label">
            <div class="cell">总支出</div>
          </td>
          <td class="base">
            <div class="cell"></div>
          </td>
          <td class="base label">
            <div class="cell">毛利额</div>
          </td>
          <td class="base">
            <div class="cell"></div>
          </td>
          <td class="base label">
            <div class="cell">毛利率</div>
          </td>
          <td class="base" style="width: 30%;">
            <div class="cell"></div>
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
         :rank="i">
        </income-bar>
      </table>

    </main>
  </div>  
</template>

<script>
import incomeBar from './subs/incomeBar'

export default {

  components: { incomeBar },

  filters: {
    dateFilter(val){
      let year, month, day;
      year= ~~ (val / 10000);
      month= ~~ ((val - year * 10000) / 100);
      day= val - year * 10000 - month * 100;
      // return `${year}年${month}月${day}日`
      return `${year}/${month}/${day}`
    }
  },

  data(){
    return Object.assign(
      {
        inited: false,
      },
      {
        pd: {},  // printData缩写
        incomes: [],
        expenses: []
      }
    )
  },

  methods: {
    init(printData){
      let { incomes, expenses, ...pdData }= printData;
      this.pd= pdData;
      this.incomes= incomes;
      this.expenses= expenses;
      this.inited= true;
    },

    dateFormator(time){
      let date, year, month, day;
      date= new Date(time);
      year= date.getFullYear();
      month= date.getMonth()+ 1;
      day= date.getDate();
      return `${year}年${month< 10?'0': ''}${month}月${day}日`
    }
  }
}
</script>