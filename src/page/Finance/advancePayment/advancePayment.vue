<template>
  <div class="vivo" style="position:relative">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="付款" name="first">
        <span class="search-title">团期计划:</span>
        <el-input v-model="groupNo" class="input"></el-input>
        <span class="search-title">申请人:</span>
        <el-input v-model="user" class="input"></el-input>
        <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time"></el-date-picker>
        <div class="date-line"></div>
        <el-date-picker v-model="endTime" type="date" placeholder="终止日期" class="start-time"></el-date-picker>
        <div style="border: 0px solid #e9eaea;  margin-bottom:100px; margin-top: 30px; margin-left: 20px; width: 100%">
          <div class="button_select">
            <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
            <el-button type="primary" @click="resetHand()" size="medium">重置</el-button>
          </div>
          <div class="button_select">
            <el-button type="primary" @click="dialogchange" plain>申请预付款</el-button>
            <el-button type="primary" @click=dialogFind plain :disabled="reable">查看借款</el-button>
          </div>
          <div class="table_trip" style="width: 70%;">
            <el-table :data="tableData" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
              <el-table-column prop="paymentID" label="付款单号" align="center" width="80%">
              </el-table-column>
              <el-table-column prop="checkTypeEX" label="状态" width="100%" align="center">
              </el-table-column>
              <el-table-column prop="createTime" label="发起时间" align="center" width="120%">
              </el-table-column>
              <el-table-column prop="groupCode" label="团期计划" align="center">
              </el-table-column>
              <el-table-column prop="supplierName" label="供应商名称" align="center">
              </el-table-column>
              <el-table-column prop="supplierTypeEX" label="类型" align="center" width="110%">
              </el-table-column>
              <el-table-column cell-style prop="price" label="金额" align="center" width="110%">
              </el-table-column>
              <el-table-column prop="orgName" label="申请组织" align="center" width="120%">
              </el-table-column>
              <el-table-column prop="createUser" label="申请人" align="center" width="120%">
              </el-table-column>
              <el-table-column prop="opinion" label="审批意见" align="center" width="120%">
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
          </div>
          <!--分页-->
        </div>
      </el-tab-pane>
      <el-tab-pane label="需要您审批" name="second">
        <NeedApproval></NeedApproval>
      </el-tab-pane>
    </el-tabs>
    <AdvanceInfo :dialogFormVisible="dialogFormVisible" :find="find" :change="change" :pid="pid" :typeList="typeList" :payModeList="payModeList" @close="closeAdd" :infoStatus="infoStatus" @searchHandList="searchHand"></AdvanceInfo>
  </div>
