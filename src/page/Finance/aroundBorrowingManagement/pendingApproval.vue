<template>
  <div class="all" id="noIncomeBorrowing">
    <div class="borders">
      <el-tabs type="border-card" v-model="activeName" class="card_style">
        <el-tab-pane :label="'无收入借款（'+ noIncomeNum +'）'" name="first">
          <div class="table_style">
            <el-table :data="tableDatanoIncome" :header-cell-style="getRowClass" border>
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
              <el-table-column prop="create_uid" label="申请人" align="center"></el-table-column>
              <el-table-column prop="approval_comments" label="审批意见" align="center"></el-table-column>
              <el-table-column prop="opinion" label="操作" align="center" width="150">
                <template slot-scope="scope">
                  <el-button @click="approval(scope.row)" type="text" size="small" class="table_details">审批</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChangenoIncome"
              @current-change="handleCurrentChangenoIncome"
              :current-page.sync="currentPagenoIncome"
              :page-sizes="[10, 20, 50, 100]"
              :page-size= pageSizenoIncome
              layout="total, sizes, prev, pager, next, jumper"
              :total=pageCountnoIncome
              background>
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'预付款管理（'+ advanceNum +'）'" name="second">
          <div class="table_style">
            <el-table :data="tableDataAdvance" :header-cell-style="getRowClass" border>
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
              <el-table-column prop="create_uid" label="申请人" align="center"></el-table-column>
              <el-table-column prop="approval_comments" label="审批意见" align="center"></el-table-column>
              <el-table-column prop="opinion" label="操作" align="center" width="150">
                <template slot-scope="scope">
                  <el-button @click="approval(scope.row)" type="text" size="small" class="table_details">审批</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChangeAdvance"
              @current-change="handleCurrentChangeAdvance"
              :current-page.sync="currentPageAdvance"
              :page-sizes="[10, 20, 50, 100]"
              :page-size= pageSizeAdvance
              layout="total, sizes, prev, pager, next, jumper"
              :total=pageCountAdvance
              background>
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'余额支付借款（'+ balanceNum +'）'" name="third">
          <div class="table_style">
            <el-table :data="tableDataBalance" :header-cell-style="getRowClass" border>
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
              <el-table-column prop="create_uid" label="申请人" align="center"></el-table-column>
              <el-table-column prop="approval_comments" label="审批意见" align="center"></el-table-column>
              <el-table-column prop="opinion" label="操作" align="center" width="150">
                <template slot-scope="scope">
                  <el-button @click="approval(scope.row)" type="text" size="small" class="table_details">审批</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChangeBalance"
              @current-change="handleCurrentChangeBalance"
              :current-page.sync="currentPageBalance"
              :page-sizes="[10, 20, 50, 100]"
              :page-size= pageSizeBalance
              layout="total, sizes, prev, pager, next, jumper"
              :total=pageCountBalance
              background>
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

      <approval :dialogFormVisible="dialogFormVisible" @close="closeAdd" :info="info"></approval>
    </div>
  </div>
</template>

