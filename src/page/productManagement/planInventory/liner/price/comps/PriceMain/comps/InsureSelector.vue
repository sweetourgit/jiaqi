<template>
  <el-table border size="mini" style="width: 100%; margin-top: 50px;"
    :data="tableData" 
    :highlight-current-row="false"
    header-row-class-name="row-header">
    <el-table-column label="标题" prop="id" header-align="center" align="center" width="800"></el-table-column>
    <el-table-column label="售卖价格" prop="sign" header-align="center" align="center"></el-table-column>
    <el-table-column label="操作" prop="quota" header-align="center" align="center" width="150">
      <template slot-scope="scope">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.radio">选中</el-checkbox>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { insureListAll } from '@/page/productManagement/planInventory/liner/api'

export default {

  mounted(){
    let { product_id }= this.$route.query;
    insureListAll({ product_id }).then(res => this.tableData= res.map(el => (el.selected= false) && el));
  },

  data(){
    return {
      tableData: []
    }
  },

  methods: {
    init(){},
    notChange(){
      return true;
    }
  }

}
</script>