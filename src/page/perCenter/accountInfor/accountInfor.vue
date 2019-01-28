<template>
  <div class="row_pass">
    <div class="list_left">
      <span class="information">账户信息</span>
      <div class="content">
      <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="ID:" prop="id">
          <el-input class="input" v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input class="input" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group class="sex" v-model="form.sex">
            <el-radio label="1" value="1">男</el-radio>
            <el-radio label="2" value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select class="dropdown" v-model="form.userState" placeholder="请选择状态" :disabled="true">
            <el-option label="未选择" value="0"></el-option>
            <el-option label="待审核" value="1"></el-option>
            <el-option label="启用" value="2"></el-option>
            <el-option label="停用" value="3"></el-option>  
          </el-select>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input class="input-phone" v-model="form.mobile" :disabled="true"></el-input>
          <img class="modify" src="@/assets/image/u3201.png" alt="" width="24" @click="dialogFormVisible = true">
        </el-form-item>
        <!-- 手机修改弹窗 -->
        <el-dialog title="手机号修改" :visible.sync="dialogFormVisible" custom-class="city_list" width="600px">
          <el-form :model="phone1" status-icon :rules="rules1" ref="phone1">
            <el-form-item label="旧手机号" :label-width="formLabelWidth" prop="usedphone" v-show="show" ref="usedphone">
              <el-input class="input-popup" v-model="phone1.usedphone" auto-complete="off"></el-input>
            </el-form-item>
            <span class="prompt" v-show="!show">已向{{'&nbsp;' + phone1.usedphone + '&nbsp;'}}发送验证码</span>
            <el-form-item label="验证码" :label-width="formLabelWidth" prop="name">
              <el-input class="input-popup" v-model="phone1.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新手机号" :label-width="formLabelWidth" prop="newphone" class="input-popup-2">
              <el-input class="input-popup" v-model="phone1.newphone" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <el-button class="phone-verification" type="primary" size="small" @click="verification('usedphone')" v-show="show">获取验证码</el-button>
          <el-button class="phone-verification-1" type="primary" size="small" plain disabled v-show="!show">{{count + 's'}}</el-button>
          <div slot="footer" class="dialog-footer">
            <el-button class="phone-Determine" @click="dialogFormVisible1('phone1')">取 消</el-button>
            <el-button class="phone-Determine" type="primary" @click="submitForm('phone1')">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 手机修改弹窗END -->
        <el-form-item label="邮箱:" prop="email">
          <el-input class="input-phone" v-model="form.email" :disabled="true"></el-input>
          <img class="modify" src="@/assets/image/u3201.png" alt="" width="24" @click="dialogEmial = true">
        </el-form-item>
        <!-- 邮箱修改弹窗 -->
        <el-dialog title="邮箱修改" :visible.sync="dialogEmial" custom-class="city_list" width="600px">
          <el-form :model="emial1" status-icon :rules="rules2" ref="emial1">
            <el-form-item label="旧邮箱" :label-width="formLabelWidth" prop="usedemial" v-show="show1" ref="usedemial">
              <el-input class="input-popup" v-model="emial1.usedemial" auto-complete="off"></el-input>
            </el-form-item>
            <span class="prompt" v-show="!show1">已向{{'&nbsp;' + emial1.usedemial + '&nbsp;'}}发送验证码</span>
            <el-form-item label="验证码" :label-width="formLabelWidth" prop="name">
              <el-input class="input-popup" v-model="emial1.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新邮箱" :label-width="formLabelWidth" prop="newemial">
              <el-input class="input-popup" v-model="emial1.newemial" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <el-button class="phone-verification" type="primary" size="small"  @click="verification1('usedemial')" v-show="show1">获取验证码</el-button>
          <el-button class="phone-verification-1" type="primary" size="small" plain disabled v-show="!show1">{{count1 + 's'}}</el-button>
          <div slot="footer" class="dialog-footer">
            <el-button class="phone-Determine" @click="dialogEmial1('emial1')">取 消</el-button>
            <el-button class="phone-Determine" type="primary" @click="submitForm('emial1')">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 邮箱修改弹窗END -->
        <el-form-item label="组织部门:">
          <el-select class="dropdown" v-model="form.department" placeholder="请选择状态" :disabled="true">
            <el-option label="大连大运通-连管中心-XXX" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select class="dropdown" v-model="form.department" placeholder="请选择状态" :disabled="true">
            <el-option label="辽宁大运通-东南亚部" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="preservation preservation_left" type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
      </div>
    </div>
    <div class="line"></div>
      <div class="list_right">
      <span class="information information_right">密码修改</span>
      <div class="content_pass">
      <el-form :model="formPass" status-icon :rules="rulesPass" ref="formPass" label-width="100px" class="demo-ruleForm">
        <el-form-item label="当前密码" prop="passWord">
          <el-input class="input" type="password" v-model="formPass.passWord" placeholder="请输入当前密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpass">
          <el-input class="input" type="password" v-model="formPass.newpass" placeholder="6-20位数字与字母"></el-input>
        </el-form-item>
        <el-form-item label="再次确认" prop="checkpass">
          <el-input class="input" type="password" v-model="formPass.checkpass" placeholder="请再次确认"></el-input>
        </el-form-item>
        <el-button class="preservation preservation_right" type="primary" @click="submitForms('formPass')">保 存</el-button>
      </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created (){
      this.$http.post(this.GLOBAL.serverSrc+'/org/api/userget',{
          id: sessionStorage.getItem('id')
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(res => {
        this.form = res.data.object
        this.form.sex = String(this.form.sex)
        this.form.userState = String(this.form.userState)
      }).catch(err => {

      })
  },
  data () {
    var validatepass = (rule, value, callback) => {
      if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formPass.newpass) {
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
    // var rulessex = (rule, value, callback) => {
    //   if(this.form.sex !== ""){
    //     callback();
    //   } else { 
    //     callback(new Error('请选择性别'));
    //   }
    // }
      return {
        // 账户信息
        form: {},
        // 手机弹窗信息
        phone1: {
          name: "",
          newphone: "",
          usedphone: "",
        },
        emial1: {
          name: "",
          newemial: "",
          usedemial: "",
        },
        show: true,
        count: '',
        timer: null,
        show1: true,
        count1: '',
        timer1: null,
        formLabelWidth: '160px',
        dialogFormVisible: false,
        dialogEmial: false,
        // 密码修改
        formPass: {
          passWord: "",
          newpass: "",
          checkpass: ""
        },
        isPass: true,
        rulesPass: {
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
        },
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6位汉字'}
          ],
          // sex: [
          //   { validator: rulessex }
          // ]
        },
        rules1: {
          name: [
            { required: true, message: '请填写验证码', trigger: 'blur'},
          ],
          newphone: [
            { required: true, message: '请填写手机号', trigger: 'blur'},
            { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请填写正确电话号码'}
          ],
          usedphone: [
            { required: true, message: '请填写手机号'},
            { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请填写正确电话号码'}
          ],
        },
        rules2: {
          name: [
            { required: true, message: '请填写验证码', trigger: 'blur'}
          ],
          newemial: [
            { required: true, message: '请填写邮箱地址', trigger: 'blur'},
            { pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请填写正确邮箱地址'}
          ],
          usedemial: [
            { required: true, message: '请填写邮箱地址'},
            { pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请填写正确邮箱地址'}
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {  
            if(formName == 'form'){
              this.$http.post(this.GLOBAL.serverSrc + "/org/api/usersave",{
                 "Object": {
                    "id": this.form.id,
                    "createTime": this.form.createTime,
                    "isDeleted": this.form.isDeleted,
                    "code": this.form.code,
                    "passWord": this.form.passWord,
                    "mobile":this.form.mobile,
                    "name": this.form.name,
                    "email": this.form.email,
                    "userCode": this.form.userCode,
                    "iDcard": this.form.iDcard,
                    "tourGuide": this.form.tourGuide,
                    "sex": this.form.sex,
                    "userType": this.form.userType
                  },
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
              }).then((res) => {
                localStorage.setItem('name', this.form.name)
                this.$message.success('修改成功！');
                document.getElementById('nameNum').innerHTML = this.form.name
              }).catch((err) => {
                console.log(err)
              })
            }else if(formName == 'phone1'){
              this.$message.success('修改成功！') 
              this.dialogFormVisible = false   
              this.show = true
              this.$refs['phone1'].resetFields()
            }else if(formName == 'emial1'){
              this.$message.success('修改成功！') 
              this.dialogEmial = false
              this.show1 = true
              this.$refs['emial1'].resetFields()
            }
          }
        })
      },
      verification(form) {
       this.$refs['usedphone'].validate()
        var str = this.phone1.usedphone
        var patt = /^[1][3,4,5,7,8][0-9]{9}$/
        if(str.match(patt)){
          const TIME_COUNT = 60;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
              } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
              }
            }, 1000)
          }
        } 
      },
      verification1(form) {
        this.$refs[form].validate()
          var str = this.emial1.usedemial
          var patt = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
          if(str.match(patt)){
            const TIME_COUNT = 60;
            if (!this.timer1) {
              this.count1 = TIME_COUNT;
              this.show1 = false;
              this.timer1 = setInterval(() => {
              if (this.count1 > 0 && this.count1 <= TIME_COUNT) {
                this.count1--;
                } else {
                this.show1 = true;
                clearInterval(this.timer1);
                this.timer1 = null;
                }
              }, 1000)
            }
          }   
      },
      dialogFormVisible1(a) {
        this.dialogFormVisible = false
        this.show = true;
        clearInterval(this.timer);
        this.timer = null;
        // this.$refs[a].resetFields()
      },
      dialogEmial1(a) {
        this.dialogEmial = false
        this.show1 = true;
        clearInterval(this.timer1);
        this.timer1 = null;
        // this.$refs[a].resetFields()
      },
      submitForms(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$http.post(this.GLOBAL.serverSrc+'/org/api/userget',{
              "id": sessionStorage.getItem('id'),
            },{
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
              }
            }).then((res) => {
              if(this.formPass.passWord === res.data.object.passWord){
                this.$http.post(this.GLOBAL.serverSrc + "/org/api/usersave",{
                  "object": {
                    "id": res.data.object.id,
                    "createTime": res.data.object.createTime,
                    "isDeleted": res.data.object.isDeleted,
                    "code": res.data.object.code,
                    "passWord": this.formPass.checkpass,
                    "mobile":res.data.object.mobile,
                    "name": res.data.object.name,
                    "email": res.data.object.email,
                    "userCode": res.data.object.userCode,
                    "iDcard": res.data.object.iDcard,
                    "tourGuide": res.data.object.tourGuide,
                    "sex": res.data.object.sex,
                    "userType": res.data.object.userType
                  },
                },{
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                  }
                }).then((res) => {
                  this.$message.success('新密码修改成功！')
                  this.$refs['formPass'].resetFields()
                }).catch((err) => {
                  console.log(err);
                })
              } else {
                this.isPass = false;
                this.submitForms('formPass')
                // this.$message.error('密码输入不正确')
                // this.$refs['formPass'].resetFields()
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
.list_left{
  float: left;
}
.information{
  float: left;
  font-size: 14px;
}
.information_right{
  margin-left: -9px;
}
.content{
  /* margin: 0 0 0 4%; */
  float: left;
  position: relative;
  top:40px;
  left: -85px;
}
.input{
  float: left;
  width: 158px;
}
.modify{
  float: left;
  cursor: pointer;
  position: relative;
  left: 10px;
  top: 10px;
}
.dialog-footer{
  text-align: center;
}
.phone-Determine{
  margin: 20px;
  width: 100px;
}
.phone-verification{
  float: right;
  position: relative;
  bottom: 182px;
  margin-right: 11%;
}
.phone-verification-1{
  float: right;
  position: relative;
  bottom: 170px;
  right: 90px;
  width: 70px;
}
.input-phone{
  float: left;
  width: 190px;
}  
.preservation{
  float: left;
  width: 144px;
  margin-top: 34px;
}
.preservation_left{
  margin-left: -16px;
}
.preservation_right{
  margin-left: 85px;  
}
.input-popup{
  width: 220px;
  margin-right: 185px
}
.prompt{
  position: relative;
  right: 100px;
  bottom: 18px;
}
.dropdown{
  float: left;
  width:190px;
  padding-right: 20px;
}
.sex{
  /*margin-right: 110px !important;*/
  float: left;
  margin-top: 11px;
  margin-left: 3%;
}
/* .row_pass>>>.el-form-item__error{
  position: absolute;
  left: 176px;
  top: 12px;
} */
.row_pass>>>.el-form-item__content{
  width:340px;
}
.row_pass .content_pass>>>.el-form-item__error{
  position: relative;
  left: 10px;
  top: 12px;
}
.line{
  float: left;
  border-left: solid 1px #F2F2F2;
  height: 590px;
  width:0;
  margin-left: -109px;
}
.list_right{
  float: left;
  margin-left: -50px;
}
.content_pass{
  float: left;
  position: relative;
  top:40px;
  left: -88px;
}
</style>


