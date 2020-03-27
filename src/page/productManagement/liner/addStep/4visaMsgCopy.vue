<template>
  <div class="vivo" style="position:relative" id="applyFor">
    <!--申请预付款-->
    <el-dialog title="新增签证信息" :visible="dialogFormVisibleCopy" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close="false" width="40%" @close="closeAdd">
      <div class="buttonDv">
        <el-button class="el-button" type="primary" @click="submitForm('ruleForm')">提 交</el-button>
        <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
      </div>
      <span class="titleSpan">复制：</span>
      <el-select  v-model="visaCopy">
        <el-option :key="item.id" v-for="item in visaList" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: "newTour",
    components: {},
    props: {
      dialogFormVisibleCopy: false,
      info: ''
    },
    data() {
      return {
        visaCopy: '',
        visaList: []
      }
    },
    computed: {
      
    },
    watch: {
      dialogFormVisibleCopy: {
        handler: function () {
          if(this.dialogFormVisibleCopy){
            this.loadData();
          }
        }
      }
    },
    methods: {
      // 关闭弹框
      closeAdd(str) {
        this.$emit('close', str);
      },
      // 取消按钮事件
      cancalBtn(){
        this.$confirm("是否取消本次操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$message.success("已取消添加");
          this.closeAdd('cancle');
        }).catch(() => {

        });
      },
      // 提交按钮
      submitForm(formName) {
        const that = this;
        if(this.visaCopy == ''){
          this.closeAdd('add');
        }else{
          this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/product/product/copyproductvisa', {
            "visa_id": this.visaCopy,
            "create_uid": sessionStorage.getItem('id'),
            "org_id": sessionStorage.getItem('orgID')
          }).then(res => {
            // console.log(res);
            if (res.data.code == 200) {
                that.$message({
                  type: 'success',
                  message: '复制成功!'
                });
                that.closeAdd('copy');

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
        }
        
      },

      // 加载编辑数据
      loadData(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product/getproductvisa", {
          "product_id": this.$route.query.id
        }, ).then(function(response) {
          if (response.data.code == '200') {
            if(response.data.data.list.length != 0){
              that.visaList = [{
                id: '',
                name: '无'
              }];
              response.data.data.list.forEach(function(item, index, arr){
                that.visaList.push({
                  id: item.id,
                  name: item.title
                })
              })
            }
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
<style lang="scss" scoped>
  .titleSpan{
    display: inline-block;
    width: 50px;
  }
  .el-select{
    width: 280px;
  }
</style>
