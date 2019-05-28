<template>
  <div class="all" style="position:relative">
    <el-tabs v-model="activeName">
      <div class="borders">
        <div class="search">
          <span class="search_style" >直客</span>
          <i class="el-icon-caret-top" v-if="caretHide" @click="caretHide = !caretHide"></i>
          <i class="el-icon-caret-bottom" v-if="!caretHide" @click="caretHide = !caretHide"></i>
        </div>
        <transition name="el-fade-in-linear">
          <div class="table_style" v-if="!caretHide">
            <el-button type="primary" @click="dialogchange" plain style="margin-bottom:10px;" :disabled="reable">审批</el-button>
            <el-table :data="tableData" border style="width:65%;" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
              <el-table-column prop="id" label="收款单号" align="center">
              </el-table-column>
              <el-table-column prop="checkTypeStatus" label="状态" align="center">
              </el-table-column>
              <el-table-column prop="collectionTime" label="收款时间" align="center">
              </el-table-column>
              <el-table-column prop="groupCode" label="团期计划" align="center">
              </el-table-column>
              <el-table-column prop="orderNumber" label="订单号" align="center">
              </el-table-column>
              <el-table-column prop="collectionNumber" label="收款账户" align="center">
              </el-table-column>
              <el-table-column prop="price" label="金额" align="center">
              </el-table-column>
              <el-table-column prop="dept" label="申请组织" align="center">
              </el-table-column>
              <el-table-column prop="createUser" label="申请人" align="center">
              </el-table-column>
              <el-table-column prop="createTime" label="申请时间" align="center">
              </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total=total background>
              </el-pagination>
            </div>
          </div>
        </transition>
        <br />
        <!--  <div class="search">
          <span class="search_style" >同业</span>
          <i class="el-icon-caret-top" v-if="caretHide2" @click="caretHide2 = !caretHide2"></i>
          <i class="el-icon-caret-bottom" v-if="!caretHide2" @click="caretHide2 = !caretHide2"></i>
        </div>
        <transition name="el-fade-in-linear">
          <div class="table_style" v-if="!caretHide2">
            <el-button type="primary" @click="dialogchange2" plain style="margin-bottom:10px;" :disabled="reable2">审批</el-button>
            <el-table :data="tableData2" border style="width:65%;" :highlight-current-row="true" @row-click="clickBanle2" :header-cell-style="getRowClass">
              <el-table-column prop="number" label="收款单号" align="center">
              </el-table-column>
              <el-table-column prop="status" label="状态" align="center">
              </el-table-column>
              <el-table-column prop="createTime" label="收款时间" align="center">
              </el-table-column>
              <el-table-column prop="plan" label="团期计划" align="center">
              </el-table-column>
              <el-table-column prop="orderNum" label="订单号" align="center">
              </el-table-column>
              <el-table-column prop="sameTrade" label="同业社名称" align="center">
              </el-table-column>
              <el-table-column prop="collectionAccount" label="收款账户" align="center">
              </el-table-column>
              <el-table-column prop="money" label="金额" align="center">
              </el-table-column>
              <el-table-column prop="orinaze" label="申请组织" align="center">
              </el-table-column>
              <el-table-column prop="accpter" label="申请人" align="center">
              </el-table-column>
              <el-table-column prop="applyTime" label="申请时间" align="center">
              </el-table-column>
            </el-table>
          </div>
        </transition> -->
        <!-- <StraightGuestInfo :dialogFormVisible="dialogFormVisible" :find="find" :change="change" @close="closeAdd"></StraightGuestInfo> -->
        <StraightGuestInfo :dialogFormVisible="dialogFormVisible" :find="find" :pid="pid" :change="change" :org="org" @searchHand="searchHand" :collectionAccountList="collectionAccountList" :accountList="accountList" @close="closeAdd"></StraightGuestInfo>
        <!-- <SameTradeInfo :dialogFormVisible="dialogFormVisible2" :find="find" :change="change" @close="closeAdd"></SameTradeInfo> -->
      </div>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import StraightGuestInfo from '@/page/Finance/collectionManagement/collectionInfo/straightGuestInfo'
