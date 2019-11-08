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
    width: 488px;
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
      padding: 20px;
      th{
        height: $tdHeight - 12px;
        border-bottom: 1px solid #e4e7ed;
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
      footer{
        display: flex;
        justify-content: flex-end;
        padding: 10px 20px 0 20px;
        border-top: 1px solid #ddd;
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
        <i class="el-icon-arrow-left" @click="dayHandler(-1)"></i>
      </span>
      <div style="display:inline-block; min-width: 170px; text-align: center;"
        @click="vm.state= !vm.state"
      >
        <span style="padding:0 5px;">{{ current[0] }}</span><span>年</span>
        <span style="padding:0 5px;">{{ current[1]+ 1 }}</span><span>月</span>
        <span style="padding:0 5px;">{{ current[2] }}</span><span>日</span>
      </div>
      <span class="control-btns">
        <i class="el-icon-arrow-right" @click="dayHandler(1)"></i>
        <i class="el-icon-d-arrow-right" @click="monthHandler(1)"></i>
      </span>
    </div>
    <div class="panel" 
      v-if="vm.state"
      v-loading="vm.inAsync"
    >
      <div class="content">
        <table cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <th>日</th>
              <th>一</th>
              <th>二</th>
              <th>三</th>
              <th>四</th>
              <th>五</th>
              <th>六</th>
            </tr>
            <tr v-for="week in 6" :key="week">
              <td v-for="day in 7" :key="day">
                <shared-header-day
                  :current="currentInt"
                  :proto="findDayDate(week, day)"
                  @select-day="emitSelectDay"
                ></shared-header-day>
              </td>
            </tr>
          </tbody>
        </table>
        <footer>
          <el-button type="text" size="mini"
            @click="init()" 
          >今天</el-button>
          <el-button type="text" size="mini" @click="vm.state= false">收起</el-button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import sharedHeaderDay from './comps/shared-header-day'
import { inventorylistAction } from '../../api.js'
import { getDayDTO } from '../../dictionary.js'

export default {
  components: { sharedHeaderDay },

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
    init(date){
      this.changeInAsync(true);
      this.changeCurrent(...this.getDateArr(date));
      inventorylistAction.bind(this)(
        this.getDateInt(date)
      ).then(res => {
        this.$emit('submit-inventory', this.dayArrayMaker(res));
      }).catch(err => {
        this.$message.error(err);
        this.$emit('submit-inventory', null);
      }).finally(() => {
        this.changeInAsync(false);
      })
    },

    /**
     * @param {type} : dayDTO
     */
    dayArrayMaker(list){
      let object= this.inventoryListToObject(list);
      return this.dayArrayPreFull(object);
    },

    // 遍历结果，将
    inventoryListToObject(list){
      let result= {};
      list.forEach(el => {
        if(!(el.date in result)) result[el.date]= [];
        result[el.date].push(el);
      })
      return result;
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
        if((currentMonthInt+ i)< todayInt) dto.previous= true;
        if((currentMonthInt+ i)=== todayInt) dto.today= true;
        dto.day= i;
        dto.dayInt= currentMonthInt+ i;
        dto.date= new Date(this.current[0], this.current[1], dto.day),
        dto.children= finder[dto.dayInt];
        dto.count= dto.children && dto.children.length;
        this.dayArray.push(dto);
        if((currentMonthInt+ i)=== this.currentInt) result= dto;
      }
      return result; 
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
      this.init(newDate);
    },

    // day组件点击提交
    emitSelectDay(day){
      if(!day) return;
      this.changeCurrent(null, null, day);
      day= this.dayArray.find(el => el && el.day== day);
      this.$emit('submit-inventory', day);
      this.vm.state= false;
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
  }
}
</script>