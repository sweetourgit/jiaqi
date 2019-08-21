<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="导入订单详情" :visible="dialogFormVisible" width=90% @close="closeAdd">
      <div>
        <span class="search-title" style="margin-right: 40px;">订单号:</span>
        <span>{{order}}</span>
      </div>
      <div class="table_trip" style="width: 100%;">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
          <el-table-column prop="oid" label="订单ID" align="center" >
          </el-table-column>
          <el-table-column prop="title" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="type" label="类别" align="center" width="70%">
          </el-table-column>
          <el-table-column prop="time" label="销售时间" align="center">
          </el-table-column>
          <el-table-column prop="money" label="费用" align="center">
          </el-table-column>
          <el-table-column prop="number" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="customer" label="客人信息" align="center">
          </el-table-column>
          <el-table-column prop="importTime" label="导入时间" align="center">
          </el-table-column>
          <el-table-column prop="product" label="关联产品" align="center">
          </el-table-column>
          <el-table-column prop="accountStatus" label="报账状态" align="center">
          </el-table-column>
          <el-table-column prop="option" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button @click="delOrder(scope.row)" type="danger" size="small" class="table_details">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total='total'>
          </el-pagination>
        </div>
      </div>

      <div class="footer">
        <el-button class="el-button" type="warning" @click="closeAdd">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "importOrderInfo",
  components: {},
  props: {
    dialogFormVisible: false,
    infoId: '',
  },
  data() {
    return {
      total: 10, //总条数
      currentPage: 1,
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求

      order: '123456',
      tableData: [],
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    infoId: {
      handler:function(){
        this.loadData()
      }
    }
  },
  methods: {
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    //获取id
    clickBanle(row, event, column) {},
    closeAdd() {
      this.$emit('close2', false);
    },
    delOrder(row) {
      console.log(row['id'])
      this.$confirm('是否需要删除选中订单?', '提示', {
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.tableData = this.tableData
      this.total = this.total
    },

    handleCurrentChange(val) {
      this.tableData = this.tableData
      this.total = this.total
    },
    loadData(){
      console.log(this.infoId);
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

  }
}

</script>
<style lang="scss" scoped>
.table_trip {
  margin-top: 30px;
  margin-bottom: 40px;
}

.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: -20px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

.inputWidth {
  width: 450px;
}

.upload-demo {
  width: 550px;
}
.el-dialog__body{
  overflow: hidden;
}
.block{
  text-align: center;
  margin: 18px auto;
}
</style>
