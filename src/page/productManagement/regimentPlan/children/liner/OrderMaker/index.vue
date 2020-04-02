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
      <div class="total-ground">
        总价: 123
      </div>
    </header>
    <main>
      <InfoGround ref="infoGround"></InfoGround>
      <ChannelGround ref="channelGround"></ChannelGround>
      <CabinGround ref="cabinGround"></CabinGround>
    </main>
  </div>
</template>

<script>
/**
 * 下单流程,先走php验证接口,然后走.net提交接口,再将.net生成的id和orderCode带给php的提交接口 
 */

import './FixedBar'
import InfoGround from './comps/InfoGround'
import ChannelGround from './comps/ChannelGround'
import CabinGround from './comps/CabinGround'
import { getSkuPlanInfo, getProductInfo } from './api'

let skuPlanCache;
export default {

  components: { InfoGround, ChannelGround, CabinGround },
  
  mounted(){
    let { sku_id, product_id }= this.$route.query;
    Promise.all([
      getProductInfo(product_id),
      getSkuPlanInfo(sku_id) 
    ]).then(res => console.log(res))
  },

  beforeDestroy(){
    skuPlanCache= null;
  }

}
</script>