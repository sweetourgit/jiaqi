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
          v-show="editState=== 'edit'"
          @click="addHandler">
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
import { saveSkuStocks } from '@/page/productManagement/planInventory/liner/api'
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

    addHandler(){
      if(this.notChange()) return this.$message.info('数据无变化');
      let { product_id, sku_id }= this.$route.query;
      let { id: create_uid, orgID: org_id }= this.$storageLoader({ loader: sessionStorage, attrs: [ 'id', 'orgID' ] });
      let data= this.$refs.priceMain.getData();
      let result= { product_id, sku_id, create_uid, org_id, plan: null }
      result.plan= this.$refs.priceHeader.selectedCalendar.map(el => {
        return {
          ...data,
          set_out_year: el._date.getFullYear(),
          set_out_month: el._date.getMonth()+ 1,
          set_out_day: el._date.getDate()
        }
      })
      saveSkuStocks(result).then(() => {
        this.$message.success('计划新增成功');
        let day= result.plan[0];
        this.$refs.priceHeader.init(
          new Date(day.set_out_year, day.set_out_month- 1, day.set_out_day), true)
      });
    },

    saveHandler(){
      if(this.notChange()) return this.$message.info('数据无变化');
      console.log(this.$refs.priceHeader.selectedCalendar)
    },

    notChange(){
      let bol= this.$refs.priceMain.notChange();
      return bol;
    },

    emitParentStatus({ state, selected }){
      this.editState= state;
      if(state=== 'edit') return this.$refs.priceMain.init(selected.plan);
      this.$refs.priceMain.init();
    }
  }
}
</script>