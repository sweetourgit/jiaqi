<template>
  <main>
    <div style="height: 4000px;">
      <div style="padding-top: 50px;">
        <span style="font-size: 14px;">订单预留时长：</span>
        <span>
          <el-select size="small"
            v-model="reserved_time">
            <el-option :key="item" v-for="item in 24" :label="item+ '小时'" :value="item"></el-option>
          </el-select>
        </span>
      </div>

      <BusSelector ref="busSelector"></BusSelector>
      <InsureSelector ref="insureSelector"></InsureSelector>
      <PriceGround ref="priceGround"></PriceGround> 
    </div>
    
  </main>
</template>

<script>
import BusSelector from './comps/BusSelector'
import InsureSelector from './comps/InsureSelector'
import PriceGround from './comps/PriceGround/PriceGround'
import { getLinerCabinType } from '../../../api'

export default {

  components: { BusSelector, InsureSelector, PriceGround },

  mounted(){ getLinerCabinType({ liner_id: 1, limit: 100 }) },

  data(){
    return {
      reserved_time: 24,
    }
  },

  methods: {
    reset(){
      this.reserved_time= 24;
      this.$refs.busSelector.reset();
      this.$refs.insureSelector.reset();
      this.$refs.priceGround.reset();
    }
  }

}
</script>