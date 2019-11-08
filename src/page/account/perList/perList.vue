<template>
  <div class="per-list">
    <!-- <el-button @click="test">添加模块</el-button> -->
    <table style="width: 100%">
      <thead>
      <tr>
        <th style="background: rgb(247, 247, 247);" width="248">模块</th>
        <th style="background: rgb(247, 247, 247);" width="278">菜单</th>
        <th style="background: rgb(247, 247, 247);" width="340">权限类型</th>
        <th style="background: rgb(247, 247, 247);" width="720">具体权限</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td rowspan="9" class="title_p">
          账号管理
          <span class="butts">
            <i class="el-icon-edit" @click="dialogAddRole = true"></i>
            <i class="el-icon-delete" @click="deleteRole"></i>
            <i class="el-icon-circle-plus-outline" @click="dialogAddRole = true"></i>
          </span>
        </td>
        <td rowspan="3" class="title_p">
          用户管理
          <span class="butts">
            <i class="el-icon-edit" @click="dialogAddRole = true"></i>
            <i class="el-icon-delete" @click="deleteRole"></i>
            <i class="el-icon-circle-plus-outline" @click="dialogAddRole = true"></i>
          </span>
        </td>
        <td>只读</td>
        <td class="table-checkout">
          <span class="title_s">01.用户列表
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
            </span>
        </td>
      </tr>
      <tr>
        <td>编辑</td>
        <td class="table-checkout">
          <span class="title_s">01.编辑用户
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
            <span class="title_s">02.添加用户
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
            </span>
            </span>
        </td>
      </tr>
      <tr>
        <td>操作</td>
        <td class="table-checkout">
          <span class="title_s">01.启用
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
          </span>
          <span class="title_s">02.停用
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
          </span>
        </td>
      </tr>
      <tr>
        <td rowspan="3" class="title_p">组织管理
          <span class="butts">
            <i class="el-icon-edit" @click="dialogAddRole = true"></i>
            <i class="el-icon-delete" @click="deleteRole"></i>
            <i class="el-icon-circle-plus-outline" @click="dialogAddRole = true"></i>
          </span>
        </td>
        <td>只读</td>
        <td></td>
      </tr>
      <tr>
        <td>编辑</td>
        <td></td>
      </tr>
      <tr>
        <td>操作</td>
        <td></td>
      </tr>
      <tr>
        <td rowspan="3" class="title_p">权限管理
          <span class="butts">
            <i class="el-icon-edit" @click="dialogAddRole = true"></i>
            <i class="el-icon-delete" @click="deleteRole"></i>
            <i class="el-icon-circle-plus-outline" @click="dialogAddRole = true"></i>
          </span>
        </td>
        <td>只读</td>
        <td class="table-checkout">
          <span class="title_s">01.角色模板列表
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
          </span>
        </td>
      </tr>
      <tr>
        <td>编辑</td>
        <td class="table-checkout">
          <span class="title_s">01.添加角色模板
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
          </span>
          <span class="title_s">02.编辑角色模板
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
          </span>
          <span class="title_s">03.停用角色模板
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
          </span>
        </td>
      </tr>
      <tr>
        <td>操作</td>
        <td></td>
      </tr>
      <tr>
        <td rowspan="3" class="title_p">个人中心
          <span class="butts">
            <i class="el-icon-edit" @click="dialogAddRole = true"></i>
            <i class="el-icon-delete" @click="deleteRole"></i>
            <i class="el-icon-circle-plus-outline" @click="dialogAddRole = true"></i>
          </span>
        </td>
        <td rowspan="3" class="title_p">账号设置
          <span class="butts">
            <i class="el-icon-edit" @click="dialogAddRole = true"></i>
            <i class="el-icon-delete" @click="deleteRole"></i>
            <i class="el-icon-circle-plus-outline" @click="dialogAddRole = true"></i>
          </span>
        </td>
        <td>只读</td>
        <td class="table-checkout">
          <span class="title_s">01.账号信息
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
          </span>
        </td>
      </tr>
      <tr>
        <td>编辑</td>
        <td class="table-checkout">
          <span class="title_s">01.修改账号信息
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
          </span>
          <span class="title_s">02.修改密码
              <span class="butts">
                <i class="el-icon-edit" @click="dialogAddRole = true"></i>
                <i class="el-icon-delete" @click="deleteRole"></i>
              </span>
          </span>
        </td>
      </tr>
      <tr>
        <td>操作</td>
        <td></td>
      </tr>
      </tbody>
    </table>
    <!--添加权限对话框-->
    <el-dialog :visible.sync="dialogAddRole" style="text-align: left" width="30%" :center="true" :lockScroll="false"
               :close-on-click-modal="false">
      <el-form :model="form" ref="myform" :rules="rules">
        <el-form-item label="名称：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="说明：" :label-width="formLabelWidth" prop="desc">
          <el-input v-model="form.desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级权限：" :label-width="formLabelWidth" prop="">
          <el-input v-model="form.f_role" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="关联ID：" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作URL：" :label-width="formLabelWidth">
          <el-input v-model="form.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth">
          <el-input v-model="form.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.type">
            <el-radio label="查看"></el-radio>
            <el-radio label="编辑"></el-radio>
            <el-radio label="操作"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('myform')">保存</el-button>
        <el-button @click="dialogAddRole = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--添加权限对话框-->
  </div>
