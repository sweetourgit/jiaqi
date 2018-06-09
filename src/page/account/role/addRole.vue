<template>
  <div style="width: 800px">
    <div class="top_tip">添加角色权限模板</div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-position="left"
      :status-icon="true"
      class="form-class">       <!--ref参数用于标识form名称-->
      <el-form-item label="模板名称" prop="temp_name" inline-message="true">
        <el-input v-model="ruleForm.temp_name" placeholder="请输入模板名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="模板描述" prop="desc" inline-message="true">
        <el-input v-model="ruleForm.desc" placeholder="请输入模板描述" clearable></el-input>
      </el-form-item>
    </el-form>

    <div class="for-allcheck">
      <el-button type="primary" size="mini">全选</el-button>
      <el-button type="primary" size="mini">重置</el-button>
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
          <el-checkbox v-model="userCheckedAll" @change="handleCheckAllChange" :indeterminate="indeterminate">
            账号管理
          </el-checkbox>
        </td>
        <td rowspan="3">
          <el-checkbox @change="handleSonChange">用户管理</el-checkbox>
        </td>
        <td>
          <el-checkbox>只读</el-checkbox>
        </td>
        <td class="table-checkout">
          <el-checkbox>用户列表</el-checkbox>
        </td>
      </tr>
      <tr class="table-content">
        <td>
          <el-checkbox>编辑</el-checkbox>
        </td>
        <td class="table-checkout">
          <el-checkbox>编辑用户</el-checkbox>
          <el-checkbox>添加用户</el-checkbox>
        </td>

      </tr>
      <tr class="table-content">
        <td>
          <el-checkbox>操作</el-checkbox>
        </td>
        <td class="table-checkout">
          <el-checkbox>启用</el-checkbox>
          <el-checkbox>停用</el-checkbox>
        </td>
      </tr>
      <tr class="table-content">
        <td rowspan="3">
          <el-checkbox @change="handleSonChange">组织管理</el-checkbox>
        </td>
        <td>
          <el-checkbox>只读</el-checkbox>
        </td>
        <td></td>
      </tr>
      <tr class="table-content">
        <td>
          <el-checkbox>编辑</el-checkbox>
        </td>
        <td></td>
      </tr>
      <tr class="table-content">
        <td>
          <el-checkbox>操作</el-checkbox>
        </td>
        <td></td>
      </tr>
      <tr class="table-content">
        <td rowspan="3">
          <el-checkbox @change="handleSonChange">权限管理</el-checkbox>
        </td>
        <td>
          <el-checkbox>只读</el-checkbox>
        </td>
        <td class="table-checkout">
          <el-checkbox>角色模板列表</el-checkbox>
        </td>
      </tr>
      <tr class="table-content">
        <td>
          <el-checkbox>编辑</el-checkbox>
        </td>
        <td class="table-checkout">
          <el-checkbox>添加角色模板</el-checkbox>
          <el-checkbox>编辑角色模板</el-checkbox>
          <el-checkbox>停用角色模板</el-checkbox>
        </td>
      </tr>
      <tr class="table-content">
        <td>
          <el-checkbox>操作</el-checkbox>
        </td>
        <td></td>
      </tr>
      <tr class="table-content">
        <td rowspan="3">
          <el-checkbox>个人中心</el-checkbox>
        </td>
        <td rowspan="3">
          <el-checkbox>账号设置</el-checkbox>
        </td>
        <td>
          <el-checkbox>只读</el-checkbox>
        </td>
        <td class="table-checkout">
          <el-checkbox>账号信息</el-checkbox>
        </td>
      </tr>
      <tr class="table-content">
        <td>
          <el-checkbox>编辑</el-checkbox>
        </td>
        <td class="table-checkout">
          <el-checkbox>修改账号信息</el-checkbox>
          <el-checkbox>修改密码</el-checkbox>
        </td>
      </tr>
      <tr class="table-content">
        <td>
          <el-checkbox>操作</el-checkbox>
        </td>
        <td></td>
      </tr>
      </tbody>
    </table>
    <el-button type="primary" class="sub_button" @click="handleClose()">取消</el-button>
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
        userCheckedAll: false,
        indeterminate: false,       // 半选择状态
        checkedItems: []
      }
    },
    created() {
      // 实例创建判断是否为编辑 存在id为编辑 不存在为新增

      // 根据id获取该模板的信息
      this.getDetail()
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
      handleCheckAllChange(val) {
        this.checkedItems = val ? Items : [];
        this.indeterminate = false      // 将不确定属性移除
      },

      handleSonChange(value) {

        if (value) {
          this.checkedItems.push(1)
        } else {
          this.checkedItems.pop()
        }

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

  .form-class {
    width: 300px
  }

  .for-allcheck {
    background: #D7D7D7;
    border: 2px solid #fff;
    text-align: left;
    margin-bottom: -5px;
    padding: 5px;
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
    margin-bottom: 20px;
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
</style>
