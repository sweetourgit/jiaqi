<template>
  <div class="curiseShip">
    <el-form>
      <div class="buttonDv">
        <el-button class="el-button" type="primary" @click="saveFun">保 存</el-button>
        <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
      </div>
      <el-form-item label="其他说明：" label-width="140px">
        <el-input v-model="reminderOther" placeholder="请输入" :rows="8" class="inputWidth" type="textarea" maxlength="1000" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    
    
  </div>
</template>
<script type="text/javascript">
export default {
  name: "curiseShip",
  components: {
    
  },
  data() {
    return {
      reminderOther: ''
    }
  },
  computed: {
    
  },
  methods: {
    cancalBtn(){
      const that = this;
      this.$confirm("是否取消本次添加?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "退出并保存",
        cancelButtonText: "退出并删除",
        type: "warning"
      }).then(() => {
        that.saveFun();
      }).catch( action => {
        if(action === 'cancel'){
          that.$router.push({
            path: '/productList/productLiner',
            name: '邮轮'
          });
        }
      });
    },
    // 提交按钮
      saveFun() {
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/product/product/saveproductcostother', {
          "product_id": this.$route.query.id,
          "cost_other": this.reminderOther,
          "create_uid": sessionStorage.getItem('id'),
          "org_id": sessionStorage.getItem('orgID')
        }).then(res => {
          if (res.data.code == 200) {
            that.$message({
              type: 'success',
              message: '创建成功!'
            });
            that.$router.push({
              path: '/productList/productLiner',
              name: '邮轮'
            });
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
      },
      loadData(){
        // alert(this.info);
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product/getproductcostother", {
          "product_id": this.$route.query.id
        }, ).then(function(response) {
          console.log('其他说明',response);
          if (response.data.code == '200') {
            that.reminderOther = response.data.data.info.cost_other.content;
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
    if(this.$route.query.id){
      this.loadData();
    }
  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
  .buttonDv{
    overflow: hidden;
    margin-bottom: 20px;
    .el-button{
      float: right;
      margin-right: 18px;
    }
  }
</style>