</template>
<script>
import NeedApproval from '@/page/Finance/advancePayment/needApproval'
import AdvanceInfo from '@/page/Finance/advancePayment/advanceInfo/advanceInfo'
import { formatDate } from '@/js/libs/formatDate.js'
export default {
  name: "advancePayment",
  components: {
    NeedApproval,
    AdvanceInfo
  },
  data() {
    return {
      activeName: 'first',
      groupNo: '',
      user: '',
      startTime: '',
      endTime: '',
      reable: true,
      tableData: [],
      currentPage4: 1,
      total: 0,
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      payModeList: [],
      typeList: [],
      find: 0,
      change: false,
      pid: '',
      infoStatus: '',
      dialogFormVisible: false,
    }
  },
  computed: {
    // 计算属性的 getter
    approval: function() {
      // `this` 指向 vm 实例
      return this.approvalTotal > 0 ? '您需要审批(' + this.approvalTotal + ')' : '您需要审批'
    },
  },
  methods: {
    closeAdd() {
      this.dialogFormVisible = false;
    },
    //获取id
    clickBanle(row, event, column) {
      this.infoStatus = row['checkTypeEX'];
      this.pid = row['paymentID'];
      this.reable = false;
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    handleClick(tab, event) {
      if (tab.name == 'first') {
        this.firstTab = true
        this.secondTab = false
        this.pageIndex = this.firstIndex;
        this.currentPage4 = this.firstIndex;
      }
      if (tab.name == 'second') {
        this.firstTab = false
        this.secondTab = true
        this.pageIndex = this.secondIndex;
        this.currentPage4 = this.secondIndex;
      }
    },
    // 报销弹窗
    dialogchange() {
      this.find = 0;
      this.change = false
      this.dialogFormVisible = true;
    },
    //报销弹窗查看
    dialogFind() {
      this.find = 1;
      this.change = true
      this.dialogFormVisible = true;
    },
    handleSizeChange(val) {
      this.pagesize = val
      let objectRequest = {}
      objectRequest.paymentType = 2;
      if (this.groupNo) { objectRequest.groupCode = this.groupNo; }
      if (this.user) { objectRequest.createUser = this.user; }
      if (this.startTime) { objectRequest.beginTime = this.startTime ? formatDate(this.startTime, 'yyyyMMdd') : 0; }
      if (this.endTime) { objectRequest.endTime = this.endTime ? formatDate(this.endTime, 'yyyyMMdd') : 0; }
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/payment/api/page", {
            "pageIndex": 1,
            "pageSize": val,
            "total": 0,
            "object": objectRequest
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          console.log(obj.data);
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    //搜索
    searchHand() {
      this.pageNum = 1;
      let objectRequest = {}
      objectRequest.paymentType = 2;
      if (this.groupNo) { objectRequest.groupCode = this.groupNo; }
      if (this.user) { objectRequest.createUser = this.user; }
      if (this.startTime) { objectRequest.beginTime = this.startTime ? formatDate(this.startTime, 'yyyyMMdd') : 0; }
      if (this.endTime) { objectRequest.endTime = this.endTime ? formatDate(this.endTime, 'yyyyMMdd') : 0; }
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/payment/api/page", {
            "pageIndex": this.pageNum,
            "pageSize": this.pageSize,
            "total": 0,
            "object": objectRequest,
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
        })
        .catch(function(obj) {
          console.log(obj)
        })

    },
    handleCurrentChange(val) {
      this.pageNum = val;
      if (this.firstTab) {
        this.firstIndex = val
      }
      if (this.secondTab) {
        this.secondIndex = val
      }
      let objectRequest = {}
      objectRequest.paymentType = 2;
      if (this.groupNo) { objectRequest.groupCode = this.groupNo; }
      if (this.user) { objectRequest.createUser = this.user; }
      if (this.startTime) { objectRequest.beginTime = this.startTime ? formatDate(this.startTime, 'yyyyMMdd') : 0; }
      if (this.endTime) { objectRequest.endTime = this.endTime ? formatDate(this.endTime, 'yyyyMMdd') : 0; }
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/payment/api/page", {
            "pageIndex": val,
            "pageSize": this.pageSize,
            "total": 0,
            "object": objectRequest,
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
        })
        .catch(function(obj) {
          console.log(obj)
        })
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
  },
  created() {
    this.querySearch6()
    this.querySearch7()
    this.searchHand()
  },
};

</script>
<style lang="scss" scoped>
.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

#tab-first {
  font-size: 30px
}

.el-table th {
  background-color: red;
}

.demo-input-suffix {
  width: 900px
}

.el-input {
  width: auto
}

.group-no {
  margin-left: 10px
}

.start-time {
  margin-left: 25px
}

.date-line {
  width: 10px;
  border-bottom: 1px solid #e6e6e6;
  display: inline-block;
  margin: 0 3px 3px 0
}

.search-title {
  font-size: 14px;
  margin-left: 20px;
  margin-top: 10px;
}

.el-input__inner {
  width: 10%;
}

.button_select {
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

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

.input-new-tags {
  width: 200px;
  float: left;
  margin-left: 5px;
  height: 30px;
  line-height: 30px;
  padding-top: 1px;
  margin-top: 1px;
  margin-bottom: 4px;
  padding-bottom: 2px
}

.bright_b {
  float: left;
  margin-left: 205px;
  margin-top: -62px;
}

.sh_style {
  background: #eaeaea;
  position: absolute;
  width: 50px;
  height: 23px;
  text-align: center;
  line-height: 26px;
  top: 20px;
  left: 116px;
}

.inputWidth {
  width: 200px;
}

</style>
