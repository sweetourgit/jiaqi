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
        <el-checkbox v-model="scope.row.radio">选中</el-checkbox>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {

  filters: {
    priceFilter(val){
      if(!val) return '';
      return val.toFixed(2);
    }
  },

  data(){
    return {
      tableData: [{ title: 123, sale_price: 32, radio: false }],
      radio: '1'
    }
  }

}
</script>