<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="绑定" :visible="dialogFormVisible" width=50%  @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div style="height: 300px;">
          <el-form-item label="团期计划" prop="tour" label-width="120px" style="float:left;">
            <el-input v-model="ruleForm.tour" @blur="tour_check" class="inputWidth" placeholder="请输入或者选择团期计划"></el-input>
            <el-input v-model="ruleForm.title" :disabled="true" class="inputWidth" style="margin-top: 5px" placeholder="自动显示产品名称"></el-input>
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
  name: "relation",
  components: {},
  props: {
    dialogFormVisible: false,
    pid: '',
  },
  data() {
    return {
      ruleForm: {},
      rules: {},
    }
  },
  computed: {
    // 计算属性的 getter
  },
  methods: {
    closeAdd() {
      this.ruleForm.tour = ''
      this.ruleForm.title = ''
      this.$emit('close', false);
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

</style>
