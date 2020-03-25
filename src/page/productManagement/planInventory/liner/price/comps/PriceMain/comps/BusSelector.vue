<template>
  <el-table border size="mini" header-row-class-name="row-header" style="width: 100%; margin-top: 50px;"
    :data="tableData" 
    :highlight-current-row="false">
    <el-table-column label="标题" prop="title" header-align="center" align="center"></el-table-column>
    <el-table-column label="城市" prop="city" header-align="center" align="center" width="150"></el-table-column>
    <el-table-column label="集合地点" prop="resort" header-align="center" align="center" width="150"></el-table-column>
    <el-table-column label="价格说明" prop="price" header-align="center" align="center" width="150"></el-table-column>
    <el-table-column label="售卖价格" prop="sale_price" header-align="center" align="center" width="200">
      <template slot-scope="scope">
        {{ scope.row.sale_price | priceFilter }}
      </template>
    </el-table-column>
    <el-table-column label="操作" header-align="center" align="center" width="150">
      <template slot-scope="scope">
        <el-checkbox 
          v-model="scope.row.radio"
          :disabled="parentState=== 'readonly'">
          选定
        </el-checkbox>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { deliverListAll } from '@/page/productManagement/planInventory/liner/api'

let deliverPromise;
export default {
  props: ['parentState'],

  filters: {
    priceFilter(val){
      if(!val) return '';
      return val.toFixed(2);
    }
  },

  mounted(){
    let { product_id }= this.$route.query;
    deliverPromise= deliverListAll({ product_id }).then(res => Promise.resolve(res))
  },

  beforeDestroy(){
    deliverPromise= null;
  },

  data(){
    return {
      tableData: [],
      radio: '1'
    }
  },

  methods: {
    init(selected){
      deliverPromise.then(list => console.log(list));
    },

    notChange(){
      return true;
    },

    getData(){
      return [];
    }
  }

}
</script>