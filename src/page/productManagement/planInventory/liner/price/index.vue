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
  & >>> .row-header{
    background-color: rgb(247, 247, 247);
  }
  & >>> th{
    background-color: transparent;
  }
}
</style>

<template>
  <div class="page">
    <header>
      <PriceHeader ref="priceHeader"
        :options="options"
        @set-parent-status="editState= $event"
        @select-day="emitSelectDay">
      </PriceHeader>
      <div v-move-btn style="display:flex;justify-content: flex-end;width: 240px;z-index: 1999;">
        <el-button type="info" size="mini"
          v-show="editState=== 'edit'">
          保存
        </el-button>
        <el-button type="info" size="mini"
          v-show="editState=== 'add'"
          @click="addHandler">
          提交
        </el-button>
        <el-button type="info" size="mini">返回</el-button>
      </div>
    </header>
    <PriceMain ref="priceMain"
      :state="editState">
    </PriceMain>
    
  </div>
</template>

<script>
import PriceHeader from './comps/PriceHeader/PriceHeader'
import PriceMain from './comps/PriceMain/PriceMain'
import './moveBtn'

export default {

  components: { PriceHeader, PriceMain },

  mounted(){
    this.$refs.priceHeader.init(new Date());
  },

  data(){
    return {
      editState: null,
      options: {
        notChange: this.notChange
      }
    }
  },

  methods: {
    // 选中一天
    emitSelectDay(day){
      let { plan }= day;
      this.$refs.priceMain.init(plan);
    },

    addHandler(){},

    notChange(){
      return this.$refs.priceMain.notChange();
    }
  }
}
</script>