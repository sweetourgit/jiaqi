<template>
  <div>
      <div class="main">
           <div class="order-title">
              <h2>订单信息</h2>
              <div slot="footer" class="dialog-footer">
                 <router-link to="/regimentPlan/planList" style="margin-right:20px"><el-button>取 消</el-button></router-link>
                 <el-button type="primary" @click="submitForm('ruleForm')" class="confirm">下单</el-button>
              </div>
           </div>
           <div class="pro-info">
                <table>
                   <tr>
                     <td width="80">产品：</td>
                     <td>1</td>
                   </tr>
                   <tr>
                     <td>团期计划：</td>
                     <td>1</td>
                   </tr>
                   <tr>
                     <td>套餐名称：</td>
                     <td>1</td>
                   </tr>
                   <tr>
                     <td>出发地：</td>
                     <td>1</td>
                   </tr>
                   <tr>
                     <td>目的地：</td>
                     <td>1</td>
                   </tr>
                   <tr>
                     <td>出发日期：</td>
                     <td>1</td>
                   </tr>
                   <tr>
                     <td>余位：</td>
                     <td>1</td>
                   </tr>
                </table>
           </div>
           <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="订单来源" prop="resource">
              <el-radio-group v-model="ruleForm.resource">
                <el-radio label="同业社" class="radiomar"></el-radio>
                <el-radio label="线下直客" class="radiomar"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="销售" prop="sale" class="fl">
              <el-select v-model="ruleForm.sale" placeholder="请选择" class="optionw ml13">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="同业社" prop="sale" class="fl">
              <el-select v-model="ruleForm.travel" placeholder="请选择" class="optionw">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择价格" prop="price" class="cb">
              <el-radio-group v-model="ruleForm.price"><br/>
                <el-radio label="同业价" class="radiomar">同业价： 成人 （￥3800）  儿童（￥3000） 老人（￥3000） 单房差（￥200）</el-radio><br/>
                <el-radio label="销售价" class="radiomar">销售价： 成人 （￥4800）  儿童（￥4000） 老人（￥4000） 单房差（￥300）</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="报名人数" prop="num1">            
              <div class="ml13">成人<el-input v-model="ruleForm.num1" class="numw" @input="adultNum"></el-input>余（17） ￥11400</div>
            </el-form-item>
            <el-form-item label="" prop="num2">            
              <div class="ml13">儿童<el-input v-model="ruleForm.num2" class="numw"></el-input>余（17） ￥1140</div>
            </el-form-item>
            <el-form-item label="" prop="num3">            
              <div class="ml13">老人<el-input v-model="ruleForm.num3" class="numw"></el-input>余（17） ￥1140</div>
            </el-form-item>
            <el-form-item label="下单方式" prop="type">
              <el-radio-group v-model="ruleForm.type"><br/>
                <el-radio label="确认占位" class="radiomar">确认占位 （同业社额度： 总欠款 270,164 元 ；额度 999,999 元 ；剩余额度 729,835 元）</el-radio><br/>
                <el-radio label="预定占位" class="radiomar">预定占位 （订单保留24小时，到期提醒）</el-radio><br/>
                <el-radio label="预定不占" class="radiomar">预定不占 （订单保留24小时，到期提醒）</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="订单联系人" prop="contact1">            
              <div class="ml13">姓名<el-input v-model="ruleForm.contact1" class="numw"></el-input></div>
            </el-form-item>
            <el-form-item label="" prop="contact2">            
              <div class="ml13">电话<el-input v-model="ruleForm.contact2" class="numw"></el-input></div>
            </el-form-item>
            <el-form-item label="出行人信息">            
               <div class="tour-til">成人</div><div class="tourist"><input v-for="item in adult" v-model="item.name" disabled="disabled"/></div>
            </el-form-item>

          </el-form>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      adult:[],
      ruleForm: {
          resource: '',                    
          sale:'',
          travel: '',
          price:'',
          num1: '',
          num2: '',
          num3: '',
          type: '',    
          contact1:'',
          contact2:'',
        },
        rules: {
          resource: [
            { required: true, message: '请选择订单来源', trigger: 'change' }
          ],
          sale: [
            { required: true, message: '请选择销售', trigger: 'change' }
          ],
          travel: [
            { required: true, message: '请选择同业社', trigger: 'change' }
          ],
          price: [
            { required: true, message: '请选择价格', trigger: 'change' }
          ],
          num1: [
            { required: true, message: '请输入数量', trigger: 'blur' }
          ],
          num2: [
            { required: true, message: '请输入数量', trigger: 'blur' }
          ],
          num3: [
            { required: true, message: '请输入数量', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择下单方式', trigger: 'change' }
          ],
          contact1: [
            { required: true, message: '请输入联系人信息', trigger: 'blur' }
          ],
          contact2: [
            { required: true, message: '请输入联系人信息', trigger: 'blur' }
          ]

        }
    }
  },
  mounted(){

  },
  methods: {
     adultNum(){
        this.adult=[];
        for(var i=0;i<this.ruleForm.num1;i++){
           this.adult.push({name:"点击填写"});
        }
     },
     submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
}
</script>

<style scoped>
    .main{border:1px solid #e6e6e6;overflow:hidden;width: 70%;min-width:900px;padding-bottom: 50px;margin-bottom: 120px}
    .order-title{overflow: hidden}
    .order-title h2{font-size: 17px;font-weight: normal;float: left;margin:25px 30px}
    .dialog-footer{float: right;margin:20px 30px}
    .pro-info{font-size: 14px;background-color: #e6e6e6;margin:0 30px 30px 30px;line-height: 25px;padding:10px 20px}
    .demo-ruleForm{margin-left: 10px;}
    .fl{float: left}
    .cb{clear: both}
    .optionw{width: 280px}
    .numw{width: 124px;text-align: center;margin:0 15px;}
    .radiomar{margin:12px 13px}
    .ml13{margin-left: 13px}
    .tourist{margin-left: 13px;float: left;width:85%}
    .tourist input{width: 110px;background-color: #f6f6f6;text-align: center;border:0;height: 40px;margin-left: 15px;margin:5px 10px 10px 10px}
    .tour-til{float: left;margin-left: 13px;margin-right: -8px}
</style>