<template>
  <div>
       <!--备注信息弹窗-->
       <el-dialog title="订单备注" :visible.sync="dialogFormMark" class="city_list" width="780px">
          <el-form :model="markForm" ref="markForm" label-width="80px" class="demo-ruleForm">
               <el-form-item label="客人：">            
                  <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" class="remark" placeholder="请输入内容" v-model="markForm.remark"></el-input>
                  <div class="time">2018-10-11 17:23:23</div>
               </el-form-item>
               <el-form-item label="阳阳：">            
                  <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" class="remark" placeholder="请输入内容" v-model="markForm.remark"></el-input>
                  <div class="time">2018-10-11 17:23:23</div>
               </el-form-item>
               <el-form-item label="填写备注">            
                  <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" class="remark" placeholder="请输入内容" v-model="markForm.remark"></el-input>
               </el-form-item>
               <el-form-item>
                  <el-button type="info" size="medium" class="submitMark">提交备注</el-button>
               </el-form-item>
               <el-form-item>
                  <el-button class="colse">关闭</el-button>
               </el-form-item>
          </el-form>
       </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    orderId:0,
    variable:0,
    dialogType:0
  },
  data() {
    return {
       //备注信息弹窗
       dialogFormMark:false,     
       markForm:{

       }
    }
  },
  created(){
  },
  watch: {
      variable:function(){        
        if(this.dialogType==2){
          this.dialogFormMark=true;    
        }
     }
  },
  methods: {

    }
}
</script>

<style scoped>
   .demo-ruleForm{margin-top: 20px}
   .remark{width: 600px}
   .time{margin-right: 60px;text-align: right;color: #999}
   .submitMark{float: right;margin-right: 60px}
   .colse{margin-left: 230px;width: 100px}
</style>