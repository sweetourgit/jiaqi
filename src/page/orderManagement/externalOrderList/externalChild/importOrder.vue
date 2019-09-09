<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="导入外部订单" :visible="dialogFormVisible2" width=50% @close="closeAdd">
      <el-form :model="ruleForm" ref="ruleForm">
        <div style="height: 420px;">
          <el-form-item label="平台" prop="platform" label-width="120px" style="float:left;">
            <el-select style="float: left;" class="inputWidth" v-model="ruleForm.type" placeholder="请选择类型">
              <el-option v-for="item in typeList" :key="item.label" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <br /><br />
          <el-form-item label="平台订单" prop="platformOrder" label-width="120px" style="float:left;" v-if="ruleForm.type == 1">
            <el-upload ref="upload" class="upload-demo" :action="UploadUrl()" :headers="headers" :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList" accept="">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item><br />
          <el-form-item label="票付通订单" prop="ticketOrder" label-width="120px" style="float:left;margin-top: 20px;" v-if="ruleForm.type == 2">
            <el-upload ref="upload1" class="upload-demo" :action="UploadUrl()" :headers="headers" :on-success="handleSuccess2" :on-error="handleError2" :on-remove="handleRemove2" :before-remove="beforeRemove2" :limit="1" :on-exceed="handleExceed2" :file-list="fileList2">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <div class="footer">
            <el-button class="el-button" type="primary" @click="submitForm()">确 定</el-button>
            <el-button class="el-button" type="danger" @click="closeAdd">取 消</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "importOrder",
  components: {},
  props: {
    dialogFormVisible2: false,
    pid: ''
  },
  data() {
    return {
      ruleForm: {
        type: '1',
      },
      typeList: [{
          label: '飞猪',
          value: '1',
        }, {
          label: '票付通',
          value: '2',
        }
      ],
      fileList: [
//        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
//        { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ],
      fileList2: [
//        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
//        { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ],
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
    closeAdd() {
      this.ruleForm.tour = '';
      this.ruleForm.title = '';
      this.$emit('close2', false);
    },
    submitForm() {
      const that = this;
      if(this.ruleForm.type == ""){
        that.$message.warning("请选择平台");
        return;
      }
      if(this.ruleForm.type == 1 && this.fileList.length == 0){
        that.$message.warning("平台订单不能为空");
        return;
      }
      if(this.ruleForm.type == 2 && this.fileList2.length == 0){
        that.$message.warning("票付通订单不能为空");
        return;
      }
      let file_platform, file_pft;
      if(that.ruleForm.type == 1){
        file_platform = this.fileList[0].response.data.url;
        file_pft = ''
      }else if(that.ruleForm.type == 2){
        file_platform = '';
        file_pft = this.fileList2[0].response.data.url
      }
      console.log(this.ruleForm.type);
      console.log(file_pft);
      console.log(file_platform);
//      console.log(this.fileList2[0].response.data.url);
      console.log(sessionStorage.getItem('id'));
      const loading = this.$loading({
        lock: true,
        text: '文件导入中，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/add", {
        "source_id": this.ruleForm.type,
        "file_platform": file_platform,
        "file_pft": file_pft,
        "create_uid": sessionStorage.getItem('id'),
        "org_id": sessionStorage.getItem('orgID')
      }, ).then(function(response) {
        that.fileList = [];
        that.fileList2 = [];
        console.log(response);
        if (response.data.code == '200') {
          that.ruleForm.type = '';
          that.$message({
            type: 'success',
            message: '提交成功!'
          });
          loading.close();
          that.$emit('close2', 'success');
        } else {
          if(response.data.message){
            that.$message({
              type: "warning",
              message: response.data.message
            });
          }else{
            that.$message({
              type: "warning",
              message: '提交失败'
            });
          }

        }
      }).catch(function(error) {
        console.log(error);
      });
    },
//    平台订单
    handleSuccess(response, file, fileList){
      console.log(fileList);
      if(response.code == 200){
        this.fileList = fileList;
      }else{
        this.$message.warning(response.data.message);
        this.fileList = {};
//        clearFiles();
        this.$refs.upload.clearFiles();
      }
    },
    handleError(err, file, fileList){
      this.$message.warning(`文件上传失败，请重新上传！`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`平台订单只支持一个附件上传！`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
//    票付通订单
    handleSuccess2(response, file, fileList){
//      console.log(response, file, fileList);
      if(response.code == 200){
        this.fileList2 = fileList;
      }else{
        this.$message({
          type: 'warning',
          message: response.data.message
        });
        this.fileList2 = {};
        this.$refs.upload1.clearFiles();
      }
    },
    handleError2(err, file, fileList){
      this.$message.warning(`文件上传失败，请重新上传！`);
    },
    handleRemove2(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed2(files, fileList) {
      this.$message.warning(`票付通订单只支持一个附件上传！`);
    },
    beforeRemove2(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    UploadUrl(){
      return this.GLOBAL.serverSrcPhp + '/api/v1/order/external-order/files';
    }
  },
  created() {

  }
}

</script>
<style lang="scss" scoped>
.footer {
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 10px;
  right: 20px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

.inputWidth {
  width: 450px;
}

.upload-demo {
  width: 550px;
}

</style>
