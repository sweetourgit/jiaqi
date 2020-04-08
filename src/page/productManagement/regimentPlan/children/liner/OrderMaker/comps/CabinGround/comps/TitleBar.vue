<style lang="scss" scoped>
.title-bar{
  position: relative;
  width: 100%;
  padding: 0 36px;
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
  *{
    box-sizing: content-box;
  }
  .control-btns{
    display: inline-block;
    width: 36px;
    top: 0;
    text-align: center;
    cursor: pointer;
  }
  .control-btns:first-child{
    position: absolute;
    left: 0;
  }
  .control-btns:last-child{
    position: absolute;
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
      &::-webkit-scrollbar{
        width: 10px;
        height: 4px;
        border-radius: 2px;
      }
      &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #AAA;
      }
      &::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: #EDEDED;
      }
    }
    .bar-outer{
      position: relative;
      display: inline-block;
      padding: 0 30px 0 30px;
      box-sizing: border-box;
      user-select: none;
      .title-text{
        max-width: 300px;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      .close-btn{
        position: absolute;
        display: block;
        width: 30px;
        top: 0;
        right: 0;
        text-align: center;
        color: gray;
        cursor: pointer;
      }
    }
    .selected{
      color: #409EFF;
      font-weight: bold;
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

        <div class="bar-outer selected">
          <div class="title-text"
            :title="'123'">
            123
          </div>
          <div class="close-btn"
            v-show="options.deletable">
            <i class="el-icon-close"></i>
          </div>
        </div>

        <div class="bar-outer">
          <div class="title-text"
            :title="'123'">
            123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123
          </div>
          <div class="close-btn"
            v-show="options.deletable">
            <i class="el-icon-close"></i>
          </div>
        </div>

        <div class="bar-outer">
          <div class="title-text"
            :title="'123'">
            123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123
          </div>
          <div class="close-btn"
            v-show="options.deletable">
            <i class="el-icon-close"></i>
          </div>
        </div>

        <div class="bar-outer">
          <div class="title-text"
            :title="'123'">
            123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123
          </div>
          <div class="close-btn"
            v-show="options.deletable">
            <i class="el-icon-close"></i>
          </div>
        </div>

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
    options: {
      type: Object,
      default(){
        return {
          // 是否有删除
          deletable: false,
          // badge
          badge: false
        }
      }
    }
  },

}
</script>