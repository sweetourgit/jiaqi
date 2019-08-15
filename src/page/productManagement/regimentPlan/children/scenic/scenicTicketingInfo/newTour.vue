<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="新建报账团号" :visible="dialogFormVisible" width="600px" @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div style="height: 300px;">
          <el-form-item label="报账团期" prop="tour" label-width="120px" style="float:left;">
            <el-input v-model="ruleForm.tour" class="inputWidth" placeholder="请输入团期计划"></el-input>
          </el-form-item>
          <br /><br />
          <el-form-item label="产品名称" prop="title" label-width="120px" style="float:left;">
            <el-autocomplete class="inputWidth" v-model="ruleForm.title" :fetch-suggestions="querySearch" placeholder="请输入产品名称" @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime" label-width="120px" style="float:left;">
            <el-date-picker v-model="ruleForm.startTime" type="date" class="inputWidth" placeholder="开始时间" :picker-options="startDatePicker"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" label-width="120px" style="float:left;">
            <el-date-picker v-model="ruleForm.endTime" type="date" class="inputWidth" placeholder="结束时间" :picker-options="endDatePicker"></el-date-picker>
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
    info: ''
  },
  data() {
    return {
      ruleForm: {
        tour: '',
        title: '',
        startTime: '',
        endTime: ''
      },
      rules: {
        tour: [{ required: true, message: '报账团期不能为空!', trigger: 'blur' }],
        title: [{ required: true, message: '产品名称不能为空!', trigger: 'blur' }],
        startTime: [{ required: true, message: '开始时间不能为空!', trigger: 'change' }],
        endTime: [{ required: true, message: '结束时间不能为空!', trigger: 'change' }],
      },
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      productList: [],
      productChose: '',
      isUpdate: false
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    info: {
      handler:function(){
        this.loadData()
      }
    }
  },
  methods: {
    loadData(){
      console.log(this.info);
      if(this.info.id){
        this.ruleForm = this.info;
        this.ruleForm = {
          tour: this.info.tour_no,
          title: this.info.product_name,
          startTime: this.info.begin_at,
          endTime: this.info.end_at
        };
        this.productChose = {
          value: this.info.product_name,
          id: this.info.product_id
        };
        this.isUpdate = true;
      };
    },
    closeAdd() {
      this.ruleForm.tour = '';
      this.ruleForm.title = '';
      this.ruleForm.startTime = '';
      this.ruleForm.endTime = '';
      this.$emit('close', false);
    },
    querySearch(queryString, cb) {
      var productList = this.productList;
      var results = queryString ? productList.filter(this.createFilter(queryString)) : productList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (productList) => {
        return (productList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
//      console.log(item);
      this.productChose = item;
    },
    submitForm(formName) {
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.info.id){
            this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/groupplan/group-plan/upd', {
              "id": this.info.id,
              "tour_no": this.ruleForm.tour,
              "product_id": this.productChose.id,
              "product_name": this.ruleForm.title,
              "begin_at": this.ruleForm.startTime,
              "end_at": this.ruleForm.endTime
            }, {
              emulateJSON: true
            }).then(res => {
//              console.log(res.data);
              if (res.data.code == 200) {
                that.$message({
                  type: 'success',
                  message: '更新成功!'
                });
                that.closeAdd();
                this.info = '';
              } else {
                console.log(res.data.message);
                that.$message({
                  type: 'warning',
                  message: res.data.message
                });
              }
            }).catch(err => {
              console.log(err)
            })
          }else{
            this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/groupplan/group-plan/add', {
              "tour_no": this.ruleForm.tour,
              "product_id": this.productChose.id,
              "product_name": this.ruleForm.title,
              "begin_at": this.ruleForm.startTime,
              "end_at": this.ruleForm.endTime,
              "create_uid": sessionStorage.getItem('id')
            }, {
              emulateJSON: true
            }).then(res => {
              console.log(res.data);
              if (res.data.code == 200) {
                that.$message({
                  type: 'success',
                  message: '创建成功!'
                });
                that.closeAdd();
//                that.$emit('loadData');
              } else {
                console.log('有错误!');
                console.log(res.data.message);
                that.$message({
                  type: 'warning',
                  message: res.data.message
                });
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
    loadProductList() {
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/product/product/listall", {
        "id": 0,
        "product_name": "",
        "destination_id": 0,
        "create_account": "",
        "limit": 0
      }, ).then(function(response) {
        if (response.data.code == '200') {
          const productList = response.data.data.list;
          var proArr = [];
          productList.forEach(function (item, index, arr) {
            const obj = {
                "value": item.product_name,
                "id": item.id
            };
            proArr.push(obj);
          });
          that.productList = proArr;
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    beginDate(){
      const that = this;
      return {
        disabledDate(time){
          if (that.ruleForm.endTime) {  //如果结束时间不为空，则小于结束时间
            return new Date(that.ruleForm.endTime).getTime() < time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    processDate(){
      const that = this;
      return {
        disabledDate(time) {
          if (that.ruleForm.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
            return new Date(that.ruleForm.startTime).getTime() > time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    }
  },
  created() {
    this.loadProductList();
  },
  mounted() {

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
