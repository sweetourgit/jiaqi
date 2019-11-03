<style lang="scss" scoped>
.show-panel{
  height: 940px;
  &>header{
    &>header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #ddd;
      .date-block{

      }
      .previous::after{
        content: '过期';
        border-radius: 4px;
        color:red;
        background-color: #ddd;
        padding: 0 2px;
      }
    }
    &>main{
      .bar{
        height: 50px;
      }
    }
  }
  &>main{
    height: 100%;
    overflow: auto;
    .container{

    }
  }
  main::-webkit-scrollbar{
    z-index:11;
    width:6px;
  }
  main::-webkit-scrollbar:horizontal{
    height:6px
  }
  main::-webkit-scrollbar-thumb{
    border-radius:5px;width:6px;background:#b4bccc
  }
  main::-webkit-scrollbar-corner{
    background:#fff
  }
  main::-webkit-scrollbar-track{
    background:#fff
  }
  main::-webkit-scrollbar-track-piece{
    background:#fff;width:6px
  }
}
</style>

<template>
  <div class="show-panel">
    <header>
      <header>
        <div class="date-block previous">
          2019年10月20日
        </div>
        <div class="edit-btns">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="primary" size="small">删除</el-button>
        </div>
      </header>
      <main>
        <div class="bar">
          库存类型: 123
        </div>
      </main>
    </header>
    <main>
      <div class="container">
        123
      </div>
    </main>
  </div>
</template>

<script>
import { DAY_STATE } from '../../../../dictionary'

export default {

  inject: ['poolManager'],

  methods: {
    init(payload){
      let { date, id }= payload;
      if(id) this.packageID= id;
      this.poolManager.initShowVM({ vm: this });
    },

    setState(state, day){
      if(state=== DAY_STATE.MULTIPLE || state=== DAY_STATE.UNDO){
        
      } 
    }
  }
}
</script>