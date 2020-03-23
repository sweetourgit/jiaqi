<template>
  <div class="curiseShip">
    <!-- 搜索表单 -->
    <el-form label-width="110px" class="form-content">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="产品ID:">
            <el-input v-model="ruleForm.productID" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称:">
            <el-input v-model="ruleForm.productName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="价格:">
            <el-input v-model="ruleForm.priceHigh" placeholder="最低价格" class="shortIn"></el-input><span>--</span>
            <el-input v-model="ruleForm.priceLow" placeholder="最高价格" class="shortIn"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="出发地:">
            <el-input v-model="ruleForm.origin" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目的地:">
            <el-input v-model="ruleForm.destination" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态:">
            <el-select v-model="ruleForm.status" class="search_input">
              <el-option value="" label="全部">全部</el-option>
              <el-option value="1" label="线上上线">线上上线</el-option>
              <el-option value="3" label="仅erp上线">仅erp上线</el-option>
              <el-option value="2" label="下线">下线</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="操作人员:" prop="company">
            <el-autocomplete class="search_input" v-model="ruleForm.operator" :fetch-suggestions="querySearchOper" placeholder="请输入操作人员" @select="handleSelectOper" @blur="blurHand"></el-autocomplete>
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
      <el-table-column prop="id" label="产品ID" align="center">
      </el-table-column>
      <el-table-column prop="product_name" label="产品名称" align="center">
      </el-table-column>
      <el-table-column prop="departure_name" label="出发地" align="center">
      </el-table-column>
      <el-table-column prop="destination_name" label="目的地" align="center">
      </el-table-column>
      <el-table-column prop="price" label="价格" align="center">
      </el-table-column>
      <el-table-column prop="create_third_user" label="操作人员" align="center">
      </el-table-column>
      <el-table-column prop="line_status" label="线上状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.line_status == 1">上线</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="erp状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.line_status == 1 || scope.row.line_status == 2">上线</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details">预定</el-button>暂无 -->
          <el-button @click="inventory(scope.row)" type="text" size="small" class="table_details">库存</el-button>
          <el-button @click="changeStatus(scope.row)" type="text" size="small" class="table_details">更改状态</el-button>
          <el-button @click="copyFun(scope.row)" type="text" size="small" class="table_details">复制</el-button>
          <!-- <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details">退改政策</el-button>暂时不写 -->
          <el-button @click="complete(scope.row)" type="text" size="small" class="table_details">补充完整</el-button>
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
    <changeStatus :dialogFormVisible='dialogFormVisible' :info='info' @close="closeAdd"></changeStatus>
  </div>
</template>
<script type="text/javascript">
import changeStatus from '@/page/productManagement/liner/changeStatus.vue'
export default {
  name: "curiseShip",
  components: {
    changeStatus
  },
  data() {
    return {
      ruleForm: {
        productID: '',
        productName: '',
        priceHigh: '',
        priceLow: '',
        origin: '',
        destination: '',
        status: '',
        operator: '',
        operatorID: ''
      }, // 搜索字段
      operatorList: [],
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
    // 操作人员
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
      this.ruleForm.operatorID = item.id;
    },
    blurHand(){
      const that = this;
      let ida = '';
      if(that.ruleForm.operator == ''){
        that.ruleForm.operatorID = '';
      }else{
        this.operatorList.forEach(function (item, index, arr) {
          if(that.ruleForm.operator == item.value){
            ida = item.id;
          }
        });
        if(ida){
          that.ruleForm.operatorID = ida;
        }else{
          that.ruleForm.operatorID = '';
        }
      }
    },
    // 搜索
    searchHandInside(){
      this.loadData();
    },
    // 重置
    emptyButtonInside(){
      this.ruleForm = {
        productID: '',
        productName: '',
        priceHigh: '',
        priceLow: '',
        origin: '',
        destination: '',
        status: '',
        operator: '',
        operatorID: ''
      };
      this.loadData();
    },
    // 添加
    addShip(){
      this.$router.push({
        path: '/productLinerDo',
        name: '邮轮/ 添加',
        query: {
          "id": ''
        }
      });
    },
    // 编辑
    edit(row){
      this.$router.push({
        path: '/productLinerDo',
        name: '邮轮/ 添加',
        query: {
          "id": row.id,
          "step": row.cur_steps
        }
      });
    },
    // 补充完整
    complete(row){
      this.$router.push({
        path: '/productLinerDo',
        name: '邮轮/ 添加',
        query: {
          "id": row.id,
          "step": row.cur_steps
        }
      });
    },
    // 复制
    copyFun(row){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/product/product/copy', {
        "product_id": row.id,
        "create_uid": sessionStorage.getItem('id'),
        "org_id": sessionStorage.getItem('orgID')
      }).then(res => {
        // console.log(res);
        if (res.data.code == 200) {
          that.$message({
            type: 'success',
            message: '复制成功!'
          });
          that.loadData();

        } else {
          if(res.data.message){
            that.$message({
              type: 'warning',
              message: res.data.message
            });
          }else{
            that.$message({
              type: 'warning',
              message: '修改失败'
            });
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 更改状态
    changeStatus(row){
      this.dialogFormVisible = true;
      this.info = row;
    },
    // 关闭弹框
    closeAdd(){
      this.dialogFormVisible = false;
      this.info = '';
      this.loadData();
    },
    // 库存
    inventory(row){
      alert("库存！暂无router地址");
    },
    // 删除
    deleteFun(row){
      const that = this;
      this.$confirm("是否删除该产品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product/del", {
          "id": row.id
        }, ).then(function(response) {
          // console.log('获取邮轮公司detail',response);
          if (response.data.code == '200') {
            that.$message.success('删除成功！');
            that.loadData();
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning("删除数据失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: "warning",
          message: "已取消删除"
        });
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
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product/listpage", {
        "pageIndex": this.pageCurrent,
        "pageSize": this.pageSize,
        "product_id": this.ruleForm.productID,
        "product_name": this.ruleForm.productName,
        "price_min": this.ruleForm.priceLow,
        "price_max": this.ruleForm.priceHigh,
        "departure_id": this.ruleForm.origin,
        "destination_id": this.ruleForm.destination,
        "line_status": this.ruleForm.status,
        "create_uid": this.ruleForm.operatorID,
      }, ).then(function(response) {
        console.log('获取chanpni',response);
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

    },
    loadOper(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcZb + "/org/api/userlist", {
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
          // console.log('操作人员列表',response.data.objects);
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
  },
  created() {
    this.loadData();
    this.loadOper();
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
    .shortIn{
      width: 41%;
    }
    span{
      display: inline-block;
      width: 16%;
      text-align: center;
    }
    .search_input{
      width: 100%;
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
