<template>
  <div>
    <div class="search_dom">
      <div class="region_search">
        <span class="keyword">地区筛选</span>
        <el-autocomplete class="inputBox" clearable placeholder="请输入地区名称" :fetch-suggestions="querySearch" @select="handleSelect" suffix-icon="el-icon-search" v-model="input" :trigger-on-focus="false"></el-autocomplete>
      </div>
      <div class="spot_search">
        <span class="keyword">景点名称</span>
        <el-input class="search_input" v-model="input" placeholder="请输入景点名称(英文/中文)"></el-input>
      </div>
    </div>

    <div style="padding: 0 20px">
      <div style="text-align: left">
        <el-button type="primary" class="add_scenic" @click="dialogFormVisible = true">添加</el-button>
        <el-button style="border:1px solid #3095fa;color:#3095fa;" class="add_scenic">编辑</el-button>
        <el-button type="danger" class="add_scenic">删除</el-button>
      </div>
  
      <el-table
        :data="checkLabelList"
        class="table"
        :header-row-style="hrs"
        :cell-style="cs"
        border
        :headerRowStyle="tableHead" :cellStyle="tableHeight" :header-cell-style="getRowClass">
        <el-table-column
          prop="id"
          label="景点ID"
          min-width="60"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="scenicName"
          label="景点名称"
          min-width="180"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="area"
          label="所属地区"
          min-width="180"
          header-align="center">
        </el-table-column>
        <!-- <el-table-column
          prop="operate"
          label="操作"
          width=""
          header-align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="dialogFormVisible = true" class="bt-stop">查看</el-button>
            <el-button type="primary" size="small" @click="dialogFormVisible = true" class="bt-edit">编辑</el-button>
            <el-button type="danger" size="small" @click="removeRole(scope.row.id)" class="bt-edit">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pages">
        <el-pagination class="page" background @size-change="pagesizes" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </div>
    <el-dialog width='1100px' top='10vh' title="景点信息" :visible.sync="dialogFormVisible" :show-close="false">
      <AddScenic @close='handleclose' v-on:closeButton="dialogFormVisible = false"></AddScenic>
    </el-dialog>
  </div>
</template>

<script>
import FadeAnimation from '@/common/FadeAnimation'
import AddScenic from './components/Addscenic'
  export default {
    name: "scenicList",
    components:{
      AddScenic,
      FadeAnimation
    },
    data() {
      return {
        input: '', // 区域搜索
        currentPage: 1, // 默认开始页数
        pagesize:10, // 每页的数据条数
        total: 1, // 分页总条数
        tableHead:{height: '60px', color: '#555555'},
        tableHeight:{padding: '0', height: '34px'},
        dialogFormVisible:false,
        hot: '',
        showadd: false,
        countryArr: [
          {
            value: '1',
            label: '中国'
          },
          {
            value: '2',
            label: '印度'
          },
        ],
        countryValue: "",
        provinceArr: [
          {
            value: '1',
            label: '北京'
          },
          {
            value: '2',
            label: '上海'
          },
        ],
        provinceValue: "",
        cityArr: [
          {
            value: '1',
            label: '北京'
          },
          {
            value: '2',
            label: '上海'
          },
        ],
        cityValue: "",

        scenicData: [

        ],
        checkLabelList: 
          [{
            id: '001',
            scenicName: '王小虎',
            scenicUrl: 'http',
            area: 'china'
          },
          {
            id: '002',
            scenicName: '小黄飞',
            scenicUrl: 'https://www.baidu.com',
            area: 'Enliend'
          }],
        keyword: "",
        hrs: {height: '60px'},
        cs: {padding: '0', height: '40px'},
      }
    },
    methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#F7F7F7'
          } else {
            return ''
          }
      },
      subForm () {
        alert('查找')
      },
      changeState(id) {
        console.log(id)
      },
      editRole (id) {
        console.log(id)
      },
      removeRole (id) {
        console.log(id)
         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      showaddbtn() {
        this.showadd = !this.showadd
       
      },
      handleCurrentChange: function () {
        
      },
      handleSizeChange: function () {
        
      },
      handleclose(){
        this.dialogFormVisible=false
      },
      handleSelect () {

      },
      querySearch () {

      },
      pagesizes () {

      }
    }
  }
</script>

<style scoped lang="scss">

  .search_dom {
    padding-top: 22px;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    border-bottom: 1px solid #F1F1F1;
    padding-bottom: 22px;
    .region_search {
      float: left;
      .inputBox {
        margin-left: 10px;
      }
    }
    .spot_search {
      float: left;
      margin-left: 60px;
      .search_input {
        width: 220px;
        margin-left: 10px;
      }
    }
  }
  .table {
    width:800px;
    text-align: center;
  }
  .pages {
    width: 800px;
    .page {
      float: right;
    }
  }
  .labels {
    text-align: left;
    margin-top: 20px;
    margin-left: 66px;
    font-size: 14px;
    color: #666;
  }

  .add_scenic {
    margin-top: 20px;
    width: 100px;
  }

  .el-table {
    margin: 20px 0 40px 0;

  }

  td {
    color: #666;
  }

  .cl_both {
    clear: both;
    width: 0;
    height: 0;
  }
</style>
