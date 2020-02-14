<template>
  <div class="curiseShip">
    <!-- 搜索表单 -->
    <el-form label-width="110px" class="form-content">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="游轮公司:" prop="company">
            <el-input v-model="company" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="8">
          <el-form-item class="buttonForm">
            <el-button @click="searchHandInside()" type="primary">搜索</el-button>
            <el-button @click="emptyButtonInside()" type="primary" plain>重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 搜索表单 END -->
    <div class="buttonsDv">
      <el-button @click="addShip" type="warning">添加</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content">
      <el-table-column prop="id" label="ID" align="center">
      </el-table-column>
      <el-table-column prop="company_name" label="游轮公司" align="center">
      </el-table-column>
      <el-table-column prop="linernums" label="旗下游轮" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="routerToDetail(scope.row)" type="text" size="small" class="table_details">详情</el-button>
          <el-button @click="edit(scope.row)" type="text" size="small" class="table_details">编辑</el-button>
          <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageCurrent" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total='totalNum'>
      </el-pagination>
    </div>
    <!-- 表格 END -->
    <cruiseShipAdd :dialogFormVisible='dialogFormVisible' :info='info' @close="closeAdd"></cruiseShipAdd>
  </div>
</template>
<script type="text/javascript">
import cruiseShipAdd from '@/page/contentInfo/cruiseShip/cruiseShipAdd.vue'
export default {
  name: "curiseShip",
  components: {
    cruiseShipAdd
  },
  data() {
    return {
      company: '', // 游轮公司搜索字段
      tableData: [], // table表格字段
      pageCurrent: 1, // 当前页数
      pageSize: 10, // 每页条数
      totalNum: 0, // 总条数

      dialogFormVisible: false, // 添加弹框显示隐藏
      info: '', // 给编辑弹框传值
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
    // 搜索
    searchHandInside(){
      this.loadData();
    },
    // 重置
    emptyButtonInside(){
      this.company = '';
      this.loadData();
    },
    // 添加
    addShip(){
      this.dialogFormVisible = true;
    },
    edit(row){
      this.dialogFormVisible = true;
      this.info = row.id;
    },
    // 关闭添加弹框
    closeAdd(){
      this.dialogFormVisible = false;
      this.info = '';
    },
    // 查看详情
    routerToDetail(row){
      this.$router.push({
        path: '/cruiseShip/cruiseShipDetail',
        name: '邮轮管理/详情',
        query: row.id
      });
    },
    // 改变每页条数
    handleSizeChange(val){
      this.pageSize = val;
      this.pageCurrent = 1;
    },
    // 改变页数
    handleCurrentChange(val){
      this.pageCurrent = val;
    },
    // 加载数据
    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner-company/listpage", {
        "pageIndex": this.pageCurrent,
        "pageSize": this.pageSize,
        "company_name": this.company
      }, ).then(function(response) {
        console.log('获取邮轮公司',response);
        if (response.data.code == '200') {
          that.tableData = response.data.data.list;
          that.totalNum = response.data.data.total - 0;
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });

    }
  },
  created() {
    this.loadData();
  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
  .form-content{
    background: #f7f7f7;
    padding: 20px 10px;
    margin: 20px 10px;
    .buttonForm{
      text-align: center;
    }
  }
  .buttonsDv{
    width: 98%;
    margin: 5px auto;
    .el-button{
      margin-right: 10px;
    }
  }
  #table-content{
    width: 98%;
    margin: 40px auto 20px;
  }
  .block{
    width: 100%;
    text-align: center;
    margin: 30px auto;
  }
</style>
