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
              <el-form-item label="用户类型" prop="type">
                <el-radio-group v-model="ruleForm.type" class="form_type">
                  <el-radio label="1" class="from-radio">普通用户</el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="form_ori">
              <el-form-item label="部门" prop="orderList" >
                <div class="addOri">
                    <el-button type="primary" plain @click="dialogFormVisible = true" v-model="orilist" class="but-left">{{orilist}}</el-button>
                    <div class="button-fun">
                  <el-button type="primary" size="mini" @click="addDomain" >添加</el-button>
                  <!--<el-button type="info" size="mini">默认职位</el-button>-->
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
                <!--弹出框> <-->
                  <el-dialog title="用户信息" custom-class="city_list" :visible.sync="dialogFormVisible" width="500px" show-close>
                    <!--<div class="qqqt">
                     <el-form ref="form"  label-width="110px">
                       &lt;!&ndash;<el-form-item label="部门:" class="form-la">
                         <el-cascader
                            placeholder="试试搜索：指南"
                            @active-item-change="handleItemChange"
                            :options="casc"
                            separator="-"
                            filterable
                            v-model="selectedOptions"
                          ></el-cascader>
                       </el-form-item>&ndash;&gt;

                       &lt;!&ndash;plan b begin&ndash;&gt;
                       <el-form-item label="组织:" class="form-la">
                         <el-select v-model="value" placeholder="请选择" @change="HandChange()">
                           <el-option
                             v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                       </el-form-item>

                       <el-form-item label="部门:" class="form-la">
                         <el-select v-model="value1" placeholder="请选择"   @change="HandChange1()">
                           <el-option
                             v-for="item in options1"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                       </el-form-item>

                       <el-form-item label="部门:" class="form-la" v-if="bumen2">
                         <el-select v-model="value2" placeholder="请选择"   @change="HandChange2()" >
                           <el-option
                             v-for="item in options2"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                       </el-form-item>

                       <el-form-item label="部门:" class="form-la" v-if="bumen1">
                         <el-select v-model="value3" placeholder="请选择" @change="HandChange3()">
                           <el-option
                             v-for="item in options3"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                       </el-form-item>

                       <el-form-item label="部门:" class="form-la" v-if="bumen3">
                         <el-select v-model="value4" placeholder="请选择" >
                           <el-option
                             v-for="item in options4"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                       </el-form-item>
                       &lt;!&ndash;plan b end&ndash;&gt;
                       <el-form-item label="职位:" class="form-la">
                         <el-select v-model="value8" filterable placeholder="请选择">
                           <el-option
                             v-for="item in bumen"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                       </el-form-item>

                         <input type="hidden" v-model="hidval" value="hidval"/>
                     </el-form>
                        <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addmaster">确 定</el-button>
                      </div>
                    </div>-->
                    <div class="left">
                      <div class="hh">
                        <el-tree ref="oppo" @node-click="treeClick" :props="props1" node-key="id" :load="loadNode" class="tree" @dblclick.native="treeDblclick" :render-content="renderContent" lazy :expand-on-click-node="isexpand" :default-expanded-keys="treeKey" highlight-current></el-tree>
                      </div>
                    </div>
                    <div style="position: absolute;top: 10px;right: 10px">
                      <el-button size="mini" @click="dialogFormVisible = false" type="primary">取消</el-button>
                      <el-button size="mini" @click="addmaster" type="primary">确定</el-button>
                    </div>
                </el-dialog>
                <!--弹出框> <-->
            </el-form>



          </el-tab-pane>
          <el-tab-pane label="权限配置" name="second">
            <Permission></Permission>
          </el-tab-pane>
        </el-tabs>
      </div>
  </div>

</template>

