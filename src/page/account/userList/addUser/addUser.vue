<template>
	<div>
     <div>
        <div class="user-title">用户列表</div>
      </div>
      <div class="tag">
        <el-tabs v-model="activeName" class="form_tag">
          <el-tab-pane label="基本信息" name="first" class="pane-scroll">
             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm ruleForm-abjust">
              <el-button type="success" size="medium" class="begin-button" @click="handleType">启用</el-button>
              <el-button type="danger" size="medium" class="end-button" @click="handleType">停用 </el-button>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="ruleForm.phone"placeholder="请输入手机号" class="from-input"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入2-6位汉字" class="from-input"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="mail">
                <el-input v-model="ruleForm.mail" placeholder="请输入邮箱" class="from-input"></el-input>
              </el-form-item>
              <el-form-item label="员工编号" prop="number">
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
                  <el-radio label="男" class="from-radio"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="用户类型" prop="type">
                <el-radio-group v-model="ruleForm.type" class="form_type">
                  <el-radio label="普通用户" class="from-radio"></el-radio>
                  <el-radio label="管理员"></el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="form_ori">
              <el-form-item label="组织-部门-职务" prop="region">
                <div class="addOri">
                    <el-button type="primary" plain @click="dialogFormVisible = true" v-model="orilist" class="but-left">{{orilist}}</el-button>
                    <div class="button-fun">
                  <el-button type="primary" size="mini" @click="addDomain" >添加</el-button>
                  <el-button type="info" size="mini">默认职位</el-button>
                    </div>
                </div>

            </el-form-item>
            </div>
              <div class="block"
                  v-if="cancel"
                  v-for="(domain, index) in ruleForm1.domains"
                  :key="domain.key"
                  :prop="'domains.' + index + '.value'"
                   v-model="ruleForm1"
              >

                  <el-button type="primary" plain @click="tanchu(domain) " v-model="ruleForm1" class="but-left">{{domain.value}}</el-button>
                  <div class="button-fun">
                 <el-button @<el-button type="danger"  @click.prevent="removeDomain(domain)" size="mini" class="delete-adjust" >删除</el-button>
                 <el-button type="primary" size="mini" class="delete-adjust">设置默认</el-button>
                  </div>

              </div>


              <el-form-item class="button-adjust">
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
                <!--弹出框> <-->
                  <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
                    <div class="qqqt">
                     <el-form ref="form"  label-width="110px">
                       <el-form-item label="部门:" class="form-la">
                         <el-cascader
                            placeholder="试试搜索：指南"
                            :options="casc"
                            separator="-"
                            filterable
                            v-model="selectedOptions"
                          ></el-cascader>
                       </el-form-item>
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
      }
      var checkName = (rule, value, callback) => {
          var myreg=  /^[\u4e00-\u9fa5]{2,6}/;
          if(!value){
            return callback(new Error('姓名不能为空'));
          }
          if (!myreg.test(value)) {
          return callback(new Error('请输入2-6位汉字'));
        }
      }
      var checkMail = (rule, value, callback) => {
          var myreg=  /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
          if(!value){
            return callback(new Error('邮箱不能为空'));
          }
          if (!myreg.test(value)) {
          return callback(new Error('请输入正确的邮箱'));
        }
      }
       var checkTrail = (rule, value, callback) => {
          if(!value){
            return callback(new Error('员工编号不能为空'));
          }
      }
      var checkRegion = (rule, value, callback) => {
          if(!value){
            return callback(new Error('请选择一个组织'));
          }
      }

      return {
          hidval:"-1",
        selectedOptions: [],
        orilist: '甜程旅行网-财务部-经理',
        ruleForm1: {
          domains: [{
            value: '请点击添加'
          }],
        },
         bumen: [{
          value: '经理1',
          label: '经理1'
        }, {
          value: '经理2',
          label: '经理2'
        }, {
          value: '经理3',
          label: '经理3'
        }, {
          value: '经理4',
          label: '经理4'
        }, {
          value: '经理5',
          label: '经理5'
        }],
        value8: ''
        ,
        dialogFormVisible: false,
        cancel:false,
        activeName: 'first',
        ruleForm: {
          phone: '',
          name: '',
          mail: '',
          number:'',
          idcard:'',
          trailid:'',
          sex:'男',
          type:'普通用户',
          region:'',
          domains: [{
            value: ''
          }],
        },
        rules: {
           phone: [
            {required: true, validator: checkPhone, trigger: 'blur' }
          ],
          name: [
            { required: true,validator: checkName, trigger: 'blur' }
          ],
          mail: [
            { required: true,validator: checkMail, trigger: 'blur' }
          ],
          number: [
            { required: true,validator: checkTrail, trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择用户类型', trigger: 'change' }
          ],
          region: [
            { required: true, validator: checkRegion, trigger: 'change' }
          ],
        },

        casc: [{
          value: '甜程旅行网',
          label: '甜程旅行网',
          children: [{
            value: '销售部',
            label: '销售部',
            children: [{
              value: '销售',
              label: '销售'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: '辽宁大运通',
          label: '辽宁大运通',
          children: [{
            value: '财务部',
            label: '财务部'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }]
      }

    },
      methods: {
        addmaster() {

            var arr =  Object.values(this.selectedOptions)
            var strb = arr.join("-"); //"aa:bb:cc"
            var wei =this.value8
            if(this.hidval== -1){
                this.orilist = strb + '-' + wei
            }else{
                this.ruleForm1.domains[this.hidval].value = strb + '-' + wei
                this.hidval= -1
            }


          this.dialogFormVisible = false

        },
        tanchu(item) {
            var index = this.ruleForm1.domains.indexOf(item)
            this.hidval = index
           this.dialogFormVisible = true
        },
      handleType() {
        this.$confirm('您确定启用/停用该用户么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: (action, instance) => {
             if (action === 'confirm') {
              this.$message({
            type: 'success',
            message: '操作成功!'
             })
            setTimeout(() => {
                  this.$router.push({path: "/"});
                }, 2000);
             }
        }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
    }

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
    margin-left: 23px;
  }
  .from-input{
    width: 180px;
    margin-left: -180px;
  }
  .from-radio{
    margin-left: -200px;
  }

  .form_type{
    margin-left: 61px;
  }
  .pane-scroll{
    overflow: auto;
  }
  .button-adjust{
    margin-left: -190px;
    margin-top: 50px;
  }
  .ruleForm-abjust{
    height: 800px;
    width: 521px;
  }
  .block{
      width: 393px;
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
    margin-left: -50px;
    margin-top: 38px;
    position: relative;
    top: -27px;
  }
  .end-button{
    margin-left: 21px;
    position: relative;
    top: -27px
  }
  .addOri{
      font-size: 14px;
      width: 403px;
      height: 50px;
  }
    .button-fun{
        float:right;
    }
    .but-left{
        float:left;
    }

</style>

