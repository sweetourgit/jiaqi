<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="修改收入来源" :visible="dialogFormVisible" width=40% @close="closeAdd">
      <div class="totalMoney">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="收入来源：" prop="source" label-width="100px">
            <el-input v-model="ruleForm.source" class="inputWidth" show-word-limit placeholder="请输入"></el-input>
          </el-form-item>
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
  name: "toUpddateSource",
  components: {},
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
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
  margin: 0 30px;
}

</style>
