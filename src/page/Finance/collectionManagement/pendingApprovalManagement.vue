<template>
  <div class="all" style="position:relative">
     <el-tabs :tab-position="tabPosition" class="tabsPosition" v-model="activeName">
       <el-tab-pane :label="examine + '('+total+')'" name="first">
         <el-table :data="tableData" border style="width: 1100px; margin:0 0 0 10px;" :header-cell-style="getRowClass">
          <el-table-column prop="date" label="收款单号" width="100" align="center"></el-table-column>
          <el-table-column prop="date" label="状态" width="80" align="center"></el-table-column>
          <el-table-column prop="date" label="收款时间" width="150" align="center"></el-table-column>
          <el-table-column prop="date" label="团期计划" width="239" align="center"></el-table-column>
          <el-table-column prop="date" label="订单号" width="150" align="center"></el-table-column>
          <el-table-column prop="date" label="收款金额" width="100" align="center"></el-table-column>
          <el-table-column prop="date" label="申请人" width="100" align="center"></el-table-column>
          <el-table-column prop="date" label="审批意见" width="100" align="center"></el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="table_details">详情</el-button>
            </template>
          </el-table-column>
         </el-table>
         <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
         <!--直客审批弹窗-->
         <el-dialog width="80%" title="审批" :visible.sync="customerApproval" append-to-body custom-class="city_list" >
          
        
        </el-dialog>
       </el-tab-pane>
       <el-tab-pane label="同业(2)">
         <el-table :data="tableData" border style="width: 1100px; margin:0 0 0 10px;" :header-cell-style="getRowClass">
          <el-table-column prop="date" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="date" label="状态" align="center"></el-table-column>
          <el-table-column prop="date" label="收款时间" align="center"></el-table-column>
          <el-table-column prop="date" label="团期计划" align="center"></el-table-column>
          <el-table-column prop="date" label="订单号" align="center"></el-table-column>
          <el-table-column prop="date" label="同业社名称" align="center"></el-table-column>
          <el-table-column prop="date" label="收款金额" align="center"></el-table-column>
          <el-table-column prop="date" label="申请人" align="center"></el-table-column>
          <el-table-column prop="date" label="审批意见" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="table_details">详情</el-button>
            </template>
          </el-table-column>
         </el-table>
         <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
       </el-tab-pane>
     </el-tabs>
  </div>
</template>
<script type="text/javascript">

export default {
  data() {
    return {
       tabPosition: 'left',//左侧导航
       activeName:'first',
       examine:'直客',
       msg:'',
       tableData:[{
        date:'123'
       },{
        date:'123'
       },{
        date:'123'
       },],
       pagesize: 10, // 设定默认分页每页显示数
       pageIndex: 1, // 设定当前页数
       total: 0,
       currentPage: 1,
       customerApproval:true,//直客审批弹窗
    }
  },
  computed: {
    
  },
  methods: {
    //表格表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
      } else {
        return ''
      }
    },
    headCall: function (msg) { //回调方法，接收子组件传的参数
      this.msg = '(' + msg + ')';
    },
    //分页
    handleSizeChange(page) {
      //this.currentPage = 1;
      //this.pagesize = page;
      //this.pageList();
    },
    handleCurrentChange(currentPage) {
      //this.currentPage = currentPage;
      //this.pageList();
    },
  },
  created() {
    
  }
}

</script>
<style>
.tabsPosition{margin: 30px 0 0 0;}
.pageList{float:right; margin: 30px 30px 20px 0;}

</style>
