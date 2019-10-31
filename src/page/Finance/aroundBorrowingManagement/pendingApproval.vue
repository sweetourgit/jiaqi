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
                  <div v-if="scope.row.approval_status=='2'" style="color: #00B83F" >驳回</div>
                  <div v-if="scope.row.approval_status=='3'" style="color: #FF4A3D" >通过</div>
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
                  <el-button @click="detail(scope.row)" type="text" size="small" class="table_details">详情</el-button>
                  <el-button @click="detail(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.status_rece == 12">选择付款账户</el-button>
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
                  <div v-if="scope.row.approval_status=='2'" style="color: #00B83F" >驳回</div>
                  <div v-if="scope.row.approval_status=='3'" style="color: #FF4A3D" >通过</div>
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
                  <el-button @click="detail(scope.row)" type="text" size="small" class="table_details">详情</el-button>
                  <el-button @click="detail(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.status_rece == 12">选择付款账户</el-button>
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
                  <div v-if="scope.row.approval_status=='2'" style="color: #00B83F" >驳回</div>
                  <div v-if="scope.row.approval_status=='3'" style="color: #FF4A3D" >通过</div>
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
                  <el-button @click="detail(scope.row)" type="text" size="small" class="table_details">详情</el-button>
                  <el-button @click="detail(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.status_rece == 12">选择付款账户</el-button>
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

      <applyFornoIncome :dialogFormVisible="dialogFormVisible" @close="closeAdd"></applyFornoIncome>
      <detail :dialogFormVisible1="dialogFormVisible1" :info="info" @close="closeAdd"></detail>
      <collectionAddBatch  :dialogFormVisible2="dialogFormVisible2" @close="closeAdd"></collectionAddBatch>
    </div>
  </div>
</template>

