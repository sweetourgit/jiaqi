<style lang="scss" scoped>
.title-bar{
  position: relative;
  width: 100%;
  padding: 0 36px;
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
  background-color: transparent;
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
  <div class="title-bar" v-show="dataList.length">
    <div class="control-btns">
      <i class="el-icon-d-arrow-left"></i>
    </div>
    <div class="scroll-container">
      <div class="scroll-body" style="width: 2000px;">

        <div :class="['bar-outer', el.selected && 'selected']"
          v-for="el in dataList"
          :key="el.id"
          @click="clickHandler(el)">
          <div class="title-text"
            :title="el.label">
            {{ el.label }}
          </div>
          <div class="close-btn"
            v-show="options.deletable"
            @click.stop="closeHandler(el)">
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
    dataList: Array,
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

  methods: {
    clickHandler(title){
      if(!title) return this.$emit('select');
      if(typeof title=== 'number') title= this.dataList.find(el => el.key=== title);
      let find= this.dataList.find(el => el.selected);
      if(!find || find=== title) return;
      find.selected= false;
      title.selected= true;
      this.$forceUpdate();
      this.$emit('select', title);
    },
    closeHandler(title){
      let index= this.dataList.findIndex(el => el=== title);
      this.$emit('close', title.key);
      if(this.dataList.length=== 0) return;
      let find= this.dataList[index];
      this.clickHandler(find);
    },
  }

}
</script>