<template>
  <div class="curiseShip">
    <el-upload ref="upload1" class="upload-demo" :action="UploadUrl1()" :headers="headers" :on-success="handleSuccess1" :on-error="handleError1" :on-remove="handleRemove1" :before-remove="beforeRemove1" :on-exceed="handleExceed1" :file-list="fileList1">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "curiseShip",
  components: {
    
  },
  data() {
    return {
      fileList1: []
    }
  },
  computed: {
      // 计算属性的 getter
    headers(){
      return {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }
  },
  methods: {
     // 上传凭证 function logo
      UploadUrl1(){
        return this.GLOBAL.serverSrcPhp + '/api/v1/upload/pzfiles';
      },
      handleSuccess1(response, file, fileList){
        // console.log(response);
        // console.log(file);
        if(response.code == 200){
          this.fileList1.push(response.data);
        }else{
          if(response.message){
            this.$message.warning(response.message);
          }else{
            this.$message.warning('文件上传失败');
          }
        }
      },
      handleError1(err, file, fileList){
        this.$message.warning(`文件上传失败，请重新上传！`);
      },
      handleRemove1(file, fileList) {
        console.log(file, fileList);
        this.fileList1 = fileList;
      },
      handleExceed1(files, fileList) {
        this.$message.warning(`平台订单只支持一个附件上传！`);
      },
      beforeRemove1(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
  },
  created() {
    
  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
  
</style>
