<style lang="scss" scoped>
.title-bar{
  position: relative;
  line-height: 32px;
  width: 100%;
  padding: 0 36px;
  box-sizing: content-box;
  cursor: pointer;
  *{
    box-sizing: content-box;
  }
  .control-btns{
    display: inline-block;
    width: 36px;
    text-align: center;
  }
  .control-btns:first-child{
    position: absolute;
    top: 0;
    left: 0;
  }
  .control-btns:last-child{
    position: absolute;
    top: 0;
    right: 0;
  }
  .control-btns:hover{
    color: #409EFF;
  }
  .scroll-container{
    display: inline-block;
    width: 100%;
    overflow: hidden;
    .scroll-body{
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      max-width: 100%;
      overflow-x:auto;
      & .bar-outer{
        user-select: none;
        display: inline-block;
      }
      & .selected{
        border-bottom: 2px solid #333;
      }
      &::-webkit-scrollbar{
        display: none;
      }
    }
  }
}
</style>

<template>
  <div class="title-bar">
    <div class="control-btns">
      <i class="el-icon-d-arrow-left"></i>
    </div>
    <div class="scroll-container">
      <div class="scroll-body" style="width: 2000px;">
        <div class="bar-outer">123123123123123123</div>
        <div>123123123123123123</div>
        <div>123123123123123123</div>
        <div>123123123123123123</div>
        <div>123123123123123123</div>
        <div>123123123123123123</div>
        <div>123123123123123123</div>
        <div>123123123123123123</div>
        <div>123123123123123123</div>
        <div>123123123123123123</div>
        <div>123123123123123123</div>
        <div>123123123123123123</div>
        <div>123123123123123123</div>
      </div>
    </div>
    <div class="control-btns">
      <i class="el-icon-d-arrow-right"></i>
    </div>
  </div>
</template>

<script>
export default {

  props: {
    list: Array,
    deletable: {
      type: Boolean,
      default: true
    },
  },

}
</script>