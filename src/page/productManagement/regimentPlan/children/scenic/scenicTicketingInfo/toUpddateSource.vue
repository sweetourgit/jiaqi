<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="修改收入来源" :visible="dialogFormVisible" width=40% @close="closeAdd">
      <div class="totalMoney">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="收入来源：" prop="source" label-width="100px">
            <el-input v-model="ruleForm.source" class="inputWidth" show-word-limit placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="经手人：" prop="distributor" label-width="100px">
            <el-input v-model="ruleForm.distributor" class="inputWidth" show-word-limit placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="text" label-width="100px">
            <el-input v-model="ruleForm.text" class="inputWidth" show-word-limit placeholder="请输入"></el-input>
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
        source: '',
        distributor: '',
        text: ''
      },
      rules: {
        source: [{ required: true, message: '收入来源不能为空!', trigger: 'blur' }],
        distributor: [{ required: true, message: '经手人不能为空!', trigger: 'blur' }],
        text: [{ required: false, message: '', trigger: 'blur' }]
      },
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    info: {
      handler: function () {
        this.loadData();
      }
    }
  },
  methods: {
    closeAdd() {
      this.$emit('close', false);
    },
    submitForm(formName) {
      const that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/updincome", {
            "id": this.info,
            "distributor": this.ruleForm.distributor,
            "handler": this.ruleForm.source,
            "remark": this.ruleForm.text
          }, ).then(function(response) {
//            console.log('收入来源',response);
            if (response.data.code == '200') {
              console.log('收入来源',response);
              that.ruleForm = {
                source: '',
                distributor: '',
                text: ''
              };
              that.$message({
                type: 'success',
                message: '提交成功!'
              });
            } else {
              that.$message.success("提交数据失败~");
            }
          }).catch(function(error) {
            console.log(error);
          });
          this.$emit('close', false);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    loadData(){
      if(this.info == ""){
          return;
      }
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recognitioninfo", {
        "id": this.info,
      }, ).then(function(response) {
        if (response.data.code == '200') {
//          console.log('收入来源',response);
          that.ruleForm = {
            source: response.data.data.handler,
            distributor: response.data.data.distributor,
            text: response.data.data.remark
          };
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }

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
