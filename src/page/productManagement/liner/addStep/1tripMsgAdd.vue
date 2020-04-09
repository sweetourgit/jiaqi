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
          <el-form-item label="价钱：" prop="price" label-width="140px">
            <el-input v-model="ruleForm.price" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="行程时长：" prop="duration" label-width="140px">
            <el-input v-model="ruleForm.duration" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="简介：" prop="introduction" label-width="140px">
            <el-input v-model="ruleForm.introduction" class="inputWidth" placeholder="请输入" type="textarea" maxlength="100" show-word-limit :rows="6"></el-input>
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
          title: '',
          price: '',
          duration: '',
          introduction: ''
        },
        rules: {
          title: [{ required: true, message: '标题不能为空!', trigger: 'blur' }]
        },
        topTitle: '添加',
      }
    },
    computed: {
      
    },
    watch: {
      dialogFormVisible: {
        handler: function () {
          if(this.info.type == "edit"){
            this.topTitle = '编辑';
            this.ruleForm = {
              title: this.info.tableData[parseInt(this.info.index)].title,
              price: this.info.tableData[parseInt(this.info.index)].price,
              duration: this.info.tableData[parseInt(this.info.index)].duration,
              introduction: this.info.tableData[parseInt(this.info.index)].introduction
            };
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
          price: '',
          duration: '',
          introduction: ''
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
            const num = parseInt(this.info.name) - 1;
            if(that.info.type == "add"){
              const item = {
                title: that.ruleForm.title,
                price: that.ruleForm.price,
                duration: that.ruleForm.duration,
                introduction: that.ruleForm.introduction
              }
              // console.log(that.info.tableData);
              that.info.tableData[parseInt(that.info.index)] = item;
              // that.info.tableData = that.info.tableData.push(item);
              // that.$parent.editableTabs[num].content.ruleForm.tableData = that.info.tableData;
              // console.log(that.$parent.editableTabs[num])
            }else if(that.info.type == "edit"){
              const item = {
                title: that.ruleForm.title,
                price: that.ruleForm.price,
                duration: that.ruleForm.duration,
                introduction: that.ruleForm.introduction
              }
              // console.log(parseInt(that.info.index));
              that.info.tableData = that.info.tableData.splice(parseInt(that.info.index), 1, item);
              that.info.tableData[parseInt(that.info.index)] = item;
              // console.log(that.info.tableData)
              // that.$parent.editableTabs[num].content.ruleForm.tableData[that.info.index] = that.info.tableData;
            }
            
            that.closeAdd();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      // 加载编辑数据
      loadData(){
        // alert(this.info);
      },
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
