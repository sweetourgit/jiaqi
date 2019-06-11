<template>
  <div>
     <div class="demo-input-suffix">
          <!--搜索-->
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
          <!--订单状态-->
          <div class="status-title">订单状态</div>
          <ul class="order-status">
            <li v-for="(item,index) in orderStatus" @click="statusTab(1,index)" v-bind:class="{statusbg: orderNum==index}">{{item}}</li>
          </ul></br>
          <!--退款状态-->
          <div class="status-title">退款状态</div>
          <ul class="order-status">
            <li v-for="(item,index) in refundStatus" @click="statusTab(2,index)" v-bind:class="{statusbg: refundNum==index}">{{item}}</li>
          </ul></br>
          <el-button type="primary" class="search-but">搜索</el-button>
          <!--订单列表-->
          <div class="pro-info" v-for="(item,index) in orderpage">
            <table cellpadding="5">
                <tr>
                  <td width="60" class="tr">订单ID</td>
                  <td>{{item.orderCode}}</td>
                  <td width="60" class="tr">产品ID</td>
                  <td width="220">{{item.teamID}}</td>
                  <td width="85" class="tr">订单状态</td>
                  <td width="90">{{getOrderStatus(item.orderStatus)}}</td>
                  <td width="60" class="tr">退款状态</td>
                  <td width="60">{{getrefundStatus(item.refundStatus)}}</td>
                  <td width="60" class="tr">订单时间</td>
                  <td>{{formatDate(new Date(item.createTime))}}</td>
                </tr>
                <tr>
                  <td width="60" class="tr">产品名</td>
                  <td colspan="9">{{item.name}}</td>
                </tr>
                <tr>
                  <td width="60" class="tr">套餐名称</td>
                  <td colspan="3">{{item.package}}</td>
                  <td width="60" class="tr">团号</td>
                  <td colspan="5">{{item.groupCode}}</td>
                </tr>
                <tr>
                  <td width="60" class="tr">应付</td>
                  <td>{{item.payable}}</td>
                  <td width="60" class="tr">电话</td>
                  <td rowspan="2" valign="top">{{item.contactTel}}</td>
                  <td width="60" class="tr">优惠</td>
                  <td colspan="4" rowspan="2" valign="top">{{item.favTitle}}</td>
                  <td rowspan="2">&nbsp;</td>
                </tr>
                <tr>
                  <td width="60" class="tr">已付</td>
                  <td>{{item.paid}}</td>
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
                  <td>{{item.saler}}</td>
                </tr>
                <tr>
                  <td width="60" class="tr">用户姓名</td>
                  <td>{{item.contactName}}</td>
                  <td width="60" class="tr"></td>
                  <td></td>
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
               <el-button @click="operation(item.id,1)">流程管理</el-button>
               <el-button @click="operation(item.id,2)">备注信息</el-button>
               <el-button>未申请退款</el-button>
               <el-button @click="operation(item.id,4)">转团</el-button>
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
          <process-manage :orderId="orderId" :variable="variable" :dialogType="dialogType" @orderPage="orderPage"></process-manage>
          <remarks-infor :orderId="orderId" :variable="variable" :dialogType="dialogType"></remarks-infor>
          <order-transfer :orderId="orderId" :variable="variable" :dialogType="dialogType"></order-transfer>
     </div>
  </div>
</template>

<script>
import processManage from './common/processManage';
import remarksInfor from './common/remarksInfor';
import orderTransfer from './common/orderTransfer';
export default {
  components:{
    "process-manage":processManage,
    "remarks-infor":remarksInfor,
    "order-transfer":orderTransfer
  },
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
       orderId:0,
       variable:0, //设置一个变量展示弹窗
       dialogType:0,//弹窗类型  1：流程管理  2：备注信息
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
        this.orderPage(1,val);
      },
      handleCurrentChange(val){
        this.orderPage(val,this.pageSize);
        this.pageIndex=val;
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
      //列表退款状态显示
      getrefundStatus(status){
         switch(status){
            case 1:
              return '退款中';
              break;
            case 2:
              return '拒绝退款';
              break;
            case 3:
              return '已退款';
              break;
            case 4:
              return '无退款';
              break;
            case 5:
              return '申请退款';
              break;
            case 6:
              return '完成退款';
              break;
          }
      },
      formatDate(date){
       var y = date.getFullYear();  
       var m = date.getMonth() + 1;  
           m = m < 10 ? ('0' + m) : m;  
       var d = date.getDate();  
           d = d < 10 ? ('0' + d) : d;  
       var h = date.getHours();  
           h=h < 10 ? ('0' + h) : h;  
       var minute = date.getMinutes();  
           minute = minute < 10 ? ('0' + minute) : minute;  
       var second=date.getSeconds();  
           second=second < 10 ? ('0' + second) : second;  
           return y + '-' + m + '-' + d +' '+ h + ':' + minute + ':' + second;
      },      
      operation(orderId,i){
          this.orderId = orderId;
          this.variable++;
          if(i==1){
            this.dialogType=1; //流程管理弹窗
          }else if(i==2){
            this.dialogType=2; //备注信息弹窗
          }else if(i==4){
            this.dialogType=4; //转团
          }           
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
       .pagination{text-align:center;margin:50px 0}
</style>