<style lang="scss" scoped>
.common-slider{
  height: 100%;
  width: 100%;
  &>main{
    height: 100%;
    padding:0 5px;
    .container{
      height: 100%;
      overflow: auto;
      .pac-title{
        padding: 5px;
        cursor: pointer;
        .title-bar{
          user-select: none;
          text-align: center;
          line-height: 2;
          border-radius: 4px;
          padding: 0 5px;
          background-color: #F7F7F7;
          word-break:keep-all;/* 不换行 */
          white-space:nowrap;/* 不换行 */
          overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
          text-overflow:ellipsis;
        }
        .selected{
          color: #FFF;
          background-color: #409EFF;
        }
        .disabled{
          opacity: 0.8;
          color: #ddd;
        }
      }
    }
    .container::-webkit-scrollbar{
      z-index:11;
      width:6px;
    }
    .container::-webkit-scrollbar:horizontal{
      height:6px
    }
    .container::-webkit-scrollbar-thumb{
      border-radius:5px;width:6px;background:#b4bccc
    }
    .container::-webkit-scrollbar-corner{
      background:#fff
    }
    .container::-webkit-scrollbar-track{
      background:#fff
    }
    .container::-webkit-scrollbar-track-piece{
      background:#fff;width:6px
    }
  }
}
</style>

<template>
  <div class="common-slider">
    <main>
      <div class="container">
        <div class="pac-title" v-for="(pac, i) in list" :key="pac.id"
          @click="select(pac, i)"
        >
          <el-tooltip effect="dark" :content="pac.inited? pac.name: '团号未设置'" placement="top-start">
            <div :class="[
              'title-bar', 
              (pac.inited && i=== currentIndex)? 'selected': '',
              pac.inited? '': 'disabled'
            ]">
              {{ pac.name }}
            </div>
          </el-tooltip>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {

  inject: ['PACKAGE_LIST'],

  data(){
    return {
      currentIndex: 0,
      list: [],
    }
  },

  methods: {
    init(id){
      if(!id) return;
      this.list.splice(0);
      this.list.push(...this.PACKAGE_LIST);
      this.PACKAGE_LIST[this.currentIndex].selected= false;
      this.currentIndex= this.list.findIndex(el => el.id=== id);
      this.PACKAGE_LIST[this.currentIndex].selected= true;
    },

    select(pac, i){
      if(i=== this.currentIndex) return;
      if(!pac.inited) return this.$message.error('请先设置套餐团号');
      this.$emit('slider-select', pac);
    }
  }

}
</script>