<template>
	<div>
      <div class="tag">
        <el-tabs v-model="activeName" class="form_tag">
          <el-tab-pane label="基本信息" name="first" class="pane-scroll">
             <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm ruleForm-abjust">
              <el-button type="success" v-if="enable" size="medium" class="begin-button" @click="enableType">启用</el-button>
              <el-button type="danger"  v-if="disable" size="medium" class="end-button" @click="disableType">停用 </el-button>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="请输入手机号" class="from-input"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入2-6位汉字" class="from-input"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="mail">
                <el-input v-model="ruleForm.mail" placeholder="请输入邮箱" class="from-input"></el-input>
              </el-form-item>
              <el-form-item label="员工编号" prop="number" >
                <el-input v-model="ruleForm.number" placeholder="请输入员工编号" class="from-input"></el-input>
              </el-form-item>
              <el-form-item label="身份证号">
                <el-input v-model="ruleForm.idcard" placeholder="请输入身份证号" class="from-input"></el-input>
              </el-form-item>
              <el-form-item label="导游证号">
                <el-input v-model="ruleForm.trailid" placeholder="请输入导游证号" class="from-input"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="ruleForm.sex">
                  <el-radio label="1" class="from-radio">男</el-radio>
                  <el-radio label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- <el-form-item label="状态" prop="state">
                <div>
                  <el-radio label="1" class="radiomar" v-model="ruleForm.state">启用</el-radio>
                  <el-radio label="2" class="radiomar" v-model="ruleForm.state">停用</el-radio>
                </div>
              </el-form-item> -->
              <el-form-item label="用户类型" prop="type">
                <el-radio-group v-model="ruleForm.type" class="form_type">
                  <el-radio label="1" class="from-radio">普通用户</el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="form_ori">
              <el-form-item label="部门" prop="orilistprop" >
                <div class="addOri">
                    <el-button type="primary" plain @click="addDep" v-model="ruleForm.orilist" class="but-left">{{ruleForm.orilist}}</el-button>
                    <div class="button-fun">
                 <!-- <el-button type="primary" size="mini" @click="addDomain" >添加</el-button>
                  <el-button type="info" size="mini">默认职位</el-button>-->
                    </div>
                </div>

            </el-form-item>
            </div>
              <div class="block"
                  v-if="cancel"
                  v-for="(domain, index) in ruleForm1.domains"
                  :key="domain.key"
                  :prop="'domains.' + index + '.value'"
              >
                  <el-button type="primary" plain @click="tanchu(domain) " v-model="ruleForm1" class="but-left">{{domain.value}}</el-button>
                  <div class="button-fun">
                 <el-button type="danger"  @click.prevent="removeDomain(domain)" size="mini" class="delete-adjust" >删除</el-button>
               <!--  <el-button type="primary" size="mini" class="delete-adjust" @click="changstatus(domain)">设置默认</el-button>-->
                  </div>
              </div>
              <el-form-item class="button-adjust">
                <el-button type="primary" @click="submitForm('ruleForm')" v-if="buttonsubmit">创建</el-button>
                <el-button type="primary" @click="changeForm('ruleForm')" v-if="buttonchange">修改</el-button>
                <el-button @click="resetForm('ruleForm')">取消</el-button>
              </el-form-item>
                <!--弹出框-->
                  <el-dialog title="用户信息" custom-class="city_list" :visible.sync="dialogFormVisible" width="400px">
                    <div class="ztree-bg">
                       <ul id="tree" class="ztree"></ul>
                    </div>
                    <div style="position: absolute;top: 10px;right: 10px">
                      <el-button size="mini" @click="dialogFormVisible = false" type="primary">取消</el-button>
                      <el-button size="mini" @click="addmaster" type="primary">确定</el-button>
                    </div>
                </el-dialog>
                <!--弹出框-->
            </el-form>
          </el-tab-pane>
         <!--
          <el-tab-pane label="权限配置" name="second">
            <Permission></Permission>
          </el-tab-pane>-->
        </el-tabs>
      </div>
  </div>

</template>

