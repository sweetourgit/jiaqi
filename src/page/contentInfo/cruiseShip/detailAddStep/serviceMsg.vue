<template>
  <div class="curiseShip">
    <el-button type="warning" @click='addCabin'>添加</el-button>
    <el-table :data="tableData" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content">
      <el-table-column prop="id" label="名称" align="center">
      </el-table-column>
      <el-table-column prop="id" label="消费" align="center">
      </el-table-column>
      <el-table-column prop="id" label="简介" align="center">
      </el-table-column>
      <el-table-column prop="id" label="图片" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope"> 
          <el-button @click="edit(scope.row)" type="text" size="small" class="table_details">编辑</el-button>
          <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageCurrent" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
    <cabinAdd :dialogFormVisible='dialogFormVisible' :info='info' @close="closeAdd"></cabinAdd>
  </div>
</template>
<script type="text/javascript">
import cabinAdd from '@/page/contentInfo/cruiseShip/detailAddStep/serviceMsgAdd.vue'
export default {
  name: "curiseShip",
  components: {
    cabinAdd
  },
  data() {
    return {
      tableData: [{id: '11'}],
      pageCurrent: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      info: ''
    }
  },
  computed: {},
  methods: {
    // 表格header设置
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    addCabin(){
      this.dialogFormVisible = true;
    },
    closeAdd(){
      this.dialogFormVisible = false;
    },
    handleSizeChange(){

    },
    handleCurrentChange(){

    },
    loadData(){

    }
  },
  created() {
    
  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
  .block{
    display: block;
    text-align: center;
    margin: 10px auto;
  }
</style>
