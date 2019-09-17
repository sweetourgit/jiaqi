<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <div class="button_select">
        <el-button type="primary" @click="cancel()" size="medium" plain>取消</el-button>
        <!--<el-button type="primary" @click="save()" size="medium" plain>保存</el-button>-->
        <el-button type="primary" @click="reject()" size="medium" plain>一键驳回</el-button>
        <el-button type="primary" @click="submit()" size="medium">审批提交</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="收款编码" name="one">
        <Receivables ref="receivables"></Receivables>
      </el-tab-pane>
      <el-tab-pane label="发票" name="two">
        <Invoice ref="invoice"></Invoice>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import Invoice from '@/page/Finance/pledgingManagement/pledgingManagementInfo/invoice'
import Receivables from '@/page/Finance/pledgingManagement/pledgingManagementInfo/receivables'
import StartNumber from '@/page/Finance/pledgingManagement/pledgingManagementInfo/startNumber'
export default {
  name: "pledgingManagementApproval",
  components: {
    Invoice,
    Receivables,
    StartNumber,
  },
  data() {
    return {
      activeName: 'one',
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {},
  methods: {
    handleClick() {
      this.reable = true
      this.transmit = !this.transmit
      this.pid = ''
    },
    close() {
      this.dialogFormVisible = false
    },
    reject() {
      const that = this;
      this.$confirm('是否一键驳回所有认款记录?', '提示', {
        confirmButtonText: '驳回',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
//      alert(this.$parent.$parent.$parent.paramTour);
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/recognition/recognition/reconereject", {
          "tour_no": this.paramTour,
          "approval_uid": sessionStorage.getItem('id')
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log(response);
            that.$message({
              type: 'success',
              message: '驳回成功!'
            });
            that.$refs.receivables.loadData();
            that.$refs.invoice.loadData();
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning("驳回失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消驳回'
        });
      });
    },
    save() {
      this.$confirm('是否保存审批记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消保存'
        });
      });
    },
    cancel() {
      this.$router.push({ path: "/pledgingManagement" });
    },
    //审批提交
    submit() {
      const that = this;
      this.$confirm('是否审核提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/recognition/recognition/examine", {
          "tour_no": this.paramTour
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log(response);
            that.$message({
              type: 'success',
              message: '审核提交成功!'
            });
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning("审核提交失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消保存'
        });
      });
    }
  },
  created() {
//    alert(JSON.stringify(this.$route.params));
//    this.paramTour = this.$route.params.tour_no;
    if(this.$route.query.tour_no){
      this.paramTour = this.$route.query.tour_no;
    }else{
      this.cancel();
    }
  }

}

</script>
<style lang="scss" scoped>
.vivo {
  .demo-input-suffix {
    width: auto;
    background-color: #F7F7F7;
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 30px;

    .search-title {
      font-size: 14px;
      margin-left: 20px;
      margin-top: 10px;
    }

    .el-input {
      width: 20%;
    }

    .el-input__inner {
      width: 10%;
    }

    .demo-input-suffix {
      width: 900px
    }

    .date-line {
      width: 10px;
      border-bottom: 1px solid #e6e6e6;
      display: inline-block;
      margin: 0 3px 3px 0
    }

    .button_select {
      display: inline;
      margin-left: 65%;
    }

  }

  .main {
    margin-top: 40px;
    margin-bottom: 20px;
    text-align: left;
  }

}



.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

</style>
