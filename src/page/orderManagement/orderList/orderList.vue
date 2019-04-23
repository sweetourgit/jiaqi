<template>
  <div>
     <div class="demo-input-suffix">
          <span class="search-title">订单ID</span>
          <el-input v-model="groupNo" class="input"></el-input>
          <span class="search-title">产品ID</span>
          <el-input v-model="groupNo" class="input"></el-input>
          <span class="search-title">团期计划ID</span>
          <el-input v-model="groupNo" class="input"></el-input>
          <span class="search-title">订单时间</span>
          <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time"></el-date-picker>
             <div class="date-line"></div>
          <el-date-picker v-model="endTime" type="date" placeholder="终止日期" class="start-time"></el-date-picker></br>
          <span class="search-title">产品名称</span>
          <el-input v-model="groupNo" class="input"></el-input>
          <span class="search-title">目的地</span>
          <el-input v-model="groupNo" class="input"></el-input>
          <span class="search-title">销售</span>
          <el-input v-model="groupNo" class="input"></el-input>
          <span class="search-title">产品类型</span>
          <el-select v-model="proTypevalue" placeholder="请选择"  class="sec-type">
             <el-option v-for="item in proType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select></br>
          <div class="status-title">订单状态</div>
          <ul class="order-status">
            <li v-for="(item,index) in orderStatus" @click="statusTab(1,index)" v-bind:class="{statusbg: orderNum==index}">{{item}}</li>
          </ul></br>
          <div class="status-title">退款状态</div>
          <ul class="order-status">
            <li v-for="(item,index) in refundStatus" @click="statusTab(2,index)" v-bind:class="{statusbg: refundNum==index}">{{item}}</li>
          </ul></br>
          <el-button type="primary" class="search-but">搜索</el-button>
          <!--订单列表-->
          <div class="pro-info">
            <table cellpadding="5">
                <tr>
                  <td width="60" class="tr">订单ID</td>
                  <td>24093932018091010185273</td>
                  <td width="60" class="tr">产品ID</td>
                  <td width="220">24093932018091010185273</td>
                  <td width="85" class="tr">订单状态</td>
                  <td width="70">订单确认</td>
                  <td width="60" class="tr">退款状态</td>
                  <td width="60">未退款</td>
                  <td width="60" class="tr">订单时间</td>
                  <td>2018/09/10 13:37</td>
                </tr>
                <tr>
                  <td width="60" class="tr">产品名</td>
                  <td colspan="9">新加坡斜坡滑车+空中吊椅索道滑车SkylineLuge景点门票 ( 即订即用 圣淘沙景点门票）</td>
                </tr>
                <tr>
                  <td width="60" class="tr">套餐名称</td>
                  <td colspan="3">君澜日式豪华房 含早餐 双人不限次温泉门票</td>
                  <td width="60" class="tr">团期计划ID</td>
                  <td colspan="5">24093932018091010185273</td>
                </tr>
                <tr>
                  <td width="60" class="tr">应付</td>
                  <td>1200</td>
                  <td width="60" class="tr">单价</td>
                  <td rowspan="2" valign="top">成人3000.00*1 单房差 500.00*1</td>
                  <td width="60" class="tr">优惠</td>
                  <td colspan="4" rowspan="2" valign="top">满1000立减300 下单立减2块</td>
                  <td rowspan="2">&nbsp;</td>
                </tr>
                <tr>
                  <td width="60" class="tr">已付</td>
                  <td>2500</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td width="60" class="tr">平台</td>
                  <td>苹果</td>
                  <td width="60" class="tr">支付方式</td>
                  <td>微信支付</td>
                  <td width="60" class="tr">订单来源</td>
                  <td colspan="3">xxx旅行社</td>
                  <td width="60" class="tr">销售</td>
                  <td>阳阳</td>
                </tr>
                <tr>
                  <td width="60" class="tr">用户姓名</td>
                  <td>阳阳</td>
                  <td width="60" class="tr">电话</td>
                  <td>13800001111</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
            </table>
            <div class="confirm-time">待确认剩余<span>1天22:33:33</span></div>
            <el-row class="but-row">
               <el-button>联系客人</el-button>
               <el-button @click="processManage">流程管理</el-button>
               <el-button>备注信息</el-button>
               <el-button>未申请退款</el-button>
               <el-button>转团</el-button>
            </el-row>
          </div>
          <el-pagination class="pagination"
            @size-change="handleSizeChange"
            background
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
       <!--流程管理弹窗-->
       <el-dialog title="流程管理" :visible.sync="dialogFormProcess" class="city_list" width="800px">
              <div class="process-sta">订单状态：<span>预定不占</span></div>
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
       <el-dialog title="变更数量" :visible.sync="dialogFormNum" class="city_list" width="800px">
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
            <el-form-item label="总计" prop="totalPrice">            
              <div class="ml13"><span class="color-red">￥{{numForm.totalPrice}}</span></div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="numdialog-footer">
               <el-button @click="dialogFormNum = false">取 消</el-button>
               <el-button type="primary" @click="subInfo('conForm')" class="confirm">保 存</el-button>
          </div>
       </el-dialog>





     </div>
     <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
       orderStatus:["全部","未确认（3）","签署合同（2）","出行中（3）","待点评（3）","完成订单","作废订单"],
       orderNum:"0",
       refundStatus:["全部","申请退款（3）","退款中（3）","完成退款","拒绝退款"],
       refundNum:"0",
       proType: [{
          value: '0',
          label: '跟团游'
        }, {
          value: '1',
          label: '自由行'
        }, {
          value: '2',
          label: '签证'
        }, {
          value: '3',
          label: '邮轮'
        }, {
          value: '4',
          label: '周边游'
       }],
       proTypevalue: '',
       groupNo:'',
       startTime: '',
       endTime: '',
       //订单列表
       pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
       pageIndex: 1, // 设定当前页数
       total: 0,
       orderpage:[],

       dialogFormProcess:false,  //流程管理弹窗
       adult:[{name:"点击填写"},{name:"点击填写"}],
       child:[{name:"点击填写"}],
       elder:[{name:"点击填写"}],
       ruleForm: {  
         contactName:'',
         contactPhone:'',
         remark:''
       },
       dialogFormNum:false,  //变更数量弹窗
       numForm:{
         totalPrice:13000
       },
       rules:{

       } 
       


    }
  },
  created(){
    this.orderPage();
  },
  methods: {
      statusTab(num,index){
        if(num==1){
          this.orderNum=index;
        }
        if(num==2){
          this.refundNum=index;
        }
      },
      //订单列表
      handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
       // this.orderPage(1,val);
      },
      handleCurrentChange(val){
       // this.orderPage(val,this.pageSize);
      },
      orderPage(pageIndex=this.pageIndex,pageSize=this.pageSize){
        this.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderpage',{
            "pageIndex": pageIndex,
            "pageSize": pageSize,
            "object":{            
           //   "groupCode": groupCode
             }
          }).then(res => {
            this.orderpage=[];
            this.total=res.data.total;
            if(res.data.isSuccess == true){
               this.orderpage=res.data.objects;              
            }
          }).catch(err => {
            console.log(err)
          })
      },

      processManage(){
        this.dialogFormProcess=true;
      },
      changeNum(){
        this.dialogFormNum=true;

        
      }
      









      }
}
</script>

