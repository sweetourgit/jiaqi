<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="收款编码数据详情" :visible="dialogFormVisible" width=70% @close="closeAdd">
      <div class="approval">
        <el-row>
          <el-col :span="2">
            <div class="grid-content bg-purple">收款编码：</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">{{receiptCode}}</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">审批：</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">{{approval}}</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">审批意见：</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">{{approvalOpinions}}</div>
          </el-col>
        </el-row>
      </div>
      <div class="totalMoney"><i class="el-icon-info"></i>总计：{{totalMoney}}元 </div>
      <div class="table_trip">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
          <el-table-column prop="oid" label="订单ID" align="center" width="80%">
          </el-table-column>
          <el-table-column prop="title" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="platform" label="平台" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="成本" align="center">
          </el-table-column>
          <el-table-column prop="income" label="收入" align="center">
          </el-table-column>
          <el-table-column prop="guestInformation" label="客人信息" align="center">
          </el-table-column>
          <el-table-column prop="number" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="money" label="申请金额" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.money" :disabled="true" placeholder="申请金额"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button @click="submitForm" type="primary" size="small" class="table_details">确定</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "getOrderInvoice",
  components: {},
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
      totalMoney: '222.00',
      receiptCode: '收款编码1', //收款编码
      approval: '未审批', //审批
      approvalOpinions: '',
      currentRow: true,
      tableData: [{
        id: '1',
        oid: '311123',
        title: '丹东百瀑峡门票（成人票）',
        platform: '途牛',
        cost: '111.00',
        income: '111.00',
        guestInformation: '取票人：阳阳 手机：1388888883',
        number: '2',
        money: '111.00',
      }, {
        id: '2',
        oid: '311124',
        title: '丹东百瀑峡门票（成人票）',
        platform: '途牛',
        cost: '111.00',
        income: '111.00',
        guestInformation: '取票人：阳阳 手机：1388888883',
        number: '2',
        money: '111.00',
      }, ],
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {

  },
  methods: {
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['id']
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    closeAdd() {
      this.$emit('close', false);
    },
    submitForm(formName) {
      this.$message({
        type: 'success',
        message: '提交成功!'
      });
    },

  },
  created() {},
  mounted() {}
}

</script>
<style lang="scss" scoped>
.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: -10px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

.inputWidth {
  width: 400px;
}

.totalMoney {
  width: 95%;
  background-color: #E6F3FC;
  height: 30px;
  line-height: 30px;
  margin: 0 30px;
}

.table_trip {
  width: 95%;
  margin: 30px 30px;
}

.approval {
  height: 30px;
  line-height: 30px;
  width: 95%;
  margin: -15px 30px 20px 30px;
}

</style>
