<template>
  <div>
    <!--备注信息弹窗-->
    <el-dialog
      title="申请发票"
      :visible.sync="dialogFormMark"
      :close-on-click-modal="false"
      class="city_list"
      width="620px"
      @close="close"
    >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class=" demo-ruleForm invoice">
        <div class=" w500">
          <el-form-item label="单位/个人：" prop="unitPersonal">
            <el-radio v-model="ruleForm.unitPersonal" label="1">个人</el-radio>
            <el-radio v-model="ruleForm.unitPersonal" label="2">单位</el-radio>
          </el-form-item>
          <el-form-item label="发票抬头：" prop="invoiceTitle">
            <el-input v-model="ruleForm.invoiceTitle" class="Words" placeholder="请输入发票抬头"></el-input>
            <span class="Numbers">{{ruleForm.invoiceTitle.length}}/80字</span>
          </el-form-item>
          <el-form-item label="纳税人识别号：" prop="taxpayerNumber">
            <el-input v-model="ruleForm.taxpayerNumber" class="Words" placeholder="请输入纳税人识别号"></el-input>
            <span class="Numbers">{{ruleForm.taxpayerNumber.length}}/40字</span>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model="ruleForm.phone" class="Words" placeholder="请输入手机号"></el-input>
            <span class="Numbers">{{ruleForm.phone.length}}/11字</span>
          </el-form-item>
          <el-form-item label="账号：" prop="account">
            <el-input v-model="ruleForm.account" class="Words" placeholder="请输入账号"></el-input>
            <span class="Numbers">{{ruleForm.account.length}}/40字</span>
          </el-form-item>
        </div>
        <div class=" w500">
          <el-form-item label="开户行：" prop="partCardBank">
            <el-input v-model="ruleForm.partCardBank" class="Words" placeholder="请输入开户行"></el-input>
            <span class="Numbers">{{ruleForm.partCardBank.length}}/80字</span>
          </el-form-item>
          <el-form-item label="地址：" prop="address">
            <el-input v-model="ruleForm.address" class="Words" placeholder="请输入地址"></el-input>
            <span class="Numbers">{{ruleForm.address.length}}/80字</span>
          </el-form-item>
          <el-form-item label="开票金额：" prop="invoicePrice">
            <el-input v-model="ruleForm.invoicePrice" class="Words" placeholder="请输入开票金额"></el-input>
            <span style="color:#909192">剩余开票金额：{{allPrice}}</span>
          </el-form-item>
         
         
        </div>
        <div class="cancel">
            <el-button class="ml13" @click="close()">取 消</el-button>
            <el-button class="ml13" type="primary" @click="closeApply(ruleForm)" :loading="loadingbut">{{loadingbuttext}}</el-button>
         </div>
       
        
       
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/js/libs/publicMethod.js";
import moment from "moment"
export default {
  props: {
    orderId: 0,
    variable_s: 0,
    dialogType: 0,
    orderCodeSon:""
  },
  data() {
    return {
      name: localStorage.getItem("name"),
      //备注信息弹窗
      dialogFormMark: false,
      loadingbuttext:'申 请',
      loadingbut:false,//提交撤销加载中
      allPrice:0,//能开金额
      tableDate:[],//订单数组
      newtabledate:[],//提交数组
      ruleForm:{
        unitPersonal:'1', // 单位/个人
        invoiceTitle:'', //发票抬头
        taxpayerNumber:'', // 纳税人识别号
        phone:'', // 手机号
        account:'', // 账号
        partCardBank:'', // 开户行
        address:'', // 地址
        invoicePrice:'', // 开票金额
        
      },
       rules:{
        invoiceTitle:[
          { required: true, message: '请输入发票抬头', trigger: 'change' },
          { min: 1, max: 80, message: '长度在 1 到 80 个字符', trigger: 'change' }
        ],
        taxpayerNumber:[
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'change' }
        ],
        phone:[
          { required: true, min: 1, max: 20, message: '长度在 1 到 40 个字符', trigger: 'change' }
        ],
        account:[
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'change' }
        ],
        partCardBank:[
          { min: 1, max: 80, message: '长度在 1 到 80 个字符', trigger: 'change' }
        ],
        address:[
          { required: true, min: 1, max: 80, message: '长度在 1 到 80 个字符', trigger: 'change' }
        ],
        invoicePrice:[
          { required: true, message: '请输入开票金额', trigger: 'change' },
        ],
      },
      
    };
  },
  created() {
  },
  watch: {
    variable_s: function() {
     if (this.dialogType == 6) {
        this.orderGetFun(this.orderId,this.orderCodeSon);
        this.dialogFormMark = true;
      }
    }
  },
  methods: {
    moment,
    close() {
      this.dialogFormMark = false;
     // this.$refs["markFormAdd"].resetFields();
      this.ruleNull();
      this.loadingbut = false;
      this.loadingbuttext = '申 请';
   
    },
    orderGetFun(orderId,orderCode) {
      this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/collection_orderRoot_search",{
            "object": {
              "orderCode":orderCode,
              "localCompName":"",
              "collectionID":0,
            },
          }).then(res => {    
            console.log( res.data.objects[0],'data');
            this.allPrice = res.data.objects[0].syje;
            this.tableDate = res.data.objects;
             
             
          })
            .catch(function (res) {
              console.log(res)
            })
   },
     closeApply(ruleForm){
        let myDate = new Date();
        let mydatas = moment(myDate).format("YYYY-MM-DD HH:mm:ss");
             if(ruleForm.invoicePrice > this.allPrice ){
                    this.$message({
                      type: "warning",
                      message: "申请开发票金额大于剩余金额 重新填写开票金额"
                      }); 
                      return;
            }else if(ruleForm.invoicePrice =="" || ruleForm.invoiceTitle == "" ||ruleForm.phone == ""||ruleForm.address == ""){
                   this.$message({
                      type: "warning",
                      message: "请填写相关信息"
                      });
                      return;
            }else if(ruleForm.invoiceTitle.length > 80){
                  this.$message({
                      type: "warning",
                      message: "请检查发票抬头字数 重新填写"
                      }); 
                      return;
            }else if(ruleForm.phone.length > 11){
                  this.$message({
                      type: "warning",
                      message: "请填写正确手机号 "
                      }); 
                      return;
            }else if(ruleForm.taxpayerNumber.length > 40){
              this.$message({
                      type: "warning",
                      message: "请检查纳税人识别号字数 重新填写"
                      }); 
                      return;
            }else if(ruleForm.account.length > 40){
              this.$message({
                      type: "warning",
                      message: "请检查账号字数 重新填写"
                      }); 
                      return;
            }else if(ruleForm.partCardBank.length > 80){
              this.$message({
                      type: "warning",
                      message: "请检查开户行字数 重新填写"
                      }); 
                      return;
            }else if(ruleForm.address.length > 80){
              this.$message({
                      type: "warning",
                      message: "请检查地址字数 重新填写"
                      }); 
                      return;
            }
            for(let i in this.tableDate){
            this.newtabledate.push({
                "orid":this.tableDate[i].orid,
                "orderCode": this.tableDate[i].orderCode,
                "collectionID": this.tableDate[i].collectionID,
                "productName": this.tableDate[i].productName,
                "source": this.tableDate[i].source,
                "planID": this.tableDate[i].planID,
                "createTime": this.tableDate[i].createTime,
                "yfje": this.tableDate[i].yfje,
                "syje": this.tableDate[i].syje,
                "collectionType": this.tableDate[i].collectionType
              })
            }
            this.loadingbut = true;
            this.loadingbuttext = '申请中...';
            
      this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/insertapplicationreceipt",{
        "object": {
          "receipt":{
                "createTime":mydatas,
                "invoiceType":ruleForm.unitPersonal,//单位个人
                "invoiceID":ruleForm.invoiceType,//发票类型
                "taxpayerIDNumber":ruleForm.taxpayerNumber,//纳税人识别号
                "invoiceHeader":ruleForm.invoiceTitle,//发票抬头
                "tel":ruleForm.phone,//手机号
                "invoiceItem":ruleForm.invoiceProject,//发票项目
                "invoicePrice":ruleForm.invoicePrice,//发票金额
                "cardNumber":ruleForm.account,//账号
                "bankName":ruleForm.partCardBank,//开户行
                "address":ruleForm.address,//地址
                "userCode":sessionStorage.getItem('userCode'),//申请人
                 "receiptType":2,//发票申请
                },
            "cosList":this.newtabledate
         
        },
      }).then(res => {

            if(res.data.isSuccess == true){
                    this.$message.success("申请成功");
                    this.dialogFormMark = false;
                    this.tableDate = [];
                    this.newtabledate = [];
                    this.ruleNull();
                    this.loadingbut = false;
				            this.loadingbuttext = '申 请';

              }else if(res.data.isSuccess == false){
                  this.$message({
                        type: "warning",
                        message: res.data.result.message
                        }); 
                        this.loadingbut = false;
                        this.loadingbuttext = '申 请';
              }
         
        })
        .catch(function (res) {
          console.log(res)
        })
    },
    
    // 接收备注时间格式的转换   
    getTimeChange (str) {
      let time = str.replace('T',' ')
      return time
    }, 
    ruleNull(){ // 清空内容
            this.ruleForm= {
                  unitPersonal:'1', // 单位/个人
                  invoiceTitle:'', //发票抬头
                  taxpayerNumber:'', // 纳税人识别号
                  phone:'', // 手机号
                  account:'', // 账号
                  partCardBank:'', // 开户行
                  address:'', // 地址
                  invoicePrice:'', // 开票金额
               }
               this.newtabledate=[];//清空的数组
    },
  }
};
</script>

<style scoped>
.demo-ruleForm {
  margin-top: 20px;
}
.remark {
  width: 600px;
}
.time {
  margin-right: 60px;
  text-align: right;
  color: #999;
}
 .Words{
   width: 200px;
 }
.colse {
  margin-left: 230px;
  width: 100px;
}
.cancel{
  width: 600px;
  margin: 10px 0 10px 70%;
}
</style>