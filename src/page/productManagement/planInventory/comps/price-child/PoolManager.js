import { DAY_STATE as STATE } from '../../dictionary'

const PoolManager= function(){
  this.state= STATE.UNDO;
  this.currentDay= {}; 
  this.showVM= null; 
  this.calendarVM= null; 
  this.calendar= null; 
}

PoolManager.prototype.setState= function(state){
  if(!this.showVM) return console.log('showVm is not inited');
  this.state= state;
  this.showVM.setState(state, this.currentDay);
}

PoolManager.prototype.initCalendarVM= function({ vm, calendar }){
  this.calendarVM= vm;
  this.calendar= calendar;
}

PoolManager.prototype.initShowVM= function({ vm }){
  this.showVM= vm;
  this.showVM.setState(STATE.UNDO);
}

PoolManager.prototype.refresh= function(){
  this.currentDay= {};
  this.state= STATE.UNDO;
},

PoolManager.prototype.destroy= function(){
  this.state= STATE.UNDO;
  this.currentDay= {};
  this.showVM= null;
  this.calendarVM= null;
  this.calendar= null;
}

PoolManager.prototype.selectDay= function(day){
  let oldDay= this.currentDay || {};
  let oldState= this.state;
  this.currentDay= day;
  day.selected= true;
  let state= this.getStateByDay(day);
  this.setState(state);
  if(oldDay=== day) return;
  if(oldState=== STATE.SHARE || oldState=== STATE.NOT_SHARE) return oldDay.selected= false;
  if(state=== STATE.MULTIPLE){
    if(!oldDay.after) oldDay.selected= false;
    return this.dayLinkWeekFunc(day);
  }
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
  this.dayLinkWeekFunc(day);
  let state= this.getStateByDay(day);
  if(state=== STATE.SHARE || state=== STATE.NOT_SHARE) return this.setState(STATE.UNDO);
  if(state=== STATE.MULTIPLE && this.getSelected().length=== 0) this.setState(STATE.UNDO);
}


PoolManager.prototype.selectWeek= function(week){
  let days= this.findDayOfWeek(week);
  days.forEach(day => day.selected= true);
  let state= this.getStateByDay(this.currentDay);
  if(state=== STATE.SHARE || state=== STATE.NOT_SHARE || !this.currentDay.after) this.currentDay.selected= false;
  if(days.length=== 0) return this.calendarVM.weekArray[week].selected= false;
  this.setState(STATE.MULTIPLE);
  return true;
}
PoolManager.prototype.unSelectWeek= function(week){
  let days= this.findDayOfWeek(week);
  days.forEach(day => day.selected= false);
}


PoolManager.prototype.findDayOfWeek= function(week){
  let day, state, result= [];
  for(let i= 0; i< 6; i++){
    day= this.calendar[i*7+ week+ 1];
    state= this.getStateByDay(day);
    if(!day.after || state!== STATE.MULTIPLE) continue;
    result.push(day);
  }
  return result;
}


PoolManager.prototype.dayLinkWeekFunc= function(day){
  let { weekDay }= day;
  let checkbox= this.calendarVM.weekArray[weekDay];
  let result= this.findDayOfWeek(weekDay);
  if(result.length=== 0) return checkbox.selected= false;
  if(result.find(el => !el.selected)) return checkbox.selected= false;
  return checkbox.selected= true; 
}

PoolManager.prototype.getStateByDay= function(day){
  if(!day.after && !day.vm) return STATE.UNDO;
  if(day.vm) return day.vm.share;
  return STATE.MULTIPLE;
}

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
  return this.calendar.filter(day => day.selected).reverse();
}

export default PoolManager