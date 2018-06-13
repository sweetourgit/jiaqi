<template>
  <div>
    <div class="form-class">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        :status-icon="true"
        >       <!--ref参数用于标识form名称-->
        <el-form-item label="模板名称" prop="temp_name">
          <el-input v-model="ruleForm.temp_name" placeholder="请输入模板名称" clearable :disabled="checkboxStatus"></el-input>
        </el-form-item>
        <el-form-item label="模板描述" prop="desc">
          <el-input v-model="ruleForm.desc" placeholder="请输入模板描述" clearable :disabled="checkboxStatus"></el-input>
        </el-form-item>
        <div class="cl_both"></div>
      </el-form>
    </div>
    <div class="for-allcheck">
      <el-button type="primary" @click="handleCheckAllChange" style="color: #3095fa;background: white">全选</el-button>
      <el-button type="primary" @click="handleResetChange">重置</el-button>
    </div>
    <table class="all-size">
      <thead>
      <tr class="table-button">
        <td class="table-title">一级功能模块</td>
        <td class="table-title">二级功能模块</td>
        <td class="table-title">权限类型</td>
        <td class="table-permiss">具体权限</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-content">
        <td rowspan="9">
          <!--<el-checkbox v-model="roleList[0].accountManager.checked" :disabled="checkboxStatus">-->
            <!--账号管理-->
          <!--</el-checkbox>-->
          <input type="checkbox" value="账号管理" v-model="isChecked" :disabled="checkboxStatus" />账号管理
        </td>
        <td rowspan="3">
          <!--<el-checkbox v-model="isChecked" :disabled="checkboxStatus">用户管理</el-checkbox>-->
          <input type="checkbox" value="用户管理" v-model="isChecked" :disabled="checkboxStatus" />用户管理
        </td>
        <td>
          <!--<el-checkbox v-model="isChecked">只读</el-checkbox>-->
          <input type="checkbox" value="只读" v-model="isChecked" :disabled="checkboxStatus" />只读
        </td>
        <td class="table-checkout">
          <!--<el-checkbox v-model="isChecked" value="用户列表">用户列表</el-checkbox>-->
          <input type="checkbox" value="用户列表" v-model="isChecked" :disabled="checkboxStatus" />用户列表
        </td>
      </tr>
      <tr class="table-content">
        <td>
          <!--<el-checkbox v-model="isChecked">编辑</el-checkbox>-->
          <input type="checkbox" value="编辑" v-model="isChecked" :disabled="checkboxStatus"/>编辑
        </td>
        <td class="table-checkout">
          <!--<el-checkbox v-model="isChecked">编辑用户</el-checkbox>-->
          <!--<el-checkbox v-model="isChecked">添加用户</el-checkbox>-->
          <input type="checkbox" value="编辑用户" v-model="isChecked" :disabled="checkboxStatus" />编辑用户
          <input type="checkbox" value="添加用户" v-model="isChecked" :disabled="checkboxStatus" />添加用户
        </td>

      </tr>
      <tr class="table-content">
        <td>
          <!--<el-checkbox v-model="isChecked">操作</el-checkbox>-->
          <input type="checkbox" value="操作" v-model="isChecked" :disabled="checkboxStatus" />操作
        </td>
        <td class="table-checkout">
          <!--<el-checkbox v-model="isChecked">启用</el-checkbox>-->
          <!--<el-checkbox v-model="isChecked">停用</el-checkbox>-->
          <input type="checkbox" value="启用" v-model="isChecked" :disabled="checkboxStatus" />启用
          <input type="checkbox" value="停用" v-model="isChecked" :disabled="checkboxStatus" />停用
        </td>
      </tr>
      <tr class="table-content">
        <td rowspan="3">
          <!--<el-checkbox v-model="isChecked">组织管理</el-checkbox>-->
          <input type="checkbox" value="组织管理" v-model="isChecked" :disabled="checkboxStatus" />组织管理
        </td>
        <td>
          <!--<el-checkbox v-model="isChecked">只读</el-checkbox>-->
          <input type="checkbox" value="只读" v-model="isChecked" :disabled="checkboxStatus" />只读
        </td>
        <td></td>
      </tr>
      <tr class="table-content">
        <td>
          <!--<el-checkbox v-model="isChecked">编辑</el-checkbox>-->
          <input type="checkbox" value="编辑" v-model="isChecked" :disabled="checkboxStatus" />编辑
        </td>
        <td></td>
      </tr>
      <tr class="table-content">
        <td>
          <!--<el-checkbox v-model="isChecked">操作</el-checkbox>-->
          <input type="checkbox" value="操作" v-model="isChecked" :disabled="checkboxStatus" />操作
        </td>
        <td></td>
      </tr>
      <tr class="table-content">
        <td rowspan="3">
          <!--<el-checkbox v-model="isChecked">权限管理</el-checkbox>-->
          <input type="checkbox" value="权限管理" v-model="isChecked" :disabled="checkboxStatus" />权限管理
        </td>
        <td>
          <!--<el-checkbox v-model="isChecked">只读</el-checkbox>-->
          <input type="checkbox" value="只读" v-model="isChecked" :disabled="checkboxStatus" />只读
        </td>
        <td class="table-checkout">
          <!--<el-checkbox v-model="isChecked">角色模板列表</el-checkbox>-->
          <input type="checkbox" value="角色模板列表" v-model="isChecked" :disabled="checkboxStatus" />角色模板列表
        </td>
      </tr>
      <tr class="table-content">
        <td>
          <!--<el-checkbox v-model="isChecked">编辑</el-checkbox>-->
          <input type="checkbox" value="编辑" v-model="isChecked" :disabled="checkboxStatus" />编辑
        </td>
        <td class="table-checkout">
          <!--<el-checkbox v-model="isChecked">添加角色模板</el-checkbox>-->
          <!--<el-checkbox v-model="isChecked">编辑角色模板</el-checkbox>-->
          <!--<el-checkbox v-model="isChecked">停用角色模板</el-checkbox>-->
          <input type="checkbox" value="角色模板列表" v-model="isChecked" :disabled="checkboxStatus" />添加角色模板
          <input type="checkbox" value="编辑角色模板" v-model="isChecked" :disabled="checkboxStatus" />编辑角色模板
          <input type="checkbox" value="停用角色模板" v-model="isChecked" :disabled="checkboxStatus" />停用角色模板
        </td>
      </tr>
      <tr class="table-content">
        <td>
          <!--<el-checkbox v-model="isChecked">操作</el-checkbox>-->
          <input type="checkbox" value="操作" v-model="isChecked" :disabled="checkboxStatus" />操作
        </td>
        <td></td>
      </tr>
      <tr class="table-content">
        <td rowspan="3">
          <!--<el-checkbox v-model="roleList[1].personCenter.checked">个人中心</el-checkbox>-->
          <input type="checkbox" value="个人中心" v-model="isChecked" :disabled="checkboxStatus" />个人中心
        </td>
        <td rowspan="3">
          <!--<el-checkbox v-model="isChecked">账号设置</el-checkbox>-->
          <input type="checkbox" value="账号设置" v-model="isChecked" :disabled="checkboxStatus" />账号设置
        </td>
        <td>
          <!--<el-checkbox v-model="isChecked">只读</el-checkbox>-->
          <input type="checkbox" value="只读" v-model="isChecked" :disabled="checkboxStatus" />只读
        </td>
        <td class="table-checkout">
          <!--<el-checkbox v-model="isChecked">账号信息</el-checkbox>-->
          <input type="checkbox" value="账号信息" v-model="isChecked" :disabled="checkboxStatus" />账号信息
        </td>
      </tr>
      <tr class="table-content">
        <td>
          <!--<el-checkbox v-model="isChecked">编辑</el-checkbox>-->
          <input type="checkbox" value="编辑" v-model="isChecked" :disabled="checkboxStatus" />编辑
        </td>
        <td class="table-checkout">
          <!--<el-checkbox v-model="isChecked">修改账号信息</el-checkbox>-->
          <!--<el-checkbox v-model="isChecked">修改密码</el-checkbox>-->
          <input type="checkbox" value="修改账号信息" v-model="isChecked" :disabled="checkboxStatus" />修改账号信息
          <input type="checkbox" value="修改密码" v-model="isChecked" :disabled="checkboxStatus" />修改密码
        </td>
      </tr>
      <tr class="table-content">
        <td>
          <!--<el-checkbox v-model="isChecked">操作</el-checkbox>-->
          <input type="checkbox" value="操作" v-model="isChecked" :disabled="checkboxStatus" />操作
        </td>
        <td></td>
      </tr>

      </tbody>
    </table>
    <el-button type="primary" class="sub_button" style="background: white;color: #3095fa" @click="handleClose()">取消</el-button>
    <el-button type="primary" class="sub_button" @click="submitForm('ruleForm')">保存</el-button>
  </div>
