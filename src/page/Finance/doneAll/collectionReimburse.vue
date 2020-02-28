<template>
  <div>
    <div class="plan">
      <el-form :model="ruleFormSearch" ref="ruleFormSearch" label-width="80px" style="margin-top: 20px">
        <el-row type="flex" class="row-bg">
          <el-col :span="8">
            <el-form-item label="收款时间:">
              <el-col :span="11">
                <el-form-item prop="startTime">
                  <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleFormSearch.startTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleFormSearch.endTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="报销单号:" prop="order">
              <el-input placeholder="请输入报销单号" v-model="ruleFormSearch.order" class="group-no" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="申请人:" prop="creater">
              <el-input placeholder="请输入申请人" v-model="ruleFormSearch.creater" class="group-no" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="text-align: left">
            <el-form-item>
              <el-button @click="HandleSearchApprove" type="primary">搜索</el-button>
              <el-button type="primary" plain @click="HandleResetApprove">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="approveTableDataSheet" border class="tableData" :highlight-current-row="true" :header-cell-style="getRowClass" id="table-content1" v-loading="listLoading">
      <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
      <el-table-column prop="checkTypeStatus" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F">审批中</div>
          <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D">驳回</div>
          <div v-if="scope.row.checkType=='1'" style="color: #33D174">通过</div>
        </template>
      </el-table-column>
      <el-table-column prop="reimbursement" label="报销单号" align="center"></el-table-column>
      <el-table-column prop="loan" label="借款单号" align="center"></el-table-column>
      <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="handleDetails(scope.row)" type="text" size="small" class="table_details">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="el-pagination">
      <el-pagination
        style="margin: 10px auto"
        :page-sizes="[10,20,30,50]"
        background
        @size-change="handleSizeChange"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: "collectionReimburse",
    props:{
      whereSheetTab: String
    },
    data(){
      return {
        ruleFormSearch: {
          endTime:'',
          startTime: '',
          order: '',
          creater: '',
          // checkType: '',
        },
        approveTableDataSheet: [],
        listLoading: false,
        pageSize: 10,
        currentPage: 1,
        totalCount: 0,
      }
    },
    created(){
      this.getTableData()
    },
    computed: {
      /*tabChange: function () {
        return this.whereSheetTab
      }*/
    },
    watch:{
      /*tabChange: function(val, oldVal){
        console.log(val, oldVal)
        if(val === oldVal){
          this.getTableData()
        }
      }*/
    },
    methods: {
      HandleResetApprove(){
        this.$refs['ruleFormSearch'].resetFields()
      },
      handleDetails(row){
        let getCurrentPaymentID = row.id
        this.$router.push({ path: "/doneAll/collectionDetails", query: {doneDetailPaymentID: getCurrentPaymentID, componentName: 'reimburse'} })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.loading = true;
        this.getTableData();
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.loading = true;
        this.getTableData();
      },
      // 直客搜索
      HandleSearchApprove() {
        this.currentPage = 1;
        this.loading = true;
        this.getTableData();
      },
      moment,
      getTableData() {
        const that = this;
        this.$http
          .post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            pageIndex: this.currentPage,
            pageSize: this.pageSize,
            object: {
              id: 0,
              checkType: 4,
              collectionTime: "2019-05-16",
              startTime: this.ruleFormSearch.startTime ? moment(this.ruleFormSearch.startTime).format("YYYY-MM-DD"): "2000-05-16",
              endTime: this.ruleFormSearch.endTime ? moment(this.ruleFormSearch.endTime).format("YYYY-MM-DD") : "2099-05-16",
              groupCode: "",
              planID: 0,
              orderID: 0,
              orderNumber: '',
              collectionNumber: "",
              price: 0,
              dept: 0,
              createUser: this.ruleFormSearch.creater !== "" ? this.ruleFormSearch.creater : "",
              createTime: "2019-05-16 01:02:40",
              code: "",
              serialNumber: "",
              abstract: "",
              isDeleted: 0,
              collectionType: 6, // 直客1.同业2
              localCompID: 0 // 直客0,同业变成同业社id
              //"localCompName":""
            }
          })
          .then(function(obj) {
            if (obj.data.isSuccess) {
              that.approveTableDataSheet = obj.data.objects;
              that.totalCount = obj.data.total;
              this.$emit('handlePassVal', obj.data.total)
              that.tableDataBXHK.forEach(function(item, index, arr) {
                item.createTime = moment(item.createTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              });
              that.listLoading = false;
            } else {
              that.totalCount = 0;
              that.approveTableDataSheet = [];
              that.listLoading = false;
            }
          })
          .catch(function(obj) {});
      },
      dateFormat: function(row, column) {
        let date = row[column.property];
        if(date == undefined) {
          return '';
        }
        return moment(date).format('YYYY-MM-DD')
      },
      // 表格表头颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
        } else {
          return "";
        }
      },
      handleJumpDetail(index, row){
        let getCurrentPaymentID = row.id
        this.$router.push({ path: "/checkSheetDetail/team", query: {id: getCurrentPaymentID} })
      },
    }
  }
</script>

<style scoped lang="scss">
  .el-pagination {
    margin-top: 30px;
    margin-left: -30%;
    text-align: center;
    margin-bottom: 20px;
  }
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    .plan{
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .time{
        margin: 0 0 0 10px;
      }
      .fl{
        float:left;
        margin: 20px 0 20px 0;
      }
    }
    #table-content{
      width: 98%;
      margin: 40px auto 10px;
    }
  }
</style>
