<style lang="scss" scoped>
.page{
  &>header{
    display: flex;
    align-content: center;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
  }
}
</style>

<template>
  <div class="page">
    <header @click="test= !test">
      <PriceHeader ref="priceHeader"></PriceHeader>
      <div>
        <el-button v-move-btn type="info" size="mini" v-if="test">返回2</el-button>
        <el-button v-move-btn type="info" size="mini">返回</el-button>
      </div>
    </header>
    <PriceMain ref="priceMain"></PriceMain>
  </div>
</template>

<script>
import PriceHeader from './comps/PriceHeader/PriceHeader'
import PriceMain from './comps/PriceMain/PriceMain'
import MoveBtn from './moveBtn'

let moveBtn= new MoveBtn();
export default {

  components: { PriceHeader, PriceMain },

  directives: { 
    moveBtn: {
      inserted: moveBtn.inserted.bind(moveBtn),
      componentUpdated: moveBtn.componentUpdated.bind(moveBtn),
      unbind: moveBtn.unbind.bind(moveBtn),
    }
  },

  data(){
    return {
      test: false,
    }
  }

}
</script>