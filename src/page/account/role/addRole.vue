<template>
  <div>
    <!--{{this.$route.query['id']}}    // 获取到的角色模板ID-->
    <div class="top_tip">添加角色权限模板</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">       <!--ref参数用于标识form名称-->
      <el-form-item label="模板名称" prop="temp_name">
        <el-input v-model="ruleForm.temp_name" placeholder="请输入模板名称" clearable class="temp_input"></el-input>
      </el-form-item>
      <el-form-item label="模板描述" prop="desc">
        <el-input v-model="ruleForm.desc" placeholder="请输入模板描述" clearable class="temp_input"></el-input>
      </el-form-item>
    </el-form>

    <hr>
    <el-button type="primary" size="small" >全选</el-button>
    <el-button type="primary" size="small" >重置</el-button>

    <el-button type="primary" class="sub_button" @click="handleClose()">取消</el-button>
    <el-button type="primary" class="sub_button" @click="submitForm('ruleForm')">保存</el-button>
  </div>
</template>

<script>
  export default {
    name: "addRole",
    data: function () {
      // 自定义验证方法
      var validateName = (rule, value, callback) => {

        // 模拟请求 判断名称是否重复
        this.$http.get(
          "/static/data.json",
        )
        .then(function (obj) {
          console.log(obj)
          if (obj.data.temp_name == value){
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
            { min: 2, max: 6, message: '字数超限', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' },
          ],
          desc: [
            {required: true, message: '不可为空', trigger: 'blur'},
            { min: 2, max: 40, message: '字数超限', trigger: 'blur' }

          ],

        }
      }
    },
    created(){
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
            this.$router.push({path:'/role'})
          })
          .catch(_ => {

          });
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      getDetail: function () {
        console.log('读取模板信息')
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
  .temp_input {
    float: left;
    width: 160px !important;
  }
</style>
