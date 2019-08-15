<template>
  <div class="all" id="scenicOrTicketList">
    <div>
      <!--报销-->
      <div class="borders">
        <div class="searchBorder">
          <div class="search">
            <span class="search_style">产品ID：</span> <el-input v-model="productID" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">产品名称：</span> <el-input v-model="productName" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">操作人员：</span> <el-input v-model="operator" placeholder="请输入内容" class="search_input"></el-input>
            <!--<span class="search_style">价格：</span>-->
            <!--<el-input v-model="priceLow" class="search_input"></el-input>-->
            <!--<div class="date-line"></div>-->
            <!--<el-input v-model="priceHigh" class="search_input"></el-input>-->
            <div style="margin-top: 20px;"></div>

            <span class="search_style">目的地：</span>
            <el-autocomplete
              class="search_input"
              v-model="destination"
              :fetch-suggestions="querySearch"
              placeholder="请输入目的地"
              :trigger-on-focus="false"
              @select="handleSelect"
            ></el-autocomplete>
            <!--<span class="search_style">状态：</span>-->
            <!--<el-select v-model="status">-->
              <!--<el-option value="">全部</el-option>-->
              <!--<el-option value="线上上线">线上上线</el-option>-->
              <!--<el-option value="erp上线">erp上线</el-option>-->
              <!--<el-option value="仅erp上线">仅erp上线</el-option>-->
              <!--<el-option value="下线">下线</el-option>-->
            <!--</el-select>-->
            <el-button type="primary" @click="searchFun" style="float: right;margin-right: 20px;">搜索</el-button>
            <el-button type="primary" @click="resetFun" plain style="float: right;margin-right: 20px;">重置</el-button>
          </div>
        </div>
        <el-button type="primary" @click="routerHandle" style="display: block">添加产品</el-button>
        <div class="table_style">
          <el-table :data="tableData" :header-cell-style="getRowClass" border style="width: 100%;">
            <el-table-column prop="id" label="产品ID" width="180" align="center"></el-table-column>
            <el-table-column prop="product_name" label="产品名称" width="220" align="center"></el-table-column>
            <el-table-column prop="dest_name" label="目的地" align="center">
              <template slot-scope="scope">
                  <span v-for="item in scope.row.destinations" style="margin-right: 10px">{{ item.destination_name }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column prop="accpter" label="价格" width="120" align="center"></el-table-column>-->
            <el-table-column prop="operator" label="操作人员" width="180" align="center"></el-table-column>
            <!--<el-table-column prop="info" label="线上状态" width="120" align="center"></el-table-column>-->
            <!--<el-table-column prop="info" label="erp状态" width="120" align="center"></el-table-column>-->
            <el-table-column prop="opinion" label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button @click="editRow(scope.row)" type="text" size="small" class="table_details">编辑</el-button>
                <!--<el-button @click="approve(scope.row)" type="text" size="small" class="table_details">预定</el-button>-->
                <!--<el-button @click="approve(scope.row)" type="text" size="small" class="table_details">库存</el-button>-->
                <!--<el-button @click="approve(scope.row)" type="text" size="small" class="table_details">更改状态</el-button>-->
                <el-button @click="deleteRow(scope.row)" type="text" size="small" class="table_details" style="color: red;">删除</el-button>
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
    </div>
  </div>
</template>

<script>
  export default {
    name: "scenicOrTicketList",
    data() {
      return {
        productID: '',
        productName: '',
        operator: '',
        destination: '',
        destinationID: '',
//        status: '',
        destinationList: [],

        pageSize: 10,
        currentPage: 1,
        pageCount: 0,

        info: '',
        //待审批table
        tableData: []
      };
    },
    created(){
        this.reimList();
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
      routerHandle(){
        this.$router.push({path: "/listInfoScenic"});
      },
      querySearch(queryString2, cb) {
        this.destinationList = [];
        this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
          "object": {
            areaName: queryString2
          }
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(res => {
            console.log(res);
          for (let i = 0; i < res.data.objects.length; i++) {
            this.destinationList.push({
              "value": res.data.objects[i].areaName,
              "id": res.data.objects[i].id
            })
          }
          var results = queryString2 ? this.destinationList.filter(this.createFilter(queryString2)) : [];
          cb(results)
        }).catch(err => {
          console.log(err);
        })
      },
      handleSelect(item) {
        this.destinationID = item.id;
        this.destination = item.value;
        this.destinationList = [];
      },
      createFilter(queryString5) {
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      searchFun(){
        if(this.destination == ''){
          this.destinationID = '';
        }
        this.reimList();
      },
      resetFun(){
        this.productID = '';
        this.productName = '';
        this.operator = '';
        this.destination = '';
        this.destinationID = '';
//        this.status = '';
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
      editRow(res){
//        this.info = res;
        this.$router.push({
          path: "/listInfoEdit",
          name: '编辑景区/票务',
          params: res
        });
      },
      deleteRow(res){
//        console.log(res);
        var that = this;
        this.$confirm('此操作将删除该跟产品信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('执行删除操作！');
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/product/product/del", {
            "id": res.id,
          }, ).then(function(response) {
            if (response.data.code == '200') {
              that.reimList();
              that.$message({
                type: 'info',
                message: '已删除'
              });
            } else {
              that.$message.success("删除失败~");
            }
          }).catch(function(error) {
            console.log(error);
            that.$message.success("删除失败~");
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      reimList(){
        //加载数据
        var that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/product/product/listpage", {
          "pageIndex": this.currentPage,
          "pageSize": this.pageSize,
          "id": this.productID,
          "product_name": this.productName,
          "destination_id": this.destinationID,
          "create_account": this.operator
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log(response);
            that.tableData = response.data.data.list;
            that.pageCount = response.data.data.total - 0;
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      }
    }
  }
</script>

<style>
  #scenicOrTicketList .el-tabs__header{
    margin-top: -14px!important;
  }
  #scenicOrTicketList .borders{
    overflow: hidden;
    border: none;
    margin-bottom: 30px;
  }
  #scenicOrTicketList .searchBorder{
    width: 100%;
    overflow: hidden;
    padding-bottom: 20px;
    margin-bottom: 20px;
    background-color: #F7F7F7;
  }
  #scenicOrTicketList .search{
    float: left;
    margin-top: 30px;
  }
  #scenicOrTicketList .date-line {
    width: 10px;
    border-bottom: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 3px 3px 0
  }
  #scenicOrTicketList .search_style{
    /*float: left;*/
    margin-top: 10px;
    margin-left: 20px;
    font-size: 14px
  }
  #scenicOrTicketList .search_input{
    /*float: left;*/
    width: 300px;
  }
  #scenicOrTicketList .table_style{
    width: 1500px;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
  }
  #scenicOrTicketList .block{
    float: left;
    margin-left: 600px;
    margin-top: 70px;
    margin-bottom: 30px;
  }
</style>
