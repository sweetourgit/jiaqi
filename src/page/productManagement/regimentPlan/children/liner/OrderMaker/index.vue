<style lang="scss" scoped>
.order-page{
  position: relative;
  height: 100%; 
  overflow: auto;
  padding-right: 400px;
  &>header{
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding-right: 10px;
    background-color: transparent;
    .btn-ground{
      display: flex;
      justify-content: flex-end;
      padding-bottom: 10px;
      border-bottom: 1px solid #f4f4f4;
    }
    .total-ground{
      padding-top: 10px;
    }
  }
}
</style>

<template>
  <div class="order-page">
    <header v-fixed-bar>
      <div class="btn-ground">
        <el-button size="small" type="info">取消</el-button>
        <el-button size="small" type="primary">预定不占</el-button>
        <el-button size="small" type="primary">预定占位</el-button>
        <el-button size="small" type="primary">确定占位</el-button>
      </div>
      <!-- <PositionPreview></!-->
      <div class="total-ground">
        剩余完整房间
      </div>
    </header>
    <main>
      <InfoGround ref="infoGround"></InfoGround>
      <ChannelGround ref="channelGround"></ChannelGround>
      <CabinGround ref="cabinGround"></CabinGround>
      <OthersGround ref="othersGround"
        :guest-count="guestCount">
      </OthersGround>
    </main>
  </div>
</template>

<script>
/**
 * 下单流程,先走php验证接口,然后走.net提交接口,再将.net生成的id和orderCode带给php的提交接口 
 */

import './FixedBar'
// import PositionPreview from './comps/PositionPreview'
import InfoGround from './comps/InfoGround'
import ChannelGround from './comps/ChannelGround'
import CabinGround from './comps/CabinGround'
import OthersGround from './comps/OthersGround'
import { getSkuPlanInfo } from './api'

let skuPlanCache;
export default {

  components: { InfoGround, ChannelGround, CabinGround, OthersGround },
  
  mounted(){
    let { sku_id, product_id }= this.$route.query;
    getSkuPlanInfo(sku_id) 
    .then(res => {
      skuPlanCache= res;
      this.init();
    })
  },

  beforeDestroy(){
    skuPlanCache= null;
  },

  computed: {
    guestCount(){
      let count= 0;
      this.submitForm.cabin.forEach(el => count+= el.guests.length);
      return count;
    }
  },

  data(){
    return {
      submitForm: {
        cabin: [],
      }
    }
  },

  methods: {
    init(){
      this.$refs.infoGround.init(skuPlanCache);
      this.$refs.cabinGround.init(this.submitForm.cabin, skuPlanCache);
      this.$refs.othersGround.init(skuPlanCache);
    }
  }

}
</script>