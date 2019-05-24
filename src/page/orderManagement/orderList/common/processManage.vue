<template>
  <div>
       <!--流程管理弹窗-->
       <el-dialog title="流程管理" :visible.sync="dialogFormProcess" class="city_list" width="800px" style="margin-top:-50px">
              <div class="process-sta">订单状态：<span>{{getOrderStatus(orderget.id)}}</span></div>
              <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="订单联系人">            
                    <div class="ml13">姓名<el-input v-model="ruleForm.contactName" class="numw"></el-input></div>
                  </el-form-item>
                  <el-form-item label="">            
                    <div class="ml13">电话<el-input v-model="ruleForm.contactPhone" class="numw"></el-input></div>
                  </el-form-item>
                  <el-form-item label="出行人信息">            
                     <div class="oh">
                       <div class="tour-til">成人</div>
                       <div class="tourist"><input v-for="(item,index) in adult" v-model="item.name" @click="fillTour('1',index)"/></div>
                     </div>
                     <div class="oh">
                       <div class="tour-til">儿童</div>
                       <div class="tourist"><input v-for="(item,index) in child" v-model="item.name" @click="fillTour('2',index)"/></div>
                     </div>
                     <div class="oh">
                       <div class="tour-til">老人</div>
                       <div class="tourist"><input v-for="(item,index) in elder" v-model="item.name" @click="fillTour('3',index)"/></div>
                     </div>
                     <div class="change-num" @click="changeNum">变更数量</div>
                     <div class="change-num">查看合同</div>
                  </el-form-item>
                  <el-form-item label="下单方式" prop="type">
                    <div class="surplus">成人：余3</br>儿童：余2</div>
                    <el-radio-group v-model="ruleForm.type"><br/>
                      <el-radio label="确认占位" class="radiomar">确认占位 （同业社额度： 总欠款 <span class="color-blue">270,164</span> 元）</el-radio><br/>
                      <el-radio label="预定占位" class="radiomar">预定占位 （订单保留24小时，到期提醒）</el-radio><br/>
                      <el-radio label="确认订单" class="radiomar">确认订单</el-radio><br/>
                      <el-radio style="display:none" label="提交用户信息" class="radiomar">提交用户信息</el-radio><br/>
                      <el-radio style="display:none" label="发送电子合同给客人" class="radiomar">发送电子合同给客人</el-radio><br/>
                      <el-radio style="display:none" label="作废订单" class="radiomar">作废订单</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item style="display:none" label="评价信息" prop="">            
                     <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" class="remark" placeholder="请输入内容" v-model="ruleForm.remark"></el-input>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="subInfo('conForm')" class="confirm">保存修改</el-button>
              </div>
              <div slot="footer" class="dialog-footer1">
                <el-button @click="dialogFormVisible = false"><span>关 闭</span></el-button>
              </div>
       </el-dialog>
       <!--变更数量弹窗-->
       <el-dialog title="变更数量" :visible.sync="dialogFormNum" class="city_list" width="800px" style="margin-top:-50px">
          <el-form :model="numForm" ref="numForm" :rules="rules" label-width="100px" class="demo-ruleForm numForm">
           <el-form-item label="" prop="">            
              <div class="ml13">结算参考 <span class="color-red">￥340</span></div>
           </el-form-item>
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
              <div class="ml13">成人<el-input v-model="ruleForm.num1" class="numw" @input="peoNum('adult')"></el-input><span class="color-red">余（17） ￥11400</span></div>
            </el-form-item>
            <el-form-item label="" prop="num2">            
              <div class="ml13">儿童<el-input v-model="ruleForm.num2" class="numw" @input="peoNum('child')"></el-input><span class="color-red">余（17） ￥1140</span></div>
            </el-form-item>
            <el-form-item label="" prop="num3">            
              <div class="ml13">老人<el-input v-model="ruleForm.num3" class="numw" @input="peoNum('elder')"></el-input><span class="color-red">余（17） ￥1140</span></div>
            </el-form-item>
            <el-form-item label="" prop="">            
              <div class="ml13">单房差 <span class="color-red">￥340</span></div>
            </el-form-item>
            <!--其他费用-->
            <div style="height:60px">
              <el-form-item label="其他费用" prop="otherCost" class="fl cb">            
                <el-input v-model="ruleForm.otherCost" class="numw" type="number" :min="0"></el-input>
              </el-form-item>
              <div class="fl mtn5">            
                备注<el-input v-model="ruleForm.otherCostRemark" class="cost-remark"></el-input>
              </div>
            </div>
            <!--整体优惠-->
            <el-form-item label="整体优惠" prop="allDiscount" class="fl cb">            
              <el-input v-model="ruleForm.allDiscount" class="numw" type="number" :min="0"></el-input>
            </el-form-item>
            <div class="fl mtn5">            
              备注<el-input v-model="ruleForm.allDisRemark" class="cost-remark"></el-input>
            </div>
            <el-form-item label="总计" prop="totalPrice" class="cb">            
              <div class="ml13"><span class="color-red">￥{{numForm.totalPrice}}</span></div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="numdialog-footer">
               <el-button @click="dialogFormNum = false">取 消</el-button>
               <el-button type="primary" @click="subInfo('conForm')" class="confirm">保 存</el-button>
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
       adult:[{name:"点击填写"},{name:"点击填写"}],
       child:[{name:"点击填写"}],
       elder:[{name:"点击填写"}],
       ruleForm: {  
         contactName:'',
         contactPhone:'',
         remark:'',
         otherCost: 0,
         otherCostRemark: '',
         allDiscount: 0,
         allDisRemark: '',
       },
       dialogFormNum:false,  //变更数量弹窗
       numForm:{
         totalPrice:13000
       },
       rules:{
         otherCost: [
            { required: true, message: '请输入其他费用', trigger: 'blur' },
            { pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/, message: '必须为数字值，并且不允许是负数'}],
         allDiscount: [
            { required: true, message: '请输入整体优惠', trigger: 'blur' },
            { pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/, message: '必须为数字值，并且不允许是负数'}],
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
     }
  },
  methods: {
      //流程管理
      processManage(orderId){
        //查询一条订单信息
        this.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderget',{
             "id": orderId
          }).then(res => {
            this.orderget={};
            if(res.data.isSuccess == true){
               this.orderget=res.data.object;   
               this.dialogFormProcess=true;           
            }
          }).catch(err => {
            console.log(err)
        })
      },
      changeNum(){
        this.dialogFormNum=true;
      },
      //列表订单状态显示
      getOrderStatus(status){
          switch(status){
            case 1:
              return '补充游客材料';
              break;
            case 2:
              return '电子合同';
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
              return '签署合同';
              break;
            case 9:
              return '订单作废';
              break;
            case 10:
              return '订单确认';
              break;
          }
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
       .dialog-footer{text-align: left;margin:-40px 0 20px 265px;display: none}
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
</style>