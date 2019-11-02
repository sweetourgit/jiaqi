<style lang="scss" scoped>
.price-child{
  height: 100%;
  padding-bottom: 50px;
  &>main{
    position: relative;
    height: 100%;
    padding-left: 200px;
    padding-right: 400px;
  }
}
</style>

<template>
  <div class="price-child">
    <header></header>
    <main>
      <common-slider style="position:absolute;width: 200px;left: 0; top: 0;"
        ref="sliderRef"
        @slider-select="init"
      ></common-slider>
      <date-panel
        ref="dateRef"
      ></date-panel>
    </main>
    <footer></footer>
  </div>
</template>

<script>
import commonSlider from '../common-slider'
import datePanel from './comps/date-panel/date-panel'

export default {

  components: { commonSlider, datePanel },

  data(){
    return {
      vm: {},
    }
  },

  methods: {
    init(payload){
      if(!payload) return this.vm.inited= false;
      let { id, rate }= payload;
      this.checkProto= payload;
      this.vm.inited= true;
      this.vm.rate= rate;
      this.$refs.sliderRef.init(id);
      this.$refs.dateRef.init({ id });
    },
  }

}
</script>