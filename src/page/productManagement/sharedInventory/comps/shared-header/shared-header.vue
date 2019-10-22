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
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    top: 36px;
    left: 0;
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
    }
  }
}
</style>

<template>
  <div class="shared-header">
    <div class="selector">
      <span class="control-btns">
        <i class="el-icon-d-arrow-left"></i>
        <i class="el-icon-arrow-left"></i>
      </span>
      <span>
        <span style="padding:0 5px;">{{ current[0] }}</span><span>年</span>
        <span style="padding:0 5px;">{{ current[1]+ 1 }}</span><span>月</span>
        <span style="padding:0 5px;">{{ current[2] }}</span><span>日</span>
      </span>
      <span class="control-btns">
        <i class="el-icon-arrow-right"></i>
        <i class="el-icon-d-arrow-right"></i>
      </span>
    </div>
    <div class="panel">
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
        <div style="border-top: 1px solid #ddd;">123</div>
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

  mounted(){
    this.init();
  },

  computed: {
    currentInt(){
      return this.getDateInt(
        new Date(this.current[0], this.current[1], this.current[2]), true);
    }
  },

  data(){
    return {
      // 长度为3的数组，依次存放年月日
      current: [],
      dayArray: []
    }
  },

  methods: {
    
    init(date){
      this.current.splice(0);
      this.current.push(...this.getDateArr(date));
      inventorylistAction.bind(this)(this.getDateInt()).then(res => {
        this.dayArrayMaker(res);
      })
    },

    dayArrayMaker(list){
      let object= this.inventoryListToObject(list);
      this.dayArrayPreFull(object);
    },

    // 遍历结果，将
    inventoryListToObject(list){
      let result= {};
      list.forEach(el => {
        console.log(el.date);
        if(!(el.date in result)) result[el.date]= [];
        result[el.date].push(el);
      })
      return result;
    },

    // 预先填满dayArray
    dayArrayPreFull(finder){
      // 今天的int形式
      let todayInt= this.getDateInt(new Date(), true);
      let begin= new Date(this.current[0], this.current[1], 1).getDay();
      // 参见eui 2019年9月
      begin= (begin=== 0? 7: begin);
      let total= new Date(this.current[0], this.current[1], 0).getDate();
      let currentMonthInt= this.getDateInt(
        new Date(this.current[0], this.current[1], this.current[2]), false);
      this.dayArray.splice(0);
      for(let i= 0; i<= begin; i++){
        this.dayArray.push(void 0);
      }
      for(let i= 1; i<= total+ 1; i++){
        let dto= getDayDTO();
        (currentMonthInt+ i)< todayInt && (dto.previous= true);
        (currentMonthInt+ i)=== todayInt && (dto.today= true);
        dto.day= i;
        dto.dayInt= currentMonthInt+ i;
        dto.children= finder[dto.dayInt];
        dto.count= dto.children && dto.children.length;
        this.dayArray.push(dto);
      }
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

    emitSelectDay(day){
      day && this.current.splice(2, 1, day);
    }
  }
}
</script>