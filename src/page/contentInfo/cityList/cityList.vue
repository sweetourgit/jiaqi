<style lang="scss" scoped>
.city-list{
  height: 100%;
  box-sizing: border-box;
  &>main{
    position: relative;
    width: 1400px;
    padding-left: 244px; 
    .tree-slider{
      position: absolute;
      top: 0;
      left: 0;
      width: 244px;
      height: 540px;
    }
    .table-ground{
      box-sizing: border-box;
      width: 1156px;
    }
  }
}
</style>

<template>
  <div class="city-list">
    <header>
      <bread-header ref="breadHeaderRef"
        @node-click="nodeClickHandler"
      ></bread-header>
    </header>
    <main>
      <div class="tree-slider">
        <tree-slider ref="treeSliderRef"
          @node-click="nodeClickHandler"
        ></tree-slider>
      </div>
      <div class="table-ground">
        <table-ground ref="tableGroundRef"
          @node-click="nodeClickHandler"
        ></table-ground>
      </div>
    </main>
  </div>
</template>

<script>
import breadHeader from './comps/breadHeader'
import treeSlider from './comps/treeSlider'
import tableGround from './comps/tableGround'

export default {

  components: { breadHeader, treeSlider, tableGround },

  mounted(){
    this.$refs.treeSliderRef.init();
  },

  data(){
    return {

    }
  },

  methods: {
    init(pid){

    },

    nodeClickHandler(nodeProto){
      this.$refs.breadHeaderRef.init(nodeProto);
      this.$refs.tableGroundRef.init(nodeProto);
    }
  }
}
</script>