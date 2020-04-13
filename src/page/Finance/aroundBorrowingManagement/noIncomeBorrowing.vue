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
              <el-option key="" label="全部" value=""></el-option>
              <el-option key="1" label="审批中" value="1"></el-option>
              <el-option key="2" label="驳回" value="2"></el-option>
              <el-option key="3" label="通过" value="3"></el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            <span class="search_style">对公/对私：</span>
            <el-select v-model="accountType" placeholder="请选择" class="search_input">
              <el-option key="" label="全部" value=""></el-option>
              <el-option key="1" label="对公" value="1"></el-option>
              <el-option key="2" label="对私" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="9">
            <span class="search_style">报销状态：</span>
            <el-select v-model="reimbursed_status" placeholder="请选择" class="search_input">
              <el-option key="" label="全部" value="0"></el-option>
              <el-option key="1" label="未完成报销" value="1"></el-option>
              <el-option key="2" label="已完成报销" value="2"></el-option>
            </el-select>
          </el-col>
          
        </el-row>
        <el-row>
          <el-col :span="9" :offset="14">
            <div class="buttonDv">
              <el-button type="primary" @click="resetFun" plain>重置</el-button>
              <el-button type="primary" @click="searchFun">搜索</el-button>
              <el-button type="primary" @click="exportFun" :disabled="canExport">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search applyDv">
        <el-button type="primary" @click="applyFor">申请</el-button>
      </div>
      <div class="table_style">
        <div class="totalMoney" v-if="isShow"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联：{{num}}项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{totalMoney}}元</div>
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
          <el-table-column prop="opinion" label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button @click="detail(scope.row)" type="text" size="small" class="table_details">详情</el-button>
              <!--<el-button @click="chooseAccount(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.approval_status == 3 && scope.row.pay_type == null">选择付款账户</el-button>-->
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
      <applyFornoIncome :dialogFormVisible="dialogFormVisible" @close="closeAdd"></applyFornoIncome>
      <detail :dialogFormVisible1="dialogFormVisible1" :info="info" @close="closeAdd"></detail>
      <chooseAccount :dialogFormVisible2="dialogFormVisible2" :info="info" @close="closeAdd"></chooseAccount>
    </div>
  </div>
</template>

