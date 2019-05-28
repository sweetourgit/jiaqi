<template>
  <div class="all" style="position:relative">
    <el-tabs v-model="activeName">
      <div class="borders" style="margin-bottom:100px;">
        <div>
          <div class="search">
            <span class="search_style">团期计划：</span>
            <el-input v-model="plan" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">申请人：</span>
            <el-input v-model="accepter" placeholder="请输入内容" class="search_input"></el-input>
            <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time"></el-date-picker>
            <div class="date-line"></div>
            <el-date-picker v-model="endTime" type="date" placeholder="终止日期" class="start-time"></el-date-picker>
          </div>
          <div class="reform">
            <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
            <el-button type="primary" @click="resetHand()" size="medium">重置</el-button>
          </div>
          <div class="reform">
            <el-button type="primary" @click="dialogchange" plain>添加收款</el-button>
            <el-button type="primary" @click=dialogFind plain :disabled="reable">查看详情</el-button>
          </div>
        </div>
        <div class="table_style">
          <el-table :data="tableData" border style="width:70%;" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
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
        <StraightGuestInfo :dialogFormVisible="dialogFormVisible" :find="find" :pid="pid" :change="change" :org="org" @searchHand="searchHand" :collectionAccountList="collectionAccountList" :accountList="accountList" @close="closeAdd" :dept="dept"></StraightGuestInfo>
      </div>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import StraightGuestInfo from '@/page/Finance/collectionManagement/collectionInfo/straightGuestInfo'
export default {
  name: "straightGuestManagement",
  components: {
    StraightGuestInfo,
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
      reable: true,
      dialogFormVisible: false,
      change: false,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      find: 0,
      org: '',
      pid: '',
      collectionAccountList: [],
      accountList: {},
      checkTypeList: {
        '0': '审批中',
        '1': '通过',
        '2': '驳回',
      },
      dept: '',
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
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": val,
            "pageSize": this.pageSize,
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
    //查询详情
    dialogFind() {
      this.find = 1;
      this.change = true
      this.dialogFormVisible = true;
    },
    //添加收款
    dialogchange() {
      this.find = 0;
      this.change = false
      this.dialogFormVisible = true;
    },
    //重置搜索条件
    resetHand() {

    },
    //搜索按钮
    searchHand() {
      this.getStraightGuestManagement()
    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['id'];
      this.reable = false;

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
    getStraightGuestManagement() {
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
    getDept() { //通过用户ID,获取部门名称
      var that = this
      that.$http.post(
          that.GLOBAL.serverSrc + "/org/user/api/orgshort", {
            id: sessionStorage.getItem('id'),
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.dept = obj.data.isSuccess == true ? obj.data.objects[0].name : ''
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
  },
  created() {
    this.getCollectionAccount()
    this.getStraightGuestManagement()
    this.getDept()
  }
}

</script>
<style lang="scss" scoped>
.all {
  margin-bottom: 100px;

  .borders {
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

      .search_input {
        float: left;
        width: 200px
      }

      .search_style {
        float: left;
        margin-top: 10px;
        margin-left: 20px;
        font-size: 14px
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
      width: 1500px;
      margin-left: 20px;
      margin-top: 20px;
      float: left;
    }



  }
}

</style>
