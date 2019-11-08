<template>
  <div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
       <div class="permission-roel">
         <el-form-item label="选择已有角色模板：" prop="type">
           <el-select v-model="value4" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                class="permission-roel">
              </el-option>
           </el-select>
          </el-form-item>
        </div>
    </el-form>
    <table class="all-size">
      <thead>
        <tr>
          <th colspan="4" class="table-button">
            <el-button type="primary" size="mini" class="table-bt" @click="handleallClick">全选</el-button>
            <el-button type="primary" size="mini" @click="handleallCancleClick">重置</el-button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="table-button">
          <td class="table-title">一级功能模块</td>
          <td class="table-title">二级功能模块</td>
          <td class="table-title">权限类型</td>
          <td class="table-permiss">具体权限</td>
        </tr>
        <tr class="table-content">
          <td rowspan="9"><el-checkbox v-model="isChecked">账号管理</el-checkbox>

          </td>
          <td rowspan="3"><el-checkbox v-model="isChecked">用户管理</el-checkbox></td>
          <td><el-checkbox v-model="isChecked" >只读</el-checkbox></td>
          <td class="table-checkout"><el-checkbox v-model="isChecked" >用户列表</el-checkbox></td>
        </tr>
        <tr class="table-content">
          <td ><el-checkbox v-model="isChecked">编辑</el-checkbox></td>
          <td class="table-checkout"><el-checkbox v-model="isChecked">编辑用户</el-checkbox>
              <el-checkbox  v-model="isChecked">添加用户</el-checkbox>
          </td>

        </tr>
        <tr class="table-content">
          <td><el-checkbox v-model="isChecked">操作</el-checkbox></td>
         <td class="table-checkout">
          <el-checkbox v-model="isChecked">启用</el-checkbox>
          <el-checkbox v-model="isChecked">停用</el-checkbox>
        </td>
        </tr>
        <tr class="table-content">
          <td rowspan="3"><el-checkbox v-model="isChecked">组织管理</el-checkbox></td>
         <td><el-checkbox v-model="isChecked">只读</el-checkbox></td>
         <td></td>
        </tr>
         <tr class="table-content">
          <td><el-checkbox v-model="isChecked">编辑</el-checkbox></td>
         <td></td>
        </tr>
         <tr class="table-content">
          <td><el-checkbox v-model="isChecked">操作</el-checkbox></td>
         <td></td>
        </tr>
        <tr class="table-content">
          <td rowspan="3"><el-checkbox v-model="isChecked">权限管理</el-checkbox></td>
         <td><el-checkbox v-model="isChecked">只读</el-checkbox></td>
         <td class="table-checkout"><el-checkbox v-model="isChecked">角色模板列表</el-checkbox></td>
        </tr>
        <tr class="table-content">
          <td><el-checkbox v-model="isChecked">编辑</el-checkbox></td>
         <td class="table-checkout">
          <el-checkbox v-model="isChecked">添加角色模板</el-checkbox>
          <el-checkbox  v-model="isChecked">编辑角色模板</el-checkbox>
          <el-checkbox  v-model="isChecked">停用角色模板</el-checkbox>
         </td>
        </tr>
        <tr class="table-content">
          <td><el-checkbox v-model="isChecked">操作</el-checkbox></td>
         <td></td>
        </tr>
       <tr class="table-content">
          <td rowspan="3"><el-checkbox v-model="isChecked">个人中心</el-checkbox></td>
          <td rowspan="3"><el-checkbox v-model="isChecked">账号设置</el-checkbox></td>
          <td><el-checkbox v-model="isChecked">只读</el-checkbox></td>
          <td class="table-checkout"><el-checkbox v-model="isChecked">账号信息</el-checkbox></td>
        </tr>
        <tr class="table-content">
          <td><el-checkbox v-model="isChecked">编辑</el-checkbox></td>
         <td class="table-checkout">
          <el-checkbox v-model="isChecked">修改账号信息</el-checkbox>
          <el-checkbox v-model="isChecked">修改密码</el-checkbox></td>
        </tr>
        <tr class="table-content">
          <td><el-checkbox v-model="isChecked">操作</el-checkbox></td>
         <td></td>
        </tr>
      </tbody>
    </table>
    <div class="button-submit">
      <el-button type="primary" @click="handleCancel">取消</el-button>
      <el-button  type="primary" @click="handleSubmit">成功</el-button>
    </div>

  </div>
</template>

<script>
  export default {
   name: 'Permission',
   data () {
      return {
        isChecked:false,
        ruleForm: {
            type: '',
          },
      options: [{
          value: '1',
          label: '管理员'
        }, {
          value: '2',
          label: '销售'
        }],
        value4: '',

      }
   },
   methods: {
     handleallCancleClick(){
       this.isChecked = false
     },
     handleallClick(){
        this.isChecked = true
     },
       handleCancel() {
        this.$confirm('取消此用户的权限配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: (action, instance) => {
             if (action === 'confirm') {
               this.$router.push({path: "/userlist/adduser?id="+this.$route.query.id});
             }
        }
        })
      },
      handleSubmit() {
          this.$message({
          message: '保存成功',
          type: 'success'
        });
          setTimeout(() => {
            this.$router.push({path: "/userlist/adduser?id="+this.$route.query.id});
          },1000);

      }
   }
}



</script>

<style scoped>
 .permission-roel{
    width: 300px;
 }
 .all-button{
  z-index: 99;
 }
 .all-table{
  display: block;
  z-index: 1;
 }
 .table-button{
  background-color:#D7D7D7;
 }
 .table-bt{
  margin-left: -550px;
 }
 .table-content{
    background-color: #F2F2F2;
 }
 .table-title{
  font-size: 15px;
  width: 100px;
  height: 40px;
 }
 .all-size{
  font-size: 10px;
 }
 .table-permiss{
  width: 300px
 }
 .button-submit{
  margin-top: 20px;
    float: left;
    margin-left: 250px;
 }
 .table-checkout{
  text-align: left;
 }


</style>

