<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="绑定" :visible="dialogFormVisible" width=50%  @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div style="height: 300px;">
          <el-form-item label="团期计划" prop="tour" label-width="120px" style="float:left;">
            <el-input v-model="ruleForm.tour" @blur="tour_check" class="inputWidth" placeholder="请输入或者选择团期计划"></el-input>
            <el-input v-model="ruleForm.title" :disabled="true" class="inputWidth" style="margin-top: 5px" placeholder="自动显示产品名称"></el-input>
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
  name: "relation",
  components: {},
  props: {
    dialogFormVisible: false,
    pid: '',
  },
  data() {
    return {
      ruleForm: {
        tour: '',
        title: ''
      },
      rules: {
        tour: [{ required: true, message: '团期计划不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '产品名称不存在，请确认团期计划准确', trigger: 'blur' }]
      },
      product: ''
    }
  },
  computed: {
    // 计算属性的 getter
  },
  methods: {
    closeAdd() {
      this.ruleForm.tour = '';
      this.ruleForm.title = '';
      this.$emit('close', false);
    },
    tour_check() {
      const that = this;
      if (this.ruleForm.tour != '') {
        this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/groupplan/group-plan/getproname', {
          "tour_no": this.ruleForm.tour
        }).then(res => {
            console.log(res);
          if (res.data.code == 200) {
            if(res.data.data){
              that.ruleForm.title = res.data.data;
            }else{
              that.ruleForm.title = '';
            }
          }else{
            that.ruleForm.title = '';
          }
        }).catch(err => {
          console.log(err)
        })
      }else{
        this.ruleForm.title = '';
      }
    },
    submitForm() {
      if(this.ruleForm.title == '' || this.ruleForm.title == undefined){
        this.$message({
          type: 'warning',
          message: '产品名称不存在，请确认团期计划准确!'
        });
        return;
      }
//      console.log(this.$parent.multipleSelection);
      let order_sn = '';
      this.$parent.multipleSelection.forEach(function (item, index, arr) {
        order_sn += item.order_sn + ','
      });
      order_sn = order_sn.substr(0,order_sn.length-1);
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/order/external-order/bindpro', {
        "order_sn": order_sn,
        "tour_no": this.ruleForm.tour,
        "product_name": this.ruleForm.title,
        "create_uid": sessionStorage.getItem('id'),
        "org_id": sessionStorage.getItem('orgID')
      }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
//          alert(JSON.stringify(res.data));
          that.$message({
            type: 'success',
            message: '提交成功!'
          });
          that.closeAdd();
        }else{
          this.$message({
            type: 'warning',
            message: res.data.message
          });
        }
      }).catch(err => {
        console.log(err)
      })

    },
  },
  created() {

  }
}

</script>
<style lang="scss" scoped>
.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: 100px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

</style>
