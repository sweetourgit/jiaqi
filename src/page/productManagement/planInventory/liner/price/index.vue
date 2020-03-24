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
    color: #333;
    background-color: #f2f2f2;
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
        @set-parent-status="emitParentStatus">
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
import { getSkuPlanDTO } from '@/page/productManagement/planInventory/liner/dictionary'
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

    addHandler(){},

    notChange(){
      let bol= this.$refs.priceMain.notChange();
      return bol;
    },

    emitParentStatus({ state, selected }){
      this.editState= state;
      if(selected) return this.$refs.priceMain.init(selected.plan);
      this.$refs.priceMain.init(getSkuPlanDTO(this.$route.query));
    }
  }
}
</script>