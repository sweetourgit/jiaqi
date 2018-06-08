<template>
  <div class="row">
    <div class="top_tip">账户信息</div>
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
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select class="dropdown" v-model="form.state" placeholder="请选择状态" :disabled="true">
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号:" prop="phone">
        <el-input class="input-phone" v-model="form.phone" :disabled="true"></el-input>
        <img class="modify" src="@/assets/image/u3201.png" alt="" width="24" @click="dialogFormVisible = true">
      </el-form-item>
       <!-- 手机修改弹窗 -->
      <el-dialog title="手机号修改" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="phone1" status-icon :rules="rules1" ref="phone1">
          <el-form-item label="旧手机号" :label-width="formLabelWidth" prop="usedphone" v-show="show">
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
        <el-button class="phone-verification" type="primary" size="small" @click="verification" v-show="show">获取验证码</el-button>
        <el-button class="phone-verification-1" type="primary" size="small" plain disabled v-show="!show">{{count + 's'}}</el-button>
        <div slot="footer" class="dialog-footer">
          <el-button class="phone-Determine" @click="dialogFormVisible1('phone1')">取 消</el-button>
          <el-button class="phone-Determine" type="primary" @click="submitForm('phone1')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 手机修改弹窗END -->
      <el-form-item label="邮箱:" prop="emial">
        <el-input class="input-phone" v-model="form.emial" :disabled="true"></el-input>
        <img class="modify" src="@/assets/image/u3201.png" alt="" width="24" @click="dialogEmial = true">
      </el-form-item>
      <!-- 邮箱修改弹窗 -->
      <el-dialog title="邮箱修改" :visible.sync="dialogEmial" width="600px">
        <el-form :model="emial1" status-icon :rules="rules2" ref="emial1">
          <el-form-item label="旧邮箱" :label-width="formLabelWidth" prop="usedemial" v-show="show1">
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
        <el-button class="phone-verification" type="primary" size="small"  @click="verification1" v-show="show1">获取验证码</el-button>
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
        <el-button class="preservation" type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    // var rulessex = (rule, value, callback) => {
    //   if(this.form.sex !== ""){
    //     callback();
    //   } else {
    //     callback(new Error('请选择性别'));
    //   }
    // }
      return {
        // 账户信息
        form: {
          id: "007",
          name: "嘟嘟",
          sex: "",
          state: "1",
          phone: "13704327780",
          emial: "alert@sina.cn",
          department: "1"
        },
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
            { required: true, message: '请填写手机号', trigger: 'blur'},
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
            { required: true, message: '请填写邮箱地址', trigger: 'blur'},
            { pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请填写正确邮箱地址'}
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {  
            this.$message.success('验证成功！') 
            if(formName == 'phone1'){
              this.dialogFormVisible = false   
              this.show = true
              this.$refs['phone1'].resetFields()
            }else if(formName == 'emial1'){
              this.dialogEmial = false
              this.show1 = true
              this.$refs['emial1'].resetFields()
            }
          } else {  
            this.$message.error('验证失败！')  
          }  
        })
      },
      verification() {
        if(this.phone1.usedphone === ''){
          this.$message.error('手机号为空！') 
        }else{
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
          } else {
            this.$message.error('请填写正确的手机号！') 
          }
        }
      },
      verification1() {
         if(this.emial1.usedemial === ''){
          this.$message.error('邮箱为空！') 
        } else {
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
          } else {
            this.$message.error('请填写正确的邮箱！') 
          }
        }
      },
      dialogFormVisible1(a) {
        this.dialogFormVisible = false
        this.$refs[a].resetFields()
      },
      dialogEmial1(a) {
        this.dialogEmial = false
        this.$refs[a].resetFields()
      }
    }
  }
</script>

<style scoped>
.content{margin: 0 0 0 4%;}
.input{
  float: left;
  width: 210px;
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
  width: 110px;
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
  width: 210px;
}  
.preservation{
  width: 140px;
  margin-top: 40px;
  margin-right: 20px;
  margin-left: 40px;
  float: left;
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
  padding-right: 20px;
}
.sex{
  /*margin-right: 110px !important; */
  float: left;
  margin-top: 11px;
  margin-left: 1%;
}
.top_tip {
  border-left: 5px solid grey;
  text-align: left;
  padding-left: 5px;
  font-size: 15px;
  margin-bottom: 15px;
}
</style>


