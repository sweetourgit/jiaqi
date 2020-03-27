<style lang="scss" scoped>
.page{
  padding-bottom: 80px;
}
</style>

<template>
  <div class="page">
    <SkuGround ref="skuGround"></SkuGround>
    <BusGround ref="busGround"></BusGround>
    <InsureGround ref="insureGround"></InsureGround>
  </div>
</template>

<script>
import SkuGround from './subs/sku/SkuGround'
import BusGround from './subs/bus/BusGround'
import InsureGround from './subs/insure/InsureGround'

export default {
  components: { SkuGround, BusGround, InsureGround },
}
</script>