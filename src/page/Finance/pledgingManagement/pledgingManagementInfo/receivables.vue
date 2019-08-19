<template>
  <div class="vivo" style="position:relative">
    <div class="table_trip" style="width: 90%;">
      <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
        <el-table-column prop="rec_sn" label="收款编码" align="center">
        </el-table-column>
        <el-table-column prop="status" label="审批状态" align="center">
          <template slot-scope="scope">
            {{status[scope.row.approval_status]}}
          </template>
        </el-table-column>
        <el-table-column prop="approval_comments" label="审批意见" align="center">
        </el-table-column>
        <el-table-column prop="approval_money" label="审批金额" align="center">
        </el-table-column>
        <el-table-column prop="option" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="details(scope.row)" size="small" class="table_details">详情</el-button>
            <el-button @click="revoke(scope.row)" type="danger" size="small" class="table_details" v-if="scope.row.approval_status != 1">撤销</el-button>
            <el-button @click="adopt(scope.row)" type="success" size="small" class="table_details" v-if="scope.row.approval_status == 1">通过</el-button>
            <el-button @click="reject(scope.row)" type="warning" size="small" class="table_details" v-if="scope.row.approval_status == 1">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <!--<div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">-->
      <!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total='total'>-->
      <!--</el-pagination>-->
    <!--</div>-->
    <el-dialog title="审批通过" :visible.sync="dialogVisible" width="500px" height="100%">
      <div class="header">
        <el-form>
          <el-form-item label="通过说明：" prop="explain" label-width="150px" style="margin-left: -60px;">
            <el-input type="textarea" v-model="explain" :autosize="{ minRows: 4, maxRows:6}" style="width:300px;" placeholder="选填"></el-input>
          </el-form-item><br /><br />
        </el-form>
      </div>
      <div class="footer">
        <el-button type="primary" @click="passSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审批驳回" :visible.sync="dialogVisible2" width="500px" height="100%">
      <div class="header">
        <el-form>
          <el-form-item label="驳回意见：" prop="content" label-width="150px" style="margin-left: -60px;">
            <el-input type="textarea" v-model="content" :autosize="{ minRows: 4, maxRows:6}" style="width:300px;" placeholder="选填"></el-input>
          </el-form-item><br /><br />
        </el-form>
      </div>
      <div class="footer">
        <el-button type="primary" @click="rejectSubmit">确 定</el-button>
        <el-button @click="dialogVisible2 = false">取 消</el-button>
      </div>
    </el-dialog>
    <ReceivablesDetails :dialogVisible="dialogVisible3" :pid="pid" @close="closeAdd"></ReceivablesDetails>
  </div>
</template>
<script type="text/javascript">
import ReceivablesDetails from '@/page/Finance/pledgingManagement/pledgingManagementInfo/receivablesDetails'
export default {
  name: "receivables",
  components: {
    ReceivablesDetails
  },
  props: {

  },
  data() {
    return {
      total: 10, //总条数
      currentPage4: 1,
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      pid: '',
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      explain: '',
      content: '',
      tableData: [],
      form: {},
      currentRow: true,
      status: {
        1: '审批中',
        2: '驳回',
        3: '通过',
      }
    }
  },
  watch: {

  },
  computed: {
    // 计算属性的 getter
  },
  methods: {
    details(row) {
      this.pid = row['id'];
      this.dialogVisible3 = true;
    },
    revoke(row) {
      const that = this;
      this.$confirm('是否撤销审批?', '提示', {
        confirmButtonText: '撤销',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recstatus", {
          "id": row['id'],
          "approval_uid": sessionStorage.getItem('id'),
          "status": "1",
          "approval_comments": ''
        }, ).then(function(response) {
          console.log(response);
          if (response.data.code == '200') {
//        console.log(response);
            that.$message.success("已撤销~");
            that.dialogVisible = false;
            that.loadData();
          } else {
            that.$message.success("撤销失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤销'
        });
      });
    },
    reject(row) {
      this.pid = row['id'];
      this.dialogVisible2 = true;
    },
    rejectSubmit(){
      const that = this;
//      alert(this.$parent.$parent.$parent.paramTour);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recstatus", {
        "id": that.pid,
        "approval_uid": sessionStorage.getItem('id'),
        "status": "2",
        "approval_comments": this.content
      }, ).then(function(response) {
        if (response.data.code == '200') {
//        console.log(response);
          that.$message.success("已驳回~");
          that.dialogVisible2 = false;
          that.loadData();
          that.content = '';
        } else {
          that.$message.success("驳回失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    adopt(row) {
      this.pid = row['id'];
      this.dialogVisible = true;
    },
    passSubmit(){
      const that = this;
//      alert(this.$parent.$parent.$parent.paramTour);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recstatus", {
        "id": that.pid,
        "approval_uid": sessionStorage.getItem('id'),
        "status": "3",
        "approval_comments": this.explain
      }, ).then(function(response) {
//        console.log(response);
        if (response.data.code == '200') {
//        console.log(response);
          that.$message.success("审核通过~");
          that.dialogVisible = false;
          that.loadData();
          that.explain = '';
        } else {
          that.$message.success("审核失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    closeAdd() {
      this.pid = '';
      this.dialogVisible = false;
      this.dialogVisible2 = false;
      this.dialogVisible3 = false;
      this.loadData();
    },
    //获取id
    clickBanle(row, event, column) {
      this.currentRow = true
//      this.$emit('selection', false, row['oid'])
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
//    handleSizeChange(val) {
//      this.tableData = this.tableData
//      this.total = this.total
//    },
//
//    handleCurrentChange(val) {
//      this.tableData = this.tableData
//      this.total = this.total
//    },
    //    数据加载 收款编码
    loadData(){
      const that = this;
//      alert(this.$parent.$parent.$parent.paramTour);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/receiptlist", {
        "tour_no": this.$parent.$parent.$parent.paramTour,
        "apply_type": 1,
        "limit": 0
      }, ).then(function(response) {
        if (response.data.code == '200') {
//          console.log(response);
          that.tableData = response.data.data.list;//还没渲染到页面
        } else {
          that.$message.success("加载数据失败22~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {
    this.loadData();
  }
}

</script>
<style lang="scss" scoped>
.vivo {
  margin-bottom: 200px;
}

.header {
  width: 100%;
  /*height: 180px;*/
  overflow: hidden;
}

.footer {
  width: 100%;
  height: 50px;
  float: right;
  margin-top: -30px;

  .el-button {
    float: right;
    margin-left: 10px;
  }
}

</style>
