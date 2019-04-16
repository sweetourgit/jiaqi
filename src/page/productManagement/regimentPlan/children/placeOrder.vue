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
                     <td>绝美斯米兰 蓝调普吉6晚8日游（往返转机）</td>
                   </tr>
                   <tr>
                     <td>团期计划：</td>
                     <td>TC-GTY-1001-01-180806-01</td>
                   </tr>
                   <tr>
                     <td>套餐名称：</td>
                     <td>绝美斯米兰</td>
                   </tr>
                   <tr>
                     <td>出发地：</td>
                     <td>沈阳</td>
                   </tr>
                   <tr>
                     <td>目的地：</td>
                     <td>普吉岛</td>
                   </tr>
                   <tr>
                     <td>出发日期：</td>
                     <td>2018-06-06</td>
                   </tr>
                   <tr>
                     <td>余位：</td>
                     <td>20</td>
                   </tr>
                   <tr>
                     <td>参考结算：</td>
                     <td>3000.00</td>
                   </tr>
                </table>
           </div>
           <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="订单来源">
              <div class="ml13">线下直客</div>
            </el-form-item>
            <el-form-item label="选择价格" prop="price" class="cb price">
              <div class="ml13">销售价： 成人 （￥4800）  儿童（￥4000） 老人（￥4000） 单房差（￥300）</div>
            </el-form-item>
            <el-form-item label="报名人数" prop="num1">            
              <div class="ml13">成人<el-input v-model="ruleForm.num1" class="numw" @input="peoNum('adult')"></el-input>余（17） ￥11400</div>
            </el-form-item>
            <el-form-item label="" prop="num2">            
              <div class="ml13">儿童<el-input v-model="ruleForm.num2" class="numw" @input="peoNum('child')"></el-input>余（17） ￥1140</div>
            </el-form-item>
            <el-form-item label="" prop="num3">            
              <div class="ml13">老人<el-input v-model="ruleForm.num3" class="numw" @input="peoNum('elder')"></el-input>余（17） ￥1140</div>
            </el-form-item>
            <el-form-item label="" prop="">            
              <div class="ml13">单房差 ￥340</div>
            </el-form-item>
            <!--其他费用-->
            <el-form-item label="其他费用" prop="otherCost" class="fl">            
              <el-input v-model="ruleForm.otherCost" class="numw"></el-input>
            </el-form-item>
            <div class="fl">            
              备注<el-input v-model="ruleForm.otherCostRemark" class="cost-remark"></el-input>
            </div>
            <!--整体优惠-->
            <el-form-item label="整体优惠" prop="allDiscount" class="cb fl">            
              <el-input v-model="ruleForm.allDiscount" class="numw"></el-input>
            </el-form-item>
            <div class="fl">            
              备注<el-input v-model="ruleForm.allDisRemark" class="cost-remark"></el-input>
            </div>
            <!--总计-->
            <el-form-item label="总计" prop="totalPrice" class="cb">            
              <div class="ml13">{{ruleForm.totalPrice}}</div>
            </el-form-item>
            <!--下单方式-->
            <el-form-item label="下单方式" prop="type">
              <el-radio-group v-model="ruleForm.type"><br/>
                <el-radio label="确认占位" class="radiomar">确认占位 （同业社额度： 总欠款 270,164 元）</el-radio><br/>
                <el-radio label="预定占位" class="radiomar">预定占位 （订单保留24小时，到期提醒）</el-radio><br/>
                <el-radio label="预定不占" class="radiomar">预定不占 （订单保留24小时，到期提醒）</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--订单联系人-->
            <el-form-item label="订单联系人" prop="contactName" class="fl">            
                 <span class="ml13">姓名</span><el-input v-model="ruleForm.contactName" class="numw"></el-input>
            </el-form-item>
            <el-form-item prop="contactPhone" class="fl" style="margin-left:-80px">            
                 电话<el-input v-model="ruleForm.contactPhone" class="numw"></el-input>
            </el-form-item>
            <!--出行人信息-->
            <el-form-item label="出行人信息" class="cb">            
               <div class="oh" v-show="typeNum1">
                 <div class="tour-til">成人</div>
                 <div class="tourist"><input v-for="(item,index) in adult" v-model="item.name" @click="fillTour('1',index)"/></div>
               </div>
               <div class="oh" v-show="typeNum2">
                 <div class="tour-til">儿童</div>
                 <div class="tourist"><input v-for="(item,index) in child" v-model="item.name" @click="fillTour('2',index)"/></div>
               </div>
               <div class="oh" v-show="typeNum3">
                 <div class="tour-til">老人</div>
                 <div class="tourist"><input v-for="(item,index) in elder" v-model="item.name" @click="fillTour('3',index)"/></div>
               </div>
            </el-form-item>
            <el-form-item label="备注" prop="">            
              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" class="remark" placeholder="请输入内容" v-model="ruleForm.remark"></el-input>
            </el-form-item>
          </el-form>
          <!--填写游客信息-->
          <el-dialog :title="'出行人信息（'+winTitle+'）'" :visible.sync="dialogFormVisible" class="city_list"  width="700px">
            <el-form :model="conForm" :rules="rules" ref="conForm">
              <el-form-item label="姓名" prop="name" label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.name" class="w200 fl"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="phone" label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.phone" class="w200"></el-input>
              </el-form-item>
              <el-form-item label="姓(拼音)" prop="firstName" label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.firstName" class="w200"></el-input>
              </el-form-item>
              <el-form-item label="名(拼音)" prop="lastName"  label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.lastName" class="w200"></el-input>
              </el-form-item>
              <el-form-item label="护照" prop="passport"  label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.passport" class="w200"></el-input>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer1 cb">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="subInfo('conForm')" class="confirm">确 定</el-button>
            </div>
          </el-dialog>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      adult:[],
      child:[],
      elder:[],
      dialogFormVisible: false,
      form:{
          
      },
      typeNum1:false,
      typeNum2:false,
      typeNum3:false,
      winTitle:'',
      ruleForm: {           
          resource:'',         
          num1: '',
          num2: '',
          num3: '',
          otherCost: '0',
          otherCostRemark: '',
          allDiscount: '0',
          allDisRemark: '',
          totalPrice:'',
          type: '',    
          contactName:'',
          contactPhone:'',
          remark:'',
        },
        conForm: {   
          name:'',
          phone:'',
          firstName:'',
          lastName:'',
          passport:''
        },
        rules: {
          resource: [{ required: true, message: '请选择订单来源', trigger: 'change' }],
          totalPrice: [{ required: true, message: '价格不能为空'}],
          otherCost: [
            { required: true, message: '请输入其他费用', trigger: 'blur' },
            { pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/, message: '必须为数字值，并且不允许是负数'}],
          allDiscount: [
            { required: true, message: '请输入整体优惠', trigger: 'blur' },
            { pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/, message: '必须为数字值，并且不允许是负数'}],
          num1: [
            { required: true, message: '请输入数量', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '数量必须为数字值'}],
          num2: [
            { required: true, message: '请输入数量', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '数量必须为数字值'}],
          num3: [
            { required: true, message: '请输入数量', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '数量必须为数字值'}],
          type: [{ required: true, message: '请选择下单方式', trigger: 'change' }],
          contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
          contactPhone: [{ required: true, message: '请输入联系人电话', trigger: 'blur' }],
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '手机号格式不正确'}],
          firstName: [
            { required: true, message: '请输入姓（拼音）', trigger: 'blur' },
            { pattern: /(a[io]?|ou?|e[inr]?|ang?|ng|[bmp](a[io]?|[aei]ng?|ei|ie?|ia[no]|o|u)|pou|me|m[io]u|[fw](a|[ae]ng?|ei|o|u)|fou|wai|[dt](a[io]?|an|e|[aeio]ng|ie?|ia[no]|ou|u[ino]?|uan)|dei|diu|[nl](a[io]?|ei?|[eio]ng|i[eu]?|i?ang?|iao|in|ou|u[eo]?|ve?|uan)|nen|lia|lun|[ghk](a[io]?|[ae]ng?|e|ong|ou|u[aino]?|uai|uang?)|[gh]ei|[jqx](i(ao?|ang?|e|ng?|ong|u)?|u[en]?|uan)|([csz]h?|r)([ae]ng?|ao|e|i|ou|u[ino]?|uan)|[csz](ai?|ong)|[csz]h(ai?|uai|uang)|zei|[sz]hua|([cz]h|r)ong|y(ao?|[ai]ng?|e|i|ong|ou|u[en]?|uan))/, message: '姓（拼音）格式不正确'}],
          lastName: [
            { required: true, message: '请输入名（拼音）', trigger: 'blur' },
            { pattern: /(a[io]?|ou?|e[inr]?|ang?|ng|[bmp](a[io]?|[aei]ng?|ei|ie?|ia[no]|o|u)|pou|me|m[io]u|[fw](a|[ae]ng?|ei|o|u)|fou|wai|[dt](a[io]?|an|e|[aeio]ng|ie?|ia[no]|ou|u[ino]?|uan)|dei|diu|[nl](a[io]?|ei?|[eio]ng|i[eu]?|i?ang?|iao|in|ou|u[eo]?|ve?|uan)|nen|lia|lun|[ghk](a[io]?|[ae]ng?|e|ong|ou|u[aino]?|uai|uang?)|[gh]ei|[jqx](i(ao?|ang?|e|ng?|ong|u)?|u[en]?|uan)|([csz]h?|r)([ae]ng?|ao|e|i|ou|u[ino]?|uan)|[csz](ai?|ong)|[csz]h(ai?|uai|uang)|zei|[sz]hua|([cz]h|r)ong|y(ao?|[ai]ng?|e|i|ong|ou|u[en]?|uan))/, message: '名（拼音）格式不正确'}],
          passport: [{ required: true, message: '请输入护照', trigger: 'blur' }],
        }
    }
  },
  mounted(){

  },
  methods: {
     peoNum(num){
        let arr;
        let arrLength;
        if(num=='adult'){
          this.adult=[];
          arr=this.adult;
          arrLength=this.ruleForm.num1;
          if(arrLength!=0){
            this.typeNum1=true;
          }else{
            this.typeNum1=false;
          }
        }
        if(num=='child'){
          this.child=[];
          arr=this.child;
          arrLength=this.ruleForm.num2;
          if(arrLength!=0){
            this.typeNum2=true;
          }else{
            this.typeNum2=false;
          }
        }
        if(num=='elder'){
          this.elder=[];
          arr=this.elder;
          arrLength=this.ruleForm.num3;
          if(arrLength!=0){
            this.typeNum3=true;
          }else{
            this.typeNum3=false;
          }
        }
        for(var i=0;i<arrLength;i++){
           arr.push({name:"点击填写"});
        }        
     },
     fillTour(type,index){
        if(type==1){
          this.winTitle="成人";
        }
        if(type==2){
          this.winTitle="儿童";
        }
        if(type==3){
          this.winTitle="老人";
        }
        this.dialogFormVisible = true;
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
      },
      subInfo(formName){
         this.$refs[formName].validate((valid) => {
          if (valid) {
         
             this.dialogFormVisible = false;
            }
          });
         
      }
    }
}
</script>

