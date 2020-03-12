<style lang="scss" scoped>
.page{

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

import { skuListAllAction, insureListAllAction, deliverListAllAction } from '../api'

export default {
  components: { SkuGround, BusGround, InsureGround },

  mounted(){
    let payload= this.$route.query;
    Promise.all([
      skuListAllAction(payload),
      deliverListAllAction(payload),
      insureListAllAction(payload)
    ]).then(res => {
      this.$refs.skuGround.init(res[0]);
      this.$refs.busGround.init(res[1]);
      this.$refs.insureGround.init(res[2]);
    })
  }
}
</script>