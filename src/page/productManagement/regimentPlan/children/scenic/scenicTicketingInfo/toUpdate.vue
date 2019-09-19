<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="修改基本信息" :visible="dialogFormVisible" width=40% @close="closeAdd">
      <div class="totalMoney">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="全程天数：" prop="days" label-width="100px">
            <el-input v-model="ruleForm.days" class="inputWidth" show-word-limit placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="导陪：" prop="guide" label-width="100px">
            <el-input v-model="ruleForm.guide" class="inputWidth" show-word-limit placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="接团社：" prop="associations" label-width="100px">
            <el-input v-model="ruleForm.associations" class="inputWidth" show-word-limit placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="成本项目：" prop="costType" label-width="100px">
            <div v-for="item in ruleForm.costType">
              <el-input v-model="item.cost_type" class="inputWidth" show-word-limit placeholder="请输入"></el-input>
              <p style="margin: 0;">订单人数：{{item.people_num}}人</p>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button @click="submitForm('ruleForm')" type="primary" size="small" class="table_details">保存</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "toUpdate",
  components: {},
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
      ruleForm: {
        days: '',
        guide: '',
        associations: '',
        costType: ''
      },
      typeList: [],
      rules: {
        days: [{ required: true, message: '天数不能为空!', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '天数必须是正整数!' }
        ],
        guide: [{ required: true, message: '导陪不能为空!', trigger: 'blur' }
        ],
        associations: [{ required: true, message: '接团社不能为空!', trigger: 'blur' }
        ],
        costType: [{ required: true, message: '成本项目不能为空!', trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    info: {
      dialogFormVisible:function(){
        if(this.dialogFormVisible){
          this.ruleForm = {
            days: this.$parent.msg.days,
            guide: this.$parent.msg.guide,
            associations: this.$parent.msg.associations
          };
          this.loadData();
        }
      }
    }
  },
  methods: {
    closeAdd() {
      this.$emit('close', false);
    },
    submitForm(formName) {
      const that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let flag = true;
          console.log('that.ruleForm.costType',that.ruleForm.costType);
          for(let i = 0; i < that.ruleForm.costType.length; i++){
//            alert(that.ruleForm.costType[i].cost_type);
            if(that.ruleForm.costType[i].cost_type == ''){
              that.$message({
                type: 'warning',
                message: '成本项目不能为空!'
              });
              flag = false;
            }
          }
          if(flag){
            let costArr = [];
            for(let i = 0; i < that.ruleForm.costType.length; i++){
              const costItem = {
                "before_name": that.typeList[i],
                "after_name": that.ruleForm.costType[i].cost_type
              };
              costArr.push(costItem);
            }
//            alert(JSON.stringify(costArr));
            this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/savetemp", {
              "tour_no": this.$parent.paramTour,
              "days": this.ruleForm.days,
              "guide": this.ruleForm.guide,
              "associations": this.ruleForm.associations,
              "create_uid": sessionStorage.getItem('id'),
              "cost_type": costArr
            }, ).then(function(response) {
              console.log(response);
              if (response.data.code == '200') {

                that.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                that.$emit('close', false);
              } else {
                if(response.data.message){
                  that.$message.warning(response.data.message);
                }else{
                  that.$message.warning('修改失败');
                }

              }
            }).catch(function(error) {
              console.log(error);
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    loadData(){
      this.ruleForm = {
        days: this.$parent.msg.days,
        guide: this.$parent.msg.guide,
        associations: this.$parent.msg.associations
      };
      console.log(this.$parent.paramTour);
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/getcostitem", {
        "tour_no": this.$parent.paramTour,
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          that.ruleForm = {
            days: that.$parent.msg.days,
            guide: that.$parent.msg.guide,
            associations: that.$parent.msg.associations,
            costType: response.data.data.listInfo
          };
          response.data.data.listInfo.forEach(function (item, index, arr) {
            that.typeList.push(item.cost_type);
          })
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });

    }

  },
  created() {
    this.loadData();
  },
  mounted() {}
}

</script>
<style lang="scss" scoped>
.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: -10px;
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

.totalMoney {
  margin: 0 30px;
}

</style>
