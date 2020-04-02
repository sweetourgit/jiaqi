<style lang="scss" scoped>
$tdHeight: 60px;
$tdWidth: 64px;
$fontHeight: 32px;
.shared-header{
  position: relative;
  display: inline-block;
  user-select: none;
  .selector{
    line-height: 32px;
    cursor: pointer;
    .control-btns{
      padding:0 20px;
    }
    .control-btns:hover{
      color: #409EFF;
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
        width: 22px !important;
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
        padding: 10px 0 0 0;
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
        @click="state= !state">
        <slot name="show" :year="current[0]" :month="current[1]+ 1"></slot>
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
                <slot name="day" :week="week" :day="day" :proto="findDayDate(week, day)"></slot>
              </td>
            </tr>
          </tbody>
        </table>
        <footer style="display: flex; justify-content: space-between;">
          <div>
            <div style="font-size: 12px; line-height: 14px; padding: 7px 0;" :class="[inReverse?'el-button--text':'']">
              {{ inReverse? '反选中': '按住ctrl反选' }}
            </div>
          </div>
          <div>
            <el-button type="text" size="mini"
              @click="init()">
              今天
            </el-button>
            <el-button type="text" size="mini" @click="state= false">收起</el-button>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>

let ctrlDownHandler;
let ctrlUpHandler;
export default {

  props: {
    /**
     * @description: options
     * @param {Function} mixinHandler: 用来给dayDto混入属性
     */
    options: {
      type: Object,
      default(){
        return {}
      }
    },
  },

  mounted(){
    ctrlDownHandler= (event) => event.keyCode=== 17 && (this.inReverse= true);
    ctrlUpHandler= (event) => event.keyCode=== 17 && (this.inReverse= false);
    window.addEventListener('keydown', ctrlDownHandler);
    window.addEventListener('keyup', ctrlUpHandler);
    this.current= this.getDateArr(new Date());
  },

  beforeDestroy(){
    window.removeEventListener('keydown', ctrlDownHandler);
    window.removeEventListener('keyup', ctrlUpHandler);
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
      // 是否反选
      inReverse: false,
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
     * @param {Date} _date: 日期对象
     * @param {Number} dateInt: 日期的数字形式，月份从1开始
     * @param {Number} col
     * @param {Number} row
     */
    getDayDto(){
      return {
        date: null,
        _date: null,
        dateInt: null,
        isPassed: false,
        isToday: false,
      }
    },
    
    // 填充日历
    fullfill(){
      let result, max, begin, total, todayInt, monthInt;
      let { mixinHandler }= this.options; 
      result= new Array(42);
      begin= new Date(this.current[0], this.current[1], 1).getDay();
      begin= (begin=== 0? 7: begin);
      max= this.currentMax;
      todayInt= this.getDateInt(new Date(), true);
      for(let i= 1+ begin; i<= max+ begin; i++){
        let _date= new Date(this.current[0], this.current[1], i- begin);
        let dto= this.getDayDto();
        dto._date= _date;
        dto.date= i- begin;
        dto.dateInt= this.getDateInt(dto._date, true);
        dto.row= ~~(i/ 7)+ 1;
        dto.col= 1+ ((i- 1)% 7);
        if(dto.dateInt< todayInt) dto.isPassed= true;
        if(dto.dateInt=== todayInt) dto.isToday= true;
        if(mixinHandler) mixinHandler(dto);
        result[i]= dto;
      }
      return result;
    },

    multiSelecte(){
      let filterArr= [...arguments];
      let result;
      result= this.dayArray.filter(day => {
        let bol= false;
        if(!day) return false;
        filterArr.forEach(filter => {
          if(bol) return;
          let { col, row }= day;
          bol= ( filter[0]=== row || filter[0]=== -1) && ( filter[1]=== col || filter[1]=== -1);
        })
        return bol;
      })
      this.$emit('multi-select', { selected: result, isReverse: this.inReverse });
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
      this.state= true;
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
      this.state= true;
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