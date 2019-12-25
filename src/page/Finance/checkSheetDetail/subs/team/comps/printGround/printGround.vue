<style lang="scss" scoped>
.print-ground{
  font-size: 14px;
  line-height: normal;
  text-align: center;
  &>header{
    .title{
      font-size: 18px;
    }
    .time{
      line-height: 2.5;
      text-align: right;
    }
  }
  &>main{
    line-height: 36px;
    .row{
      display: flex;
      height: 36px;
      .base{
        width: 10%;
        border-top: 1px solid #000;
        border-left: 1px solid #000;
        &:last-child{
          border-right: 1px solid #000;
        }
      }
      .label{
        background-color: #ccc;
        color: #000;
        box-sizing: border-box;
      }
      .content{
        box-sizing: border-box;
      }
    }
  }  
}
</style>

<template>
  <div class="print-ground" v-if="inited">
    <!-- <div style="white-space:pre-wrap" v-html="printData"></div> -->
    <header>
      <div class="title">沈阳甜程国际旅行社有限公司旅游团队报账单</div>
      <div class="time">报账时间：{{ dateFormator(pd.checkTime) }}</div>
    </header>
    <main style="border-collapse:collapse;">

      <div class="row">
        <div class="base label">部门</div>
        <div class="base content"> {{ pd.orgName }} </div>
        <div class="base label">操作人</div>
        <div class="base content"> {{ pd.createUser }} </div>
        <div class="base label">导陪</div>
        <div class="base content"> {{ pd.guideName }} </div>
        <div class="base label">接团社</div>
        <div class="base content" style="width: 30%;"> {{ pd.localName }} </div>
      </div>

      <div class="row">
        <div class="base label">团号</div>
        <div class="base content" style="width: 30%;"> {{ pd.groupCode }} </div>
        <div class="base label">产品名称</div>
        <div class="base content" style="width: 50%;"> {{ pd.teamProTitle }} </div>
      </div>

      <div class="row">
        <div class="base label">团队人数</div>
        <div class="base content"></div>
        <div class="base label">减免人数</div>
        <div class="base content"></div>
        <div class="base label">出发日期</div>
        <div class="base content"> {{ pd.date | dateFilter }} </div>
        <div class="base label">返回日期</div>
        <div class="base content"> {{ pd.returnDate | dateFilter }} </div>
        <div class="base label">全程天数</div>
        <div class="base content"> {{ pd.day }} </div>
      </div>

      <div class="row">
        <div class="base label" style="width: 100%;">团队收入成本结算</div>
      </div>

      <div class="row">
        <div class="base label">总收入</div>
        <div class="base content"> {{ pd.sumIncome }} </div>
        <div class="base label">总支出</div>
        <div class="base content"> {{ pd.sumExpense }} </div>
        <div class="base label">毛利额</div>
        <div class="base content"></div>
        <div class="base label">毛利率</div>
        <div class="base content" style="width: 30%;"></div>
      </div>

      <div class="row">
        <div class="base content" style="width: 100%;"></div>
      </div>

      <div class="row">
        <div class="base label">序号</div>
        <div class="base label" style="width: 25%;">收入来源</div>
        <div class="base label" style="width: 25%;">经手人</div>
        <div class="base label">人数</div>
        <div class="base label">实收款</div>
        <div class="base label">发票号码</div>
        <div class="base label">备注</div>
      </div>
      <!-- v-for -->
      <div class="row"
        v-for="(item, i) in incomes"
        :key="i">
        <div class="base content">{{ i + 1 }}</div>
        <div class="base content" style="width: 25%;">{{ item.orderSource }}</div>
        <div class="base content" style="width: 25%;">{{ item.joinPeople }}</div>
        <div class="base content">{{ item.peopleCount }}</div>
        <div class="base content">{{ item.incomePrice }}</div>
        <div class="base content"></div>
        <div class="base content">{{ item.mark }}</div>
      </div>

      <div class="row">
        <div class="base label" style="width: 60%;">合计：</div>
        <div class="base content"></div>
        <div class="base content"></div>
        <div class="base content"></div>
        <div class="base content"></div>
      </div>

      <div class="row">
        <div class="base label" style="width: 100%;">团队成本明细</div>
      </div>
      <div class="row">
        <div class="base label">序号</div>
        <div class="base label">成本项目</div>
        <div class="base label" style="width: 20%;">供应商</div>
        <div class="base label">人数</div>
        <div class="base label" style="width: 15%;">成本合计</div>
        <div class="base label" style="width: 15%;">已支付</div>
        <div class="base label">挂账</div>
        <div class="base label">备注</div>
      </div>
      <!-- v-for -->
      <div class="row">
        <div class="base content"></div>
        <div class="base content"></div>
        <div class="base content" style="width: 20%;"></div>
        <div class="base content"></div>
        <div class="base content" style="width: 15%;"></div>
        <div class="base content" style="width: 15%;"></div>
        <div class="base content"></div>
        <div class="base content"></div>
      </div>

      <div class="row">
        <div class="base label">合计：</div>
        <div class="base content" style="width: 30%;"></div>
        <div class="base content"></div>
        <div class="base content" style="width: 15%;"></div>
        <div class="base content" style="width: 15%;"></div>
        <div class="base content" style="width: 20%;"></div>
      </div>

      <div class="row" style="height: 72px; line-height: 72px; border-bottom: 1px solid #000;">
        <div class="base label" style="width: 12%;">
          审批人签字
        </div>
        <div class="base label">计调</div>
        <div class="base content" style="width: 12%;"></div>
        <div class="base label">部门经理</div>
        <div class="base content" style="width: 12%;"></div>
        <div class="base label">财务部</div>
        <div class="base content" style="width: 12%;"></div>
        <div class="base label">总经理</div>
        <div class="base content" style="width: 12%;"></div>
      </div>
      
    </main>
  </div>
</template>

<script>
export default {

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