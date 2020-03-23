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
import { getCalendar } from '@/page/productManagement/planInventory/liner/api.js'

export default {

  components: { Jdatepanel, PriceDay },

  mounted(){
    // this.init();
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
      // 日历集合
      priceCalendar: null,
      selectedCalendar: [],
      planStatus: SKU_PLAN_STATUS.UNDO,
      panelOptions: {
        mixinHandler: (dto) => {
          Object.assign(dto, {
            selected: false,
            plan: this.getSkuPlan(dto),
            plan_status: this.getSkuPlanStatus(dto)
          })
        }
      },
      
    }
  },

  methods: {
    init(date){
      this.currentDate= date;
      this.setPlanStatus(SKU_PLAN_STATUS.UNDO);
      let calendarArr= this.$refs.datePanel.init(date || new Date());
    },

    emitSelect(day){
      // 如果是取消选择
      if(day.selected){
        // 如果只有一个元素，则置为空选
        if(this.selectedCalendar.length=== 1) return this.setPlanStatus(SKU_PLAN_STATUS.UNDO);
        day.selected= false;
        return this.selectedCalendar= this.selectedCalendar.filter(el => el.selected=== true);
      }
      this.setPlanStatus(day.plan_status, day.isPassed);
      this.selectedCalendar.push(day);
      day.selected= true;
      this.$emit('select-day', day);
    },

    emitMultiSelect({ selected, isReverse }){
      let result;
      if(isReverse){
        selected.forEach(el => el.selected= false);
        this.selectedCalendar= this.selectedCalendar.filter(el => el.selected=== true);
        if(this.selectedCalendar.length=== 0) return this.setPlanStatus(SKU_PLAN_STATUS.UNDO);
      } else {
        result= selected.filter(el => !el.selected && el.isPassed=== false && el.plan_status=== SKU_PLAN_STATUS.MULTIPLE);
        if(result.length=== 0) return;
        this.setPlanStatus(SKU_PLAN_STATUS.MULTIPLE);
        this.selectedCalendar= [...this.selectedCalendar, ...result];
        result.forEach(el => el.selected= true);
      }
    },

    emitClearSelect(){
      this.setPlanStatus(SKU_PLAN_STATUS.UNDO);
    },

    emitDateChange(date){
      this.getCalendarAction(date).then(list => {
        this.priceCalendar= list;
        this.init(date);
      })
    },

    emitClose(){
      this.$emit('close', this.selectedCalendar.map(el => el.date));
    },

    getSkuPlan(day){
      return null;
    },

    getSkuPlanStatus(day){
      let { isPassed, plan }= day;
      // 过期或者存在计划，都按非共享计划算
      if(isPassed || plan) return SKU_PLAN_STATUS.NOT_SHARE;
      return SKU_PLAN_STATUS.MULTIPLE;
    },

    /**
     * @description: 多选对应面板的添加状态，无选对应隐藏，单选要判断选择的一天是否过时，过时则只读状态，不过时则编辑状态
     */
    setPlanStatus(status, isPassed){
      // 如果前后都是多选
      if(this.planStatus===status && status=== SKU_PLAN_STATUS.MULTIPLE) return this.$emit('set-plan-status', 'add');
      this.selectedCalendar.forEach(el => el.selected= false);
      this.selectedCalendar.splice(0);
      this.planStatus= status;
      if(status=== SKU_PLAN_STATUS.UNDO) return this.$emit('set-plan-status');
      this.$emit('set-plan-status', isPassed? 'readonly': 'edit')
    },

    getCalendarAction(date){
      let year= date.getFullYear();
      let month= date.getMonth()+ 1;
      return getCalendar({
        product_id: null,
        sku_id: null,
        year, month
      })
    }
  }

}
</script>