<template>
  <div class="arrears">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 欠款列表 -->
      <el-tab-pane class="tabs" label="欠款列表" name="first">
        <div class="search_dom">
          <div class="search_supplier">
            <span class="keyword">供应商</span>
            <el-input class="search_input" clearable v-model="supplier" placeholder="请输入供应商"></el-input>
          </div>
          <div class="search_league">
            <span class="keyword">团期计划</span>
            <el-input class="search_input" clearable v-model="league" placeholder="请输入团期计划"></el-input>
          </div>
          <div class="search_league">
            <span class="keyword">操作</span>
            <el-input class="search_input" clearable v-model="handle" placeholder="请输入操作"></el-input>
          </div>
          <div class="search_league">
            <span class="keyword">起始时间</span>
            <el-date-picker
              class="search_date_left"
              v-model="dateLeft"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <!-- <el-input class="search_date_left" clearable v-model="dateLeft" placeholder="日期"></el-input> -->
            <span class="search_date_span">——</span>
            <el-date-picker
              class="search_date"
              v-model="dateRight"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <!-- <el-input class="search_date" clearable v-model="dateRight" placeholder="日期"></el-input> -->
          </div>
          <el-button class="search_button" type="primary">搜索</el-button>
          <el-button class="search_button" type="primary" @click="reset">重置</el-button>
        </div>
        <el-button plain v-if="currentRow == ''" disabled class="see_button">查看关联单据</el-button>
        <el-button plain style="border:1px solid #3095fa;color:#3095fa;" v-else class="see_button" @click="handelList">查看关联单据</el-button>

      <el-table
        :data="checkLabelList"
        class="checkLabelListTable"
        highlight-current-row
        @current-change="handleChange"
        border
        :headerRowStyle="tableHead" :cellStyle="tableHeight" :header-cell-style="getRowClass">
        <el-table-column prop="id" label="欠款单号" min-width="60" header-align="center"></el-table-column>
        <el-table-column prop="groupCode" label="团期计划" min-width="160" header-align="center"></el-table-column>
        <el-table-column prop="title" label="产品名称" min-width="230" header-align="center"></el-table-column>
        <el-table-column prop="createTime" label="发起时间" min-width="140" header-align="center"></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" min-width="60" header-align="center"></el-table-column>
        <el-table-column prop="supplierType" label="类型" min-width="60" header-align="center"></el-table-column>
        <el-table-column prop="orgName" label="申请组织" min-width="110" header-align="center"></el-table-column>
        <el-table-column prop="name" label="申请人" min-width="60" header-align="center"></el-table-column>
        <el-table-column prop="price" label="欠款金额" min-width="60" header-align="center"></el-table-column>
        <el-table-column prop="id" label="关联单据号" min-width="60" header-align="center"></el-table-column>
      </el-table>
      <div class="pages">
        <el-pagination class="page" background @size-change="pagesizes" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <!-- 欠款信息详情 -->
      <!-- <el-dialog width='1200px' top='10vh' title="详情" :visible.sync="dialogFormVisible" :show-close="false"> -->
        <!-- <detailsForm v-on:closeButton="dialogFormVisible = false" :currentRow="currentRow"></detailsForm> -->
        <AdvanceInfo :dialogFormVisible="dialogFormVisible" :find="find" :change="change" :pid="pid" :typeList="typeList" :payModeList="payModeList" @close="closeAdd" :searchHandList="searchHand"></AdvanceInfo>
        <el-dialog width='1200px' top='10vh' title="无收入借款详情" :visible.sync="ischeckLoanManagement" :show-close="false">
          <el-button style="position:absolute; top:8px; right:15px;" @click="closeCheck()">取消</el-button>
	        <checkLoanManagement :paymentID="paymentID" :groupCode="groupCode"></checkLoanManagement>
        </el-dialog>

      <!-- </el-dialog> -->
      <!-- 欠款信息详情END -->

      </el-tab-pane>
      <!-- 欠款列表END -->

      <!-- 供应商欠款 -->
      <el-tab-pane class="tabs" label="供应商欠款" name="second">
        <div class="search_dom_right">
          <span class="keyword">供应商</span>
          <el-input class="search_input" clearable v-model="supplier" placeholder="请输入供应商"></el-input>
        </div>
        <div>
          <el-button class="search_button" type="primary">搜索</el-button>
          <el-button class="search_button" type="primary" @click="handeleReset">重置</el-button>
        </div>
        <el-button plain style="width: 100px;" v-if="supplierCurrentRow == ''" disabled class="see_button">查看</el-button>
        <el-button plain style="width: 100px;border:1px solid #3095fa;color:#3095fa;" v-else class="see_button" @click="handelSupplierList">查看</el-button>

        <el-table
        :data="supplierList"
        class="supplierListTable"
        highlight-current-row
        @current-change="handleSupplierChange"
        border
        style="width: 700px;"
        :headerRowStyle="tableHead" :cellStyle="tableHeight" :header-cell-style="getRowClass">
          <el-table-column prop="name" label="供应商名称" header-align="center"></el-table-column>
          <el-table-column prop="price" label="欠款总额" header-align="center"></el-table-column>
        </el-table>

        <div class="supplier-pages">
          <el-pagination class="pageTable" background @size-change="supplierPagesizes" @current-change="supplierCurrentChange" :current-page.sync="supplierPage" :page-sizes="[2, 4, 8, 10]" :page-size="supplierSize" layout="total, sizes, prev, pager, next, jumper" :total="supplierTotal">
          </el-pagination>
        </div>

        <!-- 供应商欠款信息详情 -->
        <!-- <el-dialog width='1200px' top='10vh' title="供应商欠款详情" :visible.sync="dialogSupplierVisible" :show-close="false">
          <supplierArrearsList v-on:closeSupplier="dialogSupplierVisible = false" :supplierCurrentRow="supplierCurrentRow"></supplierArrearsList>
        </el-dialog> -->
        <!-- 供应商欠款信息详情END -->

        <!-- 供应商欠款信息详情 -->
        <el-dialog width='1600px' top='10vh' title="供应商欠款详情" :visible.sync="dialogSupplierVisible" :show-close="false">
          <vendorArrears v-on:closeSupplier="dialogSupplierVisible = false" :supplierCurrentRow="supplierCurrentRow"></vendorArrears>
        </el-dialog>
        <!-- 供应商欠款信息详情END -->


      </el-tab-pane>
      <!-- 供应商欠款END -->

    </el-tabs>
  </div>
