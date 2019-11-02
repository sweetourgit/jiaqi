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
    .day-conteiner{
      width: 100%;
    }
    .day{
      display: inline-block;
      padding: 2px;
      width: 14.28%;
      height: 180px;
      border: 1px solid #aeaeae;
      overflow: hidden;
    }
  }
}
</style>

<template>
  <div class="date-panel">
    <header>
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
        <el-button type="primary" size="small"
          @click="monthHandler(1)"
        >新增计划</el-button>
      </div>
    </header>
    <main>
      <ul class="day-container">
        <template v-for="week in 6">
          <template v-for="day in 7">
            <li :key="week+ '-'+ day" class="day">
              <panel-day
                :proto="findDayDate(week, day)"
              ></panel-day>
            </li>
          </template>
        </template>
      </ul>
    </main>
  </div>
</template>

<script>
import { getCalendar } from '../../../../planInventory'
import panelDay from './comps/panel-day'

export default {
  components: { panelDay },

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
        state: false
      },
      // 长度为3的数组，依次存放年月日
      current: [],
      dayArray: []
    }
  },

  methods: {
    init(payload){
      let { date, id }= payload;
      if(id) this.packageID= id;
      this.changeInAsync(true);
      this.changeCurrent(...this.getDateArr(date));
      this.getCalendarAction();
    },

    dayHandler(){},
    monthHandler(){},

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
        let dto= this.getDayDTO();
        if((currentMonthInt+ i)< todayInt) dto.previous= true;
        if((currentMonthInt+ i)=== todayInt) dto.today= true;
        dto.day= i;
        dto.dayInt= currentMonthInt+ i;
        dto.date= new Date(this.current[0], this.current[1], dto.day),
        console.log(finder)
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

    getDayDTO(){
      return {
        // 显示的天
        day: null,
        // 是否是过时的信息
        previous: false,
        // getDateInt
        dayInt: null,
        today: false
      }
    }
  }
}
</script>