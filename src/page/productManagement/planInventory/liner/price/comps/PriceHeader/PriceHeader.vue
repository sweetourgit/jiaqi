<style>

</style>

<template>
  <Jdatepanel ref="datePanel" 
    :options="panelOptions"
    @single-select="emitSelect"
    @multi-select="emitMultiSelect"
    @clear-select="emitClearSelect"
    @date-change="emitDateChange">
    <template slot-scope="scope">
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

// 记录当前选中
let selectedCalendar= [];
export default {

  components: { Jdatepanel, PriceDay },

  mounted(){
    this.init();
  },
  
  data(){
    return {
      currentDate: null,
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
      selectedCalendar.splice(0);
    },

    initCalendarArrPlanStatus(calendarArr){
      calendarArr.forEach(el => el.plan_status= this.getSkuPlanStatus(el));
    },

    emitSelect(day){
      // 如果是取消选择
      if(day.selected){
        // 如果只有一个元素，则置为空选
        if(selectedCalendar.length=== 1) return this.setPlanStatus(SKU_PLAN_STATUS.UNDO);
        day.selected= false;
        return selectedCalendar= selectedCalendar.filter(el => el!== day);
      }
      this.setPlanStatus(day.plan_status);
      selectedCalendar.push(day);
      day.selected= !day.selected;
    },

    emitMultiSelect(arr){
      let selected= arr.filter(el => el.plan_status=== SKU_PLAN_STATUS.MULTIPLE);
      if(selected.length=== 0) return;
      this.setPlanStatus(SKU_PLAN_STATUS.MULTIPLE);
      selectedCalendar= [...selectedCalendar, ...selected];
      selected.forEach(el => el.selected= true);
    },

    emitClearSelect(){
      this.setPlanStatus(SKU_PLAN_STATUS.UNDO);
    },

    emitDateChange(date){
      this.init(date);
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
      selectedCalendar.forEach(el => el.selected= false);
      selectedCalendar.splice(0);
      this.planStatus= status;
    }
  }

}
</script>