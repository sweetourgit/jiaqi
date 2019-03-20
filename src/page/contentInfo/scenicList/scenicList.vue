<template>
  <div>
    <div class="search_dom">
      <div class="region_search">
        <span class="keyword">地区筛选</span>
        <el-autocomplete class="inputBox" clearable placeholder="请输入地区名称" :fetch-suggestions="querySearch" @select="handleSelect" suffix-icon="el-icon-search" v-model="areaName" :trigger-on-focus="false"></el-autocomplete>
      </div>
      <div class="spot_search">
        <span class="keyword">景点名称</span>
        <el-input class="search_input" v-model="name" placeholder="请输入景点名称(英文/中文)"></el-input>
      </div>
      <el-button style="margin-left: 20px;" type="primary" @click="searchFormVisible">搜索</el-button>

    </div>

    <div style="padding: 0 20px">
      <div style="text-align: left">
        <el-button type="primary" class="add_scenic" @click="addFormVisible">添加</el-button>
        <el-button style="border:1px solid #3095fa;color:#3095fa;" class="add_scenic">编辑</el-button>
        <el-button type="danger" class="add_scenic">删除</el-button>
      </div>
  
      <el-table
        :data="checkLabelList"
        class="table"
        :header-row-style="hrs"
        highlight-current-row
        @current-change="handleChange"
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
          label="景点名称"
          min-width="180"
          header-align="center">
          <template slot-scope="scope">
              <el-button v-if="scope.row.chineseName" @click="subordinate(scope.row)" type="text">{{ scope.row.chineseName }}</el-button>
              <el-button v-else @click="subordinate(scope.row)" type="text">{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="areaName"
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
      <AddScenic @close='handleclose' v-on:closeButton="dialogFormVisible = false" :referenceTime="referenceTime" :seasons="seasons" :crowds="crowds"></AddScenic>
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
        areaName: '',       // 按区域搜索
        name: '',           // 按景点名称搜索
        areaNames: '',      // 搜索后赋值区域搜索
        names: '',          // 搜索后赋值景点名称搜索
        vague: [],          // 模糊搜索数组
        referenceTime: '',  // 参考用时
        seasons: '',        // 适宜季节
        crowds: '',         // 适宜人群
        currentRow: '',     // 表格选中的值
        input: '',          // 区域搜索
        currentPage: 1,     // 默认开始页数
        pagesize:10,        // 每页的数据条数
        total: 1,           // 分页总条数
        checkLabelList: [], // 表格数据
        tableHead:{height: '60px', color: '#555555'},
        tableHeight:{padding: '0', height: '40px'},
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
        keyword: "",
        hrs: {height: '60px'},
        cs: {padding: '0', height: '40px'},
      }
    },
    created() {
      this.initData();
    },
    methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#F7F7F7'
          } else {
            return ''
          }
      },
      // 表格数据获取
      initData(areaVal, nameVal) {
        this.$http.post(this.GLOBAL.serverSrc + '/scenicspot/api/search', {
          "pageIndex": this.currentPage,
          "pageSize": this.pagesize,
          "object": {
            'areaName': areaVal,
            'name': nameVal
          }
        }).then(res => {
          console.log(res);
          this.checkLabelList = res.data.objects;
          this.total = res.data.total;
        })
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
      // 表格选中触发的事件
      handleChange(val) {
        this.currentRow = val;
      },
      // 添加景点按钮
      addFormVisible() {
        // 参考用时
        this.$http.post(this.GLOBAL.serverSrc + '/scenicspot/api/GetDictListByType', {
          "object": {
            type: 2
          }
        }).then(res => {
          this.referenceTime = res.data.objects;
          // 适宜季节
          this.$http.post(this.GLOBAL.serverSrc + '/scenicspot/api/GetDictListByType', {
            "object": {
              type: 0
            }
          }).then(val => {
            this.seasons = val.data.objects;
            // 适宜人群
            this.$http.post(this.GLOBAL.serverSrc + '/scenicspot/api/GetDictListByType', {
              "object": {
                type: 1
              }
            }).then(item => {
              this.crowds = item.data.objects;
              this.dialogFormVisible = true;
            })
          })
        })
        
      },
      showaddbtn() {
        this.showadd = !this.showadd
       
      },
      
      handleSizeChange: function () {
        
      },
      handleclose(){
        this.dialogFormVisible=false
      },
      handleSelect () {

      },
      // 搜索按钮
      searchFormVisible() {
        this.areaNames = this.areaName;
        this.names = this.name;
        this.initData(this.areaNames, this.names);
      },
      // 区域联想
      querySearch (queryString, cb) {
        this.vague = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
          "object": {
              areaName: queryString
            }
        }).then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.vague.push({
              "id" : res.data.objects[i].id,
              "value" : res.data.objects[i].areaName
            })
          }
          var results = queryString ? this.vague.filter(this.createFilter(queryString)) : [];
          cb(results)
        })
      },
      // 搜索方法
      createFilter(queryString){
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      // 改变每页显示条数
      pagesizes (page) {
        this.currentPage = 1;
        this.pagesize = page;
        this.initData(this.areaNames, this.names);
      },
      // 改变当前页
      handleCurrentChange (currentPage) {
        this.currentPage = currentPage;
        this.initData(this.areaNames, this.names);
      },
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