<style scoped>
       .demo-input-suffix{width: 1150px;}
       .input{margin:10px 5px;width: 145px;}
       .search-title{font-size: 14px;margin-left:5px;display: inline-block;width: 75px;text-align: center;}
       .start-time{margin-left:10px;width: 135px !important}
       .date-line{width:15px;border-bottom:1px solid #e6e6e6;display:inline-block;margin:0 -10px 3px 0}
       .sec-type{margin-left:10px}
       .status-title{float:left;font-size: 14px;margin:22px 0 0 15px;width:75px;}
       .order-status{list-style-type:none;margin:13px 0 0 0;display:inline-block;padding: 0;font-size:14px;border: 1px solid #eaeaea;border-right: 0;line-height: 35px;overflow: hidden;text-align: center;}
       .order-status li{float: left;width:120px;border-right: 1px solid #eaeaea;cursor: pointer;}
       .order-status li:first-child{width:80px}
       .search-but{margin: 20px 0 15px 10px}
       .statusbg{background-color:#f6f6f6}
       /*订单列表*/
       .pro-info{font-size: 14px;background-color: #e4e4e4;margin:0 30px 30px 10px;line-height: 25px;padding:10px;width: 70%;min-width:1120px}
       .tr{text-align: right;font-weight: bold}
       .but-row{margin:40px 0 20px 10px}
       .but-row .el-button{border: 1px solid #2f95f9}
       .confirm-time{float: right;margin: 50px 55px 0 0;font-weight: bold;font-size:15px}
       .confirm-time span{color:#ff4c3d;margin-left: 20px}
       .process-sta{background-color: #d1cfd0;height: 40px;padding: 25px 0 0 20px}
       .process-sta span{margin-left: 20px;color: #3096fa}
       .demo-ruleForm{margin-top: 20px}
       .demo-ruleForm .el-form-item{margin-bottom: 13px}
       .numw{width: 125px;text-align: center;margin:0 15px}
       .tourist{float: left;width: 600px}
       .tourist input{width: 110px;background-color: #f6f6f6;color:#606266;text-align: center;border:0;height: 30px;margin:1px 10px 10px 4px}
       .tour-til{float: left;margin:0 13px}
       .oh{overflow: hidden}
       .change-num{width: 110px;background-color: #f6f6f6;text-align: center;height: 30px;line-height: 30px;margin: 10px 0 0 13px;cursor: pointer}
       .radiomar{margin:12px 13px}
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
       .pagination{text-align:center;margin:50px 0}
</style>