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
import { SKU_PLAN_STATUS, getSkuPlanDTO } from '@/page/productManagement/planInventory/liner/dictionary'
import { getCalendar } from '@/page/productManagement/planInventory/liner/api.js'

export default {

  components: { Jdatepanel, PriceDay },

  props: ['options'],

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
      // 日历集合
      priceCalendar: null,
      selectedCalendar: [],
      // null, readonly, edit, add
      parentState: null,
      planStatus: SKU_PLAN_STATUS.UNDO,
      panelOptions: {
        mixinHandler: (dto) => {
          dto.selected= false;
          dto.plan= this.getSkuPlan(dto);
          dto.plan_status= this.getSkuPlanStatus(dto);
        }
      },
      
    }
  },

  methods: {
    /**
     * @description: autoSelect会自动选定当前日期的day
     */
    init(date, autoSelect){
      if(!date) date= new Date();
      console.log(date);
      this.getCalendarAction(date).then(list => {
        this.currentDate= date;
        this.priceCalendar= list;
        this.setPlanStatus(SKU_PLAN_STATUS.UNDO);
        let calendarArr= this.$refs.datePanel.init(date);
        if(!autoSelect) return;
        let find= calendarArr.find(day => day && day.dateInt=== this.$refs.datePanel.getDateInt(date, true));
        this.emitSelect(find);
      })
    },

    /**
     * @param {Array<day>} selected 
     * @param {Boolean} isReverse: 是否反选 
     * @return: 
     */
    setSelectedCalendar(selected, isReverse){
      let result;
      let newState;
      let oldState= this.parentState;
      let oldCalendar= [...this.selectedCalendar];
      if(this.$isArray(selected)){
        selected.forEach(el => el.selected= !isReverse)
        // 正选且之前不是多选状态，则清空目前的已选
        if(!isReverse && oldState!== 'add') this.selectedCalendar.splice(0).forEach(el => el.selected= false);
        this.selectedCalendar= [...selected.filter(el => el.selected), ...this.selectedCalendar.filter(el => el.selected)];
        newState= this.selectedCalendar.length=== 0? null: 'add';
      } else {
        // 单选做了处理,当单选的是个多选天,则是以数组传递过来,走上边的逻辑,
        // 所以进入这里的selected都是过期或者有plan的单个day
        selected.selected= !isReverse;
        // 正选时候只可能是过期或有plan, 所以selectedCalendar全取选
        if(!isReverse) this.selectedCalendar.splice(0).forEach(el => el.selected= false);
        this.selectedCalendar= selected.selected? [selected]: [];
        newState= this.selectedCalendar.length=== 0? null: (this.selectedCalendar[0].isPassed? 'readonly': 'edit');
      }
      console.log(oldState, newState)
      // 如果之前处于只读或空选,直接赋值新状态
      if(!oldState || oldState=== 'readonly') return this.setParentStatus(newState);
      // 如果新旧状态都是新增,直接赋值新状态
      if(oldState=== 'add' && newState=== 'add') return this.setParentStatus(newState);
      // 没有数据变化,直接赋值新状态
      if(this.options.notChange()) return this.setParentStatus(newState);
      this.setPlanStatusAsyncInterceptor({
        newState, oldState, 
        sureCb: () => {
          this.selectedCalendar.forEach(el => el.selected= false);
          oldCalendar.forEach(el => el.selected= true);
          this.selectedCalendar= oldCalendar;
        }, 
        cancelCb: () => this.setParentStatus(newState)
      })
    },

    setPlanStatusAsyncInterceptor({ newState, oldState, sureCb, cancelCb }){
      if(!oldState || oldState=== 'readonly') return cancelCb();
      // 如果新旧状态都是新增,直接赋值新状态
      if(oldState=== 'add' && newState=== 'add') return cancelCb();
      // 没有数据变化,直接赋值新状态
      if(this.options.notChange()) return cancelCb();
      this.$confirm('存在数据变动，是否保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(sureCb)
      .catch(cancelCb)
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

    // 日期发生变化
    emitDateChange(date){
      this.setPlanStatusAsyncInterceptor({
        newState: null, 
        oldState: this.parentState, 
        sureCb: () => {
          this.selectedCalendar.forEach(el => el.selected= false);
          oldCalendar.forEach(el => el.selected= true);
          this.selectedCalendar= oldCalendar;
        }, 
        cancelCb: () => {
          this.init(date);
        }
      })
    },

    emitClose(){
      this.$emit('close', this.selectedCalendar.map(el => el.date));
    },

    // 过期的默认给一个统一plan
    getSkuPlan(day){
      return this.priceCalendar.find((el) => day.dateInt== el.format_set_out_time);
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
      let selected= (state=== 'edit' || state=== 'readonly')? this.selectedCalendar[0]: null;
      this.parentState= state;
      this.$emit('set-parent-status', { state, selected });
    },

    getCalendarAction(date){
      let { product_id, sku_id }= this.$route.query;
      let year= date.getFullYear();
      let month= date.getMonth()+ 1;
      return getCalendar({
        product_id, sku_id, year, month
      })
    }
  }

}
</script>