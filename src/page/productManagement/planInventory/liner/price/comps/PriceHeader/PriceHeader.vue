<template>
  <Jdatepanel ref="datePanel" 
    :options="panelOptions"
    @single-select="emitSelect"
    @multi-select="emitMultiSelect"
    @clear-select="emitClearSelect"
    @date-change="emitDateChange"
    @close="emitClose">
    <template slot="show" slot-scope="scope">
      <span>
        <span style="padding:0 5px;">{{ scope.year }}</span><span>年</span>
        <span style="padding:0 5px;">{{ scope.month }}</span><span>月</span>
        <span style="padding:0 5px;">{{ computedShowDay }}</span>
      </span>
    </template>
    <template slot="day" slot-scope="scope">
      <PriceDay
        :key="scope.week+ '_'+ scope.day" 
        :proto="scope.proto">
      </PriceDay>
    </template>
  </Jdatepanel>
</template>

<script>
/**
 * @description: 分离业务与日历逻辑
 */
import Jdatepanel from './comps/Jdatepanel/Jdatepanel'
import PriceDay from './comps/PriceDay'
import { SKU_PLAN_STATUS } from '@/page/productManagement/planInventory/liner/dictionary'

export default {

  components: { Jdatepanel, PriceDay },

  mounted(){
    this.init();
  },

  computed: {
    computedShowDay(){
      let str= '';
      if(this.selectedCalendar.length=== 0) return '';
      if(this.selectedCalendar.length=== 1) return this.selectedCalendar[0].date+ '日';
      return this.selectedCalendar.map(el => el.date).sort((a, b) => a- b).join('、')+ '日';
    }
  },
  
  data(){
    return {
      currentDate: null,
      selectedCalendar: [],
      planStatus: SKU_PLAN_STATUS.UNDO,
      panelOptions: {
        dayDtoSupplier: function(){
          return {
            selected: false,
            plan: null,
            plan_status: SKU_PLAN_STATUS.MULTIPLE
          }
        }
      },
      
    }
  },

  methods: {
    init(date){
      let calendarArr= this.$refs.datePanel.init(date || new Date());
      this.initCalendarArrPlanStatus(calendarArr);
      this.selectedCalendar.splice(0);
    },

    initCalendarArrPlanStatus(calendarArr){
      calendarArr.forEach(el => el.plan_status= this.getSkuPlanStatus(el));
    },

    emitSelect(day){
      // 如果是取消选择
      if(day.selected){
        // 如果只有一个元素，则置为空选
        if(this.selectedCalendar.length=== 1) return this.setPlanStatus(SKU_PLAN_STATUS.UNDO);
        day.selected= false;
        return this.selectedCalendar= this.selectedCalendar.filter(el => el!== day);
      }
      this.setPlanStatus(day.plan_status);
      this.selectedCalendar.push(day);
      day.selected= !day.selected;
    },

    emitMultiSelect(arr){
      let selected= arr.filter(el => !el.selected && el.plan_status=== SKU_PLAN_STATUS.MULTIPLE);
      if(selected.length=== 0) return;
      this.setPlanStatus(SKU_PLAN_STATUS.MULTIPLE);
      this.selectedCalendar= [...this.selectedCalendar, ...selected];
      selected.forEach(el => el.selected= true);
    },

    emitClearSelect(){
      this.setPlanStatus(SKU_PLAN_STATUS.UNDO);
    },

    emitDateChange(date){
      this.init(date);
    },

    emitClose(){
      this.$emit('close', this.selectedCalendar.map(el => el.date));
    },

    getSkuPlanStatus(day){
      let { isPassed, plan }= day;
      // 过期或者存在计划，都按非共享计划算
      if(isPassed || plan) return SKU_PLAN_STATUS.NOT_SHARE;
      return SKU_PLAN_STATUS.MULTIPLE;
    },

    setPlanStatus(status){
      // 如果前后都是多选
      if(this.planStatus=== status && status=== SKU_PLAN_STATUS.MULTIPLE) return;
      this.selectedCalendar.forEach(el => el.selected= false);
      this.selectedCalendar.splice(0);
      this.planStatus= status;
    }
  }

}
</script>