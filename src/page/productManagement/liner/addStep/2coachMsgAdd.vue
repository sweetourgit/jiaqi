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
          <el-form-item label="标题：" prop="title" label-width="140px">
            <el-input v-model="ruleForm.title" class="inputWidth" placeholder="请输入" maxlength="30" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="城市：" prop="city" label-width="140px">
            <el-input v-model="ruleForm.city" class="inputWidth" placeholder="请输入" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="集合地点：" prop="location" label-width="140px">
            <el-input v-model="ruleForm.location" class="inputWidth" placeholder="请输入" maxlength="30" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="价钱：" prop="price" label-width="140px">
            <el-input v-model="ruleForm.price" class="inputWidth" placeholder="请输入" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="预订须知：" prop="note" label-width="140px">
            <el-input v-model="ruleForm.note" class="inputWidth" placeholder="请输入" type="textarea" maxlength="1000" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="温馨提示：" prop="tips" label-width="140px">
            <el-input v-model="ruleForm.tips" class="inputWidth" placeholder="请输入" type="textarea" maxlength="200" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="去程：" prop="go" label-width="140px">
            <el-input v-model="ruleForm.originGo" class="inputWidth" placeholder="请输入出发地" maxlength="20" show-word-limit></el-input>
            <!-- <el-time-picker v-model="ruleForm.timeGo" placeholder="请输入出发时间"></el-time-picker> -->
            <el-date-picker v-model="ruleForm.timeGo" class="inputWidth"  type="datetime" placeholder="请输入出发时间"></el-date-picker>
            <el-input v-model="ruleForm.destinationGo" class="inputWidth" placeholder="请输入目的地" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="返程：" prop="back" label-width="140px">
            <el-input v-model="ruleForm.originBack" class="inputWidth" placeholder="请输入出发地" maxlength="20" show-word-limit></el-input>
            <!-- <el-time-picker v-model="ruleForm.timeBack" placeholder="请输入出发时间"></el-time-picker> -->
            <el-date-picker v-model="ruleForm.timeBack" class="inputWidth" type="datetime" placeholder="请输入出发时间"></el-date-picker>
            <el-input v-model="ruleForm.destinationBack" class="inputWidth" placeholder="请输入目的地" maxlength="20" show-word-limit></el-input>
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
          title: '',
          city: '',
          location: '',
          price: '',
          note: '',
          tips: '',
          originGo: '',
          timeGo: '',
          destinationGo: '',
          originBack: '',
          timeBack: '',
          destinationBack: ''
        },
        rules: {
          title: [{ required: true, message: '标题不能为空!', trigger: 'blur' }]
        },
        topTitle: '添加'
      }
    },
    computed: {

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
          title: '',
          city: '',
          location: '',
          price: '',
          note: '',
          tips: '',
          originGo: '',
          timeGo: '',
          destinationGo: '',
          originBack: '',
          timeBack: '',
          destinationBack: ''
        };
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
            if(this.info){
              ida = this.info;
            }
              
            this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/product/product-deliver/save', {
							"id": ida,
              "product_id": this.$route.query.id,
              "title": this.ruleForm.title,
              "city": this.ruleForm.city,
              "resort": this.ruleForm.location,
              "price": this.ruleForm.price,
              "reservation_notes": this.ruleForm.note,
              "reminder": this.ruleForm.tips,
              "go_place_departure": this.ruleForm.originGo,
              "go_time_departure": this.ruleForm.timeGo,
              "go_destination": this.ruleForm.destinationGo,
              "return_place_departure": this.ruleForm.originBack,
              "return_time_departure": this.ruleForm.timeBack,
              "return_destination": this.ruleForm.destinationBack,
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

      // 加载编辑数据
      loadData(){
        // alert(this.info);
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product-deliver/info", {
          "id": this.info
        }, ).then(function(response) {
          console.log('接送detail',response);
          if (response.data.code == '200') {
            that.ruleForm = {
              title: response.data.data.info.title,
              city: response.data.data.info.city,
              location: response.data.data.info.resort,
              price: response.data.data.info.price,
              note: response.data.data.info.reservation_notes,
              tips: response.data.data.info.reminder,
              originGo: response.data.data.info.go_place_departure,
              timeGo: response.data.data.info.go_time_departure,
              destinationGo: response.data.data.info.go_destination,
              originBack: response.data.data.info.return_place_departure,
              timeBack: response.data.data.info.return_time_departure,
              destinationBack: response.data.data.info.return_destination
            };
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
    margin-bottom: 6px;
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
