<template>
  <div>
       <!--流程管理弹窗-->
       <el-dialog title="流程管理" :visible.sync="dialogFormProcess" class="city_list" width="800px" style="margin-top:-50px">
              <div class="process-sta">订单状态：<span>{{getOrderStatus(orderget.orderStatus)}}</span></div>
              <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="订单联系人">            
                    <div class="ml13">姓名<el-input v-model="ruleForm.contactName" class="numw"></el-input></div>
                  </el-form-item>
                  <el-form-item label="">            
                    <div class="ml13">电话<el-input v-model="ruleForm.contactPhone" class="numw"></el-input></div>
                  </el-form-item>
                  <el-form-item label="出行人信息" class="cb">            
                     <div class="oh" v-for="(item,indexPrice) in salePrice">
                       <div class="tour-til">{{item.enrollName}}</div>
                       <div class="tourist"><input v-for="(item,index) in tour[indexPrice]" placeholder="点击填写" v-model="item.cnName" @click="fillTour(indexPrice,index)" :disabled="orderget.orderStatus==4||orderget.orderStatus==5||orderget.orderStatus==6||orderget.orderStatus==9" /></div>                     
                     </div>
                  </el-form-item>
                  <el-form-item label="" class="cb">   
                     <div class="change-num" @click="changeNum" v-if="orderget.orderStatus!=4&&orderget.orderStatus!=5&&orderget.orderStatus!=6&&orderget.orderStatus!=9">变更数量</div>
                     <div class="change-num" v-if="orderget.orderStatus!=7&&orderget.orderStatus!=10">查看合同</div>
                  </el-form-item>     
                  <el-form-item label="更改订单状态" prop="type" v-if="orderget.orderStatus!=4&&orderget.orderStatus!=5&&orderget.orderStatus!=6&&orderget.orderStatus!=9">
                    <div class="surplus" v-if="false">
                         <div v-for="(item,index) in salePrice">{{item.enrollName}}：余{{item.quota}}</div>
                    </div>
                    <el-radio-group v-model="ruleForm.type"><br/>
                      <el-radio :label="0" class="radiomar" v-if="false">确认占位 （同业社额度： 总欠款 <span class="color-blue">270,164</span> 元）</el-radio><br/>
                      <el-radio :label="0" class="radiomar" v-if="false">预定占位 （订单保留24小时，到期提醒）</el-radio><br/>
                      <el-radio :label="10" class="radiomar" v-if="orderget.orderStatus==7">确认订单</el-radio><br/>
                      <el-radio :label="1" class="radiomar" v-if="orderget.orderStatus==10">提交用户信息</el-radio><br/>
                      <el-radio :label="2" class="radiomar" v-if="orderget.orderStatus==1">发送电子合同给客人</el-radio><br/>
                      <el-radio :label="9" class="radiomar" v-if="orderget.orderStatus==7||orderget.orderStatus==10||orderget.orderStatus==1||orderget.orderStatus==2">作废订单</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-if="orderget.orderStatus==6" label="评价信息" prop="">            
                     <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" class="remark" placeholder="请输入内容" v-model="ruleForm.remark" :disabled="true"></el-input>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer" v-if="orderget.orderStatus!=4&&orderget.orderStatus!=5&&orderget.orderStatus!=6&&orderget.orderStatus!=9">
                <el-button @click="dialogFormProcess = false">取 消</el-button>
                <el-button type="primary" @click="orderModification(ruleForm.type)" class="confirm">保存修改</el-button>
              </div>
              <div slot="footer" class="dialog-footer1"  v-if="orderget.orderStatus==4||orderget.orderStatus==5||orderget.orderStatus==6||orderget.orderStatus==9">
                <el-button @click="dialogFormProcess = false"><span>关 闭</span></el-button>
              </div>
       </el-dialog>
       <!--变更数量弹窗-->
       <el-dialog title="变更数量" :visible.sync="dialogFormNum" class="city_list" width="800px" style="margin-top:-50px" @close="cancelNum">
          <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm numForm">
           <el-form-item label="" prop="">            
              <div class="ml13">结算参考 <span class="color-red">￥{{teampreviewData.refPrice}}</span></div>
           </el-form-item>
           <el-form-item label="价格" prop="price" class="cb price">
              <span v-for="item in salePrice" style="margin:14px 18px 0 13px">{{item.enrollName}}：￥{{item.price_01}}</span><br/>
              <!--<el-radio-group v-model="ruleForm.price">              
                 
                 <el-radio label="1" class="radiomar">销售价：<span v-for="item in salePrice">{{item.enrollName}}（￥{{item.price_01}}）</span></el-radio><br/>
                 <el-radio label="2" class="radiomar">同业价：<span v-for="item in salePrice">{{item.enrollName}}（￥{{item.price_02}}）</span></el-radio><br/>
                 <el-radio label="自定义" class="radiomar">自定义： 
                       成人<el-form-item prop="price1" class="disib"><el-input v-model="ruleForm.price1" class="pricew"></el-input></el-form-item>
                       儿童<el-form-item prop="price2" class="disib"><el-input v-model="ruleForm.price2" class="pricew"></el-input></el-form-item>
                       老人<el-form-item prop="price3" class="disib"><el-input v-model="ruleForm.price3" class="pricew"></el-input></el-form-item>
                       单房差<el-form-item prop="price4" class="disib"><el-input v-model="ruleForm.price4" class="pricew"></el-input></el-form-item>
                  </el-radio>
              </el-radio-group>-->
            </el-form-item>
            <el-form-item label="报名人数" class="fl">            
              <div class="num-req">*</div>
            </el-form-item>
            <div class="fl">         
              <table style="margin:-7px 0 17px 13px">
                <tr v-for="(item,index) in salePrice">
                  <td height="45">{{item.enrollName}}</td>
                  <td height="45">
                      <el-input v-model="enrolNum[index]" class="numw" @input="peoNum(index,item.enrollID,item.enrollName)" type="number" :min="0" :disabled="true"></el-input>
                      <span v-bind:class="{red:quota[index]}">
                      余（{{item.quota}}）
                      ￥<span v-show="ruleForm.price==1">{{item.price_01}}</span><span v-show="ruleForm.price==2">{{item.price_02}}</span>
                      <span v-show="quota[index]">库存不足</span>
                      </span>
                  </td>
                </tr>
              </table>
              <div class="red ml13" style="height:35px" v-show="enrolNums">报名人数不能为空</div>
            </div>
            <!--其他费用-->
            <div class="cb" style="height:60px">
              <el-form-item label="其他费用" prop="otherCost" class="fl cb">            
                <el-input v-model="ruleForm.otherCost" class="numw" type="number" :min="0"></el-input>
              </el-form-item>
              <div class="fl">            
                备注<el-input v-model="ruleForm.otherCostRemark" class="cost-remark"></el-input>
              </div>
            </div>
            <!--整体优惠-->
            <div class="cb">
              <el-form-item label="整体优惠" prop="allDiscount" class="fl cb">            
                <el-input v-model="ruleForm.allDiscount" class="numw" type="number" :min="0"></el-input>
              </el-form-item>
              <div class="fl">            
                备注<el-input v-model="ruleForm.allDisRemark" class="cost-remark"></el-input>
              </div>
            </div>
            <el-form-item label="总计" prop="payable" class="cb">            
              <div class="ml13"><span class="color-red">￥{{orderget.payable}}</span></div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="numdialog-footer">
               <el-button @click="cancelNum">取 消</el-button>
               <el-button type="primary" @click="subNum(2)" class="confirm">保 存</el-button>
          </div>
       </el-dialog>
       <!--填写游客信息-->
       <el-dialog :title="'出行人信息（'+winTitle+'）'" :visible.sync="dialogFormTour" class="city_list" @close="cancelInfo('conForm')" width="700px" height="500">
            <el-form :model="conForm" :rules="rules" ref="conForm">
              <el-form-item label="中文姓名" prop="cnName" label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.cnName" class="w200 fl"></el-input>
              </el-form-item>
              <el-form-item label="英文姓名" prop="enName" label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.enName" class="w200"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex" label-width="110px" class="fl" style="width:310px">
                  <el-radio-group v-model="conForm.sex">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
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
              <el-form-item label="证件类型" prop="credType" label-width="110px" class="fl">
                  <el-select v-model="conForm.credType" placeholder="请选择">
                     <el-option label="请选择" :value="0"/>
                     <el-option label="护照" :value="1"/>
                     <el-option label="港澳通行证" :value="2"/>
                     <el-option label="军官证" :value="3"/>
                  </el-select>
              </el-form-item>
              <el-form-item label="证件号码" prop="credCode" label-width="110px" class="fl">
                  <el-input type="text" v-model="conForm.credCode" class="w200"></el-input>
              </el-form-item>
              <el-form-item label="证件有效期" prop="credTOV" label-width="110px" class="fl">
                  <el-date-picker v-model="conForm.credTOV" type="date" placeholder="选择日期" class="w200"></el-date-picker>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer cb">
              <el-button @click="cancelInfo('conForm')">取 消</el-button>
              <el-button type="primary" @click="subInfo('conForm')">确 定</el-button>
            </div>
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
       //流程管理弹窗
       dialogFormProcess:false,
       orderget:{},//保存单个订单信息
       teampreviewData:{},//团期计划订单信息预览
       ruleForm: {  
         //流程管理
         contactName:'',
         contactPhone:'',
         type:0,
         remark:'',  //评价信息
         //变更数量
         price:'1',
         otherCost: 0,
         otherCostRemark: '',
         allDiscount: 0,
         allDisRemark: '',         
       },
       //变更数量弹窗
       dialogFormNum:false,  
       cancelType:1, //1取消按钮触发，2确定触发，作为修改数量用
       //游客信息
      quota:[], //余位信息负数红色提示
      enrolNum:[], //报名人数[1,3]形式
      enrolNumCopy:[], //报名人数副本[1,3]形式，作为修改数量用
      enrolNums:false,//报名人数是否为空提示
      number:0,//报名总人数
      dialogFormTour: false,
      salePrice:[],//报名类型价格列表数据
      salePriceNum:[],//报名类型价格列表数据副本,显示余位用
      tourType:0,//报名类型索引
      fillIndex:0,//报名类型下游客list索引
      preLength:[],//记录上一次报名人数[1,3]形式
      preLengthCopy:[],//记录上一次报名人数[1,3]形式副本，作为修改数量用
      tour:[],//总游客信息,二维数组
      tourCopy:[],//总游客信息副本,二维数组
      winTitle:'',  //弹窗标题
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
        credType:0,
        credCode:'',
        credTOV:0,
        orderID: 0,
        orderCode: 'string',
        orgID: 0,
        userID: 0
      },
       rules:{      
         //变更数量
         price: [{ required: true, message: '请选择价格', trigger: 'change' }],
         otherCost: [
            { required: true, message: '请输入其他费用', trigger: 'blur' },
            { pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/, message: '必须为数字值，并且不允许是负数'}],
         allDiscount: [
            { required: true, message: '请输入整体优惠', trigger: 'blur' },
            { pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/, message: '必须为数字值，并且不允许是负数'}],
         payable: [{ required: true, message: '价格不能为空'}],
         //游客信息
         cnName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
         enName: [
            { required: true, message: '请输入姓（拼音）', trigger: 'blur' },
            { pattern: /(a[io]?|ou?|e[inr]?|ang?|ng|[bmp](a[io]?|[aei]ng?|ei|ie?|ia[no]|o|u)|pou|me|m[io]u|[fw](a|[ae]ng?|ei|o|u)|fou|wai|[dt](a[io]?|an|e|[aeio]ng|ie?|ia[no]|ou|u[ino]?|uan)|dei|diu|[nl](a[io]?|ei?|[eio]ng|i[eu]?|i?ang?|iao|in|ou|u[eo]?|ve?|uan)|nen|lia|lun|[ghk](a[io]?|[ae]ng?|e|ong|ou|u[aino]?|uai|uang?)|[gh]ei|[jqx](i(ao?|ang?|e|ng?|ong|u)?|u[en]?|uan)|([csz]h?|r)([ae]ng?|ao|e|i|ou|u[ino]?|uan)|[csz](ai?|ong)|[csz]h(ai?|uai|uang)|zei|[sz]hua|([cz]h|r)ong|y(ao?|[ai]ng?|e|i|ong|ou|u[en]?|uan))/, message: '姓（拼音）格式不正确', trigger: 'blur'}],
         sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
         mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '手机号格式不正确', trigger: 'blur'}],
         idCard: [{ required: true, message: '身份证号不能为空', trigger: 'blur' },
                   { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确', trigger: 'blur' }]
       } 
       


    }
  },
  created(){
  },
  watch: {
      variable:function(){      
        if(this.dialogType==1){
          this.processManage(this.orderId);   
          this.dialogFormProcess=true;    
        }    
     },
    enrolNum:function(val){
　　　　this.changeQuota();
        this.compPrice();
    },
    'ruleForm.otherCost':function(val){
        this.compPrice();
    },
    'ruleForm.allDiscount':function(val){
        this.compPrice();
    },
    'ruleForm.type':function(val){
        this.changeQuota();      
    }
  },
  methods: {
      //流程管理
      processManage(orderId){
        //查询一条订单信息
        this.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderget',{
             "id": orderId
          }).then(res => {
            if(res.data.isSuccess == true){
               this.orderget = res.data.object; 
               //根据订单状态设置默认选项
               switch(this.orderget.orderStatus){
                  case 7:
                    this.ruleForm.type=10;
                    break;
                  case 10:
                    this.ruleForm.type=1;
                    break;
                  case 1:
                    this.ruleForm.type=2;
                    break;
                  case 3:
                    this.ruleForm.type=9;
                    break;
               }
               //联系人信息
               this.ruleForm.contactName=JSON.parse(res.data.object.contact).Name;
               this.ruleForm.contactPhone=JSON.parse(res.data.object.contact).Tel;

               this.dialogFormProcess=true;   
               
               this.teamEnrolls(res.data.object.planID);
               this.teampreview(res.data.object.planID);        
            }
          }).catch(err => {
            console.log(err)
        })
      },
      orderModification(type){  //订单修改保存
        let url='/order/stat/api';
        switch(type){
          case 10:
            url+='/confirmed';
            break;
          case 1:
            url+='/material';
            break;
          case 2:
            url+='/econtract';
            break;
          case 9:
            url+='/invalid';
            break;
        }
        this.ordersave();
        if(type==0){
          return false;
        }
        this.$http.post(this.GLOBAL.serverSrc + url,{
            "object": {
              id:this.orderget.id
            }
          }).then(res => {
            if(res.data.isSuccess == true){
               this.$message({
                  message: '提交成功',
                  type: 'success'
               });
               this.processManage(this.orderId);   
               this.$emit('orderPage');
            }
          })
      },
      changeNum(){  //修改数量
        //优惠信息数据绑定
        this.ruleForm.otherCost = this.orderget.favourable[0].price;
        this.ruleForm.otherCostRemark = this.orderget.favourable[0].mark;
        this.ruleForm.allDiscount = this.orderget.favourable[1].price;
        this.ruleForm.allDisRemark = this.orderget.favourable[1].mark;
        //数量数组
        this.enrolNumCopy = [...this.enrolNum];
        //出游人数组
        this.tourCopy = JSON.parse(JSON.stringify(this.tour));
        //上一次报名人数
        this.preLengthCopy = [...this.preLength];

        this.dialogFormNum=true;
      }, 
      subNum(){  //修改数量确认提交
        for(let i=0;i<this.enrolNum.length;i++){  //数量不能为0
              if(this.enrolNum[i]){
                this.number+=parseInt(this.enrolNum[i]);
            }
        };
        if(this.number==0){
          this.enrolNums=true;
          return false;
        }else{
          this.enrolNums=false;
        }
        //优惠信息数据绑定
        this.orderget.favourable[0].price = this.ruleForm.otherCost;
        this.orderget.favourable[0].mark = this.ruleForm.otherCostRemark;
        this.orderget.favourable[1].price = this.ruleForm.allDiscount;
        this.orderget.favourable[1].mark = this.ruleForm.allDisRemark;
        this.cancelType=2;
        this.dialogFormNum = false;
      },
      cancelNum(){  //修改数量取消
        if(this.cancelType==1){
          //数量数组复原
          this.enrolNum = [...this.enrolNumCopy];
          //出游人数组复原
          this.tour = JSON.parse(JSON.stringify(this.tourCopy));
          //上一次报名人数
          this.preLength = [...this.preLengthCopy];
        }
        this.dialogFormNum = false;
        this.cancelType=1;
      },
      //列表订单状态显示
      getOrderStatus(status){
          switch(status){
            case 1:
              return '签订电子合同';
              break;
            case 2:
              return '待出行';
              break;
            case 3:
              return '待出行';
              break;
            case 4:
              return '旅行中';
              break;
            case 5:
              return '待评价';
              break;
            case 6:
              return '已完成';
              break;
            case 7:
              return '确认占位';
              break;
            case 8:
              return '签署合同';//？
              break;
            case 9:
              return '订单作废';
              break;
            case 10:
              return '补充游客材料';
              break;
          }
      },
      changeQuota(){  //余位变化方法
       this.salePrice = JSON.parse(JSON.stringify(this.salePriceNum));
       let salePriceType={};
          //实时减少相关余位信息，提示库存不足
           for(let i=0;i<this.salePrice.length;i++){    
             this.salePrice[i].quota=parseInt(this.salePrice[i].quota)-parseInt(this.enrolNum[i]);
             salePriceType=this.salePrice[i];         
             if(salePriceType.quota<0){  //判断是否显示库存不足
                this.quota[i]=true;
             }else{
                this.quota[i]=false;
             }
        }
     },
     peoNum(index,enrollID,enrollName){   //填写报名人数 
        let arrLength;//报名人数
        let preLength;//记录上一次报名人数
            preLength=this.preLength[index];  //获取上一次报名人数
            arrLength=this.enrolNum[index];   //获取当前报名人数
            this.preLength[index]=this.enrolNum[index];  //记录上一次报名人数为当前报名人数
        var len;
        if(arrLength>preLength){  //修改数量时，如果增加数量，直接填充数组，否则从数组末尾减去多余对象
          len=arrLength-preLength;
          for(var i=0;i<len;i++){
            this.tour[index].push({            
              enrollID:enrollID,
              enrollName:enrollName,
              id: 0,
              isDeleted: 0,
              code: "string",
              cnName:'点击填写',
              enName: "string",
              sex: '0',
              idCard: "string",
              singlePrice: 0,
              mobile: "string",
              bornDate: 0,
              credType: 0,
              credCode: "string",
              credTOV: 0,
              orderID: 0,
              orderCode: "string",
              orgID: 0,
              userID: 0
            });
          }  
        }else{
          this.tour[index].splice(arrLength-preLength,preLength-arrLength);
        }
     },
     fillTour(type,index){
          this.winTitle=this.salePrice[type].enrollName; //编辑游客信息弹窗标题
          if(this.tour[type][index].cnName!='点击填写'){
            this.conForm=JSON.parse(JSON.stringify(this.tour[type][index])); //如果已填完信息，把信息显示出来
          }else{
            this.conForm={
            id: this.tour[type][index].id,
            isDeleted: 0,
            code: "",
            cnName:'',
            enName:'',
            sex:"",
            mobile:'',          
            idCard:'',//身份证
            bornDate:0,
            credType:0,
            credCode:'',
            credTOV:0,
            orderID: 0,
            orderCode: 'string',
            orgID: 0,
            userID: 0
           }
          }
          this.tourType=type;
          this.fillIndex=index;
          this.dialogFormTour = true;
     },
      //游客信息保存
      subInfo(formName){
         this.$refs[formName].validate((valid) => {
          if (valid) {
             let guest=JSON.parse(JSON.stringify(this.conForm));
             console.log(guest.bornDate)
                guest.enrollID=this.salePrice[this.tourType].enrollID;  //填充报名类型
                guest.enrollName=this.salePrice[this.tourType].enrollName;  //填充报名类型name
                if(this.ruleForm.price==1){
                  guest.singlePrice=this.salePrice[this.tourType].price_01;  //填充价格
                }else{
                  guest.singlePrice=this.salePrice[this.tourType].price_02;
                }
             this.tour[this.tourType][this.fillIndex]=guest;
             this.dialogFormTour = false;
             this.$refs[formName].resetFields();
            }
          });
      },
      //游客信息取消
      cancelInfo(formName){       
        this.dialogFormTour = false;    
        setTimeout(()=>{
         this.$refs[formName].resetFields();   
        },500)    
      },
      teamEnrolls(planId){  //获取报名类型列表数据
       this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/enrolls',{
            "id": planId
        }).then(res => {
          if(res.data.isSuccess == true){
             this.salePrice = res.data.objects;
             this.salePriceNum = res.data.objects;            
             this.preLength=[];
             this.enrolNum=[];
             this.quota=[];
             this.tour=[];            
             for(let i=0;i<res.data.objects.length;i++){
                this.quota.push(false); 
                this.tour.push([]);
             }
             //出游人信息转换格式,二维数组，通过类型分类
             var guest=this.orderget.guest;   
             var j=0;
             for(let i=0;i<guest.length;i++){
               if(i>0&&guest[i].enrollName!=guest[i-1].enrollName){
                 this.tour[j+1].push(guest[i])
               }else{
                 this.tour[j].push(guest[i])
               }
             }
             //设置报名人数
             for(let i=0;i<this.tour.length;i++){
               this.preLength.push(this.tour[i].length);
               this.enrolNum.push(this.tour[i].length);
             }
          }
       })
     },
     teampreview(planId){  //团期计划订单信息预览
       this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/teampreview',{
            "id": planId
        }).then(res => {
          if(res.data.isSuccess == true){
             this.teampreviewData=res.data.object;
          }
       })
     },
     compPrice(){  //计算总价
          this.orderget.payable=0;
          for(let i=0;i<this.enrolNum.length;i++){
             this.orderget.payable+=this.enrolNum[i]*(this.ruleForm.price==1?this.salePrice[i].price_01:this.salePrice[i].price_02);
          }
          this.orderget.payable+=parseInt(this.ruleForm.otherCost);
          this.orderget.payable-=parseInt(this.ruleForm.allDiscount);
      },     
      ordersave(){  //更新订单，补充游客信息
          
          let obj=JSON.parse(JSON.stringify(this.orderget));
          obj.contact='{"Name":"'+ this.ruleForm.contactName +'","Tel":"'+ this.ruleForm.contactPhone +'"}';
         
          //获取报名总人数          
          obj.number=this.number;

          //出游人信息
          let guest=[];
          for(let i=0;i<this.tour.length;i++){
            for(let j=0;j<this.tour[i].length;j++){
              guest.push(this.tour[i][j]);
            }
          }
          for(let i=0;i<guest.length;i++){   
             guest[i].bornDate = new Date(guest[i].bornDate).getTime();  //时间格式转换
             guest[i].credTOV = new Date(guest[i].credTOV).getTime();              
          }                      
          obj.guest=guest;
          //判断订单信息是否更改，如果更改，修改订单信息
          if(JSON.stringify(obj)==JSON.stringify(this.orderget)){
            return false;
          }
          console.log(123);
          this.$http.post(this.GLOBAL.serverSrc + '/order/all/api/ordersave',{
            "object": obj
          }).then(res => {
            if(res.data.isSuccess == true){
               this.processManage(this.orderId);   
            }
         })
      },
      formatDate(date){
       var y = date.getFullYear();  
       var m = date.getMonth() + 1;  
           m = m < 10 ? ('0' + m) : m;  
       var d = date.getDate();  
           d = d < 10 ? ('0' + d) : d;  
           return y + '-' + m + '-' + d;
      }, 
    }
}
</script>