</template>

<script>

  export default {
    name: "perList",
    data: function () {

      // 自定义验证方法
      var validateName = (rule, value, callback) => {

        if (!value) {
          return callback(new Error('不可为空'));
        }
        if (value.length < 2 || value.length > 10) {
          return callback(new Error('字数超限'));
        }
        // 模拟请求 判断名称是否重复
        this.$http.get(
          "/static/data.json",
        )
          .then(function (obj) {
            console.log(obj)
            if (obj.data.name == value) {
              callback('名称重复')
            }
          })
          .catch(function (response) {
            console.log(response);
          });
      };

      return {
        dialogAddRole: false,
        form: {
          name: '',
          f_role: 0,
          type: '查看',
          id: 0,
          desc: '',
          sort: 0,
          url: ''
        },
        formLabelWidth: '120px',
        // 表单验证规则
        rules: {
          name: [
            {required: true, validator: validateName, trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 测试添加权限
      test: function() {
        this.$http.post(
          "http://api.dayuntong.com:3009/api/insertrole",
          this.qs.stringify(
            {
              "Id": 103,
              "Object": {
                "ID": 15,
                "CreateTime": "2017-06-01 20:23:00",
                "IsDeleted": 0,
                "Code": "",
                "Title": "财务用户",
                "Mark": "很多备注",
                "Count": 172,
                "State": 2
              }
            }
          )
        )
          .then(function (obj) {
            console.log(obj)
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      // 删除权限
      deleteRole() {
        this.$confirm('是否删除该权限?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          lockScroll: false
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
        });
      },

      // 显示操作按钮
      shoubuttons: function(){
        console.log()
      },
      // 提交表单事件
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
            // 关闭dialog
            this.dialogAddRole = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .per-list {
    padding: 20px;
    text-align: left;
    .top_tip {
      border-left: 5px solid grey;
      text-align: left;
      padding-left: 5px;
      font-size: 15px;
      margin-bottom: 15px;
    }
    table,table tr th, table tr td { border:0.5px solid #e6e6e6; }
    table {
      text-align: center;
      margin-top: 20px;
      border-collapse: collapse;
      font-size: 14px;
      thead {
        th {
          height: 54px;
          color: #999;
        }
      }
      tbody {
        .table-checkout li {
          margin-right: 50px;
        }
        td.title_p {
          .butts {
            display: none;
          }
        }

        td.title_p:hover {
          position: relative;
          left: 27px;
          .butts {
            display: inline;
          }
        }

        span.title_s {
          text-align: left;
          height: 35px;
          width: 150px;
          text-align: left;
          .butts {
            display: none;
          }
        }

        td {
          height: 26px;
          color: #666;
        }

        .table-checkout {
          text-align: left;
          padding-left: 25px;
        }
        span.title_s:hover {
          position: relative;
          .butts {
            display: inline;
          }
        }
      }
    }
  }

</style>