<script>
  import approval from '@/page/Finance/aroundBorrowingManagement/approval.vue'
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "tradeList",
    components:{
      approval
    },
    data() {
      return {
        disabled: false,
        activeName: 'first',
        noIncomeNum: 0,
        advanceNum: 0,
        balanceNum: 0,
        pageSizenoIncome: 10,
        currentPagenoIncome: 1,
        pageCountnoIncome: 0,
        tableDatanoIncome: [],
        pageSizeAdvance: 10,
        currentPageAdvance: 1,
        pageCountAdvance: 0,
        tableDataAdvance: [],
        pageSizeBalance: 10,
        currentPageBalance: 1,
        pageCountBalance: 0,
        tableDataBalance: [],
        typeList: {
          1: '门票',
          2: '酒店',
          3: '地接',
          4: '定制游(跟团游)'
        },
        dialogFormVisible: false,
        info: '',
        unfinishWorking: []
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
      approval(row){
        const that = this;
        this.unfinishWorking.forEach(function (item, index, arr) {
          if(row.id == item.jq_ID){
            that.info = {
              "id": row.id ,
              "workItemID": item.workItemID
            };
            return;
          }
        });
        this.dialogFormVisible = true;
      },
      closeAdd() {
        this.dialogFormVisible = false;
        this.info = '';
        const that = this;
        const timer = setTimeout(function () {
          that.loadUnfinished();
        }, 800);
      },
      handleSizeChangenoIncome(val) {
        this.pageSizenoIncome = val;
        this.currentPagenoIncome = 1;
        this.loadData(1);
      },
      handleCurrentChangenoIncome(val) {
        this.currentPagenoIncome = val;
        this.loadData(1);
      },
      handleSizeChangeAdvance(val) {
        this.pageSizeAdvance = val;
        this.currentPageAdvance = 1;
        this.loadData(2);
      },
      handleCurrentChangeAdvance(val) {
        this.currentPageAdvance = val;
        this.loadData(2);
      },
      handleSizeChangeBalance(val) {
        this.pageSizeBalance = val;
        this.currentPageBalance = 1;
        this.loadData(3);
      },
      handleCurrentChangeBalance(val) {
        this.currentPageBalance = val;
        this.loadData(3);
      },
      loadUnfinished(loan){
        const that = this;
        this.$http.post(this.GLOBAL.jqUrlZB + "/ZB/GettingUnfinishedTasksForZB", {
          "userCode": sessionStorage.getItem('tel'),
//          "userCode": "zb1",
          "startTime": "1970-07-23T01:30:54.452Z",
          "endTime": new Date(),
          "startIndex": -1,
          "endIndex": -1,
          "workflowCode": loan
        }, ).then(function(response) {
          console.log('获取未完成任务', response);
          let noIncomeIDs = '', noIncomeNum = 0, advanceIDs = '', advanceNum = 0, balanceIDs = '', balanceNum = 0;
//          that.$parent.totalNum = response.data.length;
          that.unfinishWorking = that.unfinishWorking.concat(response.data);
          if(response.data.length !== 0){
            response.data.forEach(function (item, index, arr) {
              if(item.jq_Type == 1){
                noIncomeIDs += item.jq_ID + ',';
                noIncomeNum++;
              }else if(item.jq_Type == 2){
                advanceIDs += item.jq_ID + ',';
                advanceNum++;
              }else if(item.jq_Type == 3){
                balanceIDs += item.jq_ID + ',';
                balanceNum++;
              }
            });
          }
          that.$parent.noIncomeNum = noIncomeNum;
          that.$parent.advanceNum = advanceNum;
          that.$parent.balanceNum = balanceNum;
          if(noIncomeIDs != ''){
            noIncomeIDs = noIncomeIDs.substr(0, noIncomeIDs.length - 1);
            that.loadData(1, noIncomeIDs);
          }else{
            that.noIncomeNum = 0;
            that.tableDatanoIncome = [];
            that.pageCountnoIncome = 0;
          }
          if(advanceIDs != ''){
            advanceIDs = advanceIDs.substr(0, advanceIDs.length - 1);
            that.loadData(2, advanceIDs);
          }else{
            that.advanceNum = 0;
            that.tableDataAdvance = [];
            that.pageCountAdvance = 0;
          }
          if(balanceIDs != ''){
            balanceIDs = balanceIDs.substr(0, balanceIDs.length - 1);
            that.loadData(3, balanceIDs);
          }else{
            that.balanceNum = 0;
            that.tableDataBalance = [];
            that.pageCountBalance = 0;
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
      loadData(periphery_type, ids){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/examinepage", {
          "pageIndex": this.currentPage,
          "pageSize": this.pageSize,
          "create_uid": '',
          "supplier_code": '',
          "start_at": '',
          "end_at": '',
          "periphery_type": periphery_type,
          "approval_status": '',
          "id": ids
        }, ).then(function(response) {
          if (response.data.code == '200') {
            if(periphery_type == 1){
              that.noIncomeNum = response.data.data.list.length;
              that.tableDatanoIncome = response.data.data.list;
              that.pageCountnoIncome = response.data.data.total - 0;
              that.tableDatanoIncome.forEach(function (item, index, arr) {
                item.created_at = formatDate(new Date(item.created_at*1000));
                that.getName(item.create_uid).then(res => {
                  item.create_uid = res;
                });
                that.getSupplier(item.supplier_code).then(res => {
                  item.supplier_code = res;
                });
              })
            }else if(periphery_type == 2){
              that.advanceNum = response.data.data.list.length;
              that.tableDataAdvance = response.data.data.list;
              that.pageCountAdvance = response.data.data.total - 0;
              that.tableDataAdvance.forEach(function (item, index, arr) {
                item.created_at = formatDate(new Date(item.created_at*1000));
                that.getName(item.create_uid).then(res => {
                  item.create_uid = res;
                });
                that.getSupplier(item.supplier_code).then(res => {
                  item.supplier_code = res;
                });
              })
            }else if(periphery_type == 3){
              that.balanceNum = response.data.data.list.length;
              that.tableDataBalance = response.data.data.list;
              that.pageCountBalance = response.data.data.total - 0;
              that.tableDataBalance.forEach(function (item, index, arr) {
                item.created_at = formatDate(new Date(item.created_at*1000));
                that.getName(item.create_uid).then(res => {
                  item.create_uid = res;
                });
                that.getSupplier(item.supplier_code).then(res => {
                  item.supplier_code = res;
                });
              })
            }
            return response.data.data.list.length;
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
      getName(id){
        const that = this;
        return that.$http.post(that.GLOBAL.serverSrcZb + "/org/api/userget", {
          "id": id
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(response) {
          console.log('名字',response.data.object.name);
          if (response.data.isSuccess) {
            return response.data.object.name;
          } else {
            if(response.data.result.message){
              that.$message.warning(response.data.result.message);
            }else{
              that.$message.warning("申请人获取失败~");
            }
            return '';
          }
        }).catch(function(error) {
          console.log(error);
          return '';
        });
      },

      getSupplier(code){
        const that = this;
        return that.$http.post(that.GLOBAL.serverSrcZb + "/universal/supplier/api/supplierget", {
          "id": code
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(response) {
          console.log(response);
          if (response.data.isSuccess) {
            return response.data.object.name;
          } else {
            if(response.data.result.message){
              that.$message.warning(response.data.result.message);
            }else{
              that.$message.warning("获取供应商名称失败~");
            }
            return '';
          }
        }).catch(function(error) {
          console.log(error);
        });
      }

    },
    created(){
      this.loadUnfinished('NoIncomeLoan_ZB');
      this.loadUnfinished('IncomeLoan_ZB');
      this.loadUnfinished('BalancePayment_ZB');
    }
  }
</script>

<style lang="scss" scoped>
  #noIncomeBorrowing .borders{
    overflow: hidden;
    /*border: 1px solid #E6E6E6;*/
    margin-bottom: 30px;
    .card_style{
      margin-top: 25px;
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
