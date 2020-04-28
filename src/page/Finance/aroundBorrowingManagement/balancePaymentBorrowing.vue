<template>
  <div class="all" id="noIncomeBorrowing">
    <div class="borders">
      <div class="search">
        <el-row>
          <el-col :span="7">
            <span class="search_style">供应商名称：</span>
            <el-autocomplete class="search_input" v-model="supplier" :fetch-suggestions="querySearchD" placeholder="请输入供应商" @select="handleSelectD" @blur="blurHand">
              <template slot-scope="{ item }">
                <div>{{ item.valueName }}</div>
              </template>
            </el-autocomplete>
          </el-col>
          <el-col :span="7">
            <span class="search_style">申请人：</span>
            <el-autocomplete class="search_input" v-model="reimbursementPer" :fetch-suggestions="querySearchOper" placeholder="请输入申请人" @select="handleSelectOper" @blur="blurHand"></el-autocomplete>
          </el-col>
          <el-col :span="9">
            <span class="search_style">申请时间：</span>
            <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time" :editable="disabled" :picker-options="startDatePicker"></el-date-picker>
            <div class="date-line"></div>
            <el-date-picker v-model="endTime" type="date" placeholder="结束日期" class="start-time" :editable="disabled" :picker-options="endDatePicker"></el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <span class="search_style">状态：</span>
            <el-select v-model="borrowStatus" placeholder="请选择" class="search_input">
              <el-option key="0" label="全部" value="0"></el-option>
              <el-option key="1" label="审批中" value="1"></el-option>
              <el-option key="2" label="驳回" value="2"></el-option>
              <el-option key="3" label="通过" value="3"></el-option>
            </el-select>
          </el-col>
          <el-col :span="9" :offset="7">
            <div class="buttonDv">
              <el-button type="primary" @click="resetFun" plain>重置</el-button>
              <el-button type="primary" @click="searchFun">搜索</el-button>
            </div>
          </el-col>
        </el-row>

      </div>
      <div class="search applyDv">
        <el-button type="primary" @click="applyFor">申请</el-button>
      </div>
      <div class="table_style">
        <el-table :data="tableData" :header-cell-style="getRowClass" border>
          <el-table-column prop="id" label="借款单号" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.approval_status=='1'" style="color: #7F7F7F" >审批中</div>
              <div v-if="scope.row.approval_status=='2'" style="color: #FF4A3D" >驳回</div>
              <div v-if="scope.row.approval_status=='3'" style="color: #00B83F" >通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="申请时间" align="center"></el-table-column>
          <el-table-column prop="supplier_code" label="供应商名称" align="center"></el-table-column>
          <el-table-column prop="periphery_type" label="类型" align="center">
            <template slot-scope="scope">
              <span>{{typeList[scope.row.periphery_type]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="loan_money" label="借款金额" width="120" align="center"></el-table-column>
          <el-table-column prop="reimbursed_money" label="已报销金额" align="center"></el-table-column>
          <el-table-column prop="create_uid" label="申请人" align="center"></el-table-column>
          <el-table-column prop="approval_comments" label="审批意见" align="center"></el-table-column>
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
      <applyForBalance :dialogFormVisible="dialogFormVisible" @close="closeAdd"></applyForBalance>
      <detail :dialogFormVisible1="dialogFormVisible1" :info="info" @close="closeAdd"></detail>
    </div>
  </div>
</template>

<script>
  import applyForBalance from '@/page/Finance/aroundBorrowingManagement/apply/applyForBalance.vue'
  import detail from '@/page/Finance/aroundBorrowingManagement/detail.vue'
  import {formatDate} from '@/js/libs/publicMethod.js'
  import { storageLocal } from '@/js/libs/storage'
  export default {
    name: "tradeList",
    components:{
      applyForBalance,
      detail
    },
    data() {
      return {
        disabled: false,
        supplier: '',
        supplierID: '',
        supplierList: [],
        startTime: '',
        endTime: '',
        reimbursementPer: '',
        reimbursementPerID: '',
        operatorList: [],
        borrowStatus: '',
        pageSize: 10,
        currentPage: 1,
        pageCount: 0,
        tableData: [],
        typeList: {
          1: '门票',
          2: '酒店',
          3: '地接',
          4: '定制游(跟团游)'
        },
        dialogFormVisible: false,
        dialogFormVisible1: false,
        info: '',
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate()
      };
    },
    methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      querySearchOper(queryString, cb){
        const operatorList = this.operatorList;
        var results = queryString ? operatorList.filter(this.createFilter1(queryString)) : operatorList;
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
      applyFor(){
        console.log('申请~');
        this.dialogFormVisible = true;
      },
      detail(row){
        this.info = row.id;
        this.dialogFormVisible1 = true;
      },
      closeAdd(str) {
        this.dialogFormVisible = false;
        this.dialogFormVisible1 = false;
        this.info = '';
        if(str !== 'detail'){
          this.loadData();
        }
        const that = this;
        const timer = setTimeout(function () {
          that.$parent.loadData('BalancePayment_ZB');
        }, 800);
      },
      searchFun(){
        this.currentPage = 1;
        this.loadData();
      },
      resetFun(){
        this.supplier = '';
        this.supplierID = '';
        this.reimbursementPer = '';
        this.startTime = '';
        this.endTime = '';
        this.reimbursementPerID = '';
        this.borrowStatus = '';
        this.currentPage = 1;
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
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/listpage", {
          "pageIndex": this.currentPage,
          "pageSize": this.pageSize,
          "create_uid": this.reimbursementPerID,
          "supplier_code": this.supplierID,
          "start_at": this.startTime,
          "end_at": this.endTime,
          "periphery_type": 3,
          "approval_status": this.borrowStatus
        }, ).then(function(response) {
          if (response.data.code == '200') {
            that.tableData = response.data.data.list;
            that.pageCount = response.data.data.total - 0;
            that.tableData.forEach(function (item, index, arr) {
              item.created_at = formatDate(new Date(item.created_at*1000));
              that.$http.post(that.GLOBAL.serverSrcZb + "/org/api/userget", {
                "id": item.create_uid
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
              }).then(function(response) {
                if (response.data.isSuccess) {
                  item.create_uid = response.data.object.name
                } else {
                  that.$message.success("获取申请人失败~");
                }
              }).catch(function(error) {
                console.log(error);
              });
              that.$http.post(that.GLOBAL.serverSrcZb + "/universal/supplier/api/supplierget", {
                "id": item.supplier_code
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
              }).then(function(response) {
                console.log(response);
                if (response.data.isSuccess) {
                  item.supplier_code = response.data.object.name
                } else {
                  if(response.data.result.message){
                    that.$message.warning('供应商：'+response.data.result.message);
                  }else{
                    that.$message.warning("获取供应商名称失败~");
                  }
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
        const that = this;
        return {
          disabledDate(time){
            if (that.endTime) {
              return new Date(that.endTime).getTime() < time.getTime()
            } else {
            }
          }
        }
      },
      processDate(){
        const that = this;
        return {
          disabledDate(time) {
            if (that.startTime) {
              return new Date(that.startTime).getTime() > time.getTime()
            } else {
            }
          }
        }
      },
      querySearchD(queryString, cb){
        let supplierList = this.supplierList;
        let results = queryString ? supplierList.filter(this.createFilterD(queryString)) : supplierList;
        cb(results);
      },
      createFilterD(queryString) {
        return (supplierList) => {
          return (supplierList.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      handleSelectD(item){
        this.supplierID = item.id;
        this.supplier = item.valueName;
      },
      blurHand(){
        const that = this;
        let ida = '', name = '';
        if(that.supplier == ''){
          that.supplierID = '';
        }else{
          this.supplierList.forEach(function (item, index, arr) {
            if(that.supplier == item.valueName){
              ida = item.id;
              name = item.valueName;
            }
          });
          if(ida){
            that.supplierID = ida;
            that.supplier = name;
          }else{
            that.supplierID = '';
          }
        }
      },
      loadSupplier(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcZb + "/alias/supplier/api/all").then(function(obj) {
          if(obj.data.isSuccess){
            let supplierObj = [];
            obj.data.objects.forEach(function (item, index, arr) {
              const valName = item.allName.split(',')[0];
              const supplier = {
                'value' : item.allName,
                'id' : item.id,
                'valueName': valName
              };
              supplierObj.push(supplier);
            });
            that.supplierList = supplierObj;
            storageLocal.set("supplier", supplierObj, '5m');
          }
        }).catch(function(obj) {
          console.log(obj);
        });
      },
    },
    created(){
      this.loadData();
      this.loadOper();
      if(storageLocal.get("supplier")){
        this.supplierList = storageLocal.get("supplier");
      }else{
        this.loadSupplier();
      }
    }
  }
</script>

<style lang="scss" scoped>
  #noIncomeBorrowing .borders{
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
        width: 100px;
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
    .applyDv{
      background-color: transparent;
      padding: 0;
    }
    .table_style{
      width: 96%;
      min-width: 1079px;
      margin-left: 20px;
      margin-top: 20px;
      float: left;
      .el-table{
        width: 100%;
      }
    }
    .block{
      float: left;
      margin-left: 600px;
      margin-top: 70px;
      margin-bottom: 30px;
    }
  }
</style>