<script>
import '../../../../../static/ztree/zTreeStyle/zTreeStyle.css'
import '../../../../../static/ztree/jquery-1.4.4.min.js'
import '../../../../../static/ztree/jquery.ztree.core.js'
  export default {
    data () {
        var checkPhone = (rule, value, callback) => {
          var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
          if(!value){
            return callback(new Error('电话号码不能为空'));
          }
          if (!myreg.test(value)) {
          return callback(new Error('请输入正确的电话号码'));
        }
          callback();
      };
      var checkName = (rule, value, callback) => {
          var myreg=  /^[\u4e00-\u9fa5]{2,6}$/;
          if(!value){
            return callback(new Error('姓名不能为空'));
          }
          if (!myreg.test(value)) {
          return callback(new Error('请输入2-6位汉字'));
        }
        callback();
      };
      var checkMail = (rule, value, callback) => {
          var myreg=  /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
          if(!value){
            return callback(new Error('邮箱不能为空'));
          }
          if (!myreg.test(value)) {
          return callback(new Error('请输入正确的邮箱'));
        }
        callback();
      };
       var checkTrail = (rule, value, callback) => {
          if(!value){
            return callback(new Error('员工编号不能为空'));
          }
          callback();
      };


      return {
        company:0,
        parentID:0,
        deptName:"",
        setting: {
          async: {
              enable: true,
              url: this.GLOBAL.serverSrc + "/org/dept/api/ztreelist",
              autoParam: ["id"],
              type: 'get',
              checkable: true,
              dataFilter: this.filter()
          },
          callback: {
            onClick: this.onNodeClick,
          }
        },
        zNodes: [],
        addInput: {
          name: "",
          topDepartment: "",
          radio: "",
          lastStage: "2",
          departmentCode: "",
          sort: "",
          phone: "",
          fax: "",
          note: "",
          ParentID: ""
        },
        userState:'',
        value: '',
        options1: [],
        value1: '',
        options2: [],
        value2: '',
        options3: [],
        value3: '',
        options4: [],
        value4: '',
        arr: [],
        arr1: [],
        arr2: [],
        arr3: [],
        buttonsubmit:false,
        buttonchange:false,
        uid:0,
        enable:false,
        disable :false,
        hidval:"-1",
        selectedOptions: [],
        ppid:'',
        orgID:'',
        ruleForm1: {
          domains: [{
            value: '请点击添加',
            id:''
          }],
        },
         bumen: [],
        value8: ''
        ,
        dialogFormVisible: false,
        cancel:false,
        activeName: 'first',
        ruleForm: {
          phone: '',
          passWord:'',
          name: '',
          mail: '',
          number:'',
          idcard:'',
          trailid:'',
          sex:'1',
          type:'1',
          state:'',
          orilist: '请点击添加',
          orilistprop:'',
          domains: [{
            value: ''
          }],
        },
        rules: {
          /* phone: [
            { required: true,validator: checkPhone,trigger: 'blur' }

          ],*/
         /* name: [
            {  required: true, validator:checkName, trigger: 'blur' }
          ],*/
          mail: [
            {  required: true, validator:checkMail, trigger: 'blur' }
          ],
          orilistprop: [
            {  required: true, message: '请选择部门', trigger: 'change' }
          ],
          number: [
            {  required: true, validator:checkTrail, trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择用户类型', trigger: 'change' }
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],

        },

      }

    },
      methods: {
        zTreeInit(){
          var ztree = $.fn.zTree.init($("#tree"), this.setting);
      },
      filter(treeId, parentNode, childNodes) {
          if (!childNodes) return null;
          for (var i = 0, l = childNodes.length; i < l; i++) {
              childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
          }
          return childNodes;
      },
      // 单击选中目录
      onNodeClick(e, treeId, treeNode){
        if(treeNode.isParent === true){
          this.parentID = treeNode.id;
        }else{
          this.parentID = treeNode.parentID;       
        }
        this.deptName=treeNode.name;
        this.orgID=treeNode.id;
      },
      addDep(){
        this.dialogFormVisible = true;
        setTimeout(()=>{
          this.zTreeInit();
        })
      },
      /*----------*/
        changstatus(item){
          //默认的值
          var id = this.ruleForm1.domains.indexOf(item)
          var one = this.ruleForm.orilist
          this.ruleForm.orilist = this.ruleForm1.domains[id].value
          this.ruleForm1.domains[id].value = one
        },
        addmaster() {
          this.company = this.parentID;
          this.ruleForm.orilist = this.deptName;
          this.ruleForm.orilistprop = this.deptName;
          this.ppid = this.orgID;
          this.dialogFormVisible = false;
        },
        tanchu(item) {
            var index = this.ruleForm1.domains.indexOf(item)
            this.hidval = index
           this.dialogFormVisible = true
        },
        enableType() {
        this.$confirm('您确定启用/停用该用户么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: (action, instance) => {
             if (action === 'confirm') {

               this.$http.post(
                 this.GLOBAL.serverSrc + "/org/api/usersave",
                 // "http://api.dayuntong.com:3009/api/org/userinsert",
                 {
                   "Object": {
                     "id": this.$route.query.id,
                     "mobile": this.ruleForm.phone,
                     "name": this.ruleForm.name,
                     "email": this.ruleForm.mail,
                     "userCode": this.ruleForm.number,
                     "passWord": this.ruleForm.passWord,
                     "iDcard": this.ruleForm.idcard,
                     "tourGuide": this.ruleForm.trailid,
                     "sex": this.ruleForm.sex,
                     "userType":this.ruleForm.type,
                     "userState": "2"

                   }
                 },{
                   headers:{
                     'Authorization': 'Bearer ' + localStorage.getItem('token')
                   }
                 }
               )
                 .then(function (obj) {
                     this.$message({
                       message: '操作成功',
                       type: 'success'
                     });
                     setTimeout(() => {
                       this.$router.push({path: "/userlist"});
                     }, 1000);
                 })
                 .catch(function (obj) {
                   console.log(obj)
                 })
              this.$message({
            type: 'success',
            message: '操作成功!'
             })
            setTimeout(() => {
                  this.$router.push({path: "/userlist"});
                }, 2000);
             }
        }
        })
      },
        disableType() {
          this.$confirm('您确定启用/停用该用户么?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            callback: (action, instance) => {
              if (action === 'confirm') {

                this.$http.post(
                  this.GLOBAL.serverSrc + "/org/api/usersave",
                  // "http://api.dayuntong.com:3009/api/org/userinsert",
                  {
                    "Object": {
                      "id": this.$route.query.id,
                      "mobile": this.ruleForm.phone,
                      "name": this.ruleForm.name,
                      "email": this.ruleForm.mail,
                      "userCode": this.ruleForm.number,
                      "passWord": this.ruleForm.passWord,
                      "iDcard": this.ruleForm.idcard,
                      "tourGuide": this.ruleForm.trailid,
                      "sex": this.ruleForm.sex,
                      "userType":this.ruleForm.type,
                      "userState": "3"

                    }
                  },{
                    headers:{
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                  }
                )
                  .then(function (obj) {
                    that.$message({
                      message: '操作成功',
                      type: 'success'
                    });
                    setTimeout(() => {
                      this.$router.push({path: "/userlist"});
                    }, 1000);
                  })
                  .catch(function (obj) {
                    console.log(obj)
                  })
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                setTimeout(() => {
                  this.$router.push({path: "/userlist"});
                }, 2000);
              }
            }
          })
        },
        bumen123(){
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/org/api/deptget",
            {
              id: that.ppid
            },{
              headers:{
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            }
          )
            .then(function (obj) {
              that.ruleForm.orilist = obj.data.object.orgName;
              that.ruleForm.orilistprop = obj.data.object.orgName;
            })
            .catch(function (obj) {
            })
        },
        submitForm(formName) {
          var that = this
          this.$refs[formName].validate((valid) => {
            if (valid) {
              var that = this
              this.$http.post(
                this.GLOBAL.serverSrc + "/org/api/userinsert",
                // "http://api.dayuntong.com:3009/api/org/userinsert",
                {
                  "Object": {
                    "createTime": "2018-06-20T09:35:52.822Z",
                    "passWord": this.ruleForm.phone,
                    "isDeleted": 0,
                    "code": 123,
                    "mobile":this.ruleForm.phone,
                    "name": this.ruleForm.name,
                    "email": this.ruleForm.mail,
                    "userCode": this.ruleForm.number,
                    "iDcard": this.ruleForm.idcard,
                    "tourGuide": this.ruleForm.trailid,
                    "sex": this.ruleForm.sex,
                    "userType": this.ruleForm.type,
                    "userState":2,
                    "orgID": this.ppid,
                    "company":this.company
                  },
                  "id": 0
                },{
                  headers:{
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
                }
              )
                .then(function (obj) {
                    if(obj.status == 200){
                      that.$message({
                        message: '操作成功',
                        type: 'success'
                      });
                      setTimeout(() => {
                        that.$router.push({path: "/userlist"});
                      }, 1000);
                    }

                })
                .catch(function (obj) {
                  console.log(obj)
                })
              // 组织列表
              // console.log(this.orilist)
              // console.log(this.ruleForm1)

            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        changeForm(formName) {
          var that = this
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$http.post(
                this.GLOBAL.serverSrc + "/org/api/usersave",
                // "http://api.dayuntong.com:3009/org/api/usersave",
                {
                  "Object": {
                    "id": this.uid,
                    "createTime": "2018-06-20T09:35:52.822Z",
                    "isDeleted": 0,
                    "code": "123",
                    "passWord": this.ruleForm.passWord,
                    "mobile":this.ruleForm.phone,
                    "name": this.ruleForm.name,
                    "email": this.ruleForm.mail,
                    "userCode": this.ruleForm.number,
                    "iDcard": this.ruleForm.idcard,
                    "tourGuide": this.ruleForm.trailid,
                    "sex": this.ruleForm.sex,
                    "userType": this.ruleForm.type,
                    //"userState":this.ruleForm.state = 1 ? 2 : 3,
                    "userState":this.userState,
                    "orgID": this.ppid,
                    "company":this.company
                  },
                },{
                  headers:{
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
                }
              )
                .then(function (obj) {
                    that.$message({
                      message: '修改成功',
                      type: 'success'
                    });
                    setTimeout(() => {
                      that.$router.push({path: "/userlist"});
                    }, 1000);
                })
                .catch(function (obj) {
                  console.log(obj)
                })
              //组织列表
              //console.log(this.orilist)
             // console.log(this.ruleForm1)

            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
      resetForm(formName) {
        this.$router.push({path: "/userlist"});
      },
      removeDomain(item) {
        var index = this.ruleForm1.domains.indexOf(item)
        if (index !== -1) {
          this.ruleForm1.domains.splice(index, 1)
        }
      },
      addDomain() {
        if(this.cancel == false){
           this.cancel = true
        }else{
          this.ruleForm1.domains.push({
          value: '请点击添加',
          key: Date.now()
        });
        }
      }
    },
    created(){
      var that = this
      if(this.$route.query.id){
        this.buttonchange = true
        this.buttonsubmit = false
        this.uid = this.$route.query.id
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/userget",
          {
              id: that.$route.query.id,
          },{
            headers:{
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
          .then(function (obj) {
           //that.treeKey.push(obj.data.object.company);
            that.company=obj.data.object.company;
           // that.treeKey.push(obj.data.object.orgID);
            that.ruleForm.phone = obj.data.object.mobile
            that.ruleForm.name = obj.data.object.name
            that.ruleForm.mail = obj.data.object.email
            that.ruleForm.idcard = obj.data.object.iDcard
            that.ruleForm.number = obj.data.object.userCode
            that.ruleForm.trailid = obj.data.object.tourGuide
            that.ruleForm.sex = String(obj.data.object.sex);
            that.ruleForm.type = String(obj.data.object.userType);
            that.ruleForm.passWord = obj.data.object.passWord
            that.userState = obj.data.object.userState
            that.ppid = obj.data.object.orgID
            if(obj.data.object.userState == 2){
                that.disable = true
            }else if(obj.data.object.userState == 3){
                that.enable = true
            }
            that.bumen123()
          })
          .catch(function (obj){
          })
      }else{
          this.buttonsubmit = true
          this.buttonchange = false
      }
    },
}
$(document).ajaxSend(function(event, jqxhr, settings){
    jqxhr.setRequestHeader("Authorization",'Bearer ' + localStorage.getItem('token'));
})
</script>

<style scoped>
  .qqqt{
    width: 365px;
    margin:auto;
  }
  .user-title{
    width: 120px;
    height: 22px;
    font-size: 18px;
    margin-left: -30px;
  }
  .tag{
    margin-left: -25px;
  }
  .form_tag{
    margin-left: 33px;
    padding-top: 20px;
  }
  .from-input{
    width: 180px;
  }
  .from-radio{

  }

  .form_type{

  }

  .button-adjust{
    margin-top: 50px;
  }
  .ruleForm-abjust{
    padding-bottom: 100px;
    margin-top: 33px;
    float: left;
  }
  .block{
      width: 1000px;
      height: 40px;
      font-size: 14px;
      margin-left: 149px;
      margin-top: 10px;
  }
  .delete-adjust{
    position: relative;
    left: 10px;
  }
  .begin-button{
    margin-left: 150px;
    position: relative;
    top: -27px;
  }
  .end-button{
    margin-left: 150px;
    position: relative;
    top: -27px
  }
  .addOri{
      font-size: 14px;
      width: 1000px;
      height: 50px;
  }
    .button-fun{
        float:left;
      margin-left: 10px;
    }
    .but-left{
        float:left;
    }
.ztree-bg{width: 250px;height:600px;margin:0 0 0 45px;padding: 10px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;overflow:scroll;}
</style>

