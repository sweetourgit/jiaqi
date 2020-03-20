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
      <div v-move-btn style="display:flex;justify-content: flex-end;width: auto;">
        <el-button type="info" size="mini" v-show="test">保存</el-button>
        <el-button type="info" size="mini">返回</el-button>
      </div>
    </header>
    <PriceMain ref="priceMain"></PriceMain>
  </div>
</template>

<script>
import PriceHeader from './comps/PriceHeader/PriceHeader'
import PriceMain from './comps/PriceMain/PriceMain'
import './moveBtn'

export default {

  components: { PriceHeader, PriceMain },

  data(){
    return {
      test: true,
    }
  }

}
</script>