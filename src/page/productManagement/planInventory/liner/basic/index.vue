<style lang="scss" scoped>
.page{

}
</style>

<template>
  <div class="page">
    <SkuGround></SkuGround>
    <BusGround></BusGround>
    <InsureGround></InsureGround>
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