<template>
  <div class="vivo" style="position:relative" id="applyFor">
    <!--申请预付款-->
    <el-dialog title="添加" :visible="dialogFormVisible" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close="false" width="70%" @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="buttonDv">
          <el-button class="el-button" type="primary" @click="submitForm('ruleForm')">添 加</el-button>
          <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
        </div>
        <div>
          <el-form-item label="邮轮公司名称：" prop="company" label-width="140px">
            <el-input v-model="ruleForm.company" placeholder="请输入" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item label="简介：" prop="introduction" label-width="140px">
            <el-input v-model="ruleForm.introduction" class="inputWidth" placeholder="请输入" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="LOGO：" label-width="140px" required>
            <el-upload ref="upload1" class="upload-demo" :action="UploadUrl()" :headers="headers" :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="图片：" label-width="140px" required>
            <el-upload ref="upload1" class="upload-demo" :action="UploadUrl1()" :headers="headers" :on-success="handleSuccess1" :on-error="handleError1" :on-remove="handleRemove1" :before-remove="beforeRemove1" :on-exceed="handleExceed1" :file-list="fileList1">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: "newTour",
    components: {},
    props: {
      dialogFormVisible: false,
      info: ''
    },
    data() {
      return {
        ruleForm: {
          company: '',
          introduction: '',
        },
        rules: {
          company: [{ required: true, message: '邮轮公司不能为空!', trigger: 'change' }]
        },
        fileList: [], // logo文件
        fileList1: [] // 图片文件
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
            this.loadData();
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
        this.$emit('close', false);
      },
      // 取消按钮事件
      cancalBtn(){
        if(this.ruleForm.company != '' || this.ruleForm.introduction != '' || this.fileList.length != 0 || this.fileList1.length != 0){
          this.$confirm("是否取消本次添加?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$message.success("已取消添加");
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

            let fileArr = [];
            console.log(that.fileList);
            if(that.fileList.length != 0){
              that.fileList.forEach(function (item, index, arr) {
                fileArr.push({
                  name: item.name,
                  url: item.response.data.url
                });
              })
            }else{
              fileArr = [];
            }

            this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/loan/periphery-loan/add', {
              "supplier_code": this.ruleForm.supplierID,
              "supplier_name": this.ruleForm.supplierName,
              "periphery_type": 1,
              "loan_type": this.ruleForm.type,
              "loan_money": this.ruleForm.money,
              "mark": this.ruleForm.abstract,
              "remittance_account": this.ruleForm.payNumber,
              "account_name": this.ruleForm.payName,
              "opening_bank": this.ruleForm.payAccount,
              "number": this.ruleForm.number,
              "file": fileArr,
              "create_uid": sessionStorage.getItem('id'),
              "org_id": sessionStorage.getItem('orgID'),
              "buy_type": this.ruleForm.buy_type,
              "account_type": this.ruleForm.account_type,
              "oracle_supplier_code": this.supplierCode
            }).then(res => {
              console.log(res);
              if (res.data.code == 200) {
                that.$message({
                  type: 'success',
                  message: '创建成功!'
                });
                that.startWork(res.data.data);

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

      // 上传凭证 function logo
      UploadUrl(){
        return this.GLOBAL.serverSrcPhp + '/api/v1/upload/pzfiles';
      },
      handleSuccess(response, file, fileList){
        if(response.code == 200){
          this.fileList = fileList;
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
        this.fileList = fileList;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`平台订单只支持一个附件上传！`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      // 上传凭证 function  图片
      UploadUrl1(){
        return this.GLOBAL.serverSrcPhp + '/api/v1/upload/pzfiles';
      },
      handleSuccess1(response, file, fileList){
        if(response.code == 200){
          this.fileList = fileList;
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
        this.fileList = fileList;
      },
      handleExceed1(files, fileList) {
        this.$message.warning(`平台订单只支持一个附件上传！`);
      },
      beforeRemove1(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      // 加载编辑数据
      loadData(){
        alert(this.info);
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
