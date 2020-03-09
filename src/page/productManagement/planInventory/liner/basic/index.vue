<style lang="scss" scoped>
.page{

}
</style>

<template>
  <div class="page">
    <SkuGround></SkuGround>
    <BusGround></BusGround>
  </div>
</template>

<script>
import SkuGround from './subs/sku/SkuGround'
import BusGround from './subs/bus/BusGround'

export default {
  components: { SkuGround, BusGround },
}
</script>