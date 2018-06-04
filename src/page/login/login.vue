<template>
<div >
  <div class="top">
    <span class="top-titleone">嘉麒集团</span>
    <span class="top-titletwo">通行证</span>
    
  </div>
 
  <div class="big">
     <!-- <div class="title">嘉麒集团应用管理中心系统</div> -->
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm login-container"  v-show="show">
     <span class="form-title">嘉麒应用管理中心</span>
     <div class="login-account">登录账号</div>
     <div class="login-border"></div>
     <el-button type="text" class="form-forget" @click="show = !show">忘记密码?</el-button>
     
     <el-form-item prop="user" class="user-input"> 
      <!-- <div><img src="../../../static/login/user.png" class="img" style="width:35px;"></div> -->
      <el-input  v-model="ruleForm.user" placeholder="用户名/邮箱"></el-input>
    </el-form-item>
    <el-form-item prop="password" class="password-input">
      <el-input type="password"  v-model="ruleForm.password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="verification" class="verification-input">
        <!-- <div><img src="../../../static/login/safety certificate.png" class="verification-img" style="width:35px;"></div> -->
        <el-input  v-model="ruleForm.verification" placeholder="验证码" ></el-input>
    </el-form-item>
        <!-- 验证码 -->
        <img src="../../../static/login-verify/number.png" alt="" class="verify-img">
    
      <router-link to="/role"> <el-button type="primary" class="button" @click="loginForm('ruleForm')">登录</el-button></router-link>

         <el-checkbox class="remember" >记住密码</el-checkbox>
    </el-form>
    <!-- 忘记密码 -->
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm login-forget"  v-show="!show">
     <span class="form-title">嘉麒应用管理中心</span>
     <div class="find-pass">找回密码</div>
     <div class="login-border"></div>
     <el-button type="text" class="form-forget" @click="show = !show">立刻登录</el-button>
     
   <div style="margin-top: 15px;">
  <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
    <el-select v-model="select" slot="prepend" placeholder="找回方式" style="width:110px">
      <el-option label="手机号" value="1"  ></el-option>
      <el-option label="邮箱" value="2" ></el-option>

    </el-select>
  </el-input>
