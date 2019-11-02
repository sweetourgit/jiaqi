<style lang="scss" scoped>
.date-panel{
  height: calc(100% - 50px);
  width: 100%;
  box-sizing: border-box;
  *{
    box-sizing: border-box;
  }
  &>header{
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    .selector{
      cursor: pointer;
      user-select: none;
      line-height: 32px;
      .control-btns{
        padding:0 20px;
      }
    }
  }
  &>main{
    padding:20px 10px;
    width: 100%; // 120* 7+ 10* 2
    ul, li{
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
      box-sizing: border-box;
    }
    ol, ul, li {
      list-style: none;
    }
    .week-container{
      display: flex;
      &>div{
        padding: 10px;
        border: 1px solid #ddd;
        text-align: center;
        width: 14.28%;
        & /deep/ .week-text{
          font-weight: bold;
          font-size: 18px;
        }
      }
    }
    .day-container{
      line-height: 0;
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="date-panel">
    <header>
      <div style="display: flex;">
        <div class="selector">
          <span class="control-btns">
            <el-button type="primary" icon="el-icon-arrow-left" size="small"
              @click="monthHandler(-1)"
            ></el-button>
          </span>
          <div style="display:inline-block; min-width: 120px; text-align: center;"
            @click="vm.state= !vm.state"
          >
            <span style="padding:0 5px;">{{ current[0] }}</span><span>年</span>
            <span style="padding:0 5px;">{{ current[1]+ 1 }}</span><span>月</span>
          </div>
          <span class="control-btns">
            <el-button type="primary" icon="el-icon-arrow-right" size="small"
              @click="monthHandler(1)"
            ></el-button>
          </span>
        </div>
        <div>
          <span style="line-height: 32px;">
            <span>人均结算价：</span>
            <span>{{ vm.average }}</span>
          </span>
        </div>
      </div>
      <div>
        <el-button type="info" size="small"
          @click="monthHandler(1)"
        >清除选中</el-button>
        <el-button type="primary" size="small"
          @click="monthHandler(1)"
        >新增计划</el-button>
      </div>
    </header>
    <main>
      <div class="week-container">
        <div v-for="(el, i) in weekArray" :key="i">
          <el-checkbox 
            v-model="weekArray[i].selected"
            @change="clickWeekCheckBox(i)"
          >
            <span class="week-text">{{ el.text }}</span>
          </el-checkbox>
        </div>
      </div>
      <ul class="day-container">
        <template v-for="week in 6">
          <template v-for="day in 7">
            <panel-day
              :key="week+ '-'+ day"
              :week="week"
              :day="day"
              :proto="findDayDate(week, day)"
              @select-day="emitSelectDay"
              @unselect-day="emitUnselectDay"
            ></panel-day>
          </template>
        </template>
      </ul>
    </main>
    <footer>

    </footer>
  </div>
</template>

<script>
import { getCalendar, getAverage } from '../../../../planInventory'
import panelDay from './comps/panel-day'
import { getDayDTO } from '../../../../dictionary'

// 管理选中
export default {
  components: { panelDay },

  provide: {
    average: 0,
  },

  computed: {
    // 当前选择日期的int表达
    currentInt(){
      return this.getDateInt(
        new Date(this.current[0], this.current[1], this.current[2]), true);
    },
    currentMax(){
      return new Date(this.current[0], this.current[1]+ 1, 0).getDate();
    }
  },

  data(){
    return {
      vm: {
        inAsync: false,
        state: false,
        average: 0,
      },
      // 长度为3的数组，依次存放年月日
      current: [],
      dayArray: [],
      weekArray: [
        { text: '日', day: 0, selected: false },
        { text: '一', day: 1, selected: false },
        { text: '二', day: 2, selected: false },
        { text: '三', day: 3, selected: false },
        { text: '四', day: 4, selected: false },
        { text: '五', day: 5, selected: false },
        { text: '六', day: 6, selected: false },
      ]
    }
  },

  methods: {
    init(payload){
      let { date, id }= payload;
      if(id) this.packageID= id;
      this.changeInAsync(true);
      this.changeCurrent(...this.getDateArr(date));
      this.getCalendarAction();
      this.getAverageAction()
    },
    
    monthHandler(payload){
      let monthVal= this.current[1]+ payload;
      let dayVal= this.current[2]
      // new Date(2019, 10, 0).getDate()
      let max= new Date(this.current[0], monthVal- 1, 0).getDate();
      max= (dayVal> max? max: dayVal);
      let newDate= new Date(this.current[0], monthVal, max);
      this.init({ date: newDate });
    },

    getCalendarAction(){
      let object= {
        year: this.current[0],
        month: this.current[1]+ 1,
        packageID: this.packageID
      }
      getCalendar(object).then(res => {
        let list= this.dayArrayPreFull(res);
      })
    },

    getAverageAction(){
      getAverage(this.packageID).then(res => {
        let average= parseFloat(res).toFixed(2);
        this.vm.average= average;
        this._provided.average= average;
      })
    },

    getDateArr(date){
      date= date || new Date();
      return [
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ]
    },


    // 预先填满dayArray
    dayArrayPreFull(finder){
      let result;
      // 今天的int形式
      let todayInt= this.getDateInt(new Date(), true);
      let begin= new Date(this.current[0], this.current[1], 1).getDay();
      // 参见eui 2019年9月
      begin= (begin=== 0? 7: begin);
      let total= this.currentMax;
      let currentMonthInt= this.getDateInt(
        new Date(this.current[0], this.current[1], this.current[2]), false);
      this.dayArray.splice(0);
      for(let i= 0; i<= begin; i++){
        this.dayArray.push(void 0);
      }
      for(let i= 1; i<= total; i++){
        let dto= getDayDTO();
        if((currentMonthInt+ i)>= todayInt) dto.after= true;
        if((currentMonthInt+ i)=== todayInt) dto.today= true;
        dto.day= i;
        dto.dayInt= currentMonthInt+ i;
        dto.date= new Date(this.current[0], this.current[1], dto.day),
        dto.vm= finder.find(el => el.date=== dto.dayInt);
        this.dayArray.push(dto);
        if((currentMonthInt+ i)=== this.currentInt) result= dto;
      }
      return result; 
    },

    /**
     * @description: 将日期转化成int形式, 后台采用的日期格式中，月份从1开始
     * @param {Date} date: 传入一个日期  
     * @param {Boolean} day: 是否计算到天  
     * @return {Number}: 20190909 
     */
    getDateInt(date, day){
      let arr= this.getDateArr(date);
      return arr[0]* 10000+ (arr[1]+ 1)* 100+ (day? arr[2]: 0);
    },

    /**
     * @description: 更改当前current的值
     */
    changeCurrent(year, month, day){
      year && this.current.splice(0, 1, year);
      (month || month=== 0) && this.current.splice(1, 1, month);
      day && this.current.splice(2, 1, day);
    },

    /**
     * @description: 根据是否弹开执行emit
     */
    changeInAsync(bol){
      this.vm.inAsync= bol;
      !this.vm.state && this.$emit('in-async', bol); 
    },

    /**
     * @description: 根据行数列数找到数组中对应元素
     * @param {Number} week: 当前行数
     * @param {Number} day: 当前列数
     */
    findDayDate(week, day){
      return this.dayArray[(week- 1)* 7+ day];
    },

    // 单选
    emitSelectDay(payload){
      let { week, day, proto}= payload;
      console.log(proto)
      proto.selected= true;
    },
    
    emitUnselectDay(payload){
      let { week, day, proto}= payload;
      console.log(proto)
      proto.selected= false;
    },

    // checkbox
    clickWeekCheckBox(i){
      let selected= this.weekArray[i].selected;
    },
  }
}
</script>