<style scoped>
       .process-sta{background-color: #d1cfd0;height: 40px;padding: 25px 0 0 20px}
       .process-sta span{margin-left: 20px;color: #3096fa}
       .demo-ruleForm{margin-top: 20px}
       .demo-ruleForm .el-form-item{margin-bottom: 13px}
       .numw{width: 125px;text-align: center;margin:0 15px}
       .cost-remark{width: 300px;text-align: center;margin:0 15px}
       .tourist{float: left;width: 600px}
       .tourist input{width: 110px;background-color: #f6f6f6;color:#606266;text-align: center;border:0;height: 30px;margin:1px 10px 10px 4px}
       .tour-til{float: left;margin:0 13px}
       .oh{overflow: hidden}
       .change-num{width: 110px;background-color: #f6f6f6;text-align: center;height: 30px;line-height: 30px;margin: 10px 0 0 13px;cursor: pointer}
       .radiomar{margin:12px 13px;}
       .ml13{margin-left: 13px}
       .dialog-footer{text-align: left;margin:-40px 0 20px 265px;}
       .dialog-footer1{text-align: left;margin:-40px 0 20px 340px;}
       .dialog-footer1 span{margin: 0 15px}
       .numdialog-footer{text-align: left;margin:-40px 0 20px 265px}
       .confirm{margin-left: 20px}
       .surplus{margin:8px 13px;line-height: 25px}
       .color-blue{color: #3096fa}
       .color-red{color: #ff4b3e}
       .remark{width: 98%;margin:7px 0 0 13px}
       .disib{display: inline-block;}
       .pricew{width: 85px;text-align: center;margin:-5px 8px}
       .numForm{margin-top: -10px}
       .numForm .el-form-item{margin-bottom: 5px}
       .fl{float: left}
       .cb{clear: both}
       .num-req{position: absolute;top:2px;left:-77px;color:red}
       .price .pricew{width: 90px;text-align: center;margin:-5px 15px;}
       .tourist{margin-left: 13px;float: left;width:85%}
       .tourist input{width: 110px;background-color: #f6f6f6;text-align: center;border:0;height: 40px;margin-left: 15px;margin:1px 10px 10px 10px}
       .tour-til{float: left;margin-left: 13px;margin-right: -8px;width: 80px}
       .red{color: red}
       .w200{width: 200px}
       .text{font-size: 14px}
</style>