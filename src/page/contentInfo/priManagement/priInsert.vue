<template>
  <div>
      <el-form :model="rformA" :rules="rules" ref="rformA" label-width="100px" class="demo-ruleForm">
         <div class="per-title">功能增加</div>
         <el-form-item label="功能名称" prop="name">
             <el-input v-model="rformA.name"></el-input>
         </el-form-item>
         <el-form-item label="页面地址" prop="pageUrl">
             <el-input v-model="rformA.pageUrl"></el-input>
         </el-form-item>
         <el-form-item label="唯一标识" prop="onlyName">
             <el-input v-model="rformA.onlyName"></el-input>
         </el-form-item>
         <el-form-item label="所属上级" prop="parentName">
             <el-input v-model="rformA.parentName"></el-input>
         </el-form-item>
         <el-form-item>
             <el-button type="primary" @click="next('rformA')">下一步</el-button>
         </el-form-item>
      </el-form>

      <el-form :model="rformB" :rules="rules" ref="rformB" label-width="100px" class="demo-ruleForm">
         <div class="per-title">功能增加</div>
         <el-form-item label="功能名称" prop="name">
             <el-input v-model="rformB.butName"></el-input>
         </el-form-item>
         <el-form-item label="页面地址" prop="pageUrl">
             <el-input v-model="rformB.serUrl"></el-input>
         </el-form-item>
         <el-form-item label="唯一标识" prop="onlyName">
             <el-input v-model="rformB.modelId"></el-input>
         </el-form-item>
         <el-form-item>
             <el-button type="primary" @click="next('rformB')">下一步</el-button>
         </el-form-item>
      </el-form>

  </div>
</el-form>
   
  </div>
</template>

<script scoped>

  export default { 
    data() {        
      return {       
        rformA: {
          name: "",
          pageUrl: "",
          onlyName: "",
          parentName: ""
        },
        rformB: {
          butName: "",
          serUrl: "",
          modelId: ""
        },
        rules: {
          name: [{ required: true, message: '功能名称不能为空', trigger: 'blur' }],
          pageUrl: [{ required: true, message: '页面地址不能为空', trigger: 'blur' }],
          onlyName: [{ required: true, message: '唯一标识不能为空', trigger: 'blur' }],
          parentName: [{ required: true, message: '所属上级不能为空', trigger: 'blur' }]
        }
      }
    },
    methods: {
      next(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            

          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }





       

    }  
  }
</script>

<style scoped>
       .demo-ruleForm{margin:50px}
       .demo-ruleForm .el-input{width:300px}
       .per-title{height: 50px;font-size: 18px;font-weight: bold;text-align: center;width: 430px}
</style>
