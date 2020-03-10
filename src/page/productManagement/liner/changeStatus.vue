<template>
  <div class="vivo" style="position:relative" id="applyFor">
    <!--申请预付款-->
    <el-dialog title="更改状态" :visible="dialogFormVisible" style="margin:-80px 0 0 0;" :show-close="false" custom-class="city_list" width="40%" @close="closeAdd">
      <el-form>
        <div class="buttonDv">
          <el-button class="el-button" type="primary" @click="submitForm()">提 交</el-button>
          <el-button class="el-button" type="danger" @click="closeAdd">取 消</el-button>
        </div>
        <span>订单来源：</span>
        <el-radio v-model="radioType" label="1">线上上线</el-radio>
        <el-radio v-model="radioType" label="3">仅erp上线</el-radio>
        <el-radio v-model="radioType" label="2">下线</el-radio>
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
        radioType: ''
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
            this.radioType = this.info.line_status;
          }
        }
      }
    },
    methods: {
      // 关闭弹框
      closeAdd() {
        
        this.$emit('close', false);
      },
      // 提交按钮
      submitForm() {
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/product/product/updatelinestatus', {
          "product_id": this.info.id,
          "line_status": this.radioType
        }).then(res => {
          // console.log(res);
          if (res.data.code == 200) {
            that.$message({
              type: 'success',
              message: '状态修改成功!'
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
                message: '修改失败'
              });
            }
          }
        }).catch(err => {
          console.log(err)
        })
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
  #applyFor .el-form{
    margin: 20px auto;
  }

</style>
