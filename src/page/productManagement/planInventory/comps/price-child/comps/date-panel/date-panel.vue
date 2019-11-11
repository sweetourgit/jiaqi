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
        <!-- <div>
          <span style="line-height: 32px;">
            <span>人均结算价：</span>
            <span>{{ vm.average }}</span>
          </span>
        </div> -->
      </div>
      <div>
        <el-button type="info" size="small"
          @click="clearAll"
        >清除选中</el-button>
        <el-button type="primary" size="small"
          @click="awakeAddForm"
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
              :proto="findDayDate(week, day)"
              @select-day="emitSelectDay"
              @unselect-day="emitUnselectDay"
            ></panel-day>
          </template>
        </template>
      </ul>
    </main>
    <footer>
      <add-form
        ref="addRef"
        @refresh="refresh"
      ></add-form>
      <edit-form
        ref="editRef"
        @refresh="refresh"
      ></edit-form>
    </footer>
  </div>
</template>

<script>
import { getCalendar, getAverage } from '../../../../planInventory'
import { getDayDTO, DAY_STATE } from '../../../../dictionary'

import editForm from './comps/forms/edit-form'
import addForm from './comps/forms/add-form'
import panelDay from './comps/panel-day'

// 管理选中
export default {
  components: { panelDay, addForm, editForm },

  inject: ['poolManager'],

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
        // 日历接口完成才允许其他操作，不然会产生bug
        inited: false,
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
      // sureDate为true时，getCalendarAction结束会默认执行一次emitSelectDay
      let { date, id, sureDate }= payload;
      // 缓存payload 刷新用
      this.initCache= payload;
      // 初始化日期
      this.changeCurrent(...this.getDateArr(date));
      // 日历
      this.getCalendarAction(id);
      // 均价
      this.getAverageAction(id);
      // 重置周选状态
      this.weekArray.forEach(el => el.selected= false);
      // 将实例挂载到poolManager
      this.poolManager.initCalendarVM({ vm: this, calendar: this.dayArray });
    },
    
    // 月份加减
    monthHandler(payload){
      let monthVal= this.current[1]+ payload;
      let dayVal= this.current[2]
      // new Date(2019, 10, 0).getDate()
      let max= new Date(this.current[0], monthVal- 1, 0).getDate();
      max= (dayVal> max? max: dayVal);
      let newDate= new Date(this.current[0], monthVal, max);
      // 没有放到init里调用的原因在于，dateRef先于showRef初始化，而clearAll里
      this.poolManager.clearAll();
      this.init({ id:this.initCache.id, date: newDate });
    },

    getCalendarAction(pacId){
      this.vm.inited= false;
      let currentIntStr= this.currentInt+ '';
      let object= {
        year: currentIntStr.substr(0, 4),
        month: currentIntStr.substr(4, 2),
        packageID: pacId
      }
      getCalendar(object).then(res => {
        // 共享库存中重定向用到的逻辑
        let selected= this.dayArrayPreFull(res);
        if(this.initCache.sureDate){
          this.initCache.sureDate= false;
          console.log(this.initCache.sureDate)
          this.emitSelectDay(selected);
        }
      })
      .finally(() => {
        this.vm.inited= true;
      })
    },

    getAverageAction(pacId){
      getAverage(pacId).then(res => {
        let average= parseFloat(res).toFixed(2);
        this.vm.average= average;
      })
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
        this.dayArray.push(getDayDTO());
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
      // 填补剩余 41= 6* 7- 1
      for(let i= begin+ total; i<= 41; i++){
        this.dayArray.push(getDayDTO());
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
    
    // 将传入日期或当前日期转为int型长度为3的数组
    getDateArr(date){
      date= date || new Date();
      return [
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ]
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
     * @description: 根据行数列数找到数组中对应元素
     * @param {Number} week: 当前行数
     * @param {Number} day: 当前列数
     */
    findDayDate(week, day){
      let hit= this.dayArray[(week- 1)* 7+ day];
      if(hit){
        hit.weekNum= week- 1;
        hit.weekDay= day- 1;
      }
      return hit;
    },

    // 点击单选
    emitSelectDay(day){
      this.poolManager.selectDay(day);
    },
    
    // 点击取消单选
    emitUnselectDay(day){
      this.poolManager.unSelectDay(day);
    },

    // 全部取消
    clearAll(){
      this.poolManager.clearAll();
    },

    // checkbox
    clickWeekCheckBox(i){
      let selected= this.weekArray[i].selected;
      let bol= selected? 
                this.poolManager.selectWeek(i):
                  this.poolManager.unSelectWeek(i);
      if(selected && !bol) this.$message.info('没有可供多选的日期');
    },

    // 刷新
    refresh(payload){
      // 重置poolManager的状态
      this.poolManager.refresh();
      this.init(Object.assign({}, this.initCache, payload));
    },

    // 新增计划
    awakeAddForm(){
      if(!this.vm.inited) return this.$message.info('数据初始化中，请稍后...');
      let state= this.poolManager.state;
      let day= this.poolManager.currentDay;
      if(state=== DAY_STATE.SHARE || state=== DAY_STATE.NOT_SHARE) return this.$message.error('计划已存在');
      // 如果空选，或者不是多选的情况下day过期
      if(state=== DAY_STATE.UNDO || (state!== DAY_STATE.MULTIPLE && !day.after)) return this.$message.error('无效日期（未指定或已过期）不能新增计划');
      this.$refs.addRef.handleOpen(this.initCache.id);
    },

    // 编辑计划
    awakeEditForm(payload){
      if(!this.vm.inited) return this.$message.info('数据初始化中，请稍后...');
      this.$refs.editRef.handleOpen(payload);
    },
  }
}
</script>