</template>

<script>

  export default {
    name: "addRole",
    data: function () {

      // 自定义验证方法
      var validateTempName = (rule, value, callback) => {

        // 模拟请求 判断名称是否重复
        this.$http.get(
          "/static/data.json",
        )
          .then(function (obj) {
            console.log(obj)
            if (obj.data.temp_name == value) {
              callback('模板名重复')
            }
          })
          .catch(function (response) {
            console.log(response);
          });
      };
      return {
        input: '',
        ruleForm: {
          temp_name: '',
          desc: ''
        },
        isChecked: [],
        // 表单验证规则
        rules: {
          temp_name: [
            {required: true, message: '不可为空', trigger: 'blur'},
            {min: 2, max: 6, message: '字数超限', trigger: 'blur'},
            {validator: validateTempName, trigger: 'blur'},
          ],
          desc: [
            {required: true, message: '不可为空', trigger: 'blur'},
            {min: 2, max: 40, message: '字数超限', trigger: 'blur'}

          ],
        },

        roleList: {},
        checkboxStatus: false     // 当前页表单组是否激活状态
      }
    },
    created() {
      if (this.$route.query.type == 'view') {
        this.checkboxStatus = true
      }
      // 根据id获取该模板的信息
      this.getDetail()

      // 模拟获取权限json数组
      this.$http.get(
        "/static/data.json"
      ).then(
        obj => {
          console.log(obj.data.roleList)
          this.roleList = obj.data.roleList
        }
      )
    },
    watch: {

    },
    methods: {
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
      resetForm: function (formName) {
        this.$refs[formName].resetFields();
      },
      handleClose(done) {
        this.$confirm('取消此模板的配置?')
          .then(_ => {
            this.$router.push({path: '/role'})
          })
          .catch(_ => {

          });
      },

      getDetail: function () {
        //todo 读取接口信息
      },

      // 全选checkbox部分逻辑
      handleCheckAllChange() {
        this.isChecked = [
          '用户管理',
          '账号管理',
          '组织管理',
          '权限管理',
          '用户列表',
          '编辑用户',
          '添加用户',
          '停用',
          '启用',
          '角色模板列表',
          '添加角色模板',
          '编辑角色模板',
          '停用角色模板',
          '账号信息',
          '修改账号信息',
          '修改密码',
          '个人中心',
          '账号设置',
          '只读',
          '编辑',
          '操作',
        ]
      },
      // 全不选checkbox部分逻辑
      handleResetChange() {
        this.isChecked = []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .top_tip {
    border-left: 5px solid grey;
    text-align: left;
    padding-left: 5px;
    font-size: 15px;
    margin-bottom: 15px;
  }

  .el-form-item {
    float: left;
  }
  .form-class {
    text-align: left;
    padding-top: 20px;
    padding-left: 95px;
    border-bottom: 1px solid #f2f2f2;
    .el-input {
      width: 158px
    }
  }

  .for-allcheck {

    text-align: left;
    padding: 20px;
  }

  .permission-roel {
    width: 300px;
  }

  .all-button {
    z-index: 99;
  }

  .all-table {
    display: block;
    z-index: 1;
  }

  .sub_button {
    width: 142px;
    font-size: 12px;
  }
  .table-button {
    background-color: #D7D7D7;
  }

  .table-content {
    background-color: #F2F2F2;
  }

  .table-title {
    font-size: 15px;
    width: 100px;
    height: 40px;
  }

  .all-size {
    font-size: 10px;
    width: 100%;
    margin-bottom: 83px;
  }

  .table-permiss {
    width: 300px
  }

  .button-submit {
    margin-top: 20px;
  }

  .table-checkout {
    text-align: left;
  }
  .cl_both {
    clear: both;
  }
</style>