</template>

<script>
// import detailsForm from './detailsForm/detailsForm';
// import supplierArrearsList from './detailsForm/supplierArrearsList'
import vendorArrears from './vendorArrears/vendorArrears';
import AdvanceInfo from '@/page/Finance/advancePayment/advanceInfo/advanceInfo';
import checkLoanManagement from '@/page/Finance/loanManagement/checkLoanManagement/checkLoanManagement'

export default {
  name: "arrearsManagement",
  components: {
    // detailsForm,
    vendorArrears,
    AdvanceInfo,
    checkLoanManagement
    // supplierArrearsList
  },
  data() {
    return {
      tableHead:{height: '60px', color: '#555555'},
      tableHeight:{padding: '0', height: '40px'},
      activeName: 'first', // 标签默认值
      supplier: '',        // 搜索供应商
      league: '',          // 搜索团期计划
      handle: '',          // 搜索操作
      dateLeft: '',        // 搜索起始时间左
      dateRight: '',       // 搜索起始时间右
      currentPage: 1,      // 默认开始页数
      pagesize:10,         // 每页的数据条数
      total: 100,          // 分页总条数
      supplierPage: 1,
      supplierSize: 10,
      supplierTotal: 100,
      currentRow: '',      // 欠款表格选中的值
      supplierCurrentRow: '', // 供应商欠款表格选中的值
      dialogFormVisible: false,     // 欠款信息详情
      dialogSupplierVisible: false, // 供应商欠款信息详情
      // 欠款列表表格
      checkLabelList: [],
      // 供应商欠款列表表格
      supplierList: [],
      // 预付款信息
      find: 5,
      change: false,
      pid: '',
      typeList: [],
      payModeList: [],
      // 无收入借款
      paymentID: 0,
      groupCode: '',
      ischeckLoanManagement: false

    };
  },
  created() {
    this.querySearch6()
    this.querySearch7()
    this.getData();
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7'
        } else {
          return ''
        }
    },
    searchHand() {

    },
    closeAdd() {
      this.dialogFormVisible = false;
    },
    //获取供应商类型
    querySearch6() {
      this.typeList = []
      this.$http.post(this.GLOBAL.serverSrc + '/universal/suppliertype/api/get', {}).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.typeList.push({
            "value": res.data.objects[i].id,
            "label": res.data.objects[i].name
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    //付款方式
    querySearch7() {
      this.payModeList = []
      this.$http.post(this.GLOBAL.serverSrc + '/finance/payway/api/get', {
        "object": {
          id: 1,
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.payModeList.push({
            "value": res.data.objects[i].id,
            "label": res.data.objects[i].name
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    formatDate: function(year, month, day, h, i, s) {
      var y = year;
      var m = month;
      if (m < 10) m = "0" + m;
      var d = day;
      if (d < 10) d = "0" + d;
      if (h < 10) h = "0" + h;
      if (i < 10) i = "0" + i;
      if (s < 10) s = "0" + s;
      return y + "-" + m + "-" + d + " " + h + ':' + i + ':' + s;
    },
    // 欠款列表页
    getData() {
      // 获取欠款列表
      this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentpage', {
          "pageIndex": this.currentPage,
          "pageSize": this.pagesize,
          "object": {}
      }).then(res => {
        console.log(res)
        res.data.objects.map(v => {
          let d = new Date(v.createTime);
          v.createTime = this.formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
        })
        this.checkLabelList = res.data.objects;
        this.total = res.data.total;
      })
    },
    // 供应商列表页
    getSupplier() {
      this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/supplierpage', {
        "pageIndex": this.currentPage,
          "pageSize": this.pagesize,
          "object": {}
      }).then(res => {
        this.supplierList = res.data.objects;
        this.supplierTotal = res.data.total;
      })
    },
    handleClick(tab, event) {
      if(tab.name == 'first') {
        this.getData();
      } else if(tab.name == 'second') {
        this.getSupplier();
      }
    },
    // 欠款表格选中触发的事件
    handleChange(val) {
      if (val) this.currentRow = val;
    },
    // 供应商欠款表格选中触发的事件
    handleSupplierChange(val) {
      if(val) this.supplierCurrentRow = val;
    },
    // 查看欠款关联数据
    handelList() {
      if(this.currentRow.paymentType == 2) {
        this.pid = this.currentRow.id;
        this.change = true
        this.dialogFormVisible = true;
      } else if(this.currentRow.paymentType == 1) {
        this.paymentID = this.currentRow.id;
        this.groupCode = this.currentRow.groupCode;
        this.ischeckLoanManagement = true;
      }
    },
    // 查看供应商欠款关联数据
    handelSupplierList() {
      this.dialogSupplierVisible = true;
    },
    // 每页显示条数
    pagesizes(page) {
      this.currentPage = 1;
      this.pagesize = page;
      this.getData();
    },
    supplierPagesizes(page) {
      this.supplierPage = 1;
      this.supplierSize = page;
      this.getData();
    },
    // 改变当前页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getData();
    },
    supplierCurrentChange(currentPage) {
      this.supplierPage = currentPage;
      this.getData();
    },
    // 重置
    reset() {
      this.supplier = '';        // 搜索供应商
      this.league = '';          // 搜索团期计划
      this.handle = '';          // 搜索操作
      this.dateLeft = '';        // 搜索起始时间左
      this.dateRight = '';       // 搜索起始时间右
    },
    // 供应商欠款重置
    handeleReset() {
      this.supplier = '';
    },
    //关闭无收入窗口弹窗
    closeCheck(){
      this.ischeckLoanManagement = false;
    },
  }
}
</script>

<style scoped>
.arrears>>>.el-tabs__nav-wrap {
  /* width: 167px; */
}
.search_dom {
  width: 1370px;
  margin: 30px 0 0 0;
}
.keyword {
  font-size: 14px;
}
.search_supplier {
  float: left;
  margin-left: 10px;
}
.search_input {
  width: 220px;
  margin-left: 10px;
}
.search_league {
  float: left;
  margin-left: 30px;
}
.search_date {
  width: 150px;
}
.search_date_left {
  width: 150px;
  margin-left: 10px;
}
.search_date_span {
  padding: 10px;
  color: #DCDFE6;
}
.search_button {
  width: 80px;
  margin: 30px 0 0 10px;
}
.see_button {
  margin: 30px 0 0 10px;
}
.checkLabelListTable {
  text-align: center;
  margin: 30px 0 0 10px;
  width: 1600px;
  min-width: 1450px;
}
.supplierListTable {
  text-align: center;
  margin: 30px 0 0 10px;
  min-width: 700px;
}
.pages {
  width: 1450px;
}
.page {
  text-align: center;
  margin: 100px 0 0 0;
}
.pageTable {
  text-align: center;
  margin: 100px 0 0 0;
}
.search_dom_right {
  margin:  30px 0 0 10px;
}
.supplier-pages {
  width: 1000px;
}
</style>
