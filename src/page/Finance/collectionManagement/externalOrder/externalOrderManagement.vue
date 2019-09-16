<template>
  <div class="all" id="trade">
    <div class="borders">
      <div class="search">
        <span class="search_style">分销商：</span> <el-input v-model="plan" placeholder="请输入内容" class="search_input"></el-input>
        <span class="search_style">申请人：</span>
        <el-autocomplete class="search_input" v-model="reimbursementPer" :fetch-suggestions="querySearchOper" placeholder="请输入申请人" @select="handleSelectOper" @blur="blurHand"></el-autocomplete>
        <span class="search_style">收款时间：</span>
        <el-date-picker v-model="startTime" type="date" placeholder="请选择日期" class="start-time" :editable="disabled" :picker-options="startDatePicker"></el-date-picker>
        <div class="date-line"></div>
        <el-date-picker v-model="endTime" type="date" placeholder="请选择日期" class="start-time" :editable="disabled" :picker-options="endDatePicker"></el-date-picker>
        <div style="margin-top: 20px;"></div>
        <span class="search_style">状态</span>
        <el-select v-model="status" placeholder="请选择" style="width:200px;">
          <el-option key="" label="全部" value=""></el-option>
          <el-option key="1" label="待认收款" value="1"></el-option>
          <el-option key="2" label="已认完" value="2"></el-option>
        </el-select>
        <el-button type="primary" @click="resetFun" plain style="float: right;margin-right: 20px;">重置</el-button>
        <el-button type="primary" @click="searchFun" style="float: right;margin-right: 20px;">搜索</el-button>
      </div>
      <div class="search" style="background-color: transparent;padding: 0;">
        <el-button type="primary" @click="addFun">添加</el-button>
      </div>
      <div class="table_style">
        <el-table :data="tableData" :header-cell-style="getRowClass" border style="width: 100%;">
          <el-table-column prop="rece_code" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status_rece=='1'" style="color: #7F7F7F" >待认收款</div>
              <div v-if="scope.row.status_rece=='2'" style="color: #FF4A3D" >已认完</div>
            </template>
          </el-table-column>
          <el-table-column prop="explain" label="收款明细说明" align="center"></el-table-column>
          <el-table-column prop="receivables_at" label="收款时间" width="120" align="center"></el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center"></el-table-column>
          <el-table-column prop="rece_start" label="款项入账时段" align="center" width="200">
            <template slot-scope="scope">
              <p>{{scope.row.rece_start}}--{{scope.row.rece_end}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="rece_money" label="收款金额" align="center"></el-table-column>
          <el-table-column prop="create_uid" label="录入人" align="center"></el-table-column>
          <el-table-column prop="opinion" label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button @click="editOrder(scope.row)" type="text" size="small" class="table_details" style="color: #13ce66">编辑</el-button>
              <el-button @click="detail(scope.row)" type="text" size="small" class="table_details">详情</el-button>
              <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details" style="color: red" v-if="scope.row.approved != 1">删除</el-button>
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
      <orderEdit :dialogFormVisible="dialogFormVisible" :info="info" @close="closeAdd"></orderEdit>
      <orderDetail :dialogFormVisible1="dialogFormVisible1" :info="info" @close="closeAdd"></orderDetail>
    </div>
  </div>
</template>

<script>
  import orderEdit from '@/page/Finance/collectionManagement/externalOrder/orderEdit.vue'
  import orderDetail from '@/page/Finance/collectionManagement/externalOrder/orderDetail.vue'
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "tradeList",
    components:{
      orderEdit,
      orderDetail
    },
    data() {
      return {
        disabled: false,

        plan: '',
        reimbursementPer: '',
        productName: '',
        startTime: '',
        endTime: '',
        status: '',
        reimbursementPerID: '',
        operatorList: [],

        pageSize: 10,
        currentPage: 1,
        pageCount: 2,

        //待审批table
        tableData: [{}],

        dialogFormVisible: false,
        dialogFormVisible1: false,
        info: '',

        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate()
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
      closeAdd(str) {
        if(str == 'success'){
          this.dialogFormVisible = false;
          this.editOrder(this.info);
        }else{
          this.dialogFormVisible = false;
          this.dialogFormVisible1 = false;
          this.info = '';
          this.loadData();
        }
      },
      //        操作人员
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
        this.reimbursementPerID = item.id;
      },
      blurHand(){
        const that = this;
        let ida = '';
        if(that.reimbursementPer == ''){
          that.reimbursementPerID = '';
        }else{
          this.operatorList.forEach(function (item, index, arr) {
            if(that.reimbursementPer == item.value){
              ida = item.id;
            }
          });
          if(ida){
            that.reimbursementPerID = ida;
          }else{
            that.reimbursementPerID = '';
          }
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
        this.reimbursementPerID = '';
        this.status = '';
        this.loadData();
      },
      addFun(){
        this.dialogFormVisible = true;
      },
      detail(row){
        this.info = row.id;
        this.dialogFormVisible1 = true;
      },
      editOrder(row){
        this.info = row.id;
        this.dialogFormVisible = true;
      },
      deleteFun(row){
        this.$confirm("是否删除该笔收款?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const that = this;
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/delrece", {
            "id": row.id
          }, ).then(function(response) {
            console.log(response);
            if (response.data.code == '200') {
              that.$message.success("删除成功~");
              that.loadData();
            } else {
              if(response.data.message){
                that.$message.warning(response.data.message);
              }else{
                that.$message.warning('失败~');
              }
            }
          }).catch(function(error) {
            console.log(error);
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
        this.loadData()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loadData();
      },
      loadData(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/listpage", {
          "pageIndex": this.currentPage,
          "pageSize": this.pageSize,
          "distributor": this.plan,
          "create_uid": this.reimbursementPerID,
          "rece_start": this.startTime,
          "rece_end": this.endTime,
          "status_rece": this.status,
          "limit": 0
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log('外部订单认款',response);
            that.tableData = response.data.data.list;
            that.pageCount = response.data.data.total - 0;
            that.tableData.forEach(function (item, index, arr) {
              item.receivables_at = formatDate(new Date(item.receivables_at*1000));
              item.receivables_at = item.receivables_at.split(" ")[0];
              item.rece_start = formatDate(new Date(item.rece_start*1000));
              item.rece_start = item.rece_start.split(" ")[0];
              item.rece_end = formatDate(new Date(item.rece_end*1000));
              item.rece_end = item.rece_end.split(" ")[0];
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
                  that.$message.success("获取录入人失败~");
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
      },
      beginDate(){
//      alert(begin);
        const that = this;
        return {
          disabledDate(time){
            if (that.endTime) {  //如果结束时间不为空，则小于结束时间
              return new Date(that.endTime).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      processDate(){
//      alert(process);
        const that = this;
        return {
          disabledDate(time) {
            if (that.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(that.startTime).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
    },
    created(){
      this.loadData();
      this.loadOper();
    }
  }
</script>

<style scoped>
  #trade .el-tabs__header{
    margin-top: -14px!important;
  }
  #trade .borders{
    overflow: hidden;
    /*border: 1px solid #E6E6E6;*/
    margin-bottom: 30px;
  }
  #trade .search{
    width: 96%;
    min-width: 1079px;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
    background-color: #f7f7f7;
    padding: 20px 10px;
    box-sizing: border-box;
  }
  #trade .date-line {
    width: 10px;
    border-bottom: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 3px 3px 0
  }
  #trade .search_style{
    /*float: left;*/
    margin-top: 10px;
    margin-left: 20px;
    font-size: 14px;
    display: inline-block;
    width: 80px;
  }
  #trade .search_input{
    /*float: left;*/
    width: 200px
  }
  #trade .table_style{
    width: 96%;
    min-width: 1079px;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
  }
  #trade .block{
    float: left;
    margin-left: 600px;
    margin-top: 70px;
    margin-bottom: 30px;
  }
</style>
