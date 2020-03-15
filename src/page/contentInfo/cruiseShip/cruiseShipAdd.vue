<template>
  <div class="vivo" style="position:relative" id="applyFor">
    <!--申请预付款-->
    <el-dialog :title="topTitle" :visible="dialogFormVisible" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close="false" width="70%" @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="buttonDv">
          <el-button class="el-button" type="primary" @click="submitForm('ruleForm')">提 交</el-button>
          <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
        </div>
        <div>
          <el-form-item label="邮轮公司名称：" prop="company" label-width="140px">
            <el-input v-model="ruleForm.company" placeholder="请输入" class="inputWidth" maxlength="40" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="简介：" prop="introduction" label-width="140px">
            <el-input v-model="ruleForm.introduction" class="inputWidth" placeholder="请输入" type="textarea" maxlength="1000" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="LOGO：" label-width="140px">
            <!-- <el-upload ref="upload1" class="upload-demo" :action="UploadUrl()" :headers="headers" :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileList" :limit=1>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload> -->
            <image-input
              :list="ruleForm.logoPic"
              :numLimit="1"
              @wakeup-material="logoSelectHandler"
              @remove-handler="removeLogoHandler"
            ></image-input>
          </el-form-item>
          <el-form-item label="图片：" label-width="140px">
            <image-input
              :list="ruleForm.pic"
              :numLimit="10"
              @wakeup-material="picSelectHandler"
              @remove-handler="removePicHandler"
            ></image-input>
            <!-- <el-upload ref="upload1" class="upload-demo" :action="UploadUrl1()" :headers="headers" :on-success="handleSuccess1" :on-error="handleError1" :on-remove="handleRemove1" :before-remove="beforeRemove1" :on-exceed="handleExceed1" :file-list="fileList1">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload> -->
          </el-form-item>
        </div>
      </el-form>
      <material-list
        ref="materialListRef">
      </material-list>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import imageInput from './comp/image-input'
  import materialList from './comp/material-list'
  import { getPictureAction } from '@/page/productManagement/listInfo/api.js'
  export default {
    name: "newTour",
    components: { imageInput, materialList },
    props: {
      dialogFormVisible: false,
      info: ''
    },
    data() {
      return {
        ruleForm: {
          company: '',
          introduction: '',
          logoPic: [],
          pic: []
        },
        rules: {
          company: [{ required: true, message: '邮轮公司不能为空!', trigger: 'change' }]
        },
        fileList: [], // logo文件
        fileList1: [], // 图片文件
        topTitle: '添加'
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
    watch: {
      dialogFormVisible: {
        handler: function () {
          if(this.info){
            this.topTitle = '编辑';
            this.loadData();
          }else{
            this.topTitle = '添加';
          }
        }
      }
    },
    methods: {
      // 关闭弹框
      closeAdd() {
        this.ruleForm = {
          company: '',
          introduction: '',
        };
        this.fileList = [];
        this.fileList1 = [];
        this.$emit('close', false);
      },
      // 取消按钮事件
      cancalBtn(){
        let words = '添加';
        if(this.info){
          words = '编辑';
        }
        
        if(this.ruleForm.company != '' || this.ruleForm.introduction != '' || this.fileList.length != 0 || this.fileList1.length != 0){
          this.$confirm("是否取消本次"+ words +"?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$message.success("已取消");
            this.closeAdd();
          }).catch(() => {

          });
        }else{
          this.closeAdd();
        }
      },
      // 提交按钮
      submitForm(formName) {
        const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // console.log(that.fileList);
            // console.log(that.fileList1);
            let logoFile = [];
            if(that.ruleForm.logoPic.length == 0){
              // that.$message.warning("LOGO不能为空！");
            }else{
              logoFile = [
                  {
                    "pic_id": this.ruleForm.logoPic.id,
                    "pic_url": this.ruleForm.logoPic.url
                  }
                ];
            }
            let fileArr = [];
            if(that.ruleForm.pic.length == 0){
              // that.$message.warning("图片不能为空！");
            }else{
              that.ruleForm.pic.forEach(function (item, index, arr) {
                fileArr.push({
                  pic_id: item.id,
                  pic_url: item.url
                });
              })
            }
              
            if(this.info == ''){
              this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/liner/liner-company/addlinercom', {
                "name": this.ruleForm.company,
                "introduce": this.ruleForm.introduction,
                "logo": logoFile,
                "pics": fileArr,
                "create_uid": sessionStorage.getItem('id'),
                "org_id": sessionStorage.getItem('orgID')
              }).then(res => {
                // console.log(res);
                if (res.data.code == 200) {
                  that.$message({
                    type: 'success',
                    message: '创建成功!'
                  });
                  that.closeAdd();

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
            }else{
              this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/liner/liner-company/editlinercom', {
                "id": this.info,
                "name": this.ruleForm.company,
                "introduce": this.ruleForm.introduction,
                "logo": logoFile,
                "pics": fileArr,
                "create_uid": sessionStorage.getItem('id'),
                "org_id": sessionStorage.getItem('orgID')
              }).then(res => {
                // console.log(res);
                if (res.data.code == 200) {
                  that.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  that.closeAdd();

                } else {
                  if(res.data.message){
                    that.$message({
                      type: 'warning',
                      message: res.data.message
                    });
                  }else{
                    that.$message({
                      type: 'warning',
                      message: '修改失败'
                    });
                  }
                }
              }).catch(err => {
                console.log(err)
              })
            }
            

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      // 头图选择
      logoSelectHandler(idList){
        let cb= (list) => {
          if(list.length > 1){
            this.$message.error(`头图数量限制为1张，当前选择${list.length}张，将截取第一张`);
            list= list.splice(0, 1);
          }
          console.log(list);
          this.getPictureFun(this.ruleForm.logoPic, list);
          console.log(this.ruleForm.logoPic);
        }
        this.$refs.materialListRef.wakeup(idList, cb);
      },
      
      // 头图删除
      removeLogoHandler(){
        this.ruleForm.logoPic= [];
      },

      // 图片选择
      picSelectHandler(idList){
      let cb= (list) => {
        console.log(list);
        this.getPictureFun(this.ruleForm.pic, list);
      }
      this.$refs.materialListRef.wakeup(idList, cb);
    },

    // 图片删除
    removePicHandler(i){
      console.log(this.ruleForm.pic);
      this.ruleForm.pic.splice(i, 1);
    },

      getPictureFun(obj, list){
        // console.log(list);
        // let imgArr = [];
        list.forEach(el => {
          // console.log(el);
          getPictureAction.bind(this)(el).then(res => {
            // console.log(res);
            const item = {
              id: el,
              url: res.url
            }
            obj.push(item);
          }).catch(err => {
            const item = {
              id: el,
              url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
            }
            obj.push(item);
          })
        })
        
      },

      // 加载编辑数据
      loadData(){
        // alert(this.info);
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner-company/viewlinercom", {
          "id": this.info
        }, ).then(function(response) {
          console.log('获取邮轮公司detail',response);
          if (response.data.code == '200') {
            that.ruleForm = {
              company: response.data.data.name,
              introduction: response.data.data.introduce
            };
            that.ruleForm.logoPic = response.data.data.logo;
            that.ruleForm.pic = response.data.data.pics;
            that.ruleForm.logoPic[0].id = response.data.data.logo[0].pic_id;
            that.ruleForm.logoPic[0].url = response.data.data.logo[0].pic_url;
            that.fileList1.forEach(function(item, index, arr){
              item.id = response.data.data.pics[index].pic_id;
              item.url = response.data.data.pics[index].pic_url;
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

    },
    mounted() {

    }
  }

</script>
<style lang="scss">
  #applyFor .buttonDv {
    position: absolute;
    top: 8px;
    right: 3%;
  }
  #applyFor .inputWidth {
    min-width: 400px;
    width: 60%;
  }
  #applyFor .inputWidthHalf{
    min-width: 200px;
    width: 28.5%;
    margin-right: 2%;
  }
  .inputWidthS{
    width: 19%;
    margin-right: 10px;
  }
  #applyFor .el-upload-list__item{
    margin-top: 10px;
  }
  #applyFor .el-divider__text, #applyFor .el-link{
    font-size: 16px;
  }

</style>
