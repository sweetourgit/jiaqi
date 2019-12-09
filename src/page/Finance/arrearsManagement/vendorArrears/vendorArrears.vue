<template>
  <div class="arrears">
      <span class="supplierName">{{this.supplierCurrentRow.name}}</span>
      <el-button class="close" plain @click="$emit('closeSupplier', false)">关闭</el-button>
      <!-- 欠款列表 -->
        <div class="search_dom">
          <div class="search_supplier">
            <span class="keyword">团期计划</span>
            <el-input class="search_input" clearable v-model="league" placeholder="请输入团期计划"></el-input>
          </div>
          <div class="search_league">
            <span class="keyword">操作</span>
            <el-input class="search_input" clearable v-model="handle" placeholder="请输入操作"></el-input>
          </div>
          <div class="search_league">
            <span class="keyword">起始时间</span>
            <el-input class="search_date_left" clearable v-model="dateLeft" placeholder="日期"></el-input>
            <span class="search_date_span">——</span>
            <el-input class="search_date" clearable v-model="dateRight" placeholder="日期"></el-input>
          </div>
          <el-button class="search_button" type="primary">重置</el-button>
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
      <el-dialog width='1200px' :append-to-body="true" top='10vh' title="详情" :visible.sync="dialogFormVisible" :show-close="false">
        <detailsForm v-on:closeButton="dialogFormVisible = false" :currentRow="currentRow"></detailsForm>
      </el-dialog>
      <!-- 欠款信息详情END -->

      <!-- 欠款列表END -->



  </div>
</template>

<script>
import detailsForm from '../detailsForm/detailsForm';

export default {
  name: "arrearsManagement",
  props: ['supplierCurrentRow'],
  components: {
    detailsForm,
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
      currentRow: '',      // 欠款表格选中的值
      dialogFormVisible: false,     // 欠款信息详情
      dialogSupplierVisible: false, // 供应商欠款信息详情
      // 欠款列表表格
      checkLabelList: [{
        id: '1',
        league: 'TC-GTY-1001-01-180806-01', // 团期计划
        leagueName: '纯玩纯净-北京',         // 产品名称
        launchDate: '2019-03-17',           // 发起时间
        supplierName: '国旅',               // 供应商名称
        type: '地接',                       // 类型
        apple: '辽宁大运通-国内部',          // 申请组织
        applePeople: '央鸯',                // 申请人
        arrearsMoney: '1000.00',           // 欠款金额
        relationBill: '1'                  // 关联单据号
      },{
        id: '1',
        league: 'TC-GTY-1001-01-180806-01',
        leagueName: '纯玩纯净-北京',
        launchDate: '2019-03-17',
        supplierName: '国旅',
        type: '地接',
        apple: '辽宁大运通-国内部',
        applePeople: '央鸯',
        arrearsMoney: '1000.00',
        relationBill: '1'
      }],
      // 供应商欠款列表表格
      supplierList: [{
        supplierName: '国旅',     // 供应商名称
        arrearsTotal: '10000.00' // 欠款总额
      },{
        supplierName: '国旅',     // 供应商名称
        arrearsTotal: '10000.00' // 欠款总额
      }]
    };
  },
  created() {
    this.getData();
    console.log(this.supplierCurrentRow);
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7'
        } else {
          return ''
        }
    },
    // 欠款列表页
    getData() {
      // 获取欠款列表
      this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentpage', {
          "pageIndex": this.currentPage,
          "pageSize": this.pagesize,
          "object": {}
      }).then(res => {
        this.checkLabelList = res.data.objects;
      })
    },
    // 欠款表格选中触发的事件
    handleChange(val) {
      if (val) this.currentRow = val;
    },

    // 查看欠款关联数据
    handelList() {
      this.dialogFormVisible = true;
    },
    // 查看供应商欠款关联数据
    handelSupplierList() {
      this.dialogSupplierVisible = true;
    },
    // 每页显示条数
    pagesizes(page) {

    },
    // 改变当前页
    handleCurrentChange(currentPage) {

    }
  }
}
</script>

<style scoped>
.arrears>>>.el-tabs__nav-wrap {
  /* width: 167px; */
}
.search_dom {
  width: 960px;
  margin: 30px 0 0 0;
}
.keyword {
  font-size: 14px;
}
.search_supplier {
  float: left;
  margin-left: -15px;
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
  width: 90px;
}
.search_date_left {
  width: 90px;
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
.supplierName {
  float: left;
  position: relative;
  top: -90px;
  left: 145px;
  color: #999999;
}
.close {
  float: right;
  width: 100px;
  margin-top: -95px;
}
</style>