<style scoped>
    *{font-size:14px}
    .main{border:1px solid #e6e6e6;overflow:hidden;width: 70%;min-width:900px;padding-bottom: 50px;margin-bottom: 120px}
    .order-title{overflow: hidden}
    .order-title h2{font-size: 17px;font-weight: normal;float: left;margin:25px 30px}
    .dialog-footer{float: right;margin:20px 50px;}
    .dialog-footer1{text-align: left;margin:20px 0 20px 108px;padding-top: 20px}
    .pro-info{font-size: 14px;background-color: #e6e6e6;margin:0 30px 30px 30px;line-height: 25px;padding:10px 20px}
    .demo-ruleForm{margin-left: 10px;}
    .fl{float: left}
    .cb{clear: both}
    .numw{width: 150px;text-align: center;margin:0 15px}
    .cost-remark{width: 300px;text-align: center;margin:0 15px}
    .radiomar{margin:12px 13px}
    .ml13{margin-left: 13px}
    .tourist{margin-left: 13px;float: left;width:85%}
    .tourist input{width: 110px;background-color: #f6f6f6;text-align: center;border:0;height: 40px;margin-left: 15px;margin:1px 10px 10px 10px}
    .tour-til{float: left;margin-left: 13px;margin-right: -8px}
    .oh{overflow: hidden;}
    .disib{display: inline-block;}
    .remark{width: 70%;margin-left: 12px}
    .w200{width: 200px}
</style>