<style lang="scss" scoped>
.price-ground{
  margin-top: 50px;
}
</style>

<template>
  <div class="price-ground">
    <header>

    </header>
    <main>
      <el-table border size="mini" style="width: 100%"
        :data="tableData" 
        :highlight-current-row="false"
        header-row-class-name="row-header">
        <el-table-column label="标题" prop="title" header-align="center" align="center"></el-table-column>
        <el-table-column label="房型" header-align="center" align="center">
          <template slot-scope="scope">{{ getCabinName(scope.row.cabin_id) }}</template>
        </el-table-column>
        <el-table-column label="最少入住" prop="min_stay" header-align="center" align="center"></el-table-column>
        <el-table-column label="同业价" prop="adult_same_price" header-align="center" align="center"></el-table-column>
        <el-table-column label="销售价" prop="adult_straight_price" header-align="center" align="center"></el-table-column>
        <el-table-column label="库存" prop="stock" header-align="center" align="center"></el-table-column>
        <el-table-column label="上线/下线" prop="line_status" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" prop="adult_straight_price" header-align="center" align="center">
          <template>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <PriceEditor ref="editor"></PriceEditor>
  </div>
</template>

<script>
import PriceEditor from './comps/PriceEditor'
import { getLinerCabinType } from '@/page/productManagement/planInventory/liner/api'

/**
cabin_id: null,
    title: '',
    min_stay: null,
    max_stay: null,
    stock: null,
    adult_same_price: null,
    adult_straight_price: null,
    line_status: 1
 */

export default {
  components: { PriceEditor },

  mounted(){
    this.makeCabinTypeOptions();
  },

  data(){
    return {
      cabinTypePromise: null,
      cabinTypeOptions: [],
      priceMap: null,
      tableData: [],
    }
  },

  methods: {
    init(priceArr){
      this.cabinTypePromise.then(() => {
        this.priceMap= this.makePriceMap(priceArr);
      })
    },

    makeCabinTypeOptions(){
      this.cabinTypePromise= getLinerCabinType({ liner_id: 1, limit: 100 }).then(res => {
        this.cabinTypeOptions= res
        return Promise.resolve();
      });
    },

    makePriceMap(priceArr){
      let result= {};
      priceArr.forEach(price => {
        
      })
    }
  }

}
</script>