</div>

  
    
    
      <el-button type="primary" class="next-button" >下一步</el-button>


    </el-form>

  
  
  
  <!-- 邮箱找回 --> 
  <el-dialog title="邮箱找回" :visible.sync="emailFormVisible" class="email">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
    <el-form-item label="邮箱号码:"  prop="email">
      <el-input v-model="ruleForm.email" auto-complete="off" style="width:400px"></el-input>
    </el-form-item>
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="emailFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
<!-- 手机找回 -->
<el-dialog title="手机找回" :visible.sync="phoneFormVisible" class="phone">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
    <el-form-item label="手机号:"  prop="phone">
      <el-input v-model="ruleForm.phone" auto-complete="off" class="phone-input"></el-input>
    
    </el-form-item>
     <el-form-item label="验证码:" prop="phoneVerification">
      <el-input v-model="ruleForm.phoneVerification" auto-complete="off" class="phone-verification-input"></el-input>
    </el-form-item>
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="phoneFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
<!-- 设置密码 -->
<el-dialog title="设置新密码" :visible.sync="newpasswordFormVisible" class="phone">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
    <el-form-item label="新密码:"  prop="newpassword" >
      <el-input type="password" v-model="ruleForm.newpassword" auto-complete="off" class="newpassword-input"></el-input>
    </el-form-item>
     <el-form-item label="重复密码:" prop="repassword" >
      <el-input type="password" v-model="ruleForm.repassword" auto-complete="off" class="repassword-input"></el-input>
    </el-form-item>
    
  </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="newpasswordFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="newpasswordForm('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
<div class="foot">
    Copy right @2018 嘉麒集团版权所有 辽ICP备辽B2 - 20150118
  </div>
    </div>
    </div>
</template>

<script>

   export default {
    data(){
      // 判断验证码
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('验证码不能为空'));
        }
        var value = value.toUpperCase()
        if(value !== this.checkCode){
           callback(new Error('验证码不正确'));
        }else{
          callback();
        }
      };
      // 判断修改密码
       var validatepass = (rule, value, callback) => {
      if (this.ruleForm.newpassword === '') {
          callback(new Error('请再次输入密码'));
        } else if (this.ruleForm.newpassword !== this.ruleForm.repassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
       return {
          input5: '',
       select: '',
       value: '',
     ruleForm: {
       user: '',
       password: '',
       verification: '',
       email: '',
       phone: '',
       phoneVerification: '',
      
       
      //  新密码和重复密码
       newpassword:'',
       repassword:'',
     },
      //验证码
        checkCode: "",
      // picLyanzhengma: "",
      

     
    
     
     rules: {
       user: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        verification: [
        // { required: true, message: '请输入验证码', trigger: 'blur' },
        { validator: checkAge, trigger: 'blur' }
       
      ],
        email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { pattern:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: "邮箱格式错误!"}
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern:/^[1][3,4,5,7,8][0-9]{9}$/, message: "手机格式错误!"}
      ],
       phoneVerification: [
        { required: true, message: '请输入手机验证码', trigger: 'blur' },
          
      ],
     
      newpassword: [
         { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{6,10}$/, message: "密码格式错误(6-20位数字与字母)"}
      ],
      repassword:[
       { validator: validatepass, }
      ]
     },
    //  邮箱找回JS
        emailTableVisible: false,
        emailFormVisible: false,
       
    //  手机号码找回JS
        phoneTableVisible: false,
        phoneFormVisible: false,

    // 设置新密码
        newpasswordTableVisible: false,
        newpasswordFormVisible: false,
        

        
    // 发送验证码倒计时
         time: 60, 
         sendMsgDisabled: false,

        show:true,
    
   };
    },
    
  
    methods: {
      //  手机验证或者邮箱验证
    submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('验证成功!');
              // 关闭邮箱找回弹框
              this.emailFormVisible = false
              this. ruleForm.email = ''
              // 关闭手机找回弹框
              this.phoneFormVisible = false
              this. ruleForm.phone = ''
              this. ruleForm.phoneVerification = ''
              // 打开新密码弹框
              this.newpasswordFormVisible = true
              this. ruleForm.newpassword = ''
              this. ruleForm.repassword = ''
              
              
              
            } else {
              console.log('验证失败');
              this. ruleForm.email = ''
              this. ruleForm.phone = ''
              this. ruleForm.phoneVerification = ''
              
              
              
              return false;
            }
          });
        },
        // 修改新密码验证
        newpasswordForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('密码设置成功!');
              // 关闭新密码弹框
              this. ruleForm.newpassword = ''
              this. ruleForm.repassword = ''                                          
              this.newpasswordFormVisible = false        
            } else {
              console.log('验证失败');
              return false;
            }
          });
        },

        //登录
        loginForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$message.success('登录成功');
              
            } else {
              this.$message.error('登录失败');
              return false;
            }
          });
        },
        
      

      //手机验证码倒计时
      send() {
      let me = this;
      me.sendMsgDisabled = true;
      let interval = window.setInterval(function() {
      if ((me.time--) <= 0) {
        me.time = 60;
        me.sendMsgDisabled = false;
        
        window.clearInterval(interval);
      }
      }, 1000);
    }
  }
    
 
    }
   
  </script>

