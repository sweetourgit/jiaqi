<style lang="scss" scoped>
$tdHeight: 60px;
$tdWidth: 64px;
$fontHeight: 32px;
.shared-header{
  position: relative;
  display: inline-block;
  user-select: none;
  cursor: pointer;
  .selector{
    line-height: 32px;
    .control-btns{
      padding:0 20px;
    }
  }
  .panel{
    position: absolute;
    width: 518px;
    font-size: 12px;
    background-color: #FFF;
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    top: 36px;
    left: 0;
    z-index: 2000;
    .content{
      position: relative;
      padding: 20px 50px 20px 20px;
      th{
        height: $tdHeight - 12px;
      }
      tr{
        td:nth-child(1){
          border-left: 1px solid #ddd;
        }
        td:last-child{
          border-right: 1px solid #ddd;
        }
      }
      // 上下边框与圆角
      tr:nth-child(2){
        td {
          border-top: 1px solid #ddd;
        }
        td:nth-child(1){
          border-radius: 4px 0 0 0;
        }
        td:last-child{
          border-radius: 0 4px 0 0;
        }
      }
      tr:last-child{
        td {
          border-bottom: 1px solid #ddd;
        }
        td:nth-child(1){
          border-radius: 0 0 0 4px;
        }
        td:last-child{
          border-radius: 0 0 4px 0;
        }
      } 
      td{
        width: $tdWidth;
        height: $tdHeight;
        padding: 2px 0;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
        position: relative;
        .prev-month{
          color: #c0c4cc;
        }
      }
      ul,li{ padding:0;margin:0;list-style:none}
      &>ul {
        position:absolute;
        top: 70px;
        right: 24px;
        li {
          box-sizing: border-box;
          writing-mode: vertical-rl;
          padding: 4px 2px;
          margin-bottom: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      }
      footer{
        display: flex;
        justify-content: flex-end;
        padding: 10px 20px 0 20px;
      }
    }
  }
}
</style>

<template>
  <div class="shared-header">
    <div class="selector">
      <span class="control-btns">
        <i class="el-icon-d-arrow-left" @click="monthHandler(-1)"></i>
      </span>
      <div style="display:inline-block; min-width: 140px; text-align: center;"
        @click="state= !state"
      >
        <span style="padding:0 5px;">{{ current[0] }}</span><span>年</span>
        <span style="padding:0 5px;">{{ current[1]+ 1 }}</span><span>月</span>
      </div>
      <span class="control-btns">
        <i class="el-icon-d-arrow-right" @click="monthHandler(1)"></i>
      </span>
    </div>
    <div class="panel" 
      v-if="state"
      v-loading="inAsync"
      @mouseleave="mouseleaveHandler">
      <div class="content">
        <ul>
          <li @click="multiSelecte([-1, -1])">全月</li>
          <li @click="multiSelecte([-1, 1], [-1, 7])">周六、日</li>
          <li @click="multiSelecte([-1, 2], [-1, 3], [-1, 4], [-1, 5], [-1, 6])">周一至五</li>
          <li @click="$emit('clear-select')">清除选中</li>
        </ul>
        <table cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <th v-for="(el, index) in weekText" :key="el"
                @click="multiSelecte([-1, index+ 1])">
                {{ el }}
              </th>
            </tr>
            <tr :key="week" 
              v-for="week in 6">
              <td :key="day"
                v-for="day in 7"
                @click="singleSelect(week, day)">
                <slot :week="week" :day="day" :proto="findDayDate(week, day)"></slot>
              </td>
            </tr>
          </tbody>
        </table>
        <footer>
          <el-button type="text" size="mini"
            @click="init()">
            今天
          </el-button>
          <el-button type="text" size="mini" @click="state= false">收起</el-button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import Jdateday from './comps/Jdateday.vue'

export default {
  components: { Jdateday },

  props: {
    /**
     * @description: options
     * @param {Function} dayDtoSupplier: 返回一个对象，用来给dayDto添加属性
     */
    options: {
      type: Object,
      default: function(){
        return {}
      }
    },
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
      inAsync: false,
      state: false,
      // 长度为3的数组，依次存放年月日
      current: [],
      dayArray: [],
      weekText: ['日', '一', '二', '三', '四', '五', '六']
    }
  },

  methods: {
    init(date){
      this.current= this.getDateArr(date);
      this.dayArray= this.fullfill();
      return this.dayArray;
    },

    /**
     * @description: 获得日历中每个day的数据原型
     * @param {Number} date: 月中几号
     * @param {Boolean} isPassed: 是否是过去时间
     * @param {Boolean} isToday: 是否是今天
     * @param {Date} Date: 日期对象
     * @param {Number} dateInt: 日期的数字形式，月份从1开始
     * @param {Number} col
     * @param {Number} row
     */
    getDayDto(){
      let { dayDtoSupplier }= this.options;
      return Object.assign({
        date: null,
        Date: null,
        dateInt: null,
        isPassed: false,
        isToday: false,
      }, dayDtoSupplier? dayDtoSupplier(): undefined);
    },
    
    // 填充日历
    fullfill(){
      let result, max, begin, total, todayInt;
      result= new Array(42);
      begin= new Date(this.current[0], this.current[1], 1).getDay();
      begin= (begin=== 0? 7: begin);
      max= this.currentMax;
      todayInt= this.getDateInt(new Date(), true);
      for(let i= 1+ begin; i<= max+ begin; i++){
        let dto= this.getDayDto();
        dto.row= ~~(i/ 7)+ 1;
        dto.col= 1+ ((i- 1)% 7);
        dto.date= i- begin;
        dto.Date= new Date(this.current[0], this.current[1], dto.date);
        dto.dateInt= this.getDateInt(dto.Date, true);
        if(dto.dateInt< todayInt) dto.isPassed= true;
        if(dto.dateInt=== todayInt) dto.isToday= true;
        result[i]= dto;
      }
      return result;
    },

    multiSelecte(){
      let filterArr= [...arguments];
      let result;
      result= this.dayArray.filter(day => {
        let bol= false;
        if(!day) return bol;
        filterArr.forEach(filter => {
          if(bol) return;
          let { col, row }= day;
          bol= ( filter[0]=== row || filter[0]=== -1) && ( filter[1]=== col || filter[1]=== -1);
        })
        return bol;
      })
      this.$emit('multi-select', result);
    },

    singleSelect(week, day){
      let result= this.findDayDate(week, day);
      if(result) this.$emit('single-select', result);
    },

    /**
     * @description: 根据行数列数找到数组中对应元素
     * @param {Number} week: 当前行数
     * @param {Number} day: 当前列数
     */
    findDayDate(week, day){
      return this.dayArray[(week- 1)* 7+ day];
    },
    
    /**
     * @description: 将日期或当前时间转成年月日数组, 注意，这里的月份是从0开始的，没有+1
     * @param {Date} date: 传入一个日期 
     * @return {Array}: [year, month, day] 
     */
    getDateArr(date){
      date= date || new Date();
      return [
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ]
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
 
    dayHandler(payload){
      let dayVal= this.current[2]+ payload;
      let max, newDate, dateArr;
      // 月份减一
      if(dayVal<= 0){
        max= new Date(this.current[0], this.current[1]- 1+ 1, 0).getDate();
        newDate= new Date(this.current[0], this.current[1]- 1, max);
        dateArr= this.getDateArr(newDate);
        return this.init(newDate);
      }
      if(dayVal> this.currentMax){
        max= new Date(this.current[0], this.current[1]+ 1+ 1, 0).getDate();
        newDate= new Date(this.current[0], this.current[1]+ 1, 1);
        dateArr= this.getDateArr(newDate);
        return this.init(newDate);
      }
      this.changeCurrent(null, null, dayVal);
      let day= this.dayArray.find(el => el && el.day== dayVal);
      this.$emit('submit-inventory', day); 
    },

    monthHandler(payload){
      let monthVal= this.current[1]+ payload;
      let dayVal= this.current[2]
      // new Date(2019, 10, 0).getDate()
      let max= new Date(this.current[0], monthVal- 1, 0).getDate();
      max= (dayVal> max? max: dayVal);
      let newDate= new Date(this.current[0], monthVal, max);
      this.$emit('date-change', newDate);
    },

    // day组件点击提交
    emitSelectDay(day){
      if(!day) return;
      this.changeCurrent(null, null, day);
      day= this.dayArray.find(el => el && el.day== day);
      this.$emit('submit-inventory', day);
      this.vm.state= false;
    },

    mouseleaveHandler(){},

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
      this.inAsync= bol;
      !this.state && this.$emit('in-async', bol); 
    },
  }
}
</script>