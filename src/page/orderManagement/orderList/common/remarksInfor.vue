<template>
  <div>
       <!--备注信息弹窗-->
       <el-dialog title="订单备注" :visible.sync="dialogFormMark" class="city_list" width="780px">
          <el-form :model="markFormAdd" :rules="rules" ref="markFormAdd" label-width="80px" class="demo-ruleForm">
               <div v-for="item in markForms">
               <el-form-item :label="name">            
                  <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" class="remark" placeholder="请输入内容" v-model="item.Mark" :disabled="true"></el-input>
                  <div class="time">{{item.CreateTime}}</div>
               </el-form-item>
               </div>
               <el-form-item label="填写备注" prop="Mark">            
                  <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" class="remark" placeholder="请输入内容" v-model="markFormAdd.Mark"></el-input>
               </el-form-item>
               <el-form-item>
                  <el-button type="info" size="medium" class="submitMark" @click="submitMark">提交备注</el-button>
               </el-form-item>
               <el-form-item>
                  <el-button class="colse" @click="close">关闭</el-button>
               </el-form-item>
          </el-form>
       </el-dialog>
  </div>
</template>

<script>
import {formatDate} from '@/js/libs/publicMethod.js'
export default {
  props:{
    orderId:0,
    variable:0,
    dialogType:0
  },
  data() {
    return {
       name:localStorage.getItem('name'),
       //备注信息弹窗
       dialogFormMark:false,     
       markFormAdd:{
         "OrderCode":"",
         'Mark':'',
         "CreateTime":formatDate(new Date())
       },
       markForms:[],
       orderget:{},
       rules:{      
         Mark: [{ required: true, message: '请填写备注信息', trigger: 'blur' }]
       }
    }
  },
  created(){
  },
  watch: {
      variable:function(){        
        if(this.dialogType==2){
          this.orderGet(this.orderId);   
          this.dialogFormMark=true;    
        }
     }
  },
  methods: {
      close(){
        this.dialogFormMark=false;
        this.$refs['markFormAdd'].resetFields();
      },
      orderGet(orderId){
        //查询一条订单信息
        this.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderget',{
             "id": orderId
          }).then(res => {
            if(res.data.isSuccess == true){
               this.orderget = res.data.object;
               this.markForms = res.data.object.remark?JSON.parse(res.data.object.remark):[];
            }
          }).catch(err => {
            console.log(err)
        })
      },
      submitMark(){
        this.$refs['markFormAdd'].validate((valid) => {
          let obj=JSON.parse(JSON.stringify(this.markForms));
          obj.push(this.markFormAdd);
          this.orderget.remark=JSON.stringify(obj);
          this.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderinsert',{
                "object":this.orderget
          }).then(res => {
            if(res.data.isSuccess == true){
              this.$message.success("提交成功");
              this.dialogFormMark=false;
              this.$refs['markFormAdd'].resetFields();
            }else{
              this.$message.error('提交失败');
            }            
          });
        });      
        
      }
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