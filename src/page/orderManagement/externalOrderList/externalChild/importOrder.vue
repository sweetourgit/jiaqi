<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="导入外部订单" :visible="dialogFormVisible2" width=60% @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div style="height: 600px;">
          <el-form-item label="平台" prop="tour" label-width="120px" style="float:left;">
            <el-select style="float: left;" class="inputWidth" v-model="ruleForm.type" placeholder="请选择类型">
              <el-option v-for="item in typeList" :key="item.label" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item><br />
          <el-form-item label="平台订单" prop="tour" label-width="120px" style="float:left;">
            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="20" :on-exceed="handleExceed" :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item><br />
          <el-form-item label="票付通订单" prop="tour" label-width="120px" style="float:left;margin-top: 20px;">
            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview2" :on-remove="handleRemove2" :before-remove="beforeRemove2" multiple :limit="20" :on-exceed="handleExceed2" :file-list="fileList2">
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
    return {
      ruleForm: {},
      rules: {},
      typeList: [{
          label: '美团',
          value: '1',
        }, {
          label: '途牛',
          value: '2',
        },
        {
          label: '携程',
          value: '3',
        },
        {
          label: '有赞',
          value: '4',
        },
        {
          label: '去哪',
          value: '5',
        },
        {
          label: '飞猪',
          value: '6',
        },
        {
          label: '马蜂窝',
          value: '7',
        },
      ],
      fileList: [
        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ],
      fileList2: [
        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ],
    }
  },
  computed: {
    // 计算属性的 getter
  },
  methods: {
    closeAdd() {
      this.ruleForm.tour = ''
      this.ruleForm.title = ''
      this.$emit('close2', false);
    },
    tour_check() {
      if (this.ruleForm.tour != '') {
        this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
          "pageIndex": 1,
          "pageSize": 1,
          "object": {
            "groupCode": this.ruleForm.tour, //团号
            "title": '', //产品名称
            "beginDate": 0, //搜索用开始日期
            "endDate": 0, //搜索用结束日期
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            //this.product_name_pre = res.data.objects[0].title
            this.ruleForm.title = res.data.objects.length > 0 ? res.data.objects[0].title : ''
            //this.getPaymentdetails(res.data.objects[0].planID)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    submitForm() {
      this.$message({
        type: 'success',
        message: '提交成功!'
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleRemove2(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview2(file) {
      console.log(file);
    },
    handleExceed2(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
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
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: 100px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

.inputWidth {
  width: 300px;
}

.upload-demo {
  width: 550px;
}

</style>
