<template>
  <div>
      <div class="main">
           <div class="order-title">
              <h2>订单信息</h2>
              <div slot="footer" class="dialog-footer">
                 <router-link to="/regimentPlan/planList"><el-button>取 消</el-button></router-link>
                 <el-button type="primary" @click="submitForm('ruleForm')" class="ml13">下单</el-button>
              </div>
           </div>
           <div class="pro-info">
                <table>
                   <tr>
                     <td width="80">产品：</td>
                     <td>{{teampreviewData.title}}</td>
                   </tr>
                   <tr>
                     <td>团期计划：</td>
                     <td>{{teampreviewData.groupCode}}</td>
                   </tr>
                   <tr>
                     <td>套餐名称：</td>
                     <td>{{teampreviewData.package}}</td>
                   </tr>
                   <tr>
                     <td>出发地：</td>
                     <td>{{teampreviewData.pod}}</td>
                   </tr>
                   <tr>
                     <td>目的地：</td>
                     <td>{{teampreviewData.destination}}</td>
                   </tr>
                   <tr>
                     <td>出发日期：</td>
                     <td>{{teampreviewData.date}}</td>
                   </tr>
                   <tr>
                     <td>余位：</td>
                     <td>{{teampreviewData.remaining}}</td>
                   </tr>
                   <tr>
                     <td>参考结算：</td>
                     <td>{{teampreviewData.refPrice}}</td>
                   </tr>
                </table>
           </div>
           <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="订单来源" prop="orderRadio">
                <!--<el-radio label="1" class="radiomar" v-model="ruleForm.orderRadio">同业社</el-radio>
                <el-radio label="2" class="radiomar" v-model="ruleForm.orderRadio">门店</el-radio>-->
                <el-radio label="3" class="radiomar" v-model="ruleForm.orderRadio">线下直客</el-radio>
            </el-form-item>
            <!--
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
            -->
            <el-form-item label="选择价格" prop="price" class="cb price">
              <el-radio-group v-model="ruleForm.price">
                 <el-radio label="1" class="radiomar">销售价： 成人 （￥4500）  儿童（￥4000） 老人（￥3500） 单房差（￥300）</el-radio>
                 <!--<el-radio label="同业价" class="radiomar">同业价： 成人 （￥3800）  儿童（￥3000） 老人（￥3000） 单房差（￥200）</el-radio><br/>          
                  <el-radio label="自定义" class="radiomar">自定义： 
                       成人<el-form-item prop="price1" class="disib"><el-input v-model="ruleForm.price1" class="pricew"></el-input></el-form-item>
                       儿童<el-form-item prop="price2" class="disib"><el-input v-model="ruleForm.price2" class="pricew"></el-input></el-form-item>
                       老人<el-form-item prop="price3" class="disib"><el-input v-model="ruleForm.price3" class="pricew"></el-input></el-form-item>
                       单房差<el-form-item prop="price4" class="disib"><el-input v-model="ruleForm.price4" class="pricew"></el-input></el-form-item>
                  </el-radio>-->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="报名人数">            
              <div class="ml13">成人<el-input v-model="ruleForm.num1" class="numw" @input="peoNum('adult')"></el-input>余（17） ￥4500</div>
              <div class="num-req">*</div>
            </el-form-item>
            <el-form-item label="">            
              <div class="ml13">儿童<el-input v-model="ruleForm.num2" class="numw" @input="peoNum('child')"></el-input>余（17） ￥4000</div>
            </el-form-item>
            <el-form-item label="">            
              <div class="ml13">老人<el-input v-model="ruleForm.num3" class="numw" @input="peoNum('elder')"></el-input>余（17） ￥3500</div>
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
              <el-radio-group v-model="ruleForm.type">
                <el-radio label="1" class="radiomar">确认占位 （同业社额度： 总欠款 270,164 元）</el-radio><br/>
                <el-radio label="2" class="radiomar">预定占位 （订单保留24小时，到期提醒）</el-radio><br/>
                <el-radio label="3" class="radiomar">预定不占 （订单保留24小时，到期提醒）</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--订单联系人-->
            <el-form-item label="订单联系人" prop="contactName" class="fl">            
                 <span class="ml13">姓名</span><el-input v-model="ruleForm.contactName" class="numw" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item prop="contactPhone" class="fl" style="margin-left:-80px">            
                 电话<el-input v-model="ruleForm.contactPhone" class="numw" maxlength="20"></el-input>
            </el-form-item>
            <!--出行人信息-->
            <el-form-item label="出行人信息" class="cb">            
               <div class="oh" v-show="typeNum1">
                 <div class="tour-til">成人</div>
                 <div class="tourist"><input v-for="(item,index) in adult" placeholder="点击填写" v-model="item.cnName" @click="fillTour('1',index)"/></div>
               </div>
               <div class="oh" v-show="typeNum2">
                 <div class="tour-til">儿童</div>
                 <div class="tourist"><input v-for="(item,index) in child" placeholder="点击填写" v-model="item.cnName" @click="fillTour('2',index)"/></div>
               </div>
               <div class="oh" v-show="typeNum3">
                 <div class="tour-til">老人</div>
                 <div class="tourist"><input v-for="(item,index) in elder" placeholder="点击填写" v-model="item.cnName" @click="fillTour('3',index)"/></div>
               </div>
            </el-form-item>
            <el-form-item label="备注" prop="">            
              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" class="remark" placeholder="请输入内容" v-model="ruleForm.remark"></el-input>
            </el-form-item>
          </el-form>
          <!--填写游客信息-->
          <el-dialog :title="'出行人信息（'+winTitle+'）'" :visible.sync="dialogFormVisible" class="city_list" @close="cancelInfo('conForm')" width="700px">
            <el-form :model="conForm" :rules="rules" ref="conForm">
              <el-form-item label="中文姓名" prop="cnName" label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.cnName" class="w200 fl"></el-input>
              </el-form-item>
              <el-form-item label="英文姓名" prop="enName" label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.enName" class="w200"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex" label-width="110px" class="fl" style="width:310px">
                  <el-radio-group v-model="conForm.sex">
                    <el-radio label="0">男</el-radio>
                    <el-radio label="1">女</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="电话" prop="mobile" label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.mobile" class="w200"></el-input>
              </el-form-item>
              <el-form-item label="身份证" prop="idCard"  label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.idCard" class="w200"></el-input>
              </el-form-item>              
              <el-form-item label="出生日期" prop="bornDate"  label-width="110px" class="fl">
                  <el-date-picker v-model="conForm.bornDate" type="date" placeholder="选择日期" class="w200"></el-date-picker>
              </el-form-item>
              <el-form-item label="证件类型"  label-width="110px" class="fl">
                  <el-select v-model="conForm.credType" placeholder="请选择">
                     <el-option label="护照" value="1"/>
                     <el-option label="港澳通行证" value="2"/>
                     <el-option label="军官证" value="3"/>
                  </el-select>
              </el-form-item>
              <el-form-item label="证件号码"  label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.credCode" class="w200"></el-input>
              </el-form-item>
              <el-form-item label="证件有效期"  label-width="110px" class="fl">
                  <el-date-picker v-model="conForm.credTOV" type="date" placeholder="选择日期" class="w200"></el-date-picker>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer1 cb">
              <el-button @click="cancelInfo('conForm')">取 消</el-button>
              <el-button type="primary" @click="subInfo('conForm')">确 定</el-button>
            </div>
          </el-dialog>
          <!--下单成功弹窗-->
          <el-dialog title="提示" :visible.sync="orderSuc" class="city_list" width="500px">      
              <h3 class="ordersuc-title">下单成功</h3>
              <div class="text item">订单号：{{orderCode}}</div>
              <div class="text item">产品名称：{{teampreviewData.title}}</div>
              <div class="text item">团期计划：{{teampreviewData.groupCode}}</div>
              <el-button type="primary" style="margin:20px 0 10px 200px" @click="orderSuc = false">关闭</el-button>
          </el-dialog>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {           
          orderRadio:'3',          
          sale:'',
          travel:'',  
          price:'1',
          price1:'',
          price2:'',
          price3:'',
          price4:'',    
          num1: '', //报名人数
          num2: '',
          num3: '',
          numpre1: 0, //记录上一次报名人数，修改人数时，改变出行人信息数组
          numpre2: 0,
          numpre3: 0,
          otherCost: '0',
          otherCostRemark: '',
          allDiscount: '0',
          allDisRemark: '',
          totalPrice:'8000',
          type: '',    
          contactName:'',
          contactPhone:'',
          remark:'',
        },
        //游客信息
        dialogFormVisible: false,
        adult:[],//游客信息
        child:[],
        elder:[],
        adultId:1,//游客类型id
        childId:2,
        elderId:3,
        fillIndex:0,//当前添加的游客的索引
        adultPrice:'4500',
        childPrice:'4000',
        elderPrice:'3500',
        typeNum1:false,
        typeNum2:false,
        typeNum3:false,
        winTitle:'',
        conForm: {   
          id: 0,
          isDeleted: 0,
          code: "",
          cnName:'',
          enName:'',
          sex:"",
          mobile:'',          
          idCard:'',//身份证
          bornDate:0,
          credType:'',
          credCode:'',
          credTOV:0,
          orderID: 0,
          orderCode: 'string',
          orgID: 0,
          userID: 0
        },
        //下单成功弹窗
        orderSuc:false,
        //团期计划订单信息
        teampreviewData:{},
        orderCode:'',
        rules: {
          orderRadio: [{ required: true, message: '请选择订单来源', trigger: 'change' }],
          sale: [{ required: true, message: '请选择销售', trigger: 'change' }],
          travel: [{ required: true, message: '请选择同业社', trigger: 'change' }],
          price: [{ required: true, message: '请选择价格', trigger: 'change' }],
          price1: [{ pattern: /^[+]{0,1}(\d+)$/, message: '价格必须为数字值'}],
          price2: [{ pattern: /^[+]{0,1}(\d+)$/, message: '价格必须为数字值'}],
          price3: [{ pattern: /^[+]{0,1}(\d+)$/, message: '价格必须为数字值'}],
          price4: [{ pattern: /^[+]{0,1}(\d+)$/, message: '价格必须为数字值'}],
          totalPrice: [{ required: true, message: '价格不能为空'}],
          otherCost: [
            { required: true, message: '请输入其他费用', trigger: 'blur' },
            { pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/, message: '必须为数字值，并且不允许是负数'}],
          allDiscount: [
            { required: true, message: '请输入整体优惠', trigger: 'blur' },
            { pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/, message: '必须为数字值，并且不允许是负数'}],
          num: [{ required: true, message: '请输入数量', trigger: 'blur' }],
          type: [{ required: true, message: '请选择下单方式', trigger: 'change' }],
          contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
          contactPhone: [{ required: true, message: '请输入联系人电话', trigger: 'blur' }],
          //游客信息
          cnName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          enName: [
            { required: true, message: '请输入姓（拼音）', trigger: 'blur' },
            { pattern: /(a[io]?|ou?|e[inr]?|ang?|ng|[bmp](a[io]?|[aei]ng?|ei|ie?|ia[no]|o|u)|pou|me|m[io]u|[fw](a|[ae]ng?|ei|o|u)|fou|wai|[dt](a[io]?|an|e|[aeio]ng|ie?|ia[no]|ou|u[ino]?|uan)|dei|diu|[nl](a[io]?|ei?|[eio]ng|i[eu]?|i?ang?|iao|in|ou|u[eo]?|ve?|uan)|nen|lia|lun|[ghk](a[io]?|[ae]ng?|e|ong|ou|u[aino]?|uai|uang?)|[gh]ei|[jqx](i(ao?|ang?|e|ng?|ong|u)?|u[en]?|uan)|([csz]h?|r)([ae]ng?|ao|e|i|ou|u[ino]?|uan)|[csz](ai?|ong)|[csz]h(ai?|uai|uang)|zei|[sz]hua|([cz]h|r)ong|y(ao?|[ai]ng?|e|i|ong|ou|u[en]?|uan))/, message: '姓（拼音）格式不正确'}],
          sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '手机号格式不正确'}],
          idCard: [{ required: true, message: '身份证号不能为空', trigger: 'blur' },
                   { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确', trigger: 'blur' }],
        }
    }
  },
  created(){
     this.teampreview()
  },
  methods: {
     teampreview(){  //团期计划订单信息预览
       this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/teampreview',{
            "id": this.$route.query.planid
        }).then(res => {
          if(res.data.isSuccess == true){
             this.teampreviewData=res.data.object;
          }
       })
     },
     peoNum(num){
        let arr;
        let arrLength;//报名人数
        let preLength;//记录上一次报名人数
        if(num=='adult'){
          arr=this.adult;
          preLength=this.ruleForm.numpre1;
          arrLength=this.ruleForm.num1;
          this.ruleForm.numpre1=this.ruleForm.num1;
          if(arrLength!=0){
            this.typeNum1=true;
          }else{
            this.typeNum1=false;
          }
        }
        if(num=='child'){
          arr=this.child;
          preLength=this.ruleForm.numpre2;
          arrLength=this.ruleForm.num2;
          this.ruleForm.numpre2=this.ruleForm.num2;
          if(arrLength!=0){
            this.typeNum2=true;
          }else{
            this.typeNum2=false;
          }
        }
        if(num=='elder'){
          arr=this.elder;
          preLength=this.ruleForm.numpre3;
          arrLength=this.ruleForm.num3;
          this.ruleForm.numpre3=this.ruleForm.num3;
          if(arrLength!=0){
            this.typeNum3=true;
          }else{
            this.typeNum3=false;
          }
        }
        var len;
        if(arrLength>preLength){  //修改数量时，如果增加数量，直接填充数组，否则从数组末尾减去多余对象
          len=arrLength-preLength;
          for(var i=0;i<len;i++){
            arr.push({cnName:'点击填写'});
          }  
        }else{
          arr.splice(arrLength-preLength,preLength-arrLength);
        }   
     },
     fillTour(type,index){
        if(type==1){
          this.winTitle='成人';
          if(this.adult[index].cnName!='点击填写'){
            this.conForm=JSON.parse(JSON.stringify(this.adult[index])); //如果已填完信息，把信息显示出来
          }
        }
        if(type==2){
          this.winTitle='儿童';
          if(this.child[index].cnName!='点击填写'){
            this.conForm=JSON.parse(JSON.stringify(this.child[index]));
          }
        }
        if(type==3){
          this.winTitle='老人';
          if(this.elder[index].cnName!='点击填写'){
            this.conForm=JSON.parse(JSON.stringify(this.elder[index]));
          }
        }
        this.fillIndex=index;
        this.dialogFormVisible = true;
     },
     submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if(valid) {
              let guestAll=this.adult.concat(this.child,this.elder);//合并所有游客信息
              let guest=[];
              for(let i=0;i<guestAll.length;i++){   //过滤掉未填写人员信息
                 if(guestAll[i].cnName!='点击填写'){
                    guest.push(guestAll[i]);
                    guest[i].bornDate = (new Date(guest[i].bornDate)).getTime()/1000;
                    guest[i].credTOV = (new Date(guest[i].credTOV)).getTime()/1000;
                 }
              }
              this.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderinsert',{
                "object": {
                  "id": 0,
                  "isDeleted": 0,
                  "code": "",
                  "orderCode": "",
                  "proID": this.teampreviewData.teamID,  
                  "planID": this.$route.query.planid,
                  "orderStatus": 0,   //订单状态
                  "refundStatus": 0,  //退款状态
                  "occupyStatus": this.ruleForm.type,  //占位状态
                  "payable": this.ruleForm.totalPrice, //应付款
                  "paid": 0,           //已付款
                  "favourable": [      //优惠
                    {
                      "id": 0,
                      "orderID": 0,
                      "price": this.ruleForm.otherCost,
                      "title": "其他费用",
                      "favMode": 1,
                      "mark": this.ruleForm.otherCostRemark
                    },
                    {
                      "id": 0,
                      "orderID": 0,
                      "price": this.ruleForm.allDiscount,
                      "title": "整体优惠",
                      "favMode": 2,
                      "mark": this.ruleForm.allDisRemark,
                    }
                  ],
                  "contact": '{"Name":"'+ this.ruleForm.contactName +'","Tel":"'+ this.ruleForm.contactPhone +'"}',
                  "endTime": 0,//?
                  "orderChannel": this.ruleForm.orderRadio,
                  "orgID": 0,
                  "userID": 0,
                  "mark": this.ruleForm.remark,
                  "guest":guest
                }
            }).then(res => {
              if(res.data.isSuccess == true){
                   this.orderCode = JSON.parse(res.data.result.details).OrderCode;
                   this.orderSuc = true;
                   //清空表单
                   this.$refs[formName].resetFields();
                   this.ruleForm.num1 = ''; //清空报名人数
                   this.ruleForm.num2 = '';
                   this.ruleForm.num3 = '';
                   this.ruleForm.numpre1 = 0; //清空上一次报名人数
                   this.ruleForm.numpre2 = 0;
                   this.ruleForm.numpre3 = 0;
                   this.adult = []; //清空游客信息
                   this.child = [];
                   this.elder = [];
                   this.ruleForm.remark = '';
              }else{
                 //预留黑名单信息？？？
                 _this.$message.success('下单失败');
              }
            }) 
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
     subInfo(formName){
         this.$refs[formName].validate((valid) => {
          if (valid) {
             let guest=JSON.parse(JSON.stringify(this.conForm));
             if(this.winTitle=='成人'){
                guest.enrollID=this.adultId;  //填充报名类型
                guest.singlePrice=this.adultPrice;  //填充价格
                this.adult[this.fillIndex]=guest;
             }else if(this.winTitle=='儿童'){
                guest.enrollID=this.childId;
                guest.singlePrice=this.childPrice;
                this.child[this.fillIndex]=guest;
             }else if(this.winTitle=='老人'){
                guest.enrollID=this.elderId;
                guest.singlePrice=this.elderPrice;
                this.elder[this.fillIndex]=guest;
             }
             this.dialogFormVisible = false;
             this.$refs[formName].resetFields();
            }
          });
      },
      cancelInfo(formName){
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style scoped>
    *{font-size:14px}
    .main{border:1px solid #e6e6e6;overflow:hidden;width: 70%;min-width:900px;padding-bottom: 50px;margin-bottom: 120px}
    .order-title{overflow: hidden}
    .optionw{width: 280px}
    .order-title h2{font-size: 17px;font-weight: normal;float: left;margin:25px 30px}
    .dialog-footer{float: right;margin:20px 30px;}
    .dialog-footer1{text-align: left;margin:20px 0 20px 108px;padding-top: 20px}
    .pro-info{font-size: 14px;background-color: #e6e6e6;margin:0 30px 30px 30px;line-height: 25px;padding:10px 20px}
    .demo-ruleForm{margin-left: 10px;}
    .fl{float: left}
    .cb{clear: both}
    .num-req{position: absolute;top:2px;left:-77px;color:red}
    .price .pricew{width: 90px;text-align: center;margin:-5px 15px;}
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
    .text{font-size: 14px}
    .item {margin:0 20px 18px 20px}
    .ordersuc-title{text-align: center;font-size: 16px;margin:0 0 30px 0}
</style>