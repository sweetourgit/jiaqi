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
            <el-table-column prop="collectionAccount" label="收款账户" width="100" align="center">
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
          <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total=total background>
            </el-pagination>
          </div>
        </div>
        <SameTradeInfo :dialogFormVisible="dialogFormVisible" :find="find" :change="change" @close="closeAdd"></SameTradeInfo>
      </div>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import SameTradeInfo from '@/page/Finance/collectionManagement/collectionInfo/sameTradeInfo'
export default {
  name: "sameTradeManagement",
  components: {
    SameTradeInfo,
  },
  data() {
    return {
      activeName: 'first',
      activeName2: 'three',
      plan: '',
      accepter: '',
      startTime: '',
      endTime: '',
      reable: true,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      tableData: [],
      find: 0,
      change: false,
      dialogFormVisible: false,
    }
  },
  computed: {
    // 计算属性的 getter
  },
  methods: {
    closeAdd() {
      this.dialogFormVisible = false;
    },
    handleSizeChange(val) {
      this.pagesize = val
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teamsearch", {
            "pageIndex": 1,
            "pageSize": val,
            "total": 0,
            "object": {
              "id": 0,
              "title": '',
              "createUser": '',
              "minPrice": 0,
              "maxPrice": 0,
              "podID": 0,
              "destinationID": 0
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
            arr[k]['number'] = arr[k]['id']
            arr[k]['status'] = "状态"
            arr[k]['createTime'] = '2016-05-03-收款时间'
            arr[k]['plan'] = '团期计划'
            arr[k]['orderNum'] = '订单号'
            arr[k]['sameTrade'] = '同业社名称'
            arr[k]['collectionAccount'] = "收款账户"
            arr[k]['money'] = "金额"
            arr[k]['orinaze'] = '申请组织:国内部'
            arr[k]['accpter'] = 'tester申请人'
            arr[k]['opinion'] = '同意'
            arr[k]['applyTime'] = '2016-05-03-申请时间'
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
          this.GLOBAL.serverSrc + "/team/api/teamsearch", {
            "pageIndex": val,
            "pageSize": this.pageSize,
            "total": 0,
            "object": {
              "id": 0,
              "title": '',
              "createUser": '',
              "minPrice": 0,
              "maxPrice": 0,
              "podID": 0,
              "destinationID": 0
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
            arr[k]['number'] = arr[k]['id']
            arr[k]['status'] = "状态"
            arr[k]['createTime'] = '2016-05-03-收款时间'
            arr[k]['plan'] = '团期计划'
            arr[k]['orderNum'] = '订单号'
            arr[k]['sameTrade'] = '同业社名称'
            arr[k]['collectionAccount'] = "收款账户"
            arr[k]['money'] = "金额"
            arr[k]['orinaze'] = '申请组织:国内部'
            arr[k]['accpter'] = 'tester申请人'
            arr[k]['opinion'] = '同意'
            arr[k]['applyTime'] = '2016-05-03-申请时间'
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

  },
  created() {
    var that = this
    this.$http.post(
        this.GLOBAL.serverSrc + "/team/api/teamsearch", {
          "pageIndex": 1,
          "pageSize": this.pageSize,
          "total": 0,
          "object": {
            "id": 0,
            "title": '',
            "createUser": '',
            "minPrice": 0,
            "maxPrice": 0,
            "podID": 0,
            "destinationID": 0
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
          arr[k]['number'] = arr[k]['id']
          arr[k]['status'] = "状态"
          arr[k]['createTime'] = '2016-05-03-收款时间'
          arr[k]['plan'] = '团期计划'
          arr[k]['orderNum'] = '订单号'
          arr[k]['sameTrade'] = '同业社名称'
          arr[k]['collectionAccount'] = "收款账户"
          arr[k]['money'] = "金额"
          arr[k]['orinaze'] = '申请组织:国内部'
          arr[k]['accpter'] = 'tester申请人'
          arr[k]['opinion'] = '同意'
          arr[k]['applyTime'] = '2016-05-03-申请时间'
        })
      })
      .catch(function(obj) {
        console.log(obj)
      })
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

    .bright {
      width: 220px;
    }

    .bright2 {
      width: 70%;
    }

  }
}

</style>
