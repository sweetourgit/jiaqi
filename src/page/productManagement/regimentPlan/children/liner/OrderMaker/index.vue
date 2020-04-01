<style lang="scss" scoped>
.order-page{
  position: relative;
  height: 100%; 
  overflow: auto;
  &>header{
    position: static;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<template>
  <div class="order-page" style="padding-right: 10px;">
    <header v-fixed-bar>
      <div>
        <el-button size="small" type="info">取消</el-button>
        <el-button size="small" type="primary">预定不占</el-button>
        <el-button size="small" type="primary">预定占位</el-button>
        <el-button size="small" type="primary">确定占位</el-button>
      </div>
    </header>
    <div style="height: 3000px;width:100%;">
      123
    </div>
  </div>
</template>

<script>
import './FixedBar'

export default {

}
</script>