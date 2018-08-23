<template>
  <div class="row">
    <div class="content_pass">
    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="当前密码" prop="passWord">
        <el-input class="input" type="password" v-model="form.passWord" placeholder="请输入当前密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newpass">
        <el-input class="input" type="password" v-model="form.newpass" placeholder="6-20位数字与字母"></el-input>
      </el-form-item>
      <el-form-item label="再次确认" prop="checkpass">
        <el-input class="input" type="password" v-model="form.checkpass" placeholder="请再次确认"></el-input>
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
    var validatepass1 = (rule, value, callback) => {
      if(this.isPass == false){
        callback(new Error('密码输入不正确'));
        this.isPass = true;
      } else {
        callback();
      }
    };
    return {
      form: {
        passWord: "",
        newpass: "",
        checkpass: ""
      },
      isPass: true,
      rules: {
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur"},
          { validator: validatepass1 }
        ],
        newpass: [
          { required: true, message: "请输入密码", trigger: "blur"},
          { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, message: "密码格式错误(6-20位数字加字母)"}
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
            this.$http.post(this.GLOBAL.serverSrc+'/api/org/userget',{
              "object":{
                "id": sessionStorage.getItem('userId'),
              }
            }).then((res) => {
              if(this.form.passWord === res.data.object.passWord){
                this.$http.post(this.GLOBAL.serverSrc + "/api/org/usersave",{
                  "Object": {
                    "id": res.data.object.id,
                    "createTime": "2018-06-20T09:35:52.822Z",
                    "isDeleted": 0,
                    "code": "string",
                    "passWord": this.form.checkpass,
                    "mobile":res.data.object.mobile,
                    "name": res.data.object.name,
                    "email": res.data.object.email,
                    "userCode": res.data.object.userCode,
                    "iDcard": res.data.object.iDcard,
                    "tourGuide": res.data.object.tourGuide,
                    "sex": res.data.object.sex,
                    "userType": res.data.object.userType
                  },
                  "id": 0
                }).then((res) => {
                  this.$message.success('新密码修改成功！')
                  this.$refs['form'].resetFields()
                }).catch((err) => {
                  console.log(err);
                })
              } else {
                this.isPass = false;
                this.submitForm('form')
                // this.$message.error('密码输入不正确')
                // this.$refs['form'].resetFields()
              }
            }).catch((err) => {
              console.log(err);
            })
            
          }
        })
      },
  }
}
</script>

<style scoped>
.content_pass{margin: 0 0 0 16%;}
.row{width: 400px; padding-top: 40px;}
.preservation{width: 140px; margin: 40px auto;}
.input{width: 210px;float: left;}
</style>


