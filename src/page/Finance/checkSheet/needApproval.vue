<template>
  <div class="all">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!--报销-->
      <div class="borders">
        <div class="search">
          <span class="search_style">团期计划：</span> <el-input v-model="plan" placeholder="请输入内容" class="search_input"></el-input>
          <span class="search_style">报账人：</span> <el-input v-model="reimbursementPer" placeholder="请输入内容" class="search_input"></el-input>
          <span class="search_style">发起时间：</span>
          <el-date-picker v-model="startTime" type="date" placeholder="请选择日期" class="start-time"></el-date-picker>
          <div class="date-line"></div>
          <el-date-picker v-model="endTime" type="date" placeholder="请选择日期" class="start-time"></el-date-picker>
          <div style="margin-top: 20px;"></div>
          <span class="search_style">产品名称：</span> <el-input v-model="productName" placeholder="请输入内容" class="search_input"></el-input>
          <el-button type="primary" @click="searchFun" style="float: right;margin-right: 20px;">搜索</el-button>
          <el-button type="primary" @click="resetFun" plain style="float: right;margin-right: 20px;">重置</el-button>
        </div>
        <div class="table_style">
          <el-table :data="tableData" :header-cell-style="getRowClass" border style="width: 100%;">
            <el-table-column prop="plan" label="团期计划" width="180" align="center"></el-table-column>
            <el-table-column prop="type" label="状态" width="120" align="center"></el-table-column>
            <el-table-column prop="orinaze" label="产品名称" align="center"></el-table-column>
            <el-table-column prop="accpter" label="申请人" width="120" align="center"></el-table-column>
            <el-table-column prop="createtime" label="申请时间" width="180" align="center"></el-table-column>
            <el-table-column prop="info" label="审批意见" width="250" align="center"></el-table-column>
            <el-table-column prop="opinion" label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button @click="approve(scope.row)" type="text" size="small" class="table_details">审批</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size= pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=pageCount
            background>
          </el-pagination>
        </div>
      </div>
      <!--报销end-->
    </el-tabs>
    <checkSheetPreview :dialogFormVisible="dialogFormVisible" @close="closeFun" :info="info"></checkSheetPreview>
  </div>
</template>

<script>
  import checkSheetPreview from '@/page/Finance/checkSheet/checkSheetPreview';
  export default {
    name: "needApproval",
    components:{
      checkSheetPreview
    },
    data() {
      return {
        plan: '',
        reimbursementPer: '',
        productName: '',
        startTime: '',
        endTime: '',

        activeName: 'first',

        pageSize: 10,
        currentPage: 1,
        pageCount: 3,

        dialogFormVisible: false,
        info: '',
        //待审批table
        tableData: [{
          number: '1',
          type: '申请中',
          checkType: '0',
          createtime: '2016-05-02',
          plan: 'TC-GTY-1001-01-180806-01',
          monkey: '国旅',
          orinaze: '辽宁大运通-国内部',
          accpter: '阳阳',
          info: '',
        }, {
          number: '1',
          type: '驳回',
          checkType: '-1',
          createtime: '2016-05-02',
          plan: 'TC-GTY-1001-01-180806-01',
          monkey: '国旅',
          orinaze: '辽宁大运通-国内部',
          accpter: '阳阳',
          info: '郑总：信息补全',
        }, {
          number: '1',
          type: '通过',
          checkType: '1',
          createtime: '2016-05-02',
          plan: 'TC-GTY-1001-01-180806-01',
          monkey: '国旅',
          orinaze: '辽宁大运通-国内部',
          accpter: '阳阳',
          info: '',
        }]
      };
    },
    methods: {
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      searchFun(){

      },
      resetFun(){

      },
      handleClick(tab, event) {
//        console.log(tab, event);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
        this.reimList()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.reimList()
      },
      approve(res){
        this.info = res;
        this.dialogFormVisible = true;
      },
      closeFun(){
        this.dialogFormVisible = false;
      }
    }
  }
</script>

<style scoped>
  .borders{
    height: 900px;
    /*border: 1px solid #E6E6E6;*/
  }
  .search{
    float: left;
    margin-top: 30px;
  }
  .date-line {
    width: 10px;
    border-bottom: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 3px 3px 0
  }
  .search_style{
    /*float: left;*/
    margin-top: 10px;
    margin-left: 20px;
    font-size: 14px
  }
  .search_input{
    /*float: left;*/
    width: 200px
  }
  .table_style{
    width: 1500px;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
  }
  .block{
    float: left;
    margin-left: 600px;
    margin-top: 70px;
    margin-bottom: 30px;
  }
</style>
