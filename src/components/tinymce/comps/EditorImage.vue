<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload name="files"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        :action="GLOBAL.serverSrc+ '/upload/obs/api/file'"
        list-type="picture-card">
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false" size="small">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit" size="small">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].uid)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('数据传输中，请稍后')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },

    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },

    /**
     * @description: 图片读取到上传队列后的回调
     */
    beforeUpload(file) {
      console.log(file)
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        const src= _URL.createObjectURL(file);
        img.src = src;
        img.onload = function() {
          _self.listObj[fileName] = {
            src,
            width: this.width, 
            height: this.height 
          }
        resolve(true);
        }
      })
    },

    /**
     * @description: 上传成功后的回调
     */
    handleSuccess(response, file) {
      let { name, uid }= file;
      let { Url }= JSON.parse(response).paths[0];
      Object.assign(
        this.listObj[uid],
        {
          uid,
          dataSrc: Url
        }
      )

      // const uid = file.uid
      // // 文件名数组
      // const objKeyArr = Object.keys(this.listObj)
      // for (let i = 0, len = objKeyArr.length; i < len; i++) {
      //   if (this.listObj[objKeyArr[i]].uid === uid) {
      //     this.listObj[objKeyArr[i]].url = response.files.file
      //     this.listObj[objKeyArr[i]].hasSuccess = true
      //     return
      //   }
      // }
    },

    // 上传接口报错，图片会自动移除
    // handleError(){},

    fileAdaptor(file){
      let { name, response }= file;
      let { Url }= JSON.parse(response).paths[0];
      let newFile= {
        createTime: Date.now(),
        isDeleted: 0,
        url: Url,
        name
      }
      if(this.isSave) newFile.supplierID= this.submitForm.id;
      return newFile;
    },

    uploadRequest(payload){
      console.log(a)
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  >>> .el-upload--picture-card {
    width: 100%;
  }
}
</style>
