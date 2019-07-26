<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog :title="frameTitle1" :visible="dialogFormVisible" width=40% @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div style="height: 220px;">
          <el-form-item :label="frameTitle2" prop="number" label-width="150px" style="float:left;margin-left: -40px;">
            <el-input v-model="ruleForm.number" class="input" placeholder="请输入"></el-input>
          </el-form-item><br /><br />
          <div class="footer">
            <el-button class="el-button" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            <el-button class="el-button" type="danger" @click="closeAdd">取 消</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "importOrder",
  components: {},
  props: {
    dialogFormVisible: false,
    pid: '',
    frameTitle1: '',
    frameTitle2: '',
  },
  data() {
    return {
      ruleForm: {
        number: 'T311123',
      },
      rules: {
        number: [{ required: true, message: '平台订单不能为空', trigger: 'blur' }],
      },
    }
  },
  computed: {
    // 计算属性的 getter
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
  created() {

  }
}

</script>
<style lang="scss" scoped>
.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: 50px;
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
