<template>
  <div class="curiseShipBaseMsg">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <div class="buttonDv">
        <el-button class="el-button" type="primary" @click="saveFun('ruleForm', 1)">保 存</el-button>
        <el-button class="el-button" type="primary" @click="saveFun('ruleForm', 2)">下一步</el-button>
        <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
      </div>
      <div>
        <el-form-item label="邮轮名称：" prop="name" label-width="140px">
          <el-input v-model="ruleForm.name" placeholder="请输入" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="亮点词：" prop="word" label-width="140px">
          <el-input v-model="ruleForm.word1" class="inputWidth marginBtm" placeholder="请输入"></el-input>
          <el-input v-model="ruleForm.word2" class="inputWidth marginBtm" placeholder="请输入"></el-input>
          <el-input v-model="ruleForm.word3" class="inputWidth marginBtm" placeholder="请输入"></el-input>
          <el-input v-model="ruleForm.word4" class="inputWidth marginBtm" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="吨位：" prop="weight" label-width="140px" class="shortItem">
          <el-input v-model="ruleForm.weight" class="inputWidth" placeholder="请输入"></el-input>
          <span>吨</span>
        </el-form-item>
        <el-form-item label="载客：" prop="passenger" label-width="140px" class="shortItem">
          <el-input v-model="ruleForm.passenger" class="inputWidth" placeholder="请输入"></el-input>
          <span>人</span>
        </el-form-item>
        <el-form-item label="首航：" prop="firstDate" label-width="140px" class="shortItem">
          <el-input v-model="ruleForm.firstDate" class="inputWidth" placeholder="请输入"></el-input>
          <span>年</span>
        </el-form-item>
        <el-form-item label="楼层：" prop="floor" label-width="140px" class="shortItem">
          <el-input v-model="ruleForm.floor" class="inputWidth" placeholder="请输入"></el-input>
          <span>层</span>
        </el-form-item>
        <el-form-item label="长度：" prop="length" label-width="140px" class="shortItem">
          <el-input v-model="ruleForm.length" class="inputWidth" placeholder="请输入"></el-input>
          <span>米</span>
        </el-form-item>
        <el-form-item label="宽度：" prop="width" label-width="140px" class="shortItem">
          <el-input v-model="ruleForm.width" class="inputWidth" placeholder="请输入"></el-input>
          <span>米</span>
        </el-form-item>
        <el-form-item label="图片：" prop="width" label-width="140px">
          <el-upload
            :file-list="fileListPic"
            :action="UploadUrl()"
            :headers="headers"
            :on-success="handleSuccess" 
            :on-error="handleError" 
            :on-remove="handleRemove" 
            :before-remove="beforeRemove" 
            :on-exceed="handleExceed"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :limit="3">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="视频：" prop="width" label-width="140px">
          <el-upload
            :file-list="fileListVideo"
            :action="UploadUrl1()"
            :headers="headers"
            :on-success="handleSuccess1" 
            :on-error="handleError1" 
            :on-remove="handleRemove1" 
            :before-remove="beforeRemove1" 
            :on-exceed="handleExceed1"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        
      </div>
    </el-form>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "curiseShipBaseMsg",
  components: {
    
  },
  data() {
    return {
      ruleForm: {
        name: '',
        word1: '',
        word2: '',
        word3: '',
        word4: '',
        weight: '',
        passenger: '',
        firstDate: '',
        floor: '',
        length: '',
        width: ''
      },
      rules: {
        name: [{ required: true, message: '邮轮名称不能为空!', trigger: 'blur' }]
      },
      fileListPic: [],
      fileListVideo: [],
      // 上传图片查看大图功能
      dialogImageUrl: '',
      dialogVisible: false
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
    // 上传凭证 function 图片
    UploadUrl(){
      return this.GLOBAL.serverSrcPhp + '/api/v1/upload/pzfiles';
    },
    handleSuccess(response, file, fileList){
      console.log(fileList);
      // console.log(file);
      if(response.code == 200){
        this.fileListPic.push(response.data);
        this.fileListPic.forEach(function(item, index, arr){
          item.urlCopy = item.url;
          item.url = fileList[index].url;
        })
      }else{
        if(response.message){
          this.$message.warning(response.message);
        }else{
          this.$message.warning('文件上传失败');
        }
      }
    },
    handleError(err, file, fileList){
      this.$message.warning(`文件上传失败，请重新上传！`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileListPic = fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`平台订单只支持一个附件上传！`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },

    // 上传凭证 function 视频
    UploadUrl1(){
      return this.GLOBAL.serverSrcPhp + '/api/v1/upload/pzfiles';
    },
    handleSuccess1(response, file, fileList){
      // console.log(response);
      // console.log(file);
      if(response.code == 200){
        this.fileListVideo.push(response.data);
        this.fileListVideo.forEach(function(item, index, arr){
          item.urlCopy = item.url;
          item.url = fileList[index].url;
        })
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
      this.fileListVideo = fileList;
    },
    handleExceed1(files, fileList) {
      this.$message.warning(`平台订单只支持一个附件上传！`);
    },
    beforeRemove1(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },

    // 保存方法
    saveFun(formName, type){
      const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let strengthArr = [];
            if(this.ruleForm.word1){
              strengthArr.push({
                "strength": this.ruleForm.word1
              })
            }
            if(this.ruleForm.word2){
              strengthArr.push({
                "strength": this.ruleForm.word2
              })
            }
            if(this.ruleForm.word3){
              strengthArr.push({
                "strength": this.ruleForm.word3
              })
            }
            if(this.ruleForm.word4){
              strengthArr.push({
                "strength": this.ruleForm.word4
              })
            }
            if(that.fileListVideo.length == 0){
              that.$message.warning("LOGO不能为空！");
            }
            let fileArr = [];
            if(that.fileListPic.length == 0){
              that.$message.warning("图片不能为空！");
            }else{
              that.fileListPic.forEach(function (item, index, arr) {
                fileArr.push({
                  pic_id: item.id,
                  pic_url: item.urlCopy
                });
              })
            }
            this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner/savelinerbasic", {
              "button_type": type,
              "company_id": this.$route.query.id,
              "id": localStorage.getItem('liner_id'),
              "name": this.ruleForm.name,
              "strengths": strengthArr,
              "tonnage": this.ruleForm.weight,
              "passenger": this.ruleForm.passenger,
              "maiden_voyage": this.ruleForm.firstDate,
              "floor": this.ruleForm.floor,
              "length": this.ruleForm.length,
              "width": this.ruleForm.width,
              "pics": fileArr,
              "videos": [
                {
                  "video_id": that.fileListVideo[0].id,
                  "video_url": that.fileListVideo[0].urlCopy
                }
              ],
              "create_uid": sessionStorage.getItem('id'),
              "org_id": sessionStorage.getItem('orgID')
            }).then(res => {
              // console.log(res);
              if (res.data.code == 200) {
                that.$message({
                  type: 'success',
                  message: '创建成功!'
                });
                if(type == '1'){
                  // alert('保存');
                  that.$router.back();
                  localStorage.removeItem('liner_id');
                  // that.$router.push({
                  //   path: '/cruiseShip/cruiseShipDetail',
                  //   name: '邮轮管理/详情',
                  //   query: {
                  //     "id": that.$route.query.id
                  //   }
                  // });
                }else if(type == '2'){
                  // alert('下一步');
                  // console.log(that.$parent);
                  localStorage.setItem('liner_id', res.data.data.liner_id);
                  that.$parent.next();
                }
              } else {
                if(res.data.message){
                  that.$message({
                    type: 'warning',
                    message: res.data.message
                  });
                }else{
                  that.$message({
                    type: 'warning',
                    message: '创建失败'
                  });
                }
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
      
    },

    cancalBtn(){
      this.$router.back();
      localStorage.removeItem('liner_id', res.data.data.liner_id);
    },

    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = 'http://yl.dayuntong.com' + file.url;
      this.dialogVisible = true;
    },

    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner/viewlinerbasic", {
        "id": localStorage.getItem('liner_id')
      }, ).then(function(response) {
        console.log('基础信息',response);
        if (response.data.code == '200') {
          that.ruleForm = {
            name: response.data.data.name,
            word1: response.data.data.strength[0] ? response.data.data.strength[0].strength : '',
            word2: response.data.data.strength[1] ? response.data.data.strength[1].strength : '',
            word3: response.data.data.strength[2] ? response.data.data.strength[2].strength : '',
            word4: response.data.data.strength[3] ? response.data.data.strength[3].strength : '',
            weight: response.data.data.tonnage,
            passenger: response.data.data.passenger,
            firstDate: response.data.data.maiden_voyage,
            floor: response.data.data.floor,
            length: response.data.data.length,
            width: response.data.data.width
          };

          that.fileListPic = response.data.data.pics;
          that.fileListPic.forEach(function(item, index, arr){
            item.url = 'http://yl.dayuntong.com' + item.pic_url;
            item.urlCopy = item.pic_url;
          })
          that.fileListVideo = response.data.data.videos;
          that.fileListVideo.forEach(function(item, index, arr){
            item.url = 'http://yl.dayuntong.com' + item.pic_url;
            item.urlCopy = item.pic_url;
          })
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {
    if(localStorage.getItem('liner_id')){
      this.loadData();
    }
  },
  mounted() {

  }
}

</script>
<style lang="scss">
  .curiseShipBaseMsg{
    .buttonDv{
      overflow: hidden;
      .el-button{
        float: right;
        margin-right: 18px;
      }
    }
    .el-upload-list__item{
      width: 148px !important;
    }
    padding-bottom: 50px;
    .shortItem{
      width: 30%;
      display: inline-block;
    }
    .inputWidth{
      width: 90%;
    }
    .marginBtm{
      margin-bottom: 18px;
    }
  }
</style>
