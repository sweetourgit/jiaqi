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
          <el-form-item label="类型：" prop="type" label-width="140px">
            <el-input v-model="ruleForm.type" placeholder="请输入" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item label="名称：" prop="name" label-width="140px">
            <el-input v-model="ruleForm.name" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="introduction" label-width="140px">
            <el-input v-model="ruleForm.introduction" class="inputWidth" placeholder="请输入" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="人群：" prop="person" label-width="140px">
            <el-checkbox-group v-model="ruleForm.person">
              <el-checkbox v-for="item in personList" :key="item.id" :label="item.id" :value="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="必须：" prop="require" label-width="140px">
            <el-radio v-model="ruleForm.require" label="1">是</el-radio>
            <el-radio v-model="ruleForm.require" label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="附件：" label-width="140px">
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
        disabled: true,
        ruleForm: {
          type: '',
          name: '',
          person: [],
          introduction: '',
          require: '1'
        },
        rules: {
          type: [{ required: true, message: '类型不能为空!', trigger: 'blur' }],
          name: [{ required: true, message: '名称不能为空!', trigger: 'blur' }],
          introduction: [{ required: true, message: '描述不能为空!', trigger: 'blur' }],
          person: [{ required: true, message: '人群不能为空!', trigger: 'change' }],
          require: [{ required: true, message: '必须不能为空!', trigger: 'change' }]
        },
        fileList1: [], // 图片文件
        topTitle: '添加',
        personList: [
          {id: "1", name: "在职"},
          {id: "2", name: "自由职业"},
          {id: "3", name: "在校学生"},
          {id: "4", name: "退休"},
          {id: "5", name: "学前龄儿童"}
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
    watch: {
      dialogFormVisible: {
        handler: function () {
          if(this.info.id){
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
          type: '',
          name: '',
          person: [],
          introduction: '',
          require: '1'
        };
        this.fileList1 = [];
        this.$emit('close', false);
      },
      // 取消按钮事件
      cancalBtn(){
        this.$confirm("是否取消本次操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$message.success("已取消添加");
          this.closeAdd();
        }).catch(() => {

        });
      },
      // 提交按钮
      submitForm(formName) {
        const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let ida = '';
            if(this.info.id){
              ida = this.info.id;
            }else{
              ida = 0;
            }
            let idVisa = '';
            if(this.info.visa_id){
              idVisa = this.info.visa_id;
            }else{
              idVisa = 0;
            }
            let crowd = []
            that.ruleForm.person.forEach(function(item, index, arr){
              crowd.push({
                "crowd_id": item
              })
            })
            this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/product/product-visa-info/save', {
							"id": ida,
              "product_id": this.$route.query.id,
              "visa_id": idVisa,
              "title": this.info.title,
              "type": this.ruleForm.type,
              "crowd": crowd,
              "name": this.ruleForm.name,
              "describe": this.ruleForm.introduction,
              "must": parseInt(this.ruleForm.require),
              "enclosure": this.fileList1.length != 0 ? this.fileList1[0].url : '',
							"create_uid": sessionStorage.getItem('id'),
							"org_id": sessionStorage.getItem('orgID')
						}).then(res => {
							// console.log(res);
							if (res.data.code == 200) {
									that.$message({
                    type: 'success',
                    message: '创建成功!'
                  });
                  if(that.info.visa_id == ''){
                    localStorage.setItem("visa_id", res.data.data.visa_id);
                  }
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

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

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

      // 加载编辑数据
      loadData(){
        // alert(this.info.id);
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product-visa-info/info", {
          "id": this.info.id
        }, ).then(function(response) {
          console.log('签证详情',response);
          if (response.data.code == '200') {
            that.ruleForm = {
              type: response.data.data.info.type,
              name: response.data.data.info.name,
              person: [],
              introduction: response.data.data.info.describe,
              require: response.data.data.info.must.toString()
            };
            let crowdArr = '';
            if(typeof response.data.data.info.crowd == "string"){
              crowdArr = JSON.parse(response.data.data.info.crowd);
            }else{
              crowdArr = response.data.data.info.crowd;
            }
            crowdArr.forEach(function(item, index, arr){
              that.ruleForm.person.push(item.crowd_id.toString());
            })
            that.fileList1 = [{
              name: response.data.data.info.enclosure,
              url: response.data.data.info.enclosure
            }];

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
