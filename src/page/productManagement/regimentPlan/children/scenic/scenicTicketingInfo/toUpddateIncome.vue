<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="更改人数" :visible="dialogFormVisible" width=80% @close="closeAdd">
      <div class="totalMoney">收款编码/发票：{{code}}</div>
      <div class="header">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <div class="table_trip" style="width:100%;">
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
              <el-table-column prop="guest" label="客人信息" align="center">
              </el-table-column>
              <el-table-column prop="number" label="数量" align="center">
              </el-table-column>
              <el-table-column prop="information" label="其他认款项人数信息" align="center">
              </el-table-column>
              <el-table-column prop="change" label="更改数量" align="center" width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.change" placeholder="申请金额"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </div>
      <div class="footer">
        <el-button @click="submitForm('ruleForm')" type="primary" size="small" class="table_details">保存</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "toUpddateIncome",
  components: {},
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
      code: '311123',
      currentRow: true,
      tableData: [{
        id: "1",
        oid: '311123',
        title: '丹东百瀑峡门票（成人票',
        platform: '途牛',
        cost: '111.00',
        income: '111.00',
        guest: '取票人：阳阳 手机：1388888883',
        number: '2',
        information: 'T1234：2 T2345：2',
        change: '',
      }, {
        id: "2",
        oid: '311124',
        title: '丹东百瀑峡门票（成人票',
        platform: '途牛',
        cost: '111.00',
        income: '111.00',
        guest: '取票人：阳阳 手机：1388888883',
        number: '2',
        information: 'T1234：2 T2345：2',
        change: '',
      }, ],
      ruleForm: {
        source: ''
      },
      rules: {
        source: [{ required: true, message: '收入来源不能为空!', trigger: 'blur' }],
      },
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {

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
    clickBanle(row, event, column) {
      this.pid = row['tour']
    },
    closeAdd() {
      this.$emit('close', false);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.$emit('close', false);
        } else {
          console.log('error submit!!');
          return false;
        }
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
  float: right;
  margin-top: -10px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

.header {
  margin: 0 30px;
  padding-bottom: 80px;
}

.totalMoney {
  width: 95%;
  height: 30px;
  line-height: 30px;
  margin: 0 30px;
  margin-bottom: 30px;
}

</style>