<script>
  import applyFornoIncome from '@/page/Finance/aroundBorrowingManagement/apply/applyFornoIncome.vue'// 添加
  import collectionAddBatch from '@/page/Finance/collectionManagement/recognitionWait/collectionAddBatch.vue'// 批量添加
  import detail from '@/page/Finance/aroundBorrowingManagement/detail.vue'// 详情
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "tradeList",
    components:{
      applyFornoIncome,
      detail,
      collectionAddBatch
    },
    data() {
      return {
        disabled: false,// 设置搜索项时间不可编辑
        activeName: 'first',
        noIncomeNum: 0,
        advanceNum: 0,
        balanceNum: 0,

        // 页数，页码，条数，列表table
        pageSizenoIncome: 10,
        currentPagenoIncome: 1,
        pageCountnoIncome: 0,
        tableDatanoIncome: [],

        // 页数，页码，条数，列表table
        pageSizeAdvance: 10,
        currentPageAdvance: 1,
        pageCountAdvance: 0,
        tableDataAdvance: [],

        // 页数，页码，条数，列表table
        pageSizeBalance: 10,
        currentPageBalance: 1,
        pageCountBalance: 0,
        tableDataBalance: [],

        typeList: {
          1: '地接',
          2: '机票（本公司）',
          3: '机票（非本公司）',
          4: '小费',
          5: '签证',
          6: '地接（其他）',
          7: '火车票',
          8: '汽车票',
          9: '船票',
          10: '其他',
          11: '机票押金',
          12: '火车票押金'
        },

        dialogFormVisible: false,// 添加-显示，隐藏
        dialogFormVisible1: false,// 详情-显示，隐藏
        dialogFormVisible2: false,// 批量添加-显示，隐藏
        info: '',// 详情传值字段

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
      // 申请
      applyFor(){
        console.log('申请~');
        this.dialogFormVisible = true;
      },
      // 详情
      detail(row){
        this.info = row.id;
        this.dialogFormVisible1 = true;
      },
      // 关闭弹窗
      closeAdd() {
        this.dialogFormVisible = false;
        this.dialogFormVisible1 = false;
        this.dialogFormVisible2 = false;
        this.info = '';
        this.loadData();
      },

      // 每页条数操作--无收入
      handleSizeChangenoIncome(val) {
        this.pageSizenoIncome = val;
        this.currentPagenoIncome = 1;
        this.loadData(1);
      },
      // 页数操作
      handleCurrentChangenoIncome(val) {
        this.currentPagenoIncome = val;
        this.loadData(1);
      },

      // 每页条数操作--预付款
      handleSizeChangeAdvance(val) {
        this.pageSizeAdvance = val;
        this.currentPageAdvance = 1;
        this.loadData(2);
      },
      // 页数操作
      handleCurrentChangeAdvance(val) {
        this.currentPageAdvance = val;
        this.loadData(2);
      },

      // 每页条数操作--余额支付
      handleSizeChangeBalance(val) {
        this.pageSizeBalance = val;
        this.currentPageBalance = 1;
        this.loadData(3);
      },
      // 页数操作
      handleCurrentChangeBalance(val) {
        this.currentPageBalance = val;
        this.loadData(3);
      },

      // 加载数据
      loadData(periphery_type){
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
          "id": ""
        }, ).then(function(response) {
          console.log('待审批list',response);
          if (response.data.code == '200') {
//            console.log('无收入借款list',response);
            if(periphery_type == 1){
              that.noIncomeNum = response.data.data.list.length;
              that.tableDatanoIncome = response.data.data.list;
              that.pageCountnoIncome = response.data.data.total - 0;
              that.tableDatanoIncome.forEach(function (item, index, arr) {
//              item.receivables_at = formatDate(new Date(item.receivables_at*1000));
//              item.receivables_at = item.receivables_at.split(" ")[0];
                item.created_at = formatDate(new Date(item.created_at*1000));
//              item.created_at = item.created_at.split(" ")[0];
                that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
                  "id": item.create_uid
                },{
                  headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                  }
                }).then(function(response) {
//                console.log(response);
                  if (response.data.isSuccess) {
                    item.create_uid = response.data.object.name
                  } else {
                    that.$message.success("获取录入人失败~");
                  }
                }).catch(function(error) {
                  console.log(error);
                });
              })
            }else if(periphery_type == 2){
              that.advanceNum = response.data.data.list.length;
              that.tableDataAdvance = response.data.data.list;
              that.pageCountAdvance = response.data.data.total - 0;
              that.tableDataAdvance.forEach(function (item, index, arr) {
//              item.receivables_at = formatDate(new Date(item.receivables_at*1000));
//              item.receivables_at = item.receivables_at.split(" ")[0];
                item.created_at = formatDate(new Date(item.created_at*1000));
//              item.created_at = item.created_at.split(" ")[0];
                that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
                  "id": item.create_uid
                },{
                  headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                  }
                }).then(function(response) {
//                console.log(response);
                  if (response.data.isSuccess) {
                    item.create_uid = response.data.object.name
                  } else {
                    that.$message.success("获取录入人失败~");
                  }
                }).catch(function(error) {
                  console.log(error);
                });
              })
            }else if(periphery_type == 3){
              that.balanceNum = response.data.data.list.length;
              that.tableDataBalance = response.data.data.list;
              that.pageCountBalance = response.data.data.total - 0;
              that.tableDataBalance.forEach(function (item, index, arr) {
//              item.receivables_at = formatDate(new Date(item.receivables_at*1000));
//              item.receivables_at = item.receivables_at.split(" ")[0];
                item.created_at = formatDate(new Date(item.created_at*1000));
//              item.created_at = item.created_at.split(" ")[0];
                that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
                  "id": item.create_uid
                },{
                  headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                  }
                }).then(function(response) {
//                console.log(response);
                  if (response.data.isSuccess) {
                    item.create_uid = response.data.object.name
                  } else {
                    that.$message.success("获取录入人失败~");
                  }
                }).catch(function(error) {
                  console.log(error);
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
      }

    },
    created(){
      this.loadData(1);
      this.loadData(2);
      this.loadData(3);

//      console.log(this.$parent);
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
