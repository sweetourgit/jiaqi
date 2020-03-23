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

  props: ['options'],

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
      // null, readonly, edit, add
      parentState: null,
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

    /**
     * @param {Array<day>} selected 
     * @param {Boolean} isReverse: 是否反选 
     * @return: 
     */
    setSelectedCalendar(selected, isReverse){
      let result;
      let oldState= this.parentState;
      let newState;
      if(this.$isArray(selected)){
        selected.forEach(el => el.selected= !isReverse)
        // 正选且之前不是多选状态，则清空目前的已选
        if(!isReverse && oldState!== 'add') this.selectedCalendar.splice(0).forEach(el => el.selected= false);
        this.selectedCalendar= [...selected.filter(el => el.selected), ...this.selectedCalendar.filter(el => el.selected)];
        newState= this.selectedCalendar.length=== 0? null: 'add';
      } else {
        selected.selected= !isReverse;
        if(!isReverse) this.selectedCalendar.splice(0).forEach(el => el.selected= false);
        this.selectedCalendar= [...[selected].filter(el => el.selected), ...this.selectedCalendar.filter(el => el.selected)];
        newState= this.selectedCalendar.length=== 0? null: (this.selectedCalendar[0].isPassed? 'readonly': 'edit');
      }
      this.parentState= newState;
    },

    emitSelect(day){
      if(day.plan_status=== SKU_PLAN_STATUS.MULTIPLE) return this.setSelectedCalendar([day], day.selected);
      this.setSelectedCalendar(day, day.selected);
    },

    emitMultiSelect({ selected, isReverse }){
      let result;
      result= selected.filter(el => !el.isPassed && el.plan_status=== SKU_PLAN_STATUS.MULTIPLE && el.selected=== !!isReverse);
      this.setSelectedCalendar(result, !!isReverse);
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
      if(this.planStatus===status && status=== SKU_PLAN_STATUS.MULTIPLE) return this.setParentStatus('add');
      this.selectedCalendar.forEach(el => el.selected= false);
      this.selectedCalendar.splice(0);
      this.planStatus= status;
      if(status=== SKU_PLAN_STATUS.UNDO) return this.setParentStatus();
      return this.setParentStatus(isPassed? 'readonly': 'edit');
      this.setParentStatus(isPassed? 'readonly': 'edit');
    },

    setParentStatus(state){
      // // 如果当前父组件是新增或者编辑状态，且数据发生过变动
      // if((this.parentState=== 'edit' || this.parentState=== 'add') && this.options.notChange())
      //   this.$confirm('存在数据变动，是否保存?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {

      //   }).catch(() => {
          this.parentState= state;
          this.$emit('set-parent-status', state);        
        // });
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