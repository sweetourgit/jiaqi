<template>
  <div>
     <div class="demo-input-suffix">
         <span class="search-title">客商名称</span>
         <el-input placeholder="请输入" v-model="customerName" class="el-input"></el-input>
         <span class="search-title">销售</span>
         <el-input placeholder="请输入" v-model="saler" class="el-input"></el-input>
         <el-button type="primary">搜索</el-button>
         <el-button type="primary">重置</el-button>
     </div>
     <el-button type="primary" class="add" plain>添加</el-button>
     <!--list-->
     <el-table :data="groupList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border>
       <el-table-column  prop="id" label="ID" min-width="60" align="center"></el-table-column>
       <el-table-column  prop="name" label="客商名称" min-width="220" align="center"></el-table-column>
       <el-table-column  prop="saler" label="销售" min-width="90" align="center"></el-table-column>
       <el-table-column  prop="card" label="储值卡卡号" min-width="200" align="center"></el-table-column>
       <el-table-column  prop="price" label="金额" min-width="100" align="center"></el-table-column>
       <el-table-column  prop="price1" label="剩余金额" min-width="100" align="center"></el-table-column>
       <el-table-column  prop="time" label="创建时间" min-width="180" align="center"></el-table-column>
       <el-table-column  label="操作" min-width="130" align="center">
           <template slot-scope="scope">
              <span @click="handleClick(scope.row)" class="cursor">详情</span>
              <span>|</span>
              <span @click="handleClick(scope.row)" class="cursor blue">编辑</span>
           </template> 
       </el-table-column>
     </el-table>
     <div style="width:1100px;overflow:hidden">
       <el-pagination class="pagination"
          @size-change="handleSizeChange"
          background
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination> 
      </div>
     
  </div>
</template>

<script>

export default {
  components:{

  },
  data() {
    return {
      customerName:'',
      saler:'',
      //list
      groupList: [{
         id:1,
         name:'国旅',
         saler:'阳阳',
         card:'6225 7785 0274 8956',
         price:'123.00',
         price1:'123.00',
         time:'2019-12-12 12:23:23'
      }],
      pageSize: 10, // 设定默认分页每页显示数
      pageIndex: 1, // 设定当前页数
      total: 0,
    }
  },
  created(){

  },
  methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
       // this.getPage(1,val);
      },
      handleCurrentChange(val){
       // this.getPage(val,this.pageSize);
        this.pageIndex=val;
      },
     
   }
}
</script>

<style scoped>
    .demo-input-suffix{width: 900px}
    .el-input{width:250px;margin-right: 10px}
    .search-title{font-size: 14px;margin:0 10px}
    .search-but{margin:20px 10px;}
    .add{margin:35px 10px 20px 10px}
    /*list*/
    .table{border:1px solid #e6e6e6;width:1100px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin-left:10px}
    .pagination{text-align:center;margin:50px 0}
    .cursor{cursor: pointer}
    .blue{color: #2e94f9}
</style>