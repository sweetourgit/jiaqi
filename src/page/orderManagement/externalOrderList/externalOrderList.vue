<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <span class="search-title">产品名称:</span>
      <el-input v-model="activeForm.title" class="input"></el-input>
      <span class="search-title">订单ID:</span>
      <el-input v-model="activeForm.oid" class="input"></el-input>
      <span class="search-title">下单时间:</span>
      <el-date-picker v-model="activeForm.startTime" type="date" placeholder="开始天数"></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker v-model="activeForm.endTime" type="date" placeholder="结束天数"></el-date-picker><br /><br />
      <span class="search-title">报账状态:</span>
      <el-select v-model="activeForm.status" placeholder="请选择" style="width:200px">
        <el-option key="" label="全部" value=""></el-option>
        <el-option key="0" label="未报账" value="0"></el-option>
        <el-option key="1" label="报账中" value="1"></el-option>
        <el-option key="2" label="已报账" value="2"></el-option>
      </el-select>
      <span class="search-title">是否关联产品:</span>
      <el-select v-model="activeForm.proRelation" placeholder="请选择" style="width:200px">
        <el-option key="" label="全部" value=""></el-option>
        <el-option key="1" label="是" value="1"></el-option>
        <el-option key="2" label="否" value="2"></el-option>
      </el-select>
      <span class="search-title">导入时间:</span>
      <el-date-picker v-model="activeForm.importStartTime" type="date" placeholder="开始天数"></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker v-model="activeForm.importEndTime" type="date" placeholder="结束天数"></el-date-picker><br /><br />
      <span class="search-title">关联团期:</span>
      <el-input v-model="activeForm.tour" class="input"></el-input>
      <span class="search-title">类别:</span>
      <el-select v-model="activeForm.type" placeholder="请选择" style="width:200px">
        <el-option key="0" label="门票" value="0"></el-option>
        <el-option key="1" label="酒店" value="1"></el-option>
      </el-select>
      <span class="search-title">验证时间:</span>
      <el-date-picker v-model="activeForm.validationStartTime" type="date" placeholder="开始天数"></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker v-model="activeForm.validationEndTime" type="date" placeholder="结束天数"></el-date-picker><br /><br />
      <span class="search-title">取票人:</span>
      <el-input v-model="activeForm.ticketPerson" class="input"></el-input>
      <span class="search-title">取票人手机:</span>
      <el-input v-model="activeForm.ticketPhone" class="input"></el-input>
      <span class="search-title">分销商:</span>
      <el-input v-model="activeForm.distributors" class="input" style="width: 485px;"></el-input>
      <div class="button_select">
        <el-button type="primary" @click="resetHand()" size="medium" plain>重置</el-button>
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
      </div>
    </div>
    <div class="main">
      <el-button type="primary" @click="importOrder" plain>导入订单</el-button>
      <el-button type="primary" :disabled="reable" @click="delOrder" plain>删除订单</el-button>
      <el-button type="primary" @click="importHistory" plain>导入历史</el-button>
      <el-button type="primary" :disabled="reable" @click="relation" plain>关联</el-button>
      <el-button type="primary" :disabled="reable" @click="unbinding" plain>解绑</el-button>
    </div>
    <div class="tableDv">
      <div class="table_trip" style="width: 88%;">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%;" :highlight-current-row="currentRow" @row-click="selection" :header-cell-style="getRowClass">
          <el-table-column prop="oid" label="订单ID" align="center" width="80%">
          </el-table-column>
          <el-table-column prop="distributors" label="分销商" align="center" width="80%">
          </el-table-column>
          <el-table-column prop="title" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="type" label="类别" align="center">
          </el-table-column>
          <el-table-column prop="salesTime" label=" 下单时间" align="center">
          </el-table-column>
          <el-table-column prop="money" label="费用" align="center">
          </el-table-column>
          <el-table-column prop="number" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="guestInformation" label="客人信息" align="center">
          </el-table-column>
          <el-table-column prop="validationTime" label="验证时间" align="center">
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
    <Relation :dialogFormVisible="dialogFormVisible" @close="close"></Relation>
    <ImportOrder :dialogFormVisible2="dialogFormVisible2" @close2="close2"></ImportOrder>

  </div>
</template>
<script type="text/javascript">
import Relation from '@/page/orderManagement/externalOrderList/externalChild/relation'//关联弹窗
import ImportOrder from '@/page/orderManagement/externalOrderList/externalChild/importOrder'//导入订单弹窗
export default {
  name: "externalOrderList",
  components: {
    Relation,
    ImportOrder,
  },
  data() {
    return {
      activeName: 'one',
      activeForm: {
        title: '',
        oid: '',
        startTime: '',
        endTime: '',
        importStartTime: '',
        importEndTime: '',
        status: '',
        proRelation: '',
        tour: '',
        type: '',
        validationStartTime: '',
        validationEndTime: '',
        ticketPerson: '',
        ticketPhone: '',
        distributors: ''
      },
      reable: true,
      pid: '',
      transmit: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,

//      表格数据
      total: 11, //总条数
      currentPage4: 1,
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      tableData: [{
        oid: '1',
        distributors: '美团',
        title: '泰国7日游',
        type: '门票',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        validationTime: '2019-09-09',
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
        oid: '4',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '5',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '6',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '7',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '8',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '9',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }, {
        oid: '10',
        title: '泰国7日游',
        salesTime: '2019-07-18',
        money: '2899',
        number: '3',
        guestInformation: '客人信息,没啥问题',
        importTime: '2019-07-08',
        relationPid: '关联的产品',
        accountingStatus: '已报账',
      }],
      currentRow: true
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {},
  methods: {
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    selection(row, event, column) {
      this.reable = false;
      this.currentRow = true;
      this.pid = row['oid'];
    },
    handleClick() {
      this.reable = true;
      this.transmit = !this.transmit;
      this.pid = ''
    },
    importOrder() {
      this.dialogFormVisible2 = true
    },
    close2() {
      this.dialogFormVisible2 = false
    },
    delOrder() {
      console.log(this.pid);
      this.$confirm('是否删除此外部订单?', '提示', {
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
    //导入历史
    importHistory() {
      this.$router.push({ path: "/importHistory" });
    },
    //关联
    relation() {
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
    },
    //解绑
    unbinding() {
      console.log(this.pid);
      this.$confirm('是否需要解绑选中订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '解绑成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解绑'
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
        oid: '',
        startTime: '',
        endTime: '',
        importStartTime: '',
        importEndTime: '',
        status: '',
        proRelation: '',
        tour: '',
        type: '',
        validationStartTime: '',
        validationEndTime: '',
        ticketPerson: '',
        ticketPhone: '',
        distributors: ''
      }
    },
    handleSizeChange(val) {
//      this.tableData = this.tableData;
//      this.total = this.total;
    },

    handleCurrentChange(val) {
//      this.tableData = this.tableData;
//      this.total = this.total;
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
      margin-left: 10px;
      margin-top: 10px;
      margin-right: 20px;
      display: inline-block;
      width: 100px;
      text-align: right;
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
      width: 1300px;
      overflow: hidden;
      padding: 10px;
      box-sizing: border-box;
    }
    .button_select button{
      float: right;
      margin-left: 20px;
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
  .tableDv{
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-bottom: 40px;
  }
}



.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

</style>
