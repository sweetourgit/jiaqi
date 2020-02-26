<template>
  <div class="vivo" style="position:relative" id="addCabin">
    <!--申请预付款-->
    <el-dialog :title="topTitle" :visible="dialogFormVisible" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close="false" width="40%" @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="buttonDv">
          <el-button class="el-button" type="primary" @click="submitForm('ruleForm')">提 交</el-button>
          <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
        </div>
        <div>
          <el-form-item label="舱房名称：" prop="cabinName" label-width="140px">
            <el-input v-model="ruleForm.cabinName" placeholder="请输入" class="inputWidth"></el-input>
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
          cabinName: '',
        },
        rules: {
          cabinName: [{ required: true, message: '舱房名称不能为空!', trigger: 'blur' }]
        },
        topTitle: '添加'
      }
    },
    computed: {
      
    },
    watch: {
      dialogFormVisible: {
        handler: function () {
          if(this.info.type == 'edit'){
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
          cabinName: '',
        },
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
        if(this.info.type == 'add'){
            this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/cabin-type/add", {
                "id": this.info.id,
                "name": this.ruleForm.cabinName,
                "create_uid": sessionStorage.getItem('id'),
                "org_id": sessionStorage.getItem('orgID')
            }, ).then(function(response) {
                if (response.data.code == '200') {
                    that.$message.success("提交成功！");
                    that.closeAdd();
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
        }else if(this.info.type == 'edit'){
            this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/cabin-type/upd", {
                "id": this.info.id,
                "name": this.ruleForm.cabinName
            }, ).then(function(response) {
                if (response.data.code == '200') {
                    that.$message.success("提交成功！");
                    that.closeAdd();
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

      // 加载编辑数据
      loadData(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/cabin-type/info", {
          "id": this.info.id
        }, ).then(function(response) {
          if (response.data.code == '200') {
            that.ruleForm.cabinName = response.data.data.name;
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
  #addCabin .buttonDv {
    position: absolute;
    top: 8px;
    right: 3%;
  }
  #addCabin .inputWidth {
    min-width: 400px;
    width: 60%;
  }
  #addCabin .inputWidthHalf{
    min-width: 200px;
    width: 28.5%;
    margin-right: 2%;
  }

</style>