<script>
  import applyFornoIncome from '@/page/Finance/aroundBorrowingManagement/apply/applyFornoIncome.vue'// 申请
  import chooseAccount from '@/page/Finance/aroundBorrowingManagement/chooseAccount.vue'// 选择付款账户
  import detail from '@/page/Finance/aroundBorrowingManagement/detail.vue'// 详情
  import {formatDate} from '@/js/libs/publicMethod.js'
  import { storageLocal } from '@/js/libs/storage'
  import moment from 'moment'
  export default {
    name: "tradeList",
    components:{
      applyFornoIncome,
      detail,
      chooseAccount
    },
    data() {
      return {
        canExport: true,
        isShow: false,// 统计条是否显示
        num: '',
        totalMoney: '',
        disabled: false,// 设置搜索项时间不可编辑

        supplier: '',// 供应商
        supplierID: '',
        supplierList: [],
        startTime: '',// 搜索项，开始时间
        endTime: '',// 搜索项，结束时间
        reimbursementPer: '',// 申请人
        reimbursementPerID: '',// 申请人ID
        operatorList: [],// 申请人list
        borrowStatus: '',// 借款状态
        accountType: '',// 对公--1,对私--2
        reimbursed_status: '',

        // 页数，页码，条数
        pageSize: 10,
        currentPage: 1,
        pageCount: 0,

        // 列表table
        tableData: [],
        typeList: {
          1: '门票',
          2: '酒店',
          3: '地接',
          4: '定制游(跟团游)'
        },

        dialogFormVisible: false,// 申请-显示，隐藏
        dialogFormVisible1: false,// 详情-显示，隐藏
        dialogFormVisible2: false,// 选择账户-显示，隐藏
        info: '',// 详情传值字段

        // 时间限制
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate()
      };
    },
    methods: {
      // 导出方法
      exportFun(){
        let start = '', end = '';
        if(this.startTime){
          start = moment(this.startTime).format('YYYY-MM-DD');
        }
        if(this.endTime){
          end = moment(this.endTime).format('YYYY-MM-DD');
        }
        if(this.tableData.length == 0){
          this.$message.warning("无搜索数据导出，请重新搜索！");
        }else{
          window.location.href = this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/exportloan?periphery_type=1&supplier_code=" + this.supplierID + "&create_uid=" + this.reimbursementPerID + "&start_time=" + start + "&end_time=" + end + "&approval_status=" + this.borrowStatus + "&account_type=" + this.accountType + "&reimbursed_status=" + this.reimbursed_status;
        }
      },
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
        // console.log(item);
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
      // 申请
      applyFor(){
        // console.log('申请~');
        this.dialogFormVisible = true;
      },
      // 详情
      detail(row){
        this.info = row.id;
        this.dialogFormVisible1 = true;
      },
      // 选择账户
      chooseAccount(row){
        this.info = row.id;
        this.dialogFormVisible2 = true;
      },
      // 关闭弹窗
      closeAdd(str) {
        this.dialogFormVisible = false;
        this.dialogFormVisible1 = false;
        this.dialogFormVisible2 = false;
        this.info = '';
        // console.log(str);
        if(str !== 'detail'){
          this.loadData();
        }
        const that = this;
        const timer = setTimeout(function () {
          that.$parent.loadData('NoIncomeLoan_ZB');
        }, 800);
      },

      // 搜索
      searchFun(){
        this.currentPage = 1;
        this.isShow = true;
        if(this.supplier != '' || this.reimbursementPer != '' || this.startTime != '' || this.endTime != '' || this.borrowStatus != '' || this.accountType != '' || reimbursed_status != ''){
          this.canExport = false;
        }
        this.loadData();
      },
      // 重置
      resetFun(){
        this.supplier = '';
        this.supplierID = '';
        this.reimbursementPer = '';
        this.startTime = '';
        this.endTime = '';
        this.reimbursementPerID = '';
        this.borrowStatus = '';
        this.accountType = '';
        this.reimbursed_status = '';
        this.currentPage = 1;
        this.isShow = false;
        this.canExport = true;
        this.loadData();
      },
      // 每页条数操作
      handleSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
        this.loadData()
      },
      // 页数操作
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loadData();
      },

      // 加载数据
      loadData(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/listpage", {
          "pageIndex": this.currentPage,
          "pageSize": this.pageSize,
          "create_uid": this.reimbursementPerID,
          "supplier_code": this.supplierID,
          "start_at": this.startTime,
          "end_at": this.endTime,
          "periphery_type": 1,
          "approval_status": this.borrowStatus,
          "account_type": this.accountType,
          "reimbursed_status": this.reimbursed_status
        }, ).then(function(response) {
          // console.log('无收入借款list',response);
          if (response.data.code == '200') {
            // console.log('无收入借款list',response);
            that.tableData = response.data.data.list;
            that.num = response.data.data.list.length;
            that.pageCount = response.data.data.total - 0;
            let moneyAll = 0;
            that.tableData.forEach(function (item, index, arr) {
              moneyAll += parseFloat(item.loan_money);
              // item.receivables_at = formatDate(new Date(item.receivables_at*1000));
              // item.receivables_at = item.receivables_at.split(" ")[0];
              item.created_at = formatDate(new Date(item.created_at*1000));
              // item.created_at = item.created_at.split(" ")[0];
              // 获取申请人
              that.$http.post(that.GLOBAL.serverSrcZb + "/org/api/userget", {
                "id": item.create_uid
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
              }).then(function(response) {
                // console.log(response);
                if (response.data.isSuccess) {
                  item.create_uid = response.data.object.name
                } else {
                  that.$message.success("获取申请人失败~");
                }
              }).catch(function(error) {
                console.log(error);
              });

              // 获取供应商名称
              that.$http.post(that.GLOBAL.serverSrcZb + "/universal/supplier/api/supplierget", {
                "id": item.supplier_code
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
              }).then(function(response) {
                // console.log(response);
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
            that.totalMoney = moneyAll.toFixed(2);
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
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

      // 时间限制（开始时间小于结束时间）
      beginDate(){
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
    .totalMoney {
      width: 100%;
      background-color: #E6F3FC;
      height: 30px;
      line-height: 30px;
      margin: 8px auto;
    }
  }
</style>
