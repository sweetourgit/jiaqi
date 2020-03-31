<template>
  <el-dialog :title="isAdd? '新增': '编辑'" width="700px"
    ref="dialogRef" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 600px;">
      <el-form
        size="small"
        label-width="120px">
        <el-form-item label="出团通知书：">
          <el-upload name="files" ref="upload"
            :action="GLOBAL.serverSrc+ '/upload/obs/api/file'"
            :file-list="filesList"
            :on-error="uploadErrorHandler"
            :on-success="uploadSuccessHandler"
            :before-upload="beforeUploadHandler"
            :before-remove="uploadBeforeRemoveHandler"
            :on-remove="uploadRemoveHandler"
            :on-preview="uploadPreviewHandler">
            <el-button type="primary" size="small" icon="el-icon-plus">上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex; justify-content: flex-end; padding-top: 20px;">
        <el-button size="small" 
          @click="handleClose">
          取 消
        </el-button>
        <el-button size="small" type="primary"
          @click="submitHandler">
          保 存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {

  data(){
    return {
      isAdd: true,
      state: false,
      filesList: [],
      uploadLock: null,
    }
  },

  methods: {
    handleClose(){},
    submitHandler(){},

    uploadErrorHandler(){},
    uploadSuccessHandler(response, file, fileList){
      this.submitForm.files.push(this.fileAdaptor(file));
      this.filesList.push(this.fileAdaptor(file));
    },

    beforeUploadHandler(file){
      return new Promise(resolve => this.uploadLock= resolve);
    },
    
    uploadBeforeRemoveHandler(file, fileList){
      return new Promise((resolve, reject) => {
        this.$confirm(`确定删除附件吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(resolve)
        .catch(reject)
      })
    },

    uploadRemoveHandler(file, fileList){
      let index= this.filesList.findIndex(f => f.name=== file.name);
      this.submitForm.files.splice(index, 1);
      this.filesList.splice(index, 1);
    },
    uploadPreviewHandler(file){
      window.open(file.url);
    },
  }

}
</script>