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
    pid: '',
  },
  data() {
    return {
      order: '123456',
      tableData: [{
        id: '1',
        oid: '311123',
        type: '门票',
        title: '丹东百瀑峡门票（成人票）',
        time: '2019-01-09 09:37',
        money: '收入：123.12 应付金额：123.12 商家承担优惠：19.99 单票成本：111.00 总成本：111.00',
        number: '1',
        customer: '取票人：阳阳 手机：1388888883',
        importTime: '2019-01-09 09:37',
        product: '产品名称：丹东门票 团期计划：LTSZ-1904-QHSD',
        accountStatus: '未报账',
      }, {
        id: '2',
        oid: '311123',
        type: '门票',
        title: '丹东百瀑峡门票（成人票）',
        time: '2019-01-09 09:37',
        money: '收入：123.12 应付金额：123.12 商家承担优惠：19.99 单票成本：111.00 总成本：111.00',
        number: '1',
        customer: '取票人：阳阳 手机：1388888883',
        importTime: '2019-01-09 09:37',
        product: '产品名称：丹东门票 团期计划：LTSZ-1904-QHSD',
        accountStatus: '未报账',
      }, {
        id: '3',
        oid: '311123',
        type: '门票',
        title: '丹东百瀑峡门票（成人票）',
        time: '2019-01-09 09:37',
        money: '收入：123.12 应付金额：123.12 商家承担优惠：19.99 单票成本：111.00 总成本：111.00',
        number: '1',
        customer: '取票人：阳阳 手机：1388888883',
        importTime: '2019-01-09 09:37',
        product: '产品名称：丹东门票 团期计划：LTSZ-1904-QHSD',
        accountStatus: '未报账',
      }, ],
    }
  },
  computed: {
    // 计算属性的 getter
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

</style>
