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
          <el-form-item label="类型：" prop="foodType" label-width="140px">
            <!-- <el-input v-model="ruleForm.cabinType" placeholder="请输入" class="inputWidth"></el-input> -->
            <el-select  v-model="ruleForm.foodType">
              <el-option :key="item.id" v-for="item in typeArr" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称：" prop="name" label-width="140px">
            <el-input v-model="ruleForm.name" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="容纳人数：" prop="person" label-width="140px">
            <el-input v-model="ruleForm.person" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="楼层：" prop="floor" label-width="140px">
            <el-input v-model="ruleForm.floor" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="消费：" prop="area" label-width="140px">
            <el-input v-model="ruleForm.money" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="开放时间：" prop="window" label-width="140px">
              <el-date-picker v-model="ruleForm.openTime" type="date" placeholder="结束日期" class="inputWidth" :editable="disabled"></el-date-picker>
          </el-form-item>
          <el-form-item label="简介：" prop="introduction" label-width="140px">
            <el-input v-model="ruleForm.introduction" class="inputWidth" placeholder="请输入" type="textarea"></el-input>
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
        disabled: true,
        ruleForm: {
          foodType: '',
          name: '',
          person: '',
          floor: '',
          money: '',
          openTime: '',
          introduction: ''
        },
        rules: {
          company: [{ required: true, message: '邮轮公司不能为空!', trigger: 'change' }]
        },
        fileList1: [], // 图片文件
        topTitle: '添加',
        typeArr: [
          {
            id: "1",
            name: "主餐厅"
          },{
            id: "2",
            name: "自助餐厅"
          },{
            id: "3",
            name: "特色餐厅"
          },{
            id: "4",
            name: "酒吧"
          }
        ]
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
          foodType: '',
          name: '',
          person: '',
          floor: '',
          money: '',
          openTime: '',
          introduction: ''
        };
        this.fileList1 = [];
        this.$emit('close', false);
      },
      // 取消按钮事件
      cancalBtn(){
        this.$confirm("是否取消本次添加?", "提示", {
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
            
            let fileArr = [];
            if(that.fileList1.length == 0){
              that.$message.warning("图片不能为空！");
            }else{
              that.fileList1.forEach(function (item, index, arr) {
                fileArr.push({
                  pic_id: item.id,
                  pic_url: item.url
                });
              })
            }
            let ida = '';
            if(this.info){
              ida = this.info;
            }
              
            this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/liner/liner-delicious/savelinerdelicious', {
							"liner_id": localStorage.getItem('liner_id'),
							"id": ida,
							"type": this.ruleForm.foodType,
							"name": this.ruleForm.name,
							"number": this.ruleForm.person,
							"floor": this.ruleForm.floor,
							"consumption": this.ruleForm.money,
							"opening_hours": this.ruleForm.openTime,
							"introduce": this.ruleForm.introduction,
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
        // alert(this.info);
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner-delicious/viewlinerdelicious", {
          "id": this.info
        }, ).then(function(response) {
          console.log('food-detail',response);
          if (response.data.code == '200') {
            that.ruleForm = {
              foodType: response.data.data.type,
              name: response.data.data.name,
              person: response.data.data.number,
              floor: response.data.data.floor,
              money: response.data.data.consumption,
              openTime: response.data.data.opening_hours,
              introduction: response.data.data.introduce
            };
            that.fileList1 = response.data.data.pics;
            that.fileList1.forEach(function(item, index, arr){
              item.name = response.data.data.pics[index].pic_name;
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
