<template>
  <div class="vivo" style="position:relative">
    <div style="padding-top:1px;">
      <el-button style="float: right;" @click="close()" size="medium">关闭</el-button>
    </div>
    <div class="demo-input-suffix">
      <span class="search-title" style="margin-right: 40px;">导入人:</span>
      <el-input v-model="activeForm.user" class="input" placeholder="请输入"></el-input>
      <span class="search-title">导入时间:</span>
      <el-date-picker v-model="activeForm.startTime" type="date" placeholder="开始天数"></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker v-model="activeForm.endTime" type="date" placeholder="结束天数"></el-date-picker>
      <br /><br />
      <div class="button_select">
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
        <el-button type="primary" @click="resetHand()" size="medium" plain>重置</el-button>
      </div>
    </div>
    <div class="table_trip" style="width: 100%;">
      <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
        <el-table-column prop="create_uid" label="导入人" align="center" width="80%">
        </el-table-column>
        <el-table-column prop="source_name" label="导入平台" align="center">
        </el-table-column>
        <el-table-column prop="file" label="文件" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.source_id == 1"><a :href="scope.row.file_platform_url">{{scope.row.file_platform_name}}</a></p>
            <p><a :href="scope.row.file_pft_url">{{scope.row.file_pdf_name}}</a></p>
          </template>
        </el-table-column>
        <el-table-column prop="success_num" label="导入订单个数" align="center">
        </el-table-column>
        <el-table-column prop="import_at" label="导入时间" align="center">
        </el-table-column>
        <el-table-column prop="option" label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button @click="infoOrder(scope.row)" type="primary" size="small" class="table_details">导入订单详情</el-button>
            <el-button @click="delOrder(scope.row)" type="danger" size="small" class="table_details">一键删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ImportOrderInfo :dialogFormVisible="dialogFormVisible" :infoId="infoId" @close2="close2"></ImportOrderInfo>
    <!--分页-->
    <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;margin-bottom: 50px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/javascript">
import ImportOrderInfo from '@/page/orderManagement/externalOrderList/importOrderInfo/importOrderInfo'
import {formatDate} from '@/js/libs/publicMethod.js'
export default {
  name: "importHistory",
  components: {
    ImportOrderInfo
  },
  data() {
    return {
      total: 0, //总条数
      currentPage4: 1,
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      activeForm: {
        user: '',
        startTime: '',
        endTime: '',
      },
      tableData: [],
      reable: true,
      pid: '',
      infoId: '',
      transmit: false,
      dialogFormVisible: false,
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {},
  methods: {
    //导入订单详情
    infoOrder(row) {
      this.dialogFormVisible = true;
      this.infoId = row['id'];
      console.log(row);
    },
    close() {
      this.$router.push({ path: "/externalOrderList/canRecognition" });
    },
    close2() {
      this.dialogFormVisible = false;
      this.infoId = '';
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['id']
    },
    delOrder(row) {
      console.log(row['id']);
      this.$confirm('是否需要一键删除所有订单?', '提示', {
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
      this.loadData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pageIndex =val;
      this.loadData();
    },
    resetHand() {
      this.activeForm = {
        user: '',
        startTime: '',
        endTime: '',
      }
    },
    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/importlist", {
        "pageIndex": this.pageIndex,
        "pageSize": this.pageSize,
        "start_time": this.activeForm.startTime,
        "end_time": this.activeForm.endTime,
        "create_account": this.activeForm.user
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          that.tableData = response.data.data.list;
          that.total = response.data.data.total - 0;
          that.tableData.forEach(function (item, index, arr) {
            item.import_at = formatDate(new Date(item.import_at*1000));
          })
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {ao
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
    margin-top: 40px;
    padding-top: 15px;
    padding-bottom: 15px;

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
      margin-left: 85%;
    }
  }

  .table_trip {
    margin-top: 40px;
  }

}



.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

</style>
