<template>
  <div class="row">
    <div class="top_tip">密码修改</div>
    <div class="content">
    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="当前密码" prop="pass">
        <el-input class="input" type="password" v-model="form.pass" placeholder="请输入当前密码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newpass">
        <el-input class="input" type="password" v-model="form.newpass" placeholder="6-20位数字与字母" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="再次确认" prop="checkpass">
        <el-input class="input" type="password" v-model="form.checkpass" placeholder="请再次确认" auto-complete="off"></el-input>
      </el-form-item>
      <el-button class="preservation" type="primary" @click="submitForm('form')">保 存</el-button>
    </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    var validatepass = (rule, value, callback) => {
      if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newpass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    return {
      form: {
        pass: "",
        newpass: "",
        checkpass: ""
      },
      rules: {
        pass: [
          { required: true, message: "请输入密码", trigger: "blur"},
          { pattern: /^[a-zA-Z0-9]{6,10}$/, message: "密码格式错误(6-20位数字与字母)"}
        ],
        newpass: [
          { required: true, message: "请输入密码", trigger: "blur"},
          { pattern: /^[a-zA-Z0-9]{6,10}$/, message: "密码格式错误(6-20位数字与字母)"}
        ],
        checkpass: [
          { validator: validatepass }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$message.success('验证成功！')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            this.dialogEmial = false
          } else {
            this.$message.error('验证失败！')
          }
        })
      },
  }
}
</script>

<style scoped>
.content{margin: 0 0 0 16%;}
.row{width: 400px;}
.preservation{width: 140px; margin: 40px auto;}
.input{width: 210px;float: left;}
.top_tip {
  border-left: 5px solid grey;
  text-align: left;
  padding-left: 5px;
  font-size: 15px;
  margin-bottom: 15px;
}
</style>


