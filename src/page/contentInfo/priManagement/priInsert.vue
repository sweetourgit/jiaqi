<template>
  <div>
      <el-form v-show="rformAvis" :model="rformA" :rules="rules" ref="rformA" label-width="100px" class="demo-ruleForm">
         <div class="per-title">功能增加</div>
         <el-form-item label="功能名称" prop="name">
             <el-input v-model="rformA.name"></el-input>
         </el-form-item>
         <el-form-item label="页面地址" prop="pageUrl">
             <el-input v-model="rformA.pageUrl"></el-input>
         </el-form-item>
         <el-form-item label="所属上级" prop="parentName">
             <el-input v-model="rformA.parentName"></el-input>
         </el-form-item>
         <el-form-item>
             <el-button type="primary" @click="next('rformA')">下一步</el-button>
         </el-form-item>
      </el-form>

      <el-form v-show="rformBvis" :model="rformB" :rules="rules" ref="rformB" label-width="100px" class="demo-ruleForm">
         <div class="per-title">功能权限配置</div>
         <el-form-item label="名称" prop="butName">
             <el-input v-model="rformB.butName"></el-input>
         </el-form-item>
         <el-form-item label="路径" prop="serUrl">
             <el-input v-model="rformB.serUrl"></el-input>
         </el-form-item>
         <el-form-item label="控件ID" prop="modelId">
             <el-input v-model="rformB.modelId"></el-input>
         </el-form-item>
         <el-form-item>
             <el-button @click="pre">上一步</el-button>
             <el-button type="primary" @click="submit('rformB')">提交</el-button>
         </el-form-item>
      </el-form>

  </div>
</el-form>
   
  </div>
</template>

<script>
  import {formatDate} from '../../../components/tools/publicMethod.js'
  export default { 
    data() {        
      return {       
        guid:"",
        rformAvis:true,
        rformBvis:false,
        rformA: {
          name: "",
          pageUrl: "",
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
          parentName: [{ required: true, message: '唯一标识不能为空', trigger: 'blur' }],
          butName: [{ required: true, message: '所属上级不能为空', trigger: 'blur' }],
          serUrl: [{ required: true, message: '所属上级不能为空', trigger: 'blur' }],
          modelId: [{ required: true, message: '所属上级不能为空', trigger: 'blur' }]
        }
      }
    },
    methods: {
      next(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
             this.$http.post(this.GLOBAL.serverSrc + '/universal/utinity/api/getguid',{
               "object": true
            }).then(res => {
                if(res.data.isSuccess == true){
                   this.guid = res.data.object;
                   this.$http.post(this.GLOBAL.serverSrc + '/org/module/api/insert',{
                     "object": {
                      "id": 0,
                      "createTime": formatDate(new Date()),
                      "isDeleted": 0,
                      "code": "string",
                      "name": this.rformA.name,
                      "uri": this.rformA.pageUrl,
                      "guid": this.guid,
                      "parentID": this.rformA.parentName,
                      "leaf": 0
                    }
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.rformAvis=false;
                         this.rformBvis=true;
                         this.$refs["rformA"].resetFields();
                      }else{
                         this.$message.success(res.data.result.message);
                      }
                  })  
              }else{
                  this.$message.success(res.data.result.message);
             }
          })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      pre(){
        this.rformAvis=true;
        this.rformBvis=false;
      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
             this.$http.post(this.GLOBAL.serverSrc + '/org/control/api/insert',{
                   "object": {
                     "id": 0,
                     "name": this.rformB.butName,
                     "path": this.rformB.serUrl,
                     "key": this.rformB.modelId,
                     "guid": this.guid
                    }
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.$message.success("提交成功");
                         this.$refs["rformB"].resetFields();
                      }else{
                         this.$message.success(res.data.result.message);
                   }
              }) 
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
