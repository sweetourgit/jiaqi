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
            <el-form-item label="订单来源" prop="orderRadio">
                <el-radio label="1" class="radiomar" v-model="ruleForm.orderRadio">同业社</el-radio>
                <el-radio label="2" class="radiomar" v-model="ruleForm.orderRadio">门店</el-radio>
                <el-radio label="3" class="radiomar" v-model="ruleForm.orderRadio">线下直客</el-radio>
            </el-form-item>
            <div v-if="ruleForm.orderRadio==1">
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
            </div>
            <div v-if="ruleForm.orderRadio==2">
                <el-form-item label="销售" prop="sale" class="fl">
                  <el-select v-model="ruleForm.sale" placeholder="请选择" class="optionw ml13">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="门店" prop="sale" class="fl">
                  <el-select v-model="ruleForm.travel" placeholder="请选择" class="optionw">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
            </div>
            <div v-if="ruleForm.orderRadio==3">
                <el-form-item label="销售" prop="sale" class="fl">
                  <el-select v-model="ruleForm.sale" placeholder="请选择" class="optionw ml13">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
            </div>


            <el-form-item label="选择价格" prop="price" class="cb price">
              <el-radio-group v-model="ruleForm.price"><br/>
                <el-radio label="同业价" class="radiomar">同业价： 成人 （￥3800）  儿童（￥3000） 老人（￥3000） 单房差（￥200）</el-radio><br/>
                <el-radio label="销售价" class="radiomar">销售价： 成人 （￥4800）  儿童（￥4000） 老人（￥4000） 单房差（￥300）</el-radio>
                <el-radio label="自定义" class="radiomar">自定义： 
                     成人<el-form-item prop="price1" class="disib"><el-input v-model="ruleForm.price1" class="pricew"></el-input></el-form-item>
                     儿童<el-form-item prop="price2" class="disib"><el-input v-model="ruleForm.price2" class="pricew"></el-input></el-form-item>
                     老人<el-form-item prop="price3" class="disib"><el-input v-model="ruleForm.price3" class="pricew"></el-input></el-form-item>
                     单房差<el-form-item prop="price4" class="disib"><el-input v-model="ruleForm.price4" class="pricew"></el-input></el-form-item>
                </el-radio>
              </el-radio-group>
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
            <el-form-item label="总计" prop="totalPrice">            
              <div class="ml13">{{ruleForm.totalPrice}}</div>
            </el-form-item>
            <el-form-item label="下单方式" prop="type">
              <el-radio-group v-model="ruleForm.type"><br/>
                <el-radio label="确认占位" class="radiomar">确认占位 （同业社额度： 总欠款 270,164 元）</el-radio><br/>
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
               <div class="oh" v-show="typeNum1">
                 <div class="tour-til">成人</div>
                 <div class="tourist"><input v-for="(item,index) in adult" v-model="item.name" @click="fillTour(index)"/></div>
               </div>
               <div class="oh" v-show="typeNum2">
                 <div class="tour-til">儿童</div>
                 <div class="tourist"><input v-for="(item,index) in child" v-model="item.name" @click="fillTour(index)"/></div>
               </div>
               <div class="oh" v-show="typeNum3">
                 <div class="tour-til">老人</div>
                 <div class="tourist"><input v-for="(item,index) in elder" v-model="item.name" @click="fillTour(index)"/></div>
               </div>
            </el-form-item>
            <el-form-item label="备注" prop="">            
              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" class="remark" placeholder="请输入内容" v-model="remark"></el-input>
            </el-form-item>
          </el-form>
          



          <!--填写游客信息-->
          <el-dialog title="更改状态" :visible.sync="dialogFormVisible" class="city_list">
            <el-form :model="form">
       
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false" class="confirm">确 定</el-button>
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
      ruleForm: {     
          orderRadio:"1",            
          resource:'',
          sale:'',
          travel:'',
          price:'',
          price1:'',
          price2:'',
          price3:'',
          price4:'',
          totalPrice:'',
          num1: '',
          num2: '',
          num3: '',
          type: '',    
          contact1:'',
          contact2:''
        },
        remark:'',
        rules: {
          orderRadio: [
            { required: true, message: '请选择订单来源', trigger: 'change' }
          ],
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
          price1: [
            { pattern: /^[+]{0,1}(\d+)$/, message: '价格必须为数字值'}
          ],
          price2: [
            { pattern: /^[+]{0,1}(\d+)$/, message: '价格必须为数字值'}
          ],
          price3: [
            { pattern: /^[+]{0,1}(\d+)$/, message: '价格必须为数字值'}
          ],
          price4: [
            { pattern: /^[+]{0,1}(\d+)$/, message: '价格必须为数字值'}
          ],
          totalPrice: [
            { required: true, message: '价格不能为空'}
          ],
          num1: [
            { required: true, message: '请输入数量', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '数量必须为数字值'}
          ],
          num2: [
            { required: true, message: '请输入数量', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '数量必须为数字值'}
          ],
          num3: [
            { required: true, message: '请输入数量', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '数量必须为数字值'}
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
     fillTour(index){
        alert(index);
        this.dialogFormVisible = true
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
    .price .pricew{width: 90px;text-align: center;margin:-5px 15px;}
    .numw{width: 90px;text-align: center;margin:0 15px;}
    .radiomar{margin:12px 13px}
    .ml13{margin-left: 13px}
    .tourist{margin-left: 13px;float: left;width:85%}
    .tourist input{width: 110px;background-color: #f6f6f6;text-align: center;border:0;height: 40px;margin-left: 15px;margin:5px 10px 10px 10px}
    .tour-til{float: left;margin-left: 13px;margin-right: -8px}
    .oh{overflow: hidden;}
    .disib{display: inline-block;}
    .remark{width: 70%;margin-left: 12px}
</style>