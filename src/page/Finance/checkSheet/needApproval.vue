<template>
  <div class="all" id="needApprovalAll">
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
            <el-table-column prop="tour_no" label="团期计划" width="180" align="center"></el-table-column>
            <el-table-column prop="bill_status" label="状态" width="120" align="center">
              <template slot-scope="scope">
                <div style="color: #7F7F7F">报账中</div>
              </template>
            </el-table-column>
            <el-table-column prop="product_name" label="产品名称" align="center"></el-table-column>
            <el-table-column prop="create_uid" label="申请人" width="120" align="center"></el-table-column>
            <el-table-column prop="created_at" label="申请时间" width="180" align="center"></el-table-column>
            <el-table-column prop="info" label="审批意见" width="250" align="center">
              <span>审批意见</span>
            </el-table-column>
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
  import {formatDate} from '@/js/libs/publicMethod.js'
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
        tableData: []
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
        this.loadData();
      },
      resetFun(){
        this.plan = '';
        this.reimbursementPer = '';
        this.productName = '';
        this.startTime = '';
        this.endTime = '';
        this.loadData();
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
      },
      loadData(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/listpage", {
          "pageIndex": this.pageIndex,
          "pageSize": this.pageSize,
          "product_name": this.productName,
          "tour_no": this.plan,
          "start_time": this.startTime,
          "end_time": this.endTime,
          "create_account": this.reimbursementPer,
          "bill_status": '4'
        }, ).then(function(response) {
//            console.log(response);
          if (response.data.code == '200') {
            console.log(response);
            that.tableData = response.data.data.list;
            that.pageCount = response.data.data.total - 0;
            that.tableData.forEach(function (item, index, arr) {
              item.created_at = formatDate(new Date(item.created_at*1000));
              item.created_at = item.created_at.split(" ")[0];
            })
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      }
    },
    created(){
      this.loadData();
    }
  }
</script>

<style>
  #needApprovalAll .el-tabs__header{
    margin-top: -14px!important;
  }
  #needApprovalAll .borders{
    overflow: hidden;
    border: 1px solid #E6E6E6;
    margin-bottom: 30px;
  }
  #needApprovalAll .search{
    float: left;
    margin-top: 30px;
  }
  #needApprovalAll .date-line {
    width: 10px;
    border-bottom: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 3px 3px 0
  }
  #needApprovalAll .search_style{
    /*float: left;*/
    margin-top: 10px;
    margin-left: 20px;
    font-size: 14px
  }
  #needApprovalAll .search_input{
    /*float: left;*/
    width: 200px
  }
  #needApprovalAll .table_style{
    width: 1500px;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
  }
  #needApprovalAll .block{
    float: left;
    margin-left: 600px;
    margin-top: 70px;
    margin-bottom: 30px;
  }
</style>
