<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <span class="search-title">产品名称:</span>
      <el-input v-model="activeForm.title" class="input"></el-input>
      <span class="search-title" style="margin-right: 40px;">报账团号:</span>
      <el-input v-model="activeForm.tour" class="input"></el-input>
      <span class="search-title">创建时间:</span>
      <el-date-picker v-model="activeForm.createTime" class="input" style="width: 30%;" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker><br /><br />
      <span class="search-title">操作人员:</span>
      <el-input v-model="activeForm.user" class="input"></el-input>
      <span class="search-title">报账状态:</span>
      <el-select v-model="activeForm.status" placeholder="请选择" style="width:200px;margin-left:40px;">
        <el-option key="" label="全部" value=""></el-option>
        <el-option key="0" label="未报账" value="0"></el-option>
        <el-option key="1" label="报账中" value="1"></el-option>
        <el-option key="2" label="已报账" value="2"></el-option>
      </el-select>
      <div class="button_select">
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
        <el-button type="primary" @click="resetHand()" size="medium">重置</el-button>
      </div>
    </div>
    <div class="main">
      <el-button type="primary" @click="createNew" plain>新建报账团号</el-button>
    </div>
    <div class="table_trip" style="width: 80%;">
      <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
        <el-table-column prop="tour" label="报账团号" align="center" width="80%">
        </el-table-column>
        <el-table-column prop="title" label="产品名称" align="center">
        </el-table-column>
        <el-table-column prop="time" label="开始时间/结束时间" align="center">
        </el-table-column>
        <el-table-column prop="status" label="报账状态" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="开始时间/结束时间" align="center">
        </el-table-column>
        <el-table-column prop="user" label="操作人员" align="center">
        </el-table-column>
        <el-table-column prop="option" label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button @click="infoTour(scope.row)" type="primary" size="small" class="table_details">详情</el-button>
            <el-button @click="createNew(scope.row)" type="warning" size="small" class="table_details">修改</el-button>
            <el-button @click="pledging(scope.row)" type="primary" size="small" class="table_details">认款</el-button>
            <el-button @click="delTour(scope.row)" type="danger" size="small" class="table_details">删除</el-button>
            <el-button @click="billReporting(scope.row)" type="primary" size="small" class="table_details">报账单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
    <NewTour :dialogFormVisible="dialogFormVisible" @close="close" :info="info"></NewTour>
  </div>
</template>
<script type="text/javascript">
import NewTour from '@/page/productManagement/regimentPlan/children/team/scenicTicketingInfo/newTour'


export default {
  name: "externalOrderList",
  components: {
    NewTour,
  },
  data() {
    return {
      activeForm: {
        title: '',
        tour: '',
        createTime: '',
        user: '',
        status: '',
      },
      reable: true,
      pid: '',
      info: '',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      total: 10, //总条数
      currentPage4: 1,
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      tableData: [{
        id : '1',
        tour: '311123',
        title: '丹东百瀑峡门票（成人票）',
        time: '开始时间：2019-01-09结束时间：2019-01-09',
        status: '未报账',
        createTime: '2019-01-09 09:37',
        user: '阳阳',
      }, {
        id : '2',
        tour: '311124',
        title: '丹东百瀑峡门票（成人票）',
        time: '开始时间：2019-01-09结束时间：2019-01-09',
        status: '未报账',
        createTime: '2019-01-09 09:37',
        user: '阳阳',
      }, ],
      form: {},
      currentRow: true,
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {},
  methods: {
    //关联
    createNew(row) {
      this.info = row
      this.dialogFormVisible = true
    },
    //报账单
    billReporting(row) {
      this.$router.push({path: "/scenicTicketingBillReporting?id="+row['id']});
    },
    //认款
    pledging(row) {
      this.$router.push({path: "/scenicTicketingPledging?id="+row['id']});
    },
    //详情
    infoTour(row) {
      this.$router.push({path: "/scenicTicketingDetails?id="+row['id']});
    },
    close() {
      this.dialogFormVisible = false
      this.dialogFormVisible2 = false
      this.dialogFormVisible3 = false
    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['tour']
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
    delTour(row) {
      this.$confirm('是否删除此报账信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //搜索
    searchHand() {
      this.$message({
        type: 'success',
        message: '搜索成功!'
      });
    },
    resetHand() {
      this.activeForm = {
        title: '',
        tour: '',
        createTime: '',
        user: '',
        status: '',
      }
    }
  },
  created() {}

}

</script>
<style lang="scss" scoped>
.vivo {
  .demo-input-suffix {
    width: auto;
    background-color: #F7F7F7;
    padding: 20px;

    .search-title {
      font-size: 14px;
      margin-left: 20px;
      margin-top: 10px;
    }

    .el-input {
      width: auto;
    }

    .el-input__inner {
      width: 10%;
    }

    .demo-input-suffix {
      width: 900px
    }

    .date-line {
      width: 10px;
      border-bottom: 1px solid #e6e6e6;
      display: inline-block;
      margin: 0 3px 3px 0
    }

    .button_select {
      display: inline;
      margin-left: 25%;
    }

  }

  .main {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: left;
    //margin-left: 50px;

    .select_button {
      padding-top: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9eaea;
      text-align: left;
      padding-left: 50px;
    }
  }

  .table_trip {
    .table_details {
      margin: 5px;
    }
  }

}



.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

</style>
