<template>
  <div class="vivo" style="position:relative">
    <div class="table_trip" style="width: 90%;">
      <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
        <el-table-column prop="tour" label="报账团号" align="center" width="80%">
        </el-table-column>
        <el-table-column prop="status" label="审批状态" align="center">
        </el-table-column>
        <el-table-column prop="title" label="产品名称" align="center">
        </el-table-column>
        <el-table-column prop="time" label="开始时间/结束时间" align="center">
        </el-table-column>
        <el-table-column prop="number" label="减免人数" align="center">
        </el-table-column>
        <el-table-column prop="income" label="收入" align="center">
        </el-table-column>
        <el-table-column prop="cost" label="成本" align="center">
        </el-table-column>
        <el-table-column prop="grossInterestRate" label="毛利率" align="center">
        </el-table-column>
        <el-table-column prop="user" label="申请人" align="center">
        </el-table-column>
        <el-table-column prop="applicationTime" label="申请时间" align="center">
        </el-table-column>
        <el-table-column prop="option" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="approvalList(scope.row)" v-if="scope.row.id==1" type="primary" size="small" class="table_details">审批</el-button>
            <el-button @click="SeeList(scope.row)" v-if="scope.row.id==2" size="small" class="table_details">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "approval",
  components: {},
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
      tableData: [{
        id: '1',
        tour: '311125',
        status: '认款申请',
        title: '丹东百瀑峡门票（成人票）',
        time: '开始时间：2019-01-09 结束时间：2019-01-09',
        number: '2',
        income: '111.00',
        cost: '90.00',
        grossInterestRate: '2',
        user: '阳阳',
        applicationTime: '2019-12-23 12:23:23',
      }, {
        id: '2',
        tour: '311126',
        status: '认款申请',
        title: '丹东百瀑峡门票（成人票）',
        time: '开始时间：2019-01-09 结束时间：2019-01-09',
        number: '2',
        income: '111.00',
        cost: '90.00',
        grossInterestRate: '2',
        user: '阳阳',
        applicationTime: '2019-12-23 12:23:23',
      }, ],
      form: {},
      currentRow: true,
    }
  },
  watch: {
    activeForm: {
      handler(newValue, oldValue) {
        this.form = newValue;
      },
      deep: true
    },
    transmit: function(val) {
      this.currentRow = false
    },
  },
  computed: {
    // 计算属性的 getter
  },
  methods: {
    approvalList(row) {
      this.$router.push({ path: "/pledgingManagementApproval?id=" + row['id'] });
    },
    seeList(row) {
      this.$router.push({ path: "/pledgingManagementSee?id=" + row['id'] });
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
  created() {
    this.$emit('getNumber', 12)
  }
}

</script>
<style lang="scss" scoped>
.vivo {
  margin-bottom: 200px;
}

</style>
