<template>
  <el-dialog title="出团通知书" width="700px"
    ref="dialogRef" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="closeHandler">
    <div style="width: 600px;">
      <el-form
        size="small"
        label-width="120px">
        <el-form-item label="出团通知书：">
          <el-upload name="files" ref="uploader" style="width: 200px;"
            action
            :file-list="filesList"
            :before-upload="beforeUploadHandler"
            :before-remove="uploadBeforeRemoveHandler"
            :on-remove="uploadRemoveHandler"
            :on-preview="uploadPreviewHandler">
            <el-button type="primary" size="mini" icon="el-icon-plus">上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex; justify-content: flex-end; padding-top: 20px;">
        <el-button size="small" 
          @click="closePreHandler">
          取 消
        </el-button>
        <el-button size="small" type="primary"
          @click="submitPreHandler">
          保 存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { uploadNotice, upload } from '../api'

let cache= null;
let uploadLock= null;
export default {

  data(){
    return {
      isAdd: true,
      state: false,
      filesList: [],
    }
  },

  methods: {
    test(){
      console.log(this.filesList[0])
    },
    wakeup(sku_plan){
      cache= sku_plan;
      let { notice }= sku_plan;
      if(notice) this.filesList.push(this.$deepCopy(notice))
      this.state= true;
    },

    closePreHandler(){
      if(this.noChange()) return this.closeHandler();
      this.$confirm(`存在数据变动,是否保存?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(this.submitPreHandler)
      .catch(this.closeHandler);
    },

    closeHandler(){
      cache= null;
      uploadLock= null;
      this.filesList.splice(0);
      this.state= false;
    },

    submitPreHandler(){
      if(this.noChange()) return this.closeHandler();
      if(!uploadLock) return this.uploadAction();
      uploadLock();
    },

    submitHandler(notice){
      let sku_plan= cache;
      sku_plan.notice= notice;
      this.closeHandler();
      this.wakeup(sku_plan);
    },

    uploadAction(notice){
      let plan_id= cache.id;
      notice= notice || this.filesList[0];
      uploadNotice({ plan_id, notice }).then(this.submitHandler)        
    },

    beforeUploadHandler(file){
      let { name }= file;
      this.filesList.splice(0);
      this.filesList.push({ name });
      return new Promise(resolve => {
        uploadLock= resolve.bind(this, file);
      })
      .then(res => {
        let formData= new FormData();
        formData.append('files', file);
        return upload(formData)
      })
      .then(res => {
        let { Url }= res;
        this.uploadAction({ name: file.name, url: Url })
      });
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

    noChange(){
      let file= this.filesList[0];
      if(!cache.notice && !file) return true;
      if(!cache.notice || !file) return false;
      return this.$checkLooseEqual(cache.notice, { name: file.name, url: file.url });
    }
  }

}
</script>