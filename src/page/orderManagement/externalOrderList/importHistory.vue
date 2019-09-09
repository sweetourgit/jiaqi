<template>
  <div class="vivo" style="position:relative">
    <div style="padding-top:1px;">
      <el-button style="float: right;" @click="close()" size="medium">关闭</el-button>
    </div>
    <div class="demo-input-suffix">
      <span class="search-title" style="margin-right: 40px;">导入人:</span>
      <el-autocomplete class="input" v-model="activeForm.user" :fetch-suggestions="querySearchOper" placeholder="请输入操作人员" @select="handleSelectOper" @blur="blurHand"></el-autocomplete>
      <span class="search-title">导入时间:</span>
      <el-date-picker v-model="activeForm.startTime" type="date" placeholder="开始天数"></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker v-model="activeForm.endTime" type="date" placeholder="结束天数"></el-date-picker>
      <br /><br />
      <div class="button_select">
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
        <el-button type="primary" @click="resetHand()" size="medium" plain>重置</el-button>
      </div>
    </div>
    <div class="table_trip" style="width: 100%;">
      <el-table ref="singleTable" :data="tableData" v-loading="loading" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
        <el-table-column prop="create_uid" label="导入人" align="center" width="80%">
        </el-table-column>
        <el-table-column prop="source_name" label="导入平台" align="center">
        </el-table-column>
        <el-table-column prop="file" label="文件" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.source_id == 1"><a :href="scope.row.file_platform_url">{{scope.row.file_platform_name}}</a></p>
            <p><a :href="scope.row.file_pft_url">{{scope.row.file_pdf_name}}</a></p>
          </template>
        </el-table-column>
        <el-table-column prop="success_num" label="导入订单个数" align="center">
        </el-table-column>
        <el-table-column prop="import_at" label="导入时间" align="center">
        </el-table-column>
        <el-table-column prop="option" label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button @click="infoOrder(scope.row)" type="primary" size="small" class="table_details">导入订单详情</el-button>
            <el-button @click="delOrder(scope.row)" type="danger" size="small" class="table_details">一键删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ImportOrderInfo :dialogFormVisible="dialogFormVisible" :infoId="infoId" @close2="close2"></ImportOrderInfo>
    <!--分页-->
    <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;margin-bottom: 50px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/javascript">
import ImportOrderInfo from '@/page/orderManagement/externalOrderList/importOrderInfo/importOrderInfo'
import {formatDate} from '@/js/libs/publicMethod.js'
export default {
  name: "importHistory",
  components: {
    ImportOrderInfo
  },
  data() {
    return {
      total: 0, //总条数
      currentPage4: 1,
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      activeForm: {
        user: '',
        userID: '',
        startTime: '',
        endTime: '',
      },
      tableData: [],
      reable: true,
      pid: '',
      infoId: '',
      transmit: false,
      dialogFormVisible: false,

      operatorList: [],

      loading: true
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {},
  methods: {
    //导入订单详情
    infoOrder(row) {
      this.dialogFormVisible = true;
      this.infoId = row['id'];
      console.log(row);
    },
    close() {
      this.$router.push({ path: "/externalOrderList/canRecognition" });
    },
    close2() {
      this.dialogFormVisible = false;
      this.infoId = '';
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['id']
    },
    delOrder(row) {
      console.log(row['id']);
      const that = this;
      this.$confirm('是否需要一键删除所有订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/delall", {
          "import_id": row['id']
        }, ).then(function(response) {
          console.log('删除',response);
          if (response.data.code == '200') {
            console.log(response);
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.loadData();
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning('删除失败');
            }

          }
        }).catch(function(error) {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
      this.activeForm.userID = item.id;
    },
    blurHand(){
      const that = this;
      let ida = '';
      if(that.activeForm.user == ''){
        that.reimbursementPerID = '';
      }else{
        this.operatorList.forEach(function (item, index, arr) {
          if(that.activeForm.user == item.value){
            ida = item.id;
          }
        });
        if(ida){
          that.activeForm.userID = ida;
        }else{
          that.activeForm.userID = '';
        }
      }
    },
    //搜索
    searchHand() {
      this.loading = true;
      this.loadData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loading = true;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pageIndex =val;
      this.loading = true;
      this.loadData();
    },
    resetHand() {
      this.activeForm = {
        user: '',
        userID: '',
        startTime: '',
        endTime: '',
      };
      this.loading = true;
      this.loadData();
    },
    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/importlist", {
        "pageIndex": this.pageIndex,
        "pageSize": this.pageSize,
        "start_time": this.activeForm.startTime,
        "end_time": this.activeForm.endTime,
        "create_uid": this.activeForm.userID,
        "org_id": ''
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log('导入历史',response);
          that.tableData = response.data.data.list;
          that.total = response.data.data.total - 0;
          that.tableData.forEach(function (item, index, arr) {
            item.import_at = formatDate(new Date(item.import_at*1000));
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
          });
          that.loading = false;
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {ao
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
  },
  created() {
    this.loadData();
    this.loadOper();
  }

}

</script>
<style lang="scss" scoped>
.vivo {
  .demo-input-suffix {
    width: auto;
    background-color: #F7F7F7;
    margin-top: 40px;
    padding-top: 15px;
    padding-bottom: 15px;

    .search-title {
      font-size: 14px;
      margin-left: 20px;
      margin-top: 10px;
    }

    .el-input {
      width: auto;
    }

    .el-input__inner {
      width: 10%;
    }

    .demo-input-suffix {
      width: 900px
    }

    .date-line {
      width: 10px;
      border-bottom: 1px solid #e6e6e6;
      display: inline-block;
      margin: 0 3px 3px 0
    }

    .button_select {
      display: inline;
      margin-left: 85%;
    }
  }

  .table_trip {
    margin-top: 40px;
  }

}



.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

</style>
