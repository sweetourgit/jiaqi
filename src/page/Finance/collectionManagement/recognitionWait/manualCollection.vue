<template>
  <div class="all" id="manualCol">
    <div class="borders">
      <div class="search">
        <el-row>
          <el-col :span="7">
            <span class="search_style">款项说明：</span>
            <el-input v-model="plan" placeholder="请输入内容" class="search_input"></el-input>
          </el-col>
          <el-col :span="7">
            <span class="search_style">申请人：</span>
            <el-autocomplete class="search_input" v-model="reimbursementPer" :fetch-suggestions="querySearchOper" placeholder="请输入申请人" @select="handleSelectOper" @blur="blurHand"></el-autocomplete>
          </el-col>
          <el-col :span="9">
            <span class="search_style">申请日期：</span>
            <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time" :editable="disabled" :picker-options="startDatePicker"></el-date-picker>
            <div class="date-line"></div>
            <el-date-picker v-model="endTime" type="date" placeholder="结束日期" class="start-time" :editable="disabled" :picker-options="endDatePicker"></el-date-picker>
          </el-col>
        </el-row>

        <div class="buttonDv">
          <el-button type="primary" @click="resetFun" plain>重置</el-button>
          <el-button type="primary" @click="searchFun">搜索</el-button>
        </div>
      </div>
      <div class="search" style="background-color: transparent;padding: 0;">
        <el-button type="primary" @click="addFun" plain>添加</el-button>
        <el-button type="primary" @click="batchAddFun">批量添加</el-button>
      </div>
      <div class="table_style">
        <el-table :data="tableData" :header-cell-style="getRowClass" border style="width: 100%;">
          <el-table-column prop="rece_code" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status_rece=='10'" style="color: #7F7F7F" >未认款</div>
              <div v-if="scope.row.status_rece=='11'" style="color: #00B83F" >待认收款</div>
              <div v-if="scope.row.status_rece=='12'" style="color: #FF4A3D" >已认完</div>
            </template>
          </el-table-column>
          <el-table-column prop="explain" label="款项说明" align="center"></el-table-column>
          <el-table-column prop="rece_money" label="收款金额" align="center"></el-table-column>
          <el-table-column prop="rece_money" label="剩余确认金额" align="center"></el-table-column>
          <el-table-column prop="receivables_at" label="收款时间" width="120" align="center"></el-table-column>
          <el-table-column prop="created_at" label="申请时间" align="center"></el-table-column>
          <el-table-column prop="create_uid" label="申请人" align="center"></el-table-column>
          <el-table-column prop="opinion" label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button @click="detail(scope.row)" type="text" size="small" class="table_details">详情</el-button>
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
      <collectionAdd :dialogFormVisible="dialogFormVisible" @close="closeAdd"></collectionAdd>
      <collectionDetail :dialogFormVisible1="dialogFormVisible1" :info="info" @close="closeAdd"></collectionDetail>
      <collectionAddBatch  :dialogFormVisible2="dialogFormVisible2" @close="closeAdd"></collectionAddBatch>
    </div>
  </div>
</template>

<script>
  import collectionAdd from '@/page/Finance/collectionManagement/recognitionWait/collectionAdd.vue'
  import collectionAddBatch from '@/page/Finance/collectionManagement/recognitionWait/collectionAddBatch.vue'
  import collectionDetail from '@/page/Finance/collectionManagement/recognitionWait/collectionDetail.vue'
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "tradeList",
    components:{
      collectionAdd,
      collectionDetail,
      collectionAddBatch
    },
    data() {
      return {
        disabled: false,

        plan: '',
        reimbursementPer: '',
        startTime: '',
        endTime: '',
        reimbursementPerID: '',
        operatorList: [],

        pageSize: 10,
        currentPage: 1,
        pageCount: 2,

        //待审批table
        tableData: [{}],

        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
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

      addFun(){
        this.info = '';
        this.dialogFormVisible = true;
      },
      batchAddFun(){
        this.info = '';
        this.dialogFormVisible2 = true;
      },
      detail(row){
        this.info = row.id;
        this.dialogFormVisible1 = true;
      },
      closeAdd() {
        this.dialogFormVisible = false;
        this.dialogFormVisible1 = false;
        this.dialogFormVisible2 = false;
        this.info = '';
        this.loadData();
      },

      searchFun(){
        this.loadData();
      },
      resetFun(){
        this.plan = '';
        this.reimbursementPer = '';
        this.startTime = '';
        this.endTime = '';
        this.reimbursementPerID = '';
        this.loadData();
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
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/predeposit/predeposit/listpage", {
          "pageIndex": this.currentPage,
          "pageSize": this.pageSize,
          "explain": this.plan,
          "create_uid": this.reimbursementPerID,
          "apply_start": this.startTime,
          "apply_end": this.endTime,
          "create_type": '1'
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log('手动列表',response);
            that.tableData = response.data.data.list;
            that.pageCount = response.data.data.total - 0;
            that.tableData.forEach(function (item, index, arr) {
              item.receivables_at = formatDate(new Date(item.receivables_at*1000));
              item.receivables_at = item.receivables_at.split(" ")[0];
              item.created_at = formatDate(new Date(item.created_at*1000));
//              item.created_at = item.created_at.split(" ")[0];
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

<style lang="scss" scoped>
  #manualCol .borders{
    overflow: hidden;
    /*border: 1px solid #E6E6E6;*/
    margin-bottom: 30px;
    .search{
      width: 96%;
      min-width: 1079px;
      margin-left: 20px;
      margin-top: 25px;
      float: left;
      background-color: #f7f7f7;
      padding: 20px 10px;
      box-sizing: border-box;
      .el-row{
        margin-bottom: 20px;
      }
      .search_style{
        /*float: left;*/
        margin-top: 10px;
        margin-left: 20px;
        font-size: 14px;
        display: inline-block;
        width: 80px;
      }
      .search_input{
        /*float: left;*/
        width: 65%;
      }
      .start-time{
        width: 32.5%;
      }
      .date-line {
        width: 10px;
        border-bottom: 1px solid #e6e6e6;
        display: inline-block;
        margin: 0 3px 3px 0
      }
      .buttonDv button{
        float: right;
        margin-right: 20px;
      }
    }
    .table_style{
      width: 96%;
      min-width: 1079px;
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
  }
</style>
