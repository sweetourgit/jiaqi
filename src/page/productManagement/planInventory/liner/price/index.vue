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
          @click="saveHandler">
          保存
        </el-button>
        <el-button type="info" size="mini"
          v-show="editState=== 'add'"
          @click="addHandler">
          提交
        </el-button>
        <el-button type="info" size="mini"
          @click="backHandler">
          返回
        </el-button>
      </div>
    </header>
    <PriceMain ref="priceMain"></PriceMain>
    
  </div>
</template>

<script>
import { saveSkuStocks, editSkuStock } from '@/page/productManagement/planInventory/liner/api'
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
      let date= this.$refs.priceHeader.selectedCalendar[0]._date;
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
        this.$refs.priceHeader.init(date, true);
        this.$refs.priceMain.init();
      });
    },

    saveHandler(){
      if(this.notChange()) return this.$message.info('数据无变化');
      let { product_id, sku_id }= this.$route.query;
      let { id: create_uid, orgID: org_id }= this.$storageLoader({ loader: sessionStorage, attrs: [ 'id', 'orgID' ] });
      let data= this.$refs.priceMain.getData();
      let result= { product_id, sku_id, create_uid, org_id, plan: null }
      let date= this.$refs.priceHeader.selectedCalendar[0]._date;
      result.plan= [data];
      editSkuStock(result).then(() => {
        this.$message.success('计划修改成功');
        this.$refs.priceHeader.init(date, true);
        this.$refs.priceMain.init();
      });
    },

    backHandler(){
      let { product_id, liner_id }= this.$route.query;
      let path= '/product/planInventory/liner/basic';
      if(this.notChange()) return this.$router.push({ path, query: { product_id, liner_id } });
      this.$confirm('存在数据变动，是否保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .catch(() => this.$router.push({ path, query: { product_id, liner_id } }));
    },

    notChange(){
      let bol= this.$refs.priceMain.notChange();
      return bol;
    },

    emitParentStatus({ state, selected }){
      if(state=== 'edit' || state=== 'readonly') this.$refs.priceMain.init({ plan: selected.plan, state });
      if(state=== 'add') this.$refs.priceMain.init({ state });
      if(!state) this.$refs.priceMain.init({});
      this.editState= state;
    }
  }
}
</script>