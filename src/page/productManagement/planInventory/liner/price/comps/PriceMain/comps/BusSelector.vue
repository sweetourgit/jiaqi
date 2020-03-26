<template>
  <el-table border size="small" header-row-class-name="row-header" style="width: 100%; margin-top: 50px;"
    :data="tableData" 
    :highlight-current-row="false">
    <el-table-column label="接送巴士" prop="title" header-align="center" align="center"></el-table-column>
    <el-table-column label="城市" prop="city" header-align="center" align="center" width="150"></el-table-column>
    <el-table-column label="集合地点" prop="resort" header-align="center" align="center" width="150"></el-table-column>
    <el-table-column label="价格说明" prop="price" header-align="center" align="center" width="150"></el-table-column>
    <el-table-column label="售卖价格" prop="sale_price" header-align="center" align="center" width="200"></el-table-column>
    <el-table-column label="操作" header-align="center" align="center" width="150">
      <template slot-scope="scope">
        <el-checkbox 
          v-model="scope.row.selected"
          :disabled="parentState=== 'readonly'">
          选定
        </el-checkbox>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { deliverListAll } from '@/page/productManagement/planInventory/liner/api'

let cache;
let deliverPromise;
export default {
  props: ['parentState'],

  mounted(){
    let { product_id }= this.$route.query;
    deliverPromise= deliverListAll({ product_id }).then(res => Promise.resolve(res))
  },

  beforeDestroy(){
    cache= null;
    deliverPromise= null;
  },

  data(){
    return {
      tableData: [],
    }
  },

  methods: {
    init(selected){
      deliverPromise.then(list => this.tableData= list.map(el => this.adaptor(el, selected)));
      cache= this.$deepCopy(this.tableData);
    },

    adaptor(deliver, selected){
      deliver.selected= !!selected.find(el => el.deliver_id=== deliver.id);
      return deliver;
    },

    notChange(){
      return this.$checkLooseEqual(this.tableData, cache);
    },

    getData(){
      let result= [];
      this.tableData.forEach(el => {
        if(el.selected) result.push({ deliver_id: el.id });
      })
      return result;
    }
  }

}
</script>