<template>
  <el-table border size="small" style="width: 100%; margin-top: 50px;"
    :data="tableData" 
    :highlight-current-row="false"
    header-row-class-name="row-header">
    <el-table-column label="保险" prop="title" header-align="center" align="center"></el-table-column>
    <el-table-column label="售卖价格" prop="sale_price" header-align="center" align="center" width="200"></el-table-column>
    <el-table-column label="操作" prop="quota" header-align="center" align="center" width="150">
      <template slot-scope="scope">
        <el-checkbox v-model="scope.row.selected">选中</el-checkbox>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { insureListAll } from '@/page/productManagement/planInventory/liner/api'

let cache;
let insurePromise;
export default {

  mounted(){
    let { product_id }= this.$route.query;
    insurePromise= insureListAll({ product_id, line_status: 1 }).then(res => Promise.resolve(res));
  },

  beforeDestroy(){
    cache= null;
    insurePromise= null;
  },

  data(){
    return {
      tableData: []
    }
  },

  methods: {
    
    init(selected){
      console.log(selected)
      this.tableData.forEach(el => el.selected= false);
      insurePromise.then(list => this.tableData= list.map(el => this.adaptor(el, selected)));
      cache= this.$deepCopy(this.tableData);
    },

    adaptor(insure, selected){
      insure.selected= !!selected.find(el => el.insure_id=== insure.id);
      return insure;
    },

    notChange(){
      return this.$checkLooseEqual(this.tableData, cache);
    },

    getData(){
      let result= [];
      this.tableData.forEach(el => {
        if(el.selected) result.push({ insure_id: el.id });
      })
      return result;
    }
  }

}
</script>