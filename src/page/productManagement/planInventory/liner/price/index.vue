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
    <header>
      <PriceHeader></PriceHeader>
      <el-button type="info" size="mini">返回</el-button>
    </header>
  </div>
</template>

<script>
import PriceHeader from './comps/PriceHeader/PriceHeader.vue'

export default {

  components: { PriceHeader }

}
</script>