<template>
  <div class="curiseShip">
    <div class="buttonDv">
      <el-button class="el-button" type="primary" @click="saveFun(1)">保 存</el-button>
      <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
    </div>
    <el-upload ref="upload1" class="upload-demo" :action="UploadUrl1()" :headers="headers" :on-success="handleSuccess1" :on-error="handleError1" :on-remove="handleRemove1" :before-remove="beforeRemove1" :on-exceed="handleExceed1" :file-list="fileList1" :limit="1">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "curiseShip",
  components: {
    
  },
  data() {
    return {
      fileList1: []
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
  methods: {
    cancalBtn(){
      const that = this;
      this.$confirm("是否取消本次添加?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "退出并保存",
        cancelButtonText: "退出并删除",
        type: "warning"
      }).then(() => {
        that.saveFun(1);
      }).catch( action => {
        if(action === 'cancel'){
          this.$router.push({
            path: '/cruiseShip/cruiseShipDetail',
            name: '邮轮管理/详情',
            query: {
              "id": this.$route.query.id
            }
          });
          localStorage.removeItem('liner_id');
        }
      });
    },
    // 提交按钮
      saveFun(type) {
        const that = this;
            
        let fileArr = [];
        if(that.fileList1.length == 0){
          that.$message.warning("图片不能为空！");
        }else{
          that.fileList1.forEach(function (item, index, arr) {
            fileArr.push({
              pic_id: item.id,
              pic_url: item.url
            });
          })
        }
        let ida = '';
        if(this.info){
          ida = this.info;
        }
          
        this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/liner/liner-deck/savelinerdeck', {
          "button_type": type,
          "id": localStorage.getItem('liner_id'),
          "pics": fileArr,
          // "create_uid": sessionStorage.getItem('id'),
          // "org_id": sessionStorage.getItem('orgID')
        }).then(res => {
          // console.log(res);
          if (res.data.code == 200) {
              that.$message({
              type: 'success',
              message: '创建成功!'
              });
              that.$router.back();
              localStorage.removeItem('liner_id');
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
     // 上传凭证 function logo
      UploadUrl1(){
        return this.GLOBAL.serverSrcPhp + '/api/v1/upload/pzfiles';
      },
      handleSuccess1(response, file, fileList){
        // console.log(response);
        // console.log(file);
        if(response.code == 200){
          this.fileList1.push(response.data);
        }else{
          if(response.message){
            this.$message.warning(response.message);
          }else{
            this.$message.warning('文件上传失败');
          }
        }
      },
      handleError1(err, file, fileList){
        this.$message.warning(`文件上传失败，请重新上传！`);
      },
      handleRemove1(file, fileList) {
        console.log(file, fileList);
        this.fileList1 = fileList;
      },
      handleExceed1(files, fileList) {
        this.$message.warning(`平台订单只支持一个附件上传！`);
      },
      beforeRemove1(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      loadData(){
        // alert(this.info);
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner-deck/viewlinerdeck", {
          "id": localStorage.getItem('liner_id')
        }, ).then(function(response) {
          console.log('play-detail',response);
          if (response.data.code == '200') {
            that.fileList1 = response.data.data;
            that.fileList1.forEach(function(item, index, arr){
              item.name = response.data.data[index].pic_name;
              item.id = response.data.data[index].pic_id;
              item.url = response.data.data[index].pic_url;
            })

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
    if(localStorage.getItem('liner_id')){
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
    .el-button{
      float: right;
      margin-right: 18px;
    }
  }
</style>
