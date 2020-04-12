<style lang="scss" scoped>

</style>

<template>
  <div style="padding-bottom: 40px;">
    <div style="padding: 10px 0 22px 0;">
      <LinkTitleBar
        ref="titleBar"
        @select="selectCabin">
      </LinkTitleBar>
    </div>
  </div>
</template>

<script>
import LinkTitleBar from '../CabinGround/comps/LinkTitleBar/index'

export default {
  components: { LinkTitleBar },
  
  computed: {
    cabinTitles(){
      return this.cabin.map((el, index) => {
        let skuPrice= el.sku_price;
        let { id, title }= skuPrice;
        return { key: id, label: title, selected: this.cabin.length=== index+ 1 };
      })
    },
  },

  data(){
    return {
      cabin: [],
    }
  },
  
  methods: {
    init(cabin){
      this.cabin= cabin;
    },
    
    selectCabin(index){
      let cabin= this.cabin[index];
    }
  }
}
</script>