<style lang="scss" scoped>
.order-page{
  position: relative;
  height: 100%; 
  overflow: auto;
  &>header{
    display: flex;
    justify-content: flex-end;
    padding: 0 10px 10px 0;
    background-color: transparent;
  }
}
</style>

<template>
  <div class="order-page">
    <header v-fixed-bar>
      <div>
        <el-button size="small" type="info">取消</el-button>
        <el-button size="small" type="primary">预定不占</el-button>
        <el-button size="small" type="primary">预定占位</el-button>
        <el-button size="small" type="primary">确定占位</el-button>
      </div>
    </header>
    <main>
      <InfoGround ref="infoGround"></InfoGround>
      <ChannelGround ref="channelGround"></ChannelGround>
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
import { getSkuPlanInfo, getProductInfo } from './api'

let skuPlanCache;
export default {

  components: { InfoGround, ChannelGround },
  
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