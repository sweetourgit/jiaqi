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
  & >>> .no-wrap{
    word-break:keep-all;/* 不换行 */
    white-space:nowrap;/* 不换行 */
    overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow:ellipsis;
  }
  & >>> .info-bar{
    position: relative;
    padding-left: 150px;
    color: #606266;
    div{
      display: inline-block;
    }
    .title{
      color: #333;
      font-weight: bold;
      position: absolute;
      top: 0;
      left: 0;
      width: 150px;
    }
    .money{
      color: #333;
      font-weight: bold;
      padding: 0 5px;
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
    <main style="padding-bottom: 40px;">
      <InfoGround ref="infoGround"></InfoGround>
      <ChannelGround ref="channelGround"></ChannelGround>
      <CabinGround ref="cabinGround"
        @calcula-price="calculaPriceHandler">
      </CabinGround>
      <OthersGround ref="othersGround"
        v-show="submitForm.cabin.length"
        :guest-count="guestCount">
      </OthersGround>
      <GuestsGround ref="guestsGround"
        v-show="submitForm.cabin.length">
      </GuestsGround>
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
import GuestsGround from './comps/GuestsGround'
import { getSkuPlanInfo } from './api'

let skuPlanCache;
export default {

  components: { InfoGround, ChannelGround, CabinGround, OthersGround, GuestsGround },
  
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

  data(){
    return {
      submitForm: {
        cabin: [],
      },
      guestCount: 0
    }
  },

  methods: {
    init(){
      this.$refs.infoGround.init(skuPlanCache);
      this.$refs.cabinGround.init(this.submitForm.cabin, skuPlanCache);
      this.$refs.othersGround.init(skuPlanCache);
      this.$refs.guestsGround.init(this.submitForm.cabin);
    },

    calculaPriceHandler(){
      console.log('emit calcula-price')
      let guestCount= 0;  // 总数
      let warnArr= [];  // 报警数组
      let cabins= this.submitForm.cabin;
      cabins.forEach(cabin => {
        let { sku_price, short, guests }= cabin;
        guestCount+= guests.length;
      })
      this.guestCount= guestCount;
    },
  }

}
</script>