<style lang="scss" scoped>

  .top{
     position: fixed;
      top:0px;
    height: 100px;
    margin-bottom:50px;
  }
  .top-titleone{
  position:fixed;
  top:4%;
  padding-left:5%;
  line-height: 50px;
  font-size: 22px;
  color:#666;
}
 .top-titletwo{
  top:4%;
  position:fixed;
  padding-left:13%;
  line-height: 50px;
  font-size: 22px;

  color:#666;
}
.top-titlethree{
  position:fixed;
  float:right;  
  top:4%;
  padding-left:73%;
  line-height: 50px;
  font-size: 16px;
}
.top-titlefour{
  position:fixed;
  float:right;  
  top:4%; 
  padding-left:77%;
  line-height: 50px;
  font-size: 16px;
  color:#008FF4;
}
.top-titlefive{
  position:fixed;
  top:4%;
  float:right;  
  padding-left:81%;
  line-height: 50px;
  font-size: 16px;
}
.top-titlesix{
  position:fixed;
  top:4%;
  float:right;  
  padding-left:82%;
  line-height: 50px;
  font-size: 16px;
  color:#008FF4;
}
.big{
  overflow: hidden;
  position: absolute;
  width:100%;
  height:90%;
  top: 10%;
  right: 20px;
  left:0px;
  // background:green;
  background-image:url('../../../static/login-img/login.png');
  background-size: 100% 80%;

}
 
  .title{
    text-align: center;
    padding-top:150px;
    color: #fff;
    font-size: 30px;
    margin-bottom:30px;
  }
   .form-title {
     position: relative;
     top:40px;
     margin: 0 auto;
     text-align: center;
     color: #444;
     font-size:24px;
    }
  .login-container {

    -webkit-border-radius: 5px;
    border-radius: 10px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    // margin: 0 auto;
    float: right;
    height:500px;
    width: 450px;
    margin: 6% 15% 9% 85%;
    background: #fff;
    // border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    background-color:rgba(255,255,255,.7);
    display:true;
    
  }
  .login-forget{
    -webkit-border-radius: 5px;
    border-radius: 10px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    // margin: 0 auto;
    float: right;
    height:400px;
    width: 450px;
    margin: 6% 15% 9% 85%;
    background: #fff;
    // border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    background-color:rgba(255,255,255,.7);
    display:true;
  }
  .login-account{
      position:relative;
      width:20%;
      top:12%;
      left:10%;
      color: #008FF4;
      font-size:20px;
      // border-bottom: #008FF4 solid 3px;
  }
  .find-pass{
      position:relative;
      width:20%;
      top:15%;
      left:10%;
      color: #008FF4;
      font-size:20px;
      // border-bottom: #008FF4 solid 3px;
  }
  .login-border{
    position: relative;
    float:left;
    left: 45px;
    top:70px;
    height:3px;
    width:90px;
    background:#008FF4;
  }
  .form-forget{
     position:relative;
      // width:25%;
      top:25px;
      left:20%;
      color: #888;
      font-size:20px;
      border-bottom: #888 solid 3px;
  }
    .input-with-select{
      margin-top:10%;
      width:350px;
    }

    .user-input{
      position:relative;
      margin-top:15%;
      float:left; 
      width:100%;
      right: 10%; 
    }
    .password-input{
      position:relative;
      float:left; 
      width:100%;
      
      right: 10%; 
    }
    .verification-input{
      position:relative;
      float:left;
      width:70%;
      right:10% !important;
      // width:55% !important;
      // left:-10%;
    }
    // 登录页验证码按钮
    .verification-button{
     text-align:center;
     position: relative;
     float: right;
     right:10% !important;
     right:60px;
     height:41px;
     width:100px;
     
  }
    .button{
      position: relative;
      width:83%;
      // left: 2%;
      margin-top:10%;
      // margin:0 auto;
    }
    .next-button{
       position: relative;
      width:78%;
      left: 1%;
      margin-top:10%;
    }
    .remember {
      position:relative;
      float:left;
      margin-top:5%;
      left: 10%;
      color: #008FF4;
    }
    .verify-img{
      width:27%;
      position:relative;
      float:right;
      right:45px;
      bottom:0px;
    }
    .iconfont{
      position: relative;
      font-size: 30px;
      right: 10px;
    }
    .forget{
       position:relative;
      float:right;
      right:37px;
      top:10px;
    }
    .forget-title{
     position: relative;
     float:right;
      text-decoration:none;
      color:#F19524;
       
    }
    .login-button{

      text-align:center;
    }
   
  
    .foot{
      position: fixed;
      bottom:0px;
      background: #fff;
      height:18%;
      width:100%;
      text-align: center;
      line-height:50px;
      color: #666;
      font-size:18px;
  }
  
  .phone{
    width:65%;margin:0 auto;
  }
  .phone-input{
    position: relative;    
    width:300px;
    right:45px;
    margin-left:30px;
  }

  // 手机找回页面的验证码输入框
   .phone-verification-input{
    width:300px;
    right:103px;
    margin-left:30px;
    
  }
  .phone-button{
    position: relative;
    float:right;
    right:40px;
    // margin-left:30px;
   
  }
 .email{
   width:50%;
   margin:0 auto;
 }
 .newpassword-input{
   width:300px;
   right:83px;
 }
 .repassword-input{
    width:300px;
    right:83px;
 }
 .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>