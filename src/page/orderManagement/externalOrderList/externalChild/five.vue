<template>
  <div class="vivo" style="position:relative">
    <div class="table_trip" style="width: 80%;">
      <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
        <el-table-column prop="oid" label="订单ID" align="center" width="80%">
        </el-table-column>
        <el-table-column prop="title" label="产品名称" align="center">
        </el-table-column>
        <el-table-column prop="salesTime" label="销售时间" align="center">
        </el-table-column>
        <el-table-column prop="money" label="费用" align="center">
        </el-table-column>
        <el-table-column prop="number" label="数量" align="center">
        </el-table-column>
        <el-table-column prop="guestInformation" label="客人信息" align="center">
        </el-table-column>
        <el-table-column prop="importTime" label="导入时间" align="center">
        </el-table-column>
        <el-table-column prop="relationPid" label="关联产品" align="center">
        </el-table-column>
        <el-table-column prop="accountingStatus" label="报账状态" align="center">
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
  name: "five",
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
        oid: '1',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '2',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '3',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '3',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '3',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '3',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '3',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '3',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '3',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '3',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
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
    this.$emit('getNumber', 'Qn', 15)
  }
}

</script>
<style lang="scss" scoped>
.vivo {
  margin-bottom: 200px;
}

</style>
