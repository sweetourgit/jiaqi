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
      <common-slider style="position:absolute;height: 940px; width: 200px; left: 0; top: 50px;"
        ref="sliderRef"
        @slider-select="init"
      ></common-slider>
      <date-panel
        ref="dateRef"
      ></date-panel>
      <show-panel style="position:absolute; width: 380px; right: 0; top: 54px;"
        ref="showRef"
        :parent-vm="vm"
        @awake-edit-form="awakeEditForm"
        @refresh-date-panel="refreshDatePanel"
      ></show-panel>
    </main>
    <footer></footer>
  </div>
</template>

<script>
import commonSlider from '../common-slider'
import datePanel from './comps/date-panel/date-panel'
import showPanel from './comps/show-panel/show-panel'

import PoolManager from './PoolManager'

export default {

  components: { commonSlider, datePanel, showPanel },

  provide: {
    poolManager: new PoolManager()
  },

  beforeDestroy(){
    this._provided.poolManager.destroy();
  },

  data(){
    return {
      vm: {
        pacId: null,
        inited: false,
        rate: 0
      },
    }
  },

  methods: {
    init(payload){
      if(!payload) return this.vm.inited= false;
      let { id, rate, timestamp }= payload;
      this.checkProto= payload;
      this.vm.pacId= id;
      this.vm.inited= true;
      this.vm.rate= rate;
      // timestamp为共享库存跳转带来的制定天
      this.$refs.dateRef.init({ 
        id, 
        date: timestamp? new Date(parseInt(timestamp)): null, 
        sureDate: timestamp? true: false, //是否初始化后选择准确日期
        rate
      });
      this.$refs.showRef.init({ id });
      this.$refs.sliderRef.init(id);
    },
  
    awakeEditForm(payload){
      this.$refs.dateRef.awakeEditForm(payload);
    },

    refreshDatePanel(payload){
      this.$refs.dateRef.refresh(payload);
    }
  }

}
</script>