import SameTradeInfo from '@/page/Finance/collectionManagement/collectionInfo/sameTradeInfo'
export default {
  name: "pendingApprovalManagement",
  components: {
    StraightGuestInfo,
    SameTradeInfo
  },
  data() {
    return {
      activeName: 'first',
      activeName2: 'three',
      plan: '',
      accepter: '',
      startTime: '',
      endTime: '',
      tableData: [],
      tableData2: [],
      reable: true,
      reable2: true,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      change: false,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      find: 0,
      caretHide: false,
      caretHide2: false,
      collectionAccountList: [],
      accountList: {},
      checkTypeList: {
        '0': '审批中',
        '1': '通过',
        '2': '驳回',
      },
      pid: '',
      org: '',
    }
  },
  computed: {
    // 计算属性的 getter
    invoiceListCount() {
      return this.ruleForm.invoiceList.length - 1;
    }
  },
  methods: {
    closeAdd() {
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = false;
    },
    changeInvoice() {
      this.ruleForm.invoiceList.forEach(function(v, k, arr) {
        console.log(arr[k]['date'])
      })
    },
    handleEdit(index, row) {
      this.ruleForm.invoiceList.push({})
    },
    handleDelete(index, row) {
      this.ruleForm.invoiceList.splice(index, 1)
      if (this.ruleForm.invoiceList.length == 0) {
        this.ruleForm.invoiceList.push({})
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": 1,
            "pageSize": val,
            "object": {
              "id": 0,
              "checkType": 0,
              "collectionTime": "2019-05-16T01:02:40.816Z",
              "startTime": this.startTime ? formatDate(this.startTime, 'yyyy-MM-dd hh:mm:ss') : "2000-05-16 01:02:40",
              "endTime": this.endTime ? formatDate(this.endTime, 'yyyy-MM-dd hh:mm:ss') : "2099-05-16 01:02:40",
              "groupCode": this.plan ? this.plan : '',
              "planID": 0,
              "orderID": 0,
              "orderNumber": "",
              "collectionNumber": "",
              "price": 0,
              "dept": 0,
              "createUser": this.accepter ? this.accepter : '',
              "createTime": "2019-05-16 01:02:40",
              "code": "",
              "serialNumber": "",
              "abstract": "",
              "isDeleted": 0,
            }

          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
            arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
            arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
            arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })

    },
    handleCurrentChange(val) {
      this.pageNum = val;
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": val,
            "pageSize": that.pageSize,
            "object": {
              "id": 0,
              "checkType": 0,
              "collectionTime": "2019-05-16T01:02:40.816Z",
              "startTime": this.startTime ? formatDate(this.startTime, 'yyyy-MM-dd hh:mm:ss') : "2000-05-16 01:02:40",
              "endTime": this.endTime ? formatDate(this.endTime, 'yyyy-MM-dd hh:mm:ss') : "2099-05-16 01:02:40",
              "groupCode": this.plan ? this.plan : '',
              "planID": 0,
              "orderID": 0,
              "orderNumber": "",
              "collectionNumber": "",
              "price": 0,
              "dept": 0,
              "createUser": this.accepter ? this.accepter : '',
              "createTime": "2019-05-16 01:02:40",
              "code": "",
              "serialNumber": "",
              "abstract": "",
              "isDeleted": 0,
            }

          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
            arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
            arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
            arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })

    },
    //直客审核
    dialogchange() {
      this.find = 2;
      this.change = true
      this.dialogFormVisible = true;
    },
    //同业审核
    dialogchange2() {
      this.find = 2;
      this.change = true
      this.dialogFormVisible2 = true;
    },
    //重置搜索条件
    resetHand() {

    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['id'];
      this.reable = false;

    },
    //获取id
    clickBanle2(row, event, column) {
      this.pid2 = row['id'];
      this.reable2 = false;
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    getCollectionAccount() {
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list", {
            "object": {
              "id": 0,
              "title": 'string',
              "mark": 'string',
              "isDeleted": 0,
            }
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.collectionAccountList = [];
          obj.data.objects.forEach(function(v, k, arr) {
            that.accountList[arr[k]['id']] = arr[k]['title']
            that.collectionAccountList.push({ "value": arr[k]['id'], "label": arr[k]['title'] });
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    searchHand() {
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": 1,
            "pageSize": that.pageSize,
            "object": {
              "id": 0,
              "checkType": 0,
              "collectionTime": "2019-05-16T01:02:40.816Z",
              "startTime": this.startTime ? formatDate(this.startTime, 'yyyy-MM-dd hh:mm:ss') : "2000-05-16 01:02:40",
              "endTime": this.endTime ? formatDate(this.endTime, 'yyyy-MM-dd hh:mm:ss') : "2099-05-16 01:02:40",
              "groupCode": this.plan ? this.plan : '',
              "planID": 0,
              "orderID": 0,
              "orderNumber": "",
              "collectionNumber": "",
              "price": 0,
              "dept": 0,
              "createUser": this.accepter ? this.accepter : '',
              "createTime": "2019-05-16 01:02:40",
              "code": "",
              "serialNumber": "",
              "abstract": "",
              "isDeleted": 0,
            }

          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
            arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
            arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
            arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    getUnfinishedTasksForJQ() {
      var that = this
      this.$http.post(
          this.GLOBAL.jqUrl + "/api/JQ/GettingUnfinishedTasksForJQ", {
            "userCode": sessionStorage.getItem('account'),
            "startTime": '2000-01-01',
            "endTime": '2999-01-01',
            "startIndex": 1,
            "endIndex": 10,
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          console.log(123)
          console.log(obj.data)
          console.log(456)

        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
  },
  created() {
    this.getCollectionAccount()
    this.searchHand()
    this.getUnfinishedTasksForJQ()
  }
}

</script>
<style lang="scss" scoped>
.all {
  margin-bottom: 100px;

  .borders {
    margin-bottom: 100px;
    border: 0px solid #E6E6E6;

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

    .search {
      i {
        font-size: 30px;
      }

      .search_input {
        float: left;
        width: 200px
      }

      .search_style {
        float: left;
        margin-top: 10px;
        margin-left: 20px;
        font-size: 27px
      }

      .date-line {
        width: 10px;
        border-bottom: 1px solid #e6e6e6;
        display: inline-block;
        margin: 0 3px 3px 0
      }

      .start-time {
        margin-left: 25px
      }

    }

    .reform {
      float: left;
      width: 1550px;
      margin-left: 20px;
      margin-top: 20px;
    }

    .table_style {
      width: 100%;
      margin-left: 20px;
      margin-top: 20px;
      float: left;
    }



  }
}

</style>
