<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >       <!--ref参数用于标识form名称-->
      <div class="form-class">

        <el-form-item label="模板名称" prop="temp_name">
          <el-input v-model="ruleForm.temp_name" placeholder="请输入模板名称" :disabled="checkboxStatus"></el-input>
        </el-form-item>
        <el-form-item label="模板描述" prop="desc">
          <el-input v-model="ruleForm.desc" placeholder="请输入模板描述" :disabled="checkboxStatus"></el-input>
        </el-form-item>
        <div class="cl_both"></div>
      </div>
      <div class="for-allcheck">
        <el-button type="primary" @click="handleCheckAllChange" style="color: #3095fa;background: white">全选</el-button>
        <el-button type="primary" @click="handleResetChange">重置</el-button>
      </div>
      <table>
        <thead>
        <tr>
          <th width="248">一级功能模块</th>
          <th width="278">二级功能模块</th>
          <th width="340">权限类型</th>
          <th>具体权限</th>
        </tr>
        </thead>
          <tbody v-for="item of list"
          :key="item">
        <tr>

          <td rowspan="9">
            <el-checkbox  :disabled="checkboxStatus">
              账号管理
            </el-checkbox>

          </td>
          <td rowspan="3">
            <el-checkbox>用户管理</el-checkbox>
          </td>
          <td>
            <el-checkbox >只读</el-checkbox>
          </td>
          <td class="table-checkout">
            <el-checkbox >用户列表</el-checkbox>
          </td>
        </tr>
        <tr>
          <td>
            <el-checkbox >编辑</el-checkbox>
          </td>
          <td class="table-checkout">
            <el-checkbox >编辑用户</el-checkbox>
            <el-checkbox >添加用户</el-checkbox>
          </td>

        </tr>
        <tr>
          <td>
            <el-checkbox >操作</el-checkbox>
          </td>
          <td class="table-checkout">
            <el-checkbox >启用</el-checkbox>
            <el-checkbox >停用</el-checkbox>
          </td>
        </tr>
        <tr>
          <td rowspan="3">
            <el-checkbox >组织管理</el-checkbox>
          </td>
          <td>
            <el-checkbox >只读</el-checkbox>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-checkbox >编辑</el-checkbox>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-checkbox >操作</el-checkbox>
          </td>
          <td></td>
        </tr>
        <tr>
          <td rowspan="3">
            <el-checkbox >权限管理</el-checkbox>
          </td>
          <td>
            <el-checkbox >只读</el-checkbox>
          </td>
          <td class="table-checkout">
            <el-checkbox >角色模板列表</el-checkbox>
          </td>
        </tr>
        <tr>
          <td>
            <el-checkbox >编辑</el-checkbox>
          </td>
          <td class="table-checkout">
            <el-checkbox >添加角色模板</el-checkbox>
            <el-checkbox >编辑角色模板</el-checkbox>
            <el-checkbox >停用角色模板</el-checkbox>
          </td>
        </tr>
        <tr>
          <td>
            <el-checkbox >操作</el-checkbox>
          </td>
          <td></td>
        </tr>
        <tr>
          <td rowspan="3">
            <el-checkbox >个人中心</el-checkbox>

          </td>
          <td rowspan="3">
            <el-checkbox >账号设置</el-checkbox>
          </td>
          <td>
            <el-checkbox >只读</el-checkbox>
          </td>
          <td class="table-checkout">
            <el-checkbox >账号信息</el-checkbox>
          </td>
        </tr>
        <tr>
          <td>
            <el-checkbox >编辑</el-checkbox>

          </td>
          <td class="table-checkout">
            <el-checkbox >修改账号信息</el-checkbox>
           <el-checkbox >修改密码</el-checkbox>
          </td>
        </tr>
        <tr>
          <td>
            <el-checkbox >操作</el-checkbox>
          </td>
          <td></td>
        </tr>
        </tbody>
        </table>

    </el-form>
    <el-button type="primary" class="sub_button" style="background: white;color: #3095fa" @click="handleClose()">取消
    </el-button>
    <el-button type="primary" class="sub_button" @click="submitForm('ruleForm')">保存</el-button>
  </div>
</template>

<script>

  export default {
    data(){
      return {
        ruleForm: {
          temp_name: '',
          desc: '',
          count:0,
          state:0
        },
        // 表单验证规则
        rules: {
          temp_name: [
            {required: true, message: '不可为空', trigger: 'blur'},
            {min: 2, max: 6, message: '请输入2-6个汉字', trigger: 'blur'},
            {pattern: /[\u4e00-\u9fa5]/, message: '必须为汉字'}
          ],
          desc: [
            {required: true, message: '不可为空', trigger: 'blur'},
            {min: 2, max: 40, message: '请输入2-40个汉字', trigger: 'blur'},
            {pattern: /[\u4e00-\u9fa5]/, message: '必须为汉字'}
          ],
        },
        apiUrl:this.GLOBAL.serverSrc + "/org/api/roleinsert",
        list: [1],
        checkboxStatus: false     // 当前页表单组是否激活状态
      }
    },
    created() {
      // 如果有参数id，根据id获取该模板的信息
      if (this.$route.query.id) {
        this.apiUrl = this.GLOBAL.serverSrc + "/org/api/rolesave";
        this.getDetail(this.$route.query.id);
      }

    },
    methods: {
      submitForm(formName) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let mes="";
            if(this.$route.query.id){
               mes="修改";
            }else{
               mes="添加";
            }
            this.$http.post(
              this.apiUrl,
              {
                "object": {
                  "id": this.$route.query.id,
                  "isDeleted": 0,
                  "title": this.ruleForm.temp_name,
                  "mark": this.ruleForm.desc,
                  "count": this.ruleForm.count,
                  "state": this.ruleForm.state
                }
              }
            )
              .then(res => {
                  if(res.data.isSuccess==true){
                      this.$message({
                        type: "success",
                        message: mes + "成功"
                      });
                      _this.$router.push({path: '/role'})
                  }   
                }
              )
          }
        })
      },
      handleClose(done) {
        this.$confirm('取消此模板的配置?')
          .then(res => {
            this.$router.push({path: '/role'})
          })
          .catch(res => {

          });
      },
      getDetail: function (id) {
        this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/roleget",
          {
            "id": this.$route.query.id
          }
        )
        .then(res => {
              let data=res.data.object;
              this.ruleForm.temp_name = data.title;
              this.ruleForm.desc = data.mark;
              this.ruleForm.count = data.count;
              this.ruleForm.state = data.state;
        })
      },

      // 全选checkbox部分逻辑
      handleCheckAllChange() {

      },
      // 全不选checkbox部分逻辑
      handleResetChange(){
        //重置表单
        this.$refs["ruleForm"].resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>

  .form-class {
    text-align: left;
    padding-top: 20px;
    padding-left: 95px;
    border-bottom: 1px solid #f2f2f2;
    .el-input {
      width: 158px
    }
    .el-form-item {
      float: left;
    }
  }

  .for-allcheck {
    text-align: left;
    padding: 20px;
  }

  table, table tr th, table tr td {
    border: 0.5px solid #e6e6e6;
  }

  table {
    width: 100%;
    margin: 20px 0 83px 0;
    border-collapse: collapse;
    font-size: 12px;
    th {
      height: 54px;
      color: #999;
    }
    td {
      height: 26px;
    }
  }

  .sub_button {
    width: 142px;
    font-size: 12px;
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
