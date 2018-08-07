<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标签" style="float:left">
            <el-input size='small' style="width:200px" v-model="form.name"></el-input>
            <el-button size='small' type='primary'>添加</el-button>
               <el-checkbox-group v-model="first">
          <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
        </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
           <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标签" style="float:left">
            <el-input size='small' style="width:200px" v-model="form.name"></el-input>
            <el-button size='small' type='primary'>添加</el-button>
               <el-checkbox-group v-model="first">
          <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
        </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="third">
           <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标签" style="float:left">
            <el-input size='small' style="width:200px" v-model="form.name"></el-input>
            <el-button size='small' type='primary'>添加</el-button>
               <el-checkbox-group v-model="first">
          <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
        </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">
           <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标签" style="float:left">
            <el-input size='small' style="width:200px" v-model="form.name"></el-input>
            <el-button size='small' type='primary'>添加</el-button>
               <el-checkbox-group v-model="first">
          <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
        </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>

    </el-tabs>
      
     
      <el-button
        style="margin-left:150px"
       >
        取消
       </el-button>
       <el-button
        type="primary" 
       >
        确认
       </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return{
      form:{

      },
      activeName: 'first',
      first:[]
    }
  }
};
</script>

<style>
</style>

 <el-checkbox-group v-model="first">
          <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
        </el-checkbox-group>