<script>
import Permission from '@/page/account/userList/addUser/permission'
  export default {
    name:'addUser',
    components:{
      Permission
    },
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
        fID:'',
        dname:'',
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
        treeKey: [],
        isexpand: false,
        props1: {
          label: "label",
          isLeaf: "leaf"
        },
        userState:'',
        options: [],
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
        bumen2: false,
        bumen1: false,
        bumen3:false,
        buttonsubmit:false,
        buttonchange:false,
        uid:0,
        enable:false,
        disable :false,
        hidval:"-1",
        selectedOptions: [],
        orilist: '请点击添加',
        ppid:'',
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
          orderList:'',
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
          orderList: [
            {  required: true, message: '请选择部门', trigger: 'blur' }
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

        },

      }

    },
      methods: {
        treeDblclick(a) {
          this.treeKey = [];
          if (this.dbSave.isLeaf == 2 || this.dbSave.isLeaf == 0) {
            this.treeKey.push(this.dbSave.id);
          }
          this.dbSave = ''
        },
        getUser(key, label, id, isLeaf, resolve) {
          this.data1 = [];
          let _this = this;
          this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptlist",{
            object: {
              ParentID: id
            }
          },{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
          }).then(response => {
            for (let i = 0; i < response.data.objects.length; i++) {
              if (response.data.objects[i].isDeleted !== 1) {
                if (response.data.objects[i].isLeaf == 1) {
                  _this.data1.push({
                    label: response.data.objects[i].orgName,
                    id: response.data.objects[i].id,
                    key: i,
                    cities: [],
                    isLeaf: response.data.objects[i].isLeaf,
                    leaf: true
                  });
                } else if (response.data.objects[i].isLeaf == 2) {
                  _this.data1.push({
                    label: response.data.objects[i].orgName,
                    id: response.data.objects[i].id,
                    key: i,
                    cities: [],
                    isLeaf: response.data.objects[i].isLeaf,
                    leaf: false
                  });
                }
              }
            }
            setTimeout(() => {
              let data = _this.data1;
              resolve(data);
            }, 200);
          })
            .catch(function(error) {
              console.log(error);
            });
        },
        // 单击tree节点
        treeClick(a, b, c) {

          console.log(a.id)
          console.log(a.label)
          this.fID = a.id
          this.dname = a.label
          this.data = [];
          this.org = a.id;
          this.tableData = [];
          this.tableList = [];
          this.addInput.ParentID = a.id;
          this.addInput.topDepartment = a.label;
          this.dbSave = a;
          var _this = this;
          //下级部门
          this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptlist",{
            object: {
              ParentID: a.id
            }
          },{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
          }).then(response => {
            for (let i = 0; i < response.data.objects.length; i++) {
              if (response.data.objects[i].isDeleted !== 1) {
                _this.tableData.push({
                  label: response.data.objects[i].orgName,
                  id: response.data.objects[i].id,
                  key: i,
                  value: response.data.objects[i].id
                });
              }
            }
          }).catch(function(error) {
            console.log(error);
          });
          //部门人员
          this.$http.post(this.GLOBAL.serverSrc + "/org/api/userlistwithorg", {
            id:a.id
          },{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
          }).then(res => {
            for(let i = 0;i<res.data.objects.length;i++){
              if(res.data.objects[i].sex == 1){
                res.data.objects[i].sex = '男'
              }else{
                res.data.objects[i].sex = '女'
              }
              _this.tableList.push({
                id:res.data.objects[i].id,
                name:res.data.objects[i].name,
                phone:res.data.objects[i].mobile,
                sex:res.data.objects[i].sex
              })
            }
          }).catch(function(error){
            console.log(error)
          })
        },
        renderContent(h, { node, data, store }) {
          if (data.isLeaf == 1) {
            return (
              <span>
              <img style="position:relative;bottom: -3px" width="20px" src="../static/organList-image/257785656210656304.png"/>
              <span>{node.label}</span>
            </span>
          );
          } else if (data.isLeaf == 2 || data.isLeaf == 0) {
            return (
              <span>
              <img style="position:relative;bottom: -3px" width="20px" src="../static/organList-image/ewqdewq.png"/>
              <span>{node.label}</span>
            </span>
          );
          }
        },
        //树形控件父级数据加载
        loadNode(node, resolve) {
          console.log(node.data)
          this.node = node.data
          this.removes = resolve
          this.data = [];
          let _this = this;
          this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptlist",{
            object: {
              ParentID: -1
            }
          },{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
          }).then(response => {
            for (let i = 0; i < response.data.objects.length; i++) {
              if (node.level === 0) {
                _this.options.push({
                  label: response.data.objects[i].orgName,
                  value: response.data.objects[i].id + "-" + response.data.objects[i].orgName
                });
                resolve([
                  {
                    label: response.data.objects[i].orgName,
                    key: i,
                    id: response.data.objects[i].id,
                    isLeaf: response.data.objects[i].isLeaf
                  }
                ]);
              }
            }
            let num = Array();
            num.push({
              id: response.data.objects[0].id,
              isLeaf: response.data.objects[0].isLeaf,
              key: 0,
              label: response.data.objects[0].orgName
            });
            if (this.flag) {
              _this.treeClick(num[0]);
              this.flag = false;
            }
            this.treeKey.push(204);
          }).catch(function(error) {
            console.log(error);
          });
          if (node.level >= 1) {
            this.getUser(
              node.data.key,
              node.data.label,
              node.data.id,
              node.data.isLeaf,
              resolve
            );
          }
        },
        HandChange () {
          this.arr = this.value.split('-')
          this.options1 = []
          this.value1 = ''
          this.value2 = ''
          this.value3 = ''
          var that = this
          // 获取顶级，第一级城市beg
          this.$http.post(
            this.GLOBAL.serverSrc + "/org/api/deptlist",
            {
              'order': 'string',
              'object': {
                'isDeleted': 0,
                'parentID': this.arr[0]
              }
            },{
              headers:{
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            }
          )
            .then(function (obj) {
              if(obj.data.objects.length ==0){
                that.bumen2 = false
                that.bumen1 = false
              }
              console.log(obj)
              var i = ''
              for (i = 0; i < obj.data.objects.length; i++) {
                that.options1.push({
                  label: obj.data.objects[i].orgName,
                  value: obj.data.objects[i].id + '-' + obj.data.objects[i].orgName
                })
              }
            })
            .catch(function (obj) {
            })
        },
      /*----------*/
        changstatus(item){
          //默认的值
          var id = this.ruleForm1.domains.indexOf(item)
          var one = this.orilist
          this.orilist = this.ruleForm1.domains[id].value
          this.ruleForm1.domains[id].value = one
        },
        handleItemChange(){
          console.log(13)
        },

        addmaster() {
        /*  console.log(this.value.split("-")[1])
          console.log(this.value1.split("-")[1])
          console.log(this.value2.split("-")[1])
          console.log(this.value3.split("-")[1])
          console.log(this.value4.split("-")[1])
          console.log(this.value4)
            var arr =  Object.values(this.selectedOptions)
            var strb = arr.join("-"); //"aa:bb:cc"
            var wei =this.value8*/
            if(this.hidval== -1){
                /*this.orilist = strb + '-' + wei*/
              this.orilist = this.dname
              this.ppid = this.fID
              this.ruleForm.orderList = this.dname
            }else{
                 this.ruleForm1.domains[this.hidval].value = this.dname
                 this.ruleForm1.domains[this.hidval].id = this.fID
                 this.hidval= -1
            }


          this.dialogFormVisible = false

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
            /* "http://192.168.1.168:6001/org/api/userget",*/
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

              that.orilist = obj.data.object.orgName



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
                    "userState":this.userState,
                    "orgID": this.ppid,
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
      //获取职位
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/positionpage", {
        object: {
          isDeleted: 0
        },
        pageSize: 100,
        pageIndex: 1,
        id: 0
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(function(response) {
        for (let i = 0; i < response.data.objects.length; i++) {
          if (response.data.objects[i].isDeleted !== 1) {
            that.bumen.push({
              value: response.data.objects[i].id,
              label: response.data.objects[i].name
            });
          }
        }
      }).catch(function(error) {
        console.log(error);
      });


      if(this.$route.query.id){
        this.buttonchange = true
        this.buttonsubmit = false
        this.uid = this.$route.query.id
        var that = this
        this.$http.post(
         /* "http://192.168.1.168:6001/org/api/userget",*/
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
          .catch(function (obj) {


          })

      }else{
          this.buttonsubmit = true
          this.buttonchange = false
      }


    },


}
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

</style>

