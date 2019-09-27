<template>
  <div class="all" id="scenicOrTicketList">
    <div>
      <!--报销-->
      <div class="borders">
        <div class="searchBorder">
          <div class="search">
            <span class="search_style">产品ID：</span> <el-input v-model="productID" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">产品名称：</span> <el-input v-model="productName" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">操作人员：</span>
            <!--<el-input v-model="operator" placeholder="请输入内容" class="search_input"></el-input>-->
            <el-autocomplete class="search_input" v-model="operator" :fetch-suggestions="querySearchOper" placeholder="请输入操作人员" @select="handleSelectOper" @blur="blurHand"></el-autocomplete>
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
            <el-button type="primary" @click="resetFun" plain style="float: right;margin-right: 20px;">重置</el-button>
            <el-button type="primary" @click="searchFun" style="float: right;margin-right: 20px;">搜索</el-button>

          </div>
        </div>
        <el-button type="primary" @click="routerHandle" style="display: block">添加产品</el-button>
        <div class="table_style">
          <el-table :data="tableData" :header-cell-style="getRowClass" border style="width: 100%;">
            <el-table-column prop="id" label="产品ID" width="180" align="center"></el-table-column>
            <el-table-column prop="product_name" label="产品名称" width="220" align="center"></el-table-column>
            <el-table-column prop="dest_name" label="目的地" align="center">
              <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.destinations" :key="index" style="margin-right: 10px">{{ item.destination_name }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column prop="accpter" label="价格" width="120" align="center"></el-table-column>-->
            <el-table-column prop="create_uid" label="操作人员" width="180" align="center"></el-table-column>
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
        operatorID: '',
//        status: '',
        destinationList: [],
        operatorList: [],

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
        this.loadOper();
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
      querySearchOper(queryString, cb){
        const operatorList = this.operatorList;
        var results = queryString ? operatorList.filter(this.createFilter1(queryString)) : operatorList;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter1(queryString) {
        return (operatorList) => {
          return (operatorList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectOper(item){
        console.log(item);
        this.operatorID = item.id;
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
      blurHand(){
        const that = this;
        let ida = '';
        if(that.operator == ''){
          that.operatorID = '';
        }else{
          this.operatorList.forEach(function (item, index, arr) {
            if(that.operator == item.value){
              ida = item.id;
            }
          });
          if(ida){
            that.operatorID = ida;
          }else{
            that.operatorID = '';
          }
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
        this.operatorID = '';
        this.destination = '';
        this.destinationID = '';
//        this.status = '';
        this.reimList();
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
          query: {
            id: res.id,
            product_name: res.product_name,
            destinations: JSON.stringify(res.destinations)
          }
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
              if(response.data.message){
                that.$message.warning(response.data.message);
              }else{
                that.$message.warning("删除失败~");
              }
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
          "create_uid": this.operatorID,
          "org_id": ''
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log(response);
            that.tableData = response.data.data.list;
            that.pageCount = response.data.data.total - 0;
            that.tableData.forEach(function (item, index, arr) {
              console.log(item.create_uid);
              that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
                "id": item.create_uid
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
              }).then(function(response) {

                if (response.data.isSuccess) {
                  item.create_uid = response.data.object.name
                } else {
                  that.$message.success("加载数据失败~");
                }
              }).catch(function(error) {
                console.log(error);
              });
            })
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
      loadOper(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrc + "/org/api/userlist", {
          "object": {
            "id": 0,
            "createTime": '2019-08-23T03:03:10.386Z',
            "isDeleted": 0,
            "code": "",
            "mobile": "",
            "name": "",
            "email": "",
            "userCode": "",
            "passWord": "",
            "iDcard": "",
            "tourGuide": "",
            "sex": 0,
            "userType": 0,
            "userState": 0,
            "orgID": 0,
            "orgName": "",
            "user_Position": [
              {
                "id": 0,
                "userID": 0,
                "positionID": 0,
                "positionName": "",
                "isDefault": 0,
                "orgID": 0,
                "orgName": ""
              }
            ]
          }
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(response) {

          if (response.data.isSuccess) {
//            console.log('操作人员列表',response.data.objects);
            let operatorList = [];
            response.data.objects.forEach(function (item, index, arr) {
              const operator = {
                'value' : item.name,
                'id' : item.id
              };
              operatorList.push(operator);
            });
            that.operatorList = operatorList;
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
