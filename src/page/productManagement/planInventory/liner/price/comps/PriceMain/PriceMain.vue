<template>
  <main v-show="state">
    <div style="padding-top: 50px;">
      <span style="font-size: 14px;">订单预留时长：</span>
      <span>
        <el-select size="small"
          v-model="reserved_time">
          <el-option :key="item" v-for="item in 24" :label="item+ '小时'" :value="item"></el-option>
        </el-select>
      </span>
    </div>
    <BusSelector ref="busSelector"
      :parent-state="parentState">
    </BusSelector>
    <InsureSelector ref="insureSelector"
      :parent-state="parentState">
    </InsureSelector>
    <PriceGround ref="priceGround"
      :parent-state="parentState">
    </PriceGround>
  </main>
</template>

<script>
import BusSelector from './comps/BusSelector'
import InsureSelector from './comps/InsureSelector'
import PriceGround from './comps/PriceGround/PriceGround'
import { getSkuPlanDTO } from '@/page/productManagement/planInventory/liner/dictionary'
import { singleSkuInfo } from '@/page/productManagement/planInventory/liner/api'

let cache;
export default {

  // props: ['state'],

  components: { BusSelector, InsureSelector, PriceGround },

  computed: {
    parentState(){ return this.state },
  },

  data(){
    return {
      state: null,
      reserved_time: 24,
    }
  },

  methods: {
    init({ plan, state }){
      let oldState= this.state;
      this.state= state;
      console.log(oldState, state);
      // 无选或连续多选
      if(!state || (oldState=== state && oldState=== 'add')) return;
      // 有计划
      if(plan) return singleSkuInfo({ id: plan.id }).then(this.initSuffix);
      // 无计划
      this.initSuffix(getSkuPlanDTO());
    },

    initSuffix(plan){
      cache= plan;
      let { reserved_time, sku_plan_deliver, sku_plan_insure, sku_price }= plan;
      this.reserved_time= reserved_time;
      this.$refs.busSelector.init(sku_plan_deliver);
      this.$refs.insureSelector.init(sku_plan_insure);
      this.$refs.priceGround.init(sku_price);
    },

    notChange(){
      let bol= true;
      bol= this.reserved_time=== cache.reserved_time;
      if(bol) bol= this.$refs.busSelector.notChange();
      if(bol) bol= this.$refs.insureSelector.notChange();
      if(bol) bol= this.$refs.priceGround.notChange(cache.sku_price);
      return bol;
    },

    getData(){
      let reserved_time= this.reserved_time;
      let sku_plan_deliver= this.$refs.busSelector.getData();
      let sku_plan_insure= this.$refs.insureSelector.getData();
      let sku_price= this.$refs.priceGround.getData();
      let result= { reserved_time, sku_plan_deliver, sku_plan_insure, sku_price }
      if(cache.id) result.id= cache.id;
      return result;
    }
  }

}
</script>