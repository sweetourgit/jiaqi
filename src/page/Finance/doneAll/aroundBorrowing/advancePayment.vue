<template>
  <div class="all" id="noIncomeBorrowing">
    <div class="borders">
      <el-form :model="ruleForm" ref="ruleForm">
        <div class="search">
          <el-row>
            <el-col :span="7">
              <span class="search_style">供应商名称：</span>
              <el-autocomplete class="search_input" v-model="ruleForm.supplier" :fetch-suggestions="querySearchD" placeholder="请输入供应商" @select="handleSelectD" @blur="blurHand">
                <template slot-scope="{ item }">
                  <div>{{ item.valueName }}</div>
                </template>
              </el-autocomplete>
            </el-col>
            <el-col :span="7">
              <span class="search_style">申请人：</span>
              <el-autocomplete class="search_input" v-model="ruleForm.reimbursementPer" :fetch-suggestions="querySearchOper" placeholder="请输入申请人" @select="handleSelectOper" @blur="blurHand"></el-autocomplete>
            </el-col>
            <el-col :span="9">
              <span class="search_style">申请时间：</span>
              <el-date-picker v-model="ruleForm.startTime" type="date" placeholder="开始日期" class="start-time" :editable="disabled" :picker-options="startDatePicker"></el-date-picker>
              <div class="date-line"></div>
              <el-date-picker v-model="ruleForm.endTime" type="date" placeholder="结束日期" class="start-time" :editable="disabled" :picker-options="endDatePicker"></el-date-picker>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <span class="search_style">状态：</span>
              <el-select v-model="ruleForm.borrowStatus" placeholder="请选择" class="search_input">
                <el-option key="" label="全部" value=""></el-option>
                <!-- <el-option key="1" label="审批中" value="1"></el-option> -->
                <el-option key="2" label="驳回" value="2"></el-option>
                <el-option key="3" label="通过" value="3"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <span class="search_style">对公/对私：</span>
              <el-select v-model="ruleForm.accountType" placeholder="请选择" class="search_input">
                <el-option key="" label="全部" value=""></el-option>
                <el-option key="1" label="对公" value="1"></el-option>
                <el-option key="2" label="对私" value="2"></el-option>
              </el-select>
            </el-col>
            <el-col :span="9">
              <span class="search_style">报销状态：</span>
              <el-select v-model="ruleForm.reimbursed_status" placeholder="请选择" class="search_input">
                <el-option key="" label="全部" value="0"></el-option>
                <el-option key="1" label="未完成报销" value="1"></el-option>
                <el-option key="2" label="已完成报销" value="2"></el-option>
              </el-select>
            </el-col>
            
          </el-row>
          <el-row>
            <el-col :span="9" :offset="14">
              <div class="buttonDv">
                <el-button type="primary" @click="resetFun('ruleForm')" plain>重置</el-button>
                <el-button type="primary" @click="searchFun('ruleForm')">搜索</el-button>
                <el-button type="primary" @click="exportFun(ruleForm, 2)" :disabled="canExport">导出</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="table_style">
        <div class="totalMoney" v-if="isShow"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联：{{num2}}项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{totalMoney2}}元</div>
        <el-table :data="tableData2" :header-cell-style="getRowClass" border>
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
          <el-table-column prop="loan_type" label="类型" align="center">
            <template slot-scope="scope">
              <span>{{typeList[scope.row.loan_type]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="loan_money" label="借款金额" width="120" align="center"></el-table-column>
          <el-table-column prop="reimbursed_money" label="已报销金额" align="center"></el-table-column>
          <el-table-column prop="account_type" label="对公/对私" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.account_type=='1'">对公</span>
              <span v-if="scope.row.account_type=='2'">对私</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_uid" label="申请人" align="center"></el-table-column>
          <el-table-column prop="approval_comments" label="审批意见" align="center"></el-table-column>
          <el-table-column prop="finishTime" label="审批时间" align="center"></el-table-column>
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
          :current-page.sync="currentPage2"
          :page-sizes="[10, 20, 50, 100]"
          :page-size= pageSize2
          layout="total, sizes, prev, pager, next, jumper"
          :total=pageCount2
          background>
        </el-pagination>
      </div>
      <detail :dialogFormVisible1="dialogFormVisible1" :info="info" @close="closeAdd"></detail>
    </div>
  </div>
</template>

<script>
  import detail from '@/page/Finance/aroundBorrowingManagement/detail.vue'// 详情
  
  import { storageLocal } from '@/js/libs/storage'
  import moment from 'moment'
  import aroundCommon from './aroundCommon'
  export default {
    name: "advance",
    components:{
      detail
    },
    data() {
      return {
        canExport: true,
        isShow: false,// 统计条是否显示
        num2: '',
        totalMoney2: '',
        disabled: false,// 设置搜索项时间不可编辑
        ruleForm: {
          supplier: '',// 供应商
          supplierID: '',
          startTime: '',// 搜索项，开始时间
          endTime: '',// 搜索项，结束时间
          reimbursementPer: '',// 申请人
          reimbursementPerID: '',// 申请人ID
          borrowStatus: '',// 借款状态
          accountType: '',// 对公--1,对私--2
          reimbursed_status: '',
        },
        supplierList: [],
        operatorList: [],// 申请人list

        // 页数，页码，条数
        pageSize2: 10,
        currentPage2: 1,
        pageCount2: 0,

        // 列表table
        tableData2: [],
        typeList: {
          1: '门票',
          2: '酒店',
          3: '地接',
          4: '定制游(跟团游)'
        },

        dialogFormVisible1: false,// 详情-显示，隐藏
        info: '',// 详情传值字段

        // 时间限制
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate()
      };
    },
    mixins: [aroundCommon],
    methods: {
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
        // console.log(item);
        this.ruleForm.reimbursementPerID = item.id;
      },
      blurHand(){
        const that = this;
        let ida = '';
        if(that.ruleForm.reimbursementPer == ''){
          that.ruleForm.reimbursementPerID = '';
        }else{
          this.operatorList.forEach(function (item, index, arr) {
            if(that.ruleForm.reimbursementPer == item.value){
              ida = item.id;
            }
          });
          if(ida){
            that.ruleForm.reimbursementPerID = ida;
          }else{
            that.ruleForm.reimbursementPerID = '';
          }
        }
      },
      // 详情
      detail(row){
        this.info = row.id;
        this.dialogFormVisible1 = true;
      },
      // 关闭弹窗
      closeAdd(str) {
        this.dialogFormVisible1 = false;
        this.info = '';
      },

      // 搜索
      searchFun(){
        this.currentPage2 = 1;
        this.isShow = true;
        if(this.ruleForm.supplier != '' || this.ruleForm.reimbursementPer != '' || this.ruleForm.startTime != '' || this.ruleForm.endTime != '' || this.ruleForm.borrowStatus != '' || this.ruleForm.accountType != '' || this.ruleForm.reimbursed_status != ''){
          this.canExport = false;
        }
        this.loadFinished(this.ruleForm,'IncomeLoan_ZB');
      },
      // 重置
      resetFun(){
        this.ruleForm.supplier = '';
        this.ruleForm.supplierID = '';
        this.ruleForm.reimbursementPer = '';
        this.ruleForm.startTime = '';
        this.ruleForm.endTime = '';
        this.ruleForm.reimbursementPerID = '';
        this.ruleForm.borrowStatus = '';
        this.ruleForm.accountType = '';
        this.ruleForm.reimbursed_status = '';
        this.currentPage2 = 1;
        this.isShow = false;
        this.canExport = true;
        this.loadFinished(this.ruleForm,'IncomeLoan_ZB');
      },
      // 每页条数操作
      handleSizeChange(val) {
        this.pageSize2 = val;
        this.currentPage2 = 1;
        this.loadFinished(this.ruleForm,'IncomeLoan_ZB');
      },
      // 页数操作
      handleCurrentChange(val) {
        this.currentPage2 = val;
        this.loadFinished(this.ruleForm,'IncomeLoan_ZB');
      },
      // 加载搜索项中 申请人 list
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
      },

      // 供应商选择
      querySearchD(queryString, cb){
        let supplierList = this.supplierList;
        let results = queryString ? supplierList.filter(this.createFilterD(queryString)) : supplierList;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilterD(queryString) {
        return (supplierList) => {
          return (supplierList.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      handleSelectD(item){
        console.log(item);
        this.ruleForm.supplierID = item.id;
        this.ruleForm.supplier = item.valueName;
      },
      blurHand(){
        const that = this;
        let ida = '', name = '';
        if(that.ruleForm.supplier == ''){
          that.ruleForm.supplierID = '';
        }else{
          this.supplierList.forEach(function (item, index, arr) {
            if(that.ruleForm.supplier == item.valueName){
              ida = item.id;
              name = item.valueName;
            }
          });
          if(ida){
            that.ruleForm.supplierID = ida;
            that.ruleForm.supplier = name;
          }else{
            that.ruleForm.supplierID = '';
          }
        }
      },

      // 加载供应商信息
      loadSupplier(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcZb + "/alias/supplier/api/all").then(function(obj) {
          console.log('获取供应商',obj);
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
            // const dataSup = JSON.stringfy(supplierObj);
            storageLocal.set("supplier", supplierObj, '5m');
          }
        }).catch(function(obj) {
          console.log(obj);
        });
      },

    },
    created(){
      this.loadFinished(this.ruleForm,'IncomeLoan_ZB');
      
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
    .totalMoney {
      width: 100%;
      background-color: #E6F3FC;
      height: 30px;
      line-height: 30px;
      margin: 8px auto;
    }
  }
</style>
