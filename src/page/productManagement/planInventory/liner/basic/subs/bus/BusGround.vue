<style lang="scss" scoped>
.bus-ground{
  margin-bottom: 75px;
  header {
    font-weight: bold;
    font-size: 24px;
    line-height: 2;
  }
}
</style>

<template>
  <div class="bus-ground">
    <header>
      大巴车
    </header>
    <main>
      <el-table border style="width: 100%"
      :data="tableData" 
      :highlight-current-row="false"
      header-row-class-name="row-header">
        <el-table-column label="标题" prop="title" header-align="center" align="center"></el-table-column>
        <el-table-column label="城市" prop="city" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column label="集合地点" prop="resort" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column label="价格说明" prop="price" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column label="售卖价格" prop="sale_price" header-align="center" align="center" width="200">
          <template slot-scope="scope">
            <TableInputer
              v-model="scope.row.sale_price"
              :options="priceOptions"
              table="bus"
              column="sale_price">
              {{ scope.row.sale_price | priceFilter }}
            </TableInputer>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text"
              @click="openDetailer(scope.row)">
              详情
            </el-button>
            <el-button type="text"
              @click="openPrice('bus', 'sale_price', scope.$index)">
              价格
            </el-button>
            <el-button type="text"
              v-show="scope.row.isPriced"
              @click="deliverOnOffLineAction(scope.row)">
              {{ scope.row.line_status=== 1? '下线': '上线' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <BusDetailer ref="detailer"></BusDetailer>
    </footer>
  </div>
</template>

<script>
// import TableInputer from './comps/TableInputer'
import { deliverListAll, saveDeliverPrice, deliverOnOffLine } from '@/page/productManagement/planInventory/liner/api'
import { TableInputer, manager as TableInputerManager } from './comps/TableInputer/index'
import BusDetailer from './comps/BusDetailer'

export default {

  components: { TableInputer, BusDetailer },

  filters: {
    priceFilter(val){
      if(!val) return '';
      return typeof val=== "string"? val: val.toFixed(2);
    }
  },

  mounted(){
    this.init();
  },

  data(){
    return {
      tableData: [],
      priceOptions: {
        placeholder: '请输入价格',
        pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
        message: '价格格式输入错误',
        adaptor: (val) => parseFloat(val),
        successCb: ({ index, oldVal }) => {
          let deliver= this.tableData[index];
          let { id, sale_price }= deliver;
          saveDeliverPrice({ id, sale_price })
          .then(() => {
            deliver= this.deliverAdaptor(deliver);
            this.$message.success('售卖价格修改成功');
          })
          .catch(() => {
            deliver.sale_price= oldVal;
            this.$message.error('售卖价格修改失败');
          });
        }
      }
    }
  },

  methods: {
    init(){
      let { product_id }= this.$route.query;
      deliverListAll({ product_id })
      .then(deliverList => this.tableData= deliverList.map(this.deliverAdaptor));
    },

    openPrice(table, column, index){
      let vm= TableInputerManager.getVm(table, column, index);
      vm.focus();
    },

    openDetailer(bus){
      this.$refs.detailer.open(bus)
    },

    deliverAdaptor(deliver){
      deliver.isPriced= !!deliver.sale_price;
      return deliver;
    },

    deliverOnOffLineAction(deliver){
      let { id, line_status: oldStatus, isPriced }= deliver;
      let line_status= oldStatus=== 2? 1: 2;
      if(line_status=== 1 && !isPriced) return this.$message.error('未设置价格不能上线');
      this.$confirm(`是否${line_status=== 1? '上线': '下线'}该大巴车信息?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        deliverOnOffLine({ id, line_status }).then(() => deliver.line_status= line_status);
      })
    }
  }

}
</script>
