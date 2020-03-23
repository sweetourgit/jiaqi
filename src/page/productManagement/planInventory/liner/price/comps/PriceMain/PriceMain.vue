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

let cache;
export default {

  props: ['state'],

  components: { BusSelector, InsureSelector, PriceGround },

  computed: {
    parentState(){ return this.state },
  },

  data(){
    return {
      reserved_time: 24,
    }
  },

  methods: {
    init(plan){
      if(!plan) plan= getSkuPlanDTO(this.$route.query);
      cache= plan;
      let { reserved_time, sku_plan_deliver, sku_plan_insure, sku_price }= plan;
      this.$refs.busSelector.init(sku_plan_deliver);
      this.$refs.insureSelector.init(sku_plan_insure);
      this.$refs.priceGround.init(sku_price);
    },
  }

}
</script>