<template>
  <div class="vivo" style="position:relative">
    <div class="table_trip" style="width: 90%;">
      <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
        <el-table-column prop="code" label="收款编码" align="center">
        </el-table-column>
        <el-table-column prop="status" label="审批状态" align="center">
        </el-table-column>
        <el-table-column prop="approvalOpinions" label="审批意见" align="center">
        </el-table-column>
        <el-table-column prop="approvalAmount" label="审批金额" align="center">
        </el-table-column>
        <el-table-column prop="option" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="details(scope.row)" size="small" class="table_details">详情</el-button>
            <el-button @click="revoke(scope.row)" type="danger" size="small" class="table_details">撤销</el-button>
            <el-button @click="adopt(scope.row)" type="success" size="small" class="table_details">通过</el-button>
            <el-button @click="reject(scope.row)" type="warning" size="small" class="table_details">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
    <el-dialog title="审批通过" :visible.sync="dialogVisible" width="500px" height="100%">
      <div class="header">
        <el-form>
          <el-form-item label="通过说明：" prop="explain" label-width="150px" style="float:left;margin-left: -70px;">
            <el-input type="textarea" v-model="explain" :autosize="{ minRows: 4, maxRows:6}" style="width:300px;" placeholder="选填"></el-input>
          </el-form-item><br /><br />
        </el-form>
      </div>
      <div class="footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审批驳回" :visible.sync="dialogVisible2" width="500px" height="100%">
      <div class="header">
        <el-form>
          <el-form-item label="驳回意见：" prop="content" label-width="150px" style="float:left;margin-left: -70px;">
            <el-input type="textarea" v-model="content" :autosize="{ minRows: 4, maxRows:6}" style="width:300px;" placeholder="选填"></el-input>
          </el-form-item><br /><br />
        </el-form>
      </div>
      <div class="footer">
        <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
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
    reable: {
      type: Boolean
    },
    transmit: {
      type: Boolean
    },
    activeForm: {
      type: Object
    }
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
      tableData: [{
        id: '1',
        code: '收款编码1',
        status: '驳回',
        approvalOpinions: '重新确认金额',
        approvalAmount: '222.00',
      }, {
        id: '2',
        code: '收款编码2',
        status: '通过',
        approvalOpinions: '重新确认金额',
        approvalAmount: '222.00',
      }, {
        id: '3',
        code: '收款编码3',
        status: '通过',
        approvalOpinions: '重新确认金额',
        approvalAmount: '222.00',
      }, ],
      form: {},
      currentRow: true,
    }
  },
  watch: {
    transmit: function(val) {
      this.currentRow = false
    },
  },
  computed: {
    // 计算属性的 getter
  },
  methods: {
    details(row) {
      this.pid = row['id']
      this.dialogVisible3 = true
    },
    revoke(row) {
      this.$confirm('是否撤销审批?', '提示', {
        confirmButtonText: '撤销',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '撤销成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤销'
        });
      });
    },
    reject(row) {
      this.pid = row['id']
      this.dialogVisible2 = true
    },
    adopt(row) {
      this.pid = row['id']
      this.dialogVisible = true
    },
    closeAdd() {
      this.pid = ''
      this.dialogVisible = false
      this.dialogVisible2 = false
      this.dialogVisible3 = false
    },
    //获取id
    clickBanle(row, event, column) {
      this.currentRow = true
      this.$emit('selection', false, row['oid'])
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    handleSizeChange(val) {
      this.tableData = this.tableData
      this.total = this.total
    },

    handleCurrentChange(val) {
      this.tableData = this.tableData
      this.total = this.total
    },
  },
  created() {}
}

</script>
<style lang="scss" scoped>
.vivo {
  margin-bottom: 200px;
}

.header {
  width: 100%;
  height: 180px;

}

.footer {
  width: 100%;
  height: 50px;
  float: right;
  margin-top: -50px;

  .el-button {
    float: right;
    margin-left: 10px;
  }
}

</style>
