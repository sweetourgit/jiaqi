<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="导入外部订单" :visible="dialogFormVisible2" width=50% @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div style="height: 420px;">
          <el-form-item label="平台" prop="platform" label-width="120px" style="float:left;">
            <el-select style="float: left;" class="inputWidth" v-model="ruleForm.type" placeholder="请选择类型">
              <el-option v-for="item in typeList" :key="item.label" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <br /><br />
          <el-form-item label="平台订单" prop="platformOrder" label-width="120px" style="float:left;" v-if="ruleForm.type != 2">
            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item><br />
          <el-form-item label="票付通订单" prop="ticketOrder" label-width="120px" style="float:left;margin-top: 20px;">
            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-success="handleSuccess2" :on-error="handleError2" :on-remove="handleRemove2" :before-remove="beforeRemove2" :limit="1" :on-exceed="handleExceed2" :file-list="fileList2">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <div class="footer">
            <el-button class="el-button" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
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
    pid: '',
  },
  data() {
    var checkPlat = (rule, value, callback) => {
      if(this.ruleForm.type == ""){
        return callback(new Error('请选择平台类型'));
      }
    };
    var checkOrder = (rule, value, callback) => {
      if(this.ruleForm.type == 1 && this.fileList.length == 0){
        return callback(new Error('平台订单不能为空'));
      }
    };
    var ticketOrder = (rule, value, callback) => {
      if(this.fileList2.length == 0){
        return callback(new Error('票付通订单不能为空'));
      }
    };
    return {
      ruleForm: {
        type: '',

      },
      rules: {
        platform: [{ required: true, validator:checkPlat, trigger: 'change' }],
        platformOrder: [{ required: true, validator:checkOrder, trigger: 'change' }],
        ticketOrder: [{ required: true, validator:ticketOrder, trigger: 'change' }]
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
  },
  methods: {
    closeAdd() {
      this.ruleForm.tour = '';
      this.ruleForm.title = '';
      this.$emit('close2', false);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
//    平台订单
    handleSuccess(response, file, fileList){
//      console.log(response, file, fileList);
      this.fileList = fileList;
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
      this.fileList2 = fileList;
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
