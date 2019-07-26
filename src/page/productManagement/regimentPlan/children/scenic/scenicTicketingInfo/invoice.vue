<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="发票" :visible="dialogFormVisible" width=80% @close="closeAdd">
      <div class="approval">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-row>
            <el-col :span="8">
              <el-form-item label="发票抬头" prop="title" label-width="120px">
                <el-input v-model="ruleForm.title" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="纳税人识别号：" prop="number" label-width="150px">
                <el-input v-model="ruleForm.number" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号:" prop="phone" label-width="150px">
                <el-input v-model="ruleForm.phone" class="inputWidth" maxlength="11" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="地址：" prop="address" label-width="120px">
                <el-input v-model="ruleForm.address" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开户行：" prop="bank" label-width="150px">
                <el-input v-model="ruleForm.bank" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="凭证:" prop="voucher" label-width="150px">
                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
          <el-table-column prop="untreatedMoney" label="未处理金额" align="center">
          </el-table-column>
          <el-table-column prop="money" label="申请金额" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.money" placeholder="申请金额"></el-input>
            </template>
          </el-table-column>
        </el-table>
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
  name: "invoice",
  components: {},
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
      totalMoney: '222.00',
      currentRow: true,
      ruleForm: {
        title: '',
        number: '',
        phone: '',
        address: '',
        bank: '',
        voucher: '',
      },
      rules: {
        title: [{ required: true, message: '发票抬头不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^[1][345789]\d{9}$/, message: '手机号码不符合规范' }
        ],
      },
      fileList: [
        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
      ],
      tableData: [{
        id: '1',
        oid: '311123',
        title: '丹东百瀑峡门票（成人票）',
        platform: '途牛',
        cost: '111.00',
        income: '111.00',
        guestInformation: '取票人：阳阳 手机：1388888883',
        number: '2',
        untreatedMoney: '20.00',
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
        untreatedMoney: '33.00',
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
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$confirm('存在订单未填写开票金额，点击保存 则自动移除以上订单。', '提示', {
            confirmButtonText: '保存',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            this.$emit('close', false);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            });
          });
        }
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
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
  width: 300px;
}

.totalMoney {
  width: 95%;
  background-color: #E6F3FC;
  height: 30px;
  line-height: 30px;
  margin: 0 30px;
}

.approval {
  height: 150px;
  line-height: 30px;
  width: 95%;
  margin: -15px 30px 30px 30px;
}

.table_trip {
  width: 95%;
  margin: 30px 30px;
}

.upload-demo {
  width: 1000px;

  .el-upload-list {
    width: 1000px;
  }

  .el-upload-list__item {
    width: 300px;
    display: inline-block;
  }

  .el-upload-list--text {
    width: 1000px;
  }
}

</style>
