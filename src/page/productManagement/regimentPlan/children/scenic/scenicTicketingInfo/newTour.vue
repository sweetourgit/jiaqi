<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="新建报账团号" :visible="dialogFormVisible" width="600px" @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div style="height: 300px;">
          <el-form-item label="报账团期" prop="tour" label-width="120px" style="float:left;">
            <el-input v-model="ruleForm.tour" class="inputWidth" placeholder="请输入或者选择团期计划"></el-input>
          </el-form-item>
          <br /><br />
          <el-form-item label="产品名称" prop="title" label-width="120px" style="float:left;">
            <el-autocomplete class="inputWidth" v-model="ruleForm.title" :fetch-suggestions="querySearch" placeholder="请输入产品名称" @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime" label-width="120px" style="float:left;">
            <el-date-picker v-model="ruleForm.startTime" type="date" class="inputWidth" placeholder="开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" label-width="120px" style="float:left;">
            <el-date-picker v-model="ruleForm.endTime" type="date" class="inputWidth" placeholder="结束时间"></el-date-picker>
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
  name: "newTour",
  components: {},
  props: {
    dialogFormVisible: false,
  },
  data() {
    return {
      ruleForm: {},
      rules: {
        tour: [{ required: true, message: '报账团期不能为空!', trigger: 'blur' }],
        title: [{ required: true, message: '报账团期不能为空!', trigger: 'blur' }],
        startTime: [{ required: true, message: '开始时间不能为空!', trigger: 'change' }],
        endTime: [{ required: true, message: '结束时间不能为空!', trigger: 'change' }],
      },
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {},
  methods: {
    closeAdd() {
      this.ruleForm.tour = ''
      this.ruleForm.title = ''
      this.ruleForm.startTime = ''
      this.ruleForm.endTime = ''
      this.$emit('close', false);
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/groupplan/group-plan/add', {
            "tour_no": this.ruleForm.tour,
            "product_name": this.ruleForm.title,
            "begin_at": this.ruleForm.startTime,
            "end_at": this.ruleForm.endTime,
            "create_uid": sessionStorage.getItem('id')
          }, {
            emulateJSON: true
          }).then(res => {
            console.log(res.data);
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                message: '创建成功!'
              });
              this.closeAdd()
            } else {
              console.log('有错误!')
              console.log(res.data)
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
    loadAll() {
      return [
        { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
        { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
        { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
        { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
      ];
    },
  },
  created() {

  },
  mounted() {
    this.restaurants = this.loadAll();
  }
}

</script>
<style lang="scss" scoped>
.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: 20px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

.inputWidth {
  min-width: 400px;
}

.inputWidth2 {
  min-width: 400px;
}

</style>
