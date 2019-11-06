import { DAY_STATE as STATE } from '../../dictionary'

// 选择池管理，拆分组件与业务逻辑
const PoolManager= function(){
  this.state= STATE.UNDO;
  this.currentDay= {}; // 当前选择的日期
  this.showVM= null; // show-panel实例
  this.calendarVM= null; // date-panel实例
  this.calendar= null; //日历池
}

PoolManager.prototype.setState= function(state){
  this.state= state;
  this.showVM.setState(state, this.currentDay);
}

// 挂载date-panel
PoolManager.prototype.initCalendarVM= function({ vm, calendar }){
  this.calendarVM= vm;
  this.calendar= calendar;
}
// 挂载show-panel
PoolManager.prototype.initShowVM= function({ vm }){
  this.showVM= vm;
  this.showVM.setState(STATE.UNDO);
}

PoolManager.prototype.destroy= function(){
  this.state= STATE.UNDO;
  this.currentDay= {};
  this.showVM= null;
  this.calendarVM= null;
  this.calendar= null;
}

// day已过滤掉不是当前月的天
PoolManager.prototype.selectDay= function(day){
  let oldDay= this.currentDay || {};
  let oldState= this.state;
  this.currentDay= day;
  day.selected= true;
  let state= this.getStateByDay(day);
  this.setState(state);
  // 如果前后点击的是同一天，则返回
  if(oldDay=== day) return;
  // 如果之前是有计划状态，则清除oldDay
  if(oldState=== STATE.SHARE || oldState=== STATE.NOT_SHARE) return oldDay.selected= false;
  // 如果newDay无计划，则联动周
  if(state=== STATE.MULTIPLE) return this.dayLinkWeekFunc(day);
  // 如果之前无状态，且newDay有计划，则清除所有选中天，所有选定周
  oldDay.selected= false;
  this.calendarVM.weekArray.forEach(
    (weekDay, i) => {
      this.unSelectWeek(i);
      weekDay.selected= false;
    }
  );
}

PoolManager.prototype.unSelectDay= function(day){
  day.selected= false;
  let weekSelected= this.dayLinkWeekFunc(day);
  let state= this.getStateByDay(day);
  if(state=== STATE.SHARE || state=== STATE.NOT_SHARE) this.setState(STATE.UNDO);
}

/**
 * @description: 点击或取消周选，周选，只选空白能用的天
 * @param {Number} week
 */
PoolManager.prototype.selectWeek= function(week){
  // 如果之前选择存在计划
  if(this.state=== STATE.SHARE || this.state=== STATE.NOT_SHARE){
    // TODO: listVM清空面板
  };
  // 找到week下所属day
  let days= this.findDayOfWeek(week);
  days.forEach(day => day.selected= true);
  // 点击周选则一定进入多选状态，如果当前选有计划，则取消选择
  let state= this.getStateByDay(this.currentDay);
  if(state=== STATE.SHARE || state=== STATE.NOT_SHARE) this.currentDay.selected= false;
  this.setState(STATE.MULTIPLE);
}
PoolManager.prototype.unSelectWeek= function(week){
  let days= this.findDayOfWeek(week);
  days.forEach(day => day.selected= false);
  // 取消周选不一定退出多选状态
}

/**
 * @description: 找到一个月中所有无计划的所有周一，二...
 * @param {Number} week 
 * @return {[dayDTO]} 
 */
PoolManager.prototype.findDayOfWeek= function(week){
  let day, state, result= [];
  for(let i= 0; i< 6; i++){
    day= this.calendar[i*7+ week+ 1];
    state= this.getStateByDay(day);
    // 过期或有计划则跳过
    if(!day.after || state!== STATE.MULTIPLE) continue;
    result.push(day);
  }
  return result;
}

/**
 * @description: 单击天后产生的与周选中框的联动
 * @param {dayDTO} day 
 */
PoolManager.prototype.dayLinkWeekFunc= function(day){
  let { weekDay }= day;
  let checkbox= this.calendarVM.weekArray[weekDay];
  let result= this.findDayOfWeek(weekDay);
  if(result.length=== 0) return checkbox.selected= false;
  // 如果result中有未选中的
  if(result.find(el => !el.selected)) return checkbox.selected= false;
  return checkbox.selected= true; 
}

// 返回该天状态，但不判断是否过期
PoolManager.prototype.getStateByDay= function(day){
  // 过期有计划的显示，过期没计划的不显示
  if(!day.after && !day.vm) return STATE.UNDO;
  if(day.vm) return day.vm.share;
  return STATE.MULTIPLE;
}

// 清理所有选中
PoolManager.prototype.clearAll= function(){
  this.calendar.forEach(el => el.selected= false);
  this.calendarVM.weekArray.forEach(
    weekDay => {
      weekDay.selected= false;
    }
  );
  this.currentDay= {};
  this.setState(STATE.UNDO);
}

PoolManager.prototype.getAverage= function(){
  return this.calendarVM.vm.average;
}

PoolManager.prototype.getSelected= function(){
  return this.calendar.filter(day => day.selected);
}

export default PoolManager