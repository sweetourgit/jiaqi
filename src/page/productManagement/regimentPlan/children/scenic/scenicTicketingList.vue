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
        <el-option key="1" label="未认款" value="1"></el-option>
        <el-option key="2" label="认款申请" value="2"></el-option>
        <el-option key="3" label="认款待修改" value="3"></el-option>
        <el-option key="4" label="认款通过" value="4"></el-option>
        <el-option key="5" label="报账中" value="5"></el-option>
        <el-option key="6" label="报账驳回" value="6"></el-option>
        <el-option key="7" label="已报账" value="7"></el-option>
      </el-select>
      <div class="button_select">
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
        <el-button type="primary" @click="resetHand()" size="medium" plain>重置</el-button>
      </div>
    </div>
    <div class="main">
      <el-button type="primary" @click="createNew" plain>新建报账团号</el-button>
    </div>
    <div style="overflow: hidden">
      <div class="table_trip" style="width: 85%;">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" :header-cell-style="getRowClass">
          <el-table-column prop="tour_no" label="报账团号" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column label="出发日期/返回日期" align="center" width="220">
            <template slot-scope="scope">
              <p>出发日期：{{scope.row.begin_at}}<br>返回日期：{{scope.row.end_at}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="bill_status" label="报账状态" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.bill_status == 1">未认款</p>
              <p v-if="scope.row.bill_status == 2">认款申请</p>
              <p v-if="scope.row.bill_status == 3">认款待修改</p>
              <p v-if="scope.row.bill_status == 4">认款通过</p>
              <p v-if="scope.row.bill_status == 5">报账中</p>
              <p v-if="scope.row.bill_status == 6">报账驳回</p>
              <p v-if="scope.row.bill_status == 7">已报账</p>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center">
          </el-table-column>
          <el-table-column prop="create_uid" label="操作人员" align="center">
          </el-table-column>
          <el-table-column prop="option" label="操作" align="center" width="300">
            <template slot-scope="scope">
              <div v-if="scope.row.bill_status == 1">
                <el-button @click="infoTour(scope.row)" type="primary" size="small" class="table_details">详情</el-button>
                <el-button @click="createNew(scope.row)" type="warning" size="small" class="table_details">修改</el-button>
                <el-button @click="pledging(scope.row)" type="primary" size="small" class="table_details">认款</el-button>
                <el-button @click="delTour(scope.row)" type="danger" size="small" class="table_details">删除</el-button>
              </div>
              <div v-if="scope.row.bill_status == 2">
                <el-button @click="infoTour(scope.row)" type="primary" size="small" class="table_details">详情</el-button>
              </div>
              <div v-if="scope.row.bill_status == 3">
                <div v-if="scope.row.approved == 1">
                  <el-button @click="infoTour(scope.row)" type="primary" size="small" class="table_details">详情</el-button>
                  <el-button @click="pledging(scope.row)" type="primary" size="small" class="table_details">认款</el-button>
                </div>
                <div v-else>
                  <el-button @click="infoTour(scope.row)" type="primary" size="small" class="table_details">详情</el-button>
                  <el-button @click="createNew(scope.row)" type="warning" size="small" class="table_details">修改</el-button>
                  <el-button @click="pledging(scope.row)" type="primary" size="small" class="table_details">认款</el-button>
                  <el-button @click="delTour(scope.row)" type="danger" size="small" class="table_details">删除</el-button>
                </div>
              </div>
              <div v-if="scope.row.bill_status == 4 || scope.row.bill_status == 5 || scope.row.bill_status == 6 || scope.row.bill_status == 7">
                <el-button @click="infoTour(scope.row)" type="primary" size="small" class="table_details">详情</el-button>
                <el-button @click="billReporting(scope.row)" type="success" size="small" class="table_details">报账单</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;margin-bottom: 50px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total='total'>
        </el-pagination>
      </div>
    </div>
    <NewTour :dialogFormVisible="dialogFormVisible" @close="close" :info="info"></NewTour>
  </div>
</template>
<script type="text/javascript">
import NewTour from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/newTour'
import {formatDate} from '@/js/libs/publicMethod.js'

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
        startTime: '',
        endTime: ''
      },
      reable: true,
      info: '',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      total: 10, //总条数
      currentPage4: 1,
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      tableData: [],
      form: {},
      currentRow: true,
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {},
  methods: {
    //新增
    createNew(row) {
//      console.log(row);
      if(row.id){
        this.info = row;
      }else{
        this.info = '';
      }
      this.dialogFormVisible = true;
    },
    //报账单
    billReporting(row) {
      this.$router.push({
        path: "/scenicTicketingBillReporting",
        name: '产品管理  /团期计划  /报账单',
        params: row
      });
    },
    //认款
    pledging(row) {
      this.$router.push({
        path: '/scenicTicketingPledging',
        name: '产品管理  /团期计划  /认款',
        params: row
      });
    },
    //详情
    infoTour(row) {
      this.$router.push({
        path: "/scenicTicketingDetails",
        name: "产品管理  /团期计划  /详情",
        params: row
      });
    },
    close() {
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = false;
      this.dialogFormVisible3 = false;
      this.loadData();
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
//    分页事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.loadData();
    },
//    删除
    delTour(row) {
        console.log(row);
        var that = this;
      this.$confirm('是否删除此报账信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/del", {
          "id": row.id,
        }, ).then(function(response) {
          if (response.data.code == '200') {
            that.loadData();
            that.$message({
              type: 'info',
              message: '已删除'
            });
          } else {
            that.$message.success("删除失败~");
          }
        }).catch(function(error) {
          console.log(error);
          that.$message.success("删除失败~");
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
//      console.log(this.activeForm.createTime);
      if(this.activeForm.createTime.length > 0){
        this.activeForm.startTime = formatDate(this.activeForm.createTime[0]);
        this.activeForm.endTime = formatDate(this.activeForm.createTime[1]);
      }
      this.loadData();
    },
//    重置
    resetHand() {
      this.activeForm = {
        title: '',
        tour: '',
        createTime: '',
        user: '',
        status: '',
        startTime: '',
        endTime: ''
      }
    },
//    数据加载
    loadData(){
      //加载数据
      var that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/listpage", {
        "pageIndex": this.pageIndex,
        "pageSize": this.pageSize,
        "product_name": this.activeForm.title,
        "tour_no": this.activeForm.tour,
        "start_time": this.activeForm.startTime,
        "end_time": this.activeForm.endTime,
        "create_account": this.activeForm.user,
        "bill_status": this.activeForm.status
      }, ).then(function(response) {
          console.log(response);
        if (response.data.code == '200') {
          console.log(response);
          that.tableData = response.data.data.list;
          that.total = response.data.data.total - 0;
          that.tableData.forEach(function (item, index, arr) {
            item.begin_at = formatDate(new Date(item.begin_at*1000));
            item.begin_at = item.begin_at.split(" ")[0];
            item.end_at = formatDate(new Date(item.end_at*1000));
            item.end_at = item.end_at.split(" ")[0];
            item.created_at = formatDate(new Date(item.created_at*1000));
            item.created_at = item.created_at.split(" ")[0];
          })
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {
    this.loadData();
  }

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
