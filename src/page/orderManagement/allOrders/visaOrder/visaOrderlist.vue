<template>
  <div>
     <div class="demo-input-suffix" v-if="true">
          <!--搜索-->
          <span class="search-title">订单ID</span>
          <el-input v-model="orderCode" class="input"></el-input>
          <span class="search-title">产品名称</span>
          <el-input v-model="productName" class="input"></el-input>
          <span class="search-title">团期计划</span>
          <el-input v-model="groupCode" class="input"></el-input>
          <span class="search-title">订单时间</span>
          <el-date-picker v-model="beginDate" type="date" placeholder="开始日期" class="start-time" @change="endDateChange"></el-date-picker>
             <div class="date-line"></div>
          <el-date-picker v-model="endDate" type="date" placeholder="终止日期" class="start-time" @change="endDateChange"></el-date-picker></br>
          <span class="search-title por">签证地区<span v-if="isDes" class="poa">没有该地区名称</span></span>
          <el-autocomplete class="input" v-model="destination" :fetch-suggestions="querySearch" :trigger-on-focus="false" @select="departure" @blur="isToastFun(1)"></el-autocomplete>
          <span class="search-title">订单联系人</span>
          <el-input v-model="orderContact" class="input"></el-input>
          <span class="search-title por">商户名称<span v-if="isToast" class="poa">没有该商户名称</span></span>
          <el-autocomplete class="input" v-model="localcomp" :fetch-suggestions="handleBusinessGet" :trigger-on-focus="false" @select="handleChooseOrgID" @blur="isToastFun(2)"></el-autocomplete>
          <span class="search-title">销售</span>
          <el-input v-model="saler" class="input"></el-input></br>
          <!--订单状态-->
          <div class="status-title">订单状态</div>
          <ul class="order-status">
            <li v-for="(item,index) in orderStatusSearch" @click="statusTab(1,index,item.status)" v-bind:class="{statusbg: orderNum==index}">{{item.name}}</li>
          </ul>
          <!--退款状态-->
          <ul class="order-status1">
            <li v-for="(item,index) in refundStatusSearch" @click="statusTab(2,index,item.status)" v-bind:class="{statusbg: refundNum==index}">{{item.name}}</li>
          </ul>
          <div class="search-but">
             <el-button type="primary" @click="orderPage(1,pageSize)">搜索</el-button>
             <el-button type="primary" @click="reset">重置</el-button>
          </div>
          <!--订单列表-->
          <div class="pro-info" v-for="(item,index) in orderpage" :key="index">
          <h3 class="list-title">{{item.name}}</h3>
          <div class="contentHeader" @click="handleContentHeader(index)">
              <table>
                <tr>
                  <td class="tr">订单ID</td>
                  <td width="270">{{item.orderCode}}</td>
                  <td class="tr">团期计划</td>
                  <td width="270">{{item.groupCode}}</td>
                  <td class="tr">下单时间</td>
                  <td width="270">{{formatDate(new Date(item.createTime))}}</td>
                </tr>
                <tr>
                  <td class="tr">套餐</td>
                  <td>{{item.package}}</td>
                  <td class="tr">签证类型</td>
                  <td>
                    <div v-if="item.productType=='1'">单次旅游签</div>
                    <div v-if="item.productType=='2'">5年旅游签</div>
                    <div v-if="item.productType=='3'">10年多次旅游签</div>
                    <div v-if="item.productType=='4'">探亲访友签</div>
                    <div v-if="item.productType=='5'">商务签证</div>
                  </td>
                  <td class="tr">签证地区</td>
                  <td>{{item.visaArea}}</td>
                </tr>
              </table>
              <i :class="['contentHeaderIcon', showContent !== index ? 'el-icon-arrow-right': 'el-icon-arrow-down']"></i>
            </div>
            <transition name="el-fade-in">
              <div v-show="showContent == index">
                <table>
                  <tr>
                    <td class="tr">联系人</td>
                    <td width="270">{{item.contactName}}</td>
                    <td class="tr">电话</td>
                    <td width="270">{{item.contactTel}}</td>
                    <td class="tr">产品类型</td>
                    <td width="270">
                      <div v-if="item.productType=='1'">跟团游</div>
                      <div v-if="item.productType=='2'">自由行</div>
                      <div v-if="item.productType=='3'">签证</div>
                      <div v-if="item.productType=='4'">邮轮</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="tr">整体优惠</td>
                    <td>{{item.favTitle}}({{item.entiretyFav | numFilter}})</td>
                    <td class="tr">数量</td>
                    <td>{{item.enrollDetail}}</td>
                    <td class="tr">其他费用</td>
                    <td>{{item.otherTitle}}({{item.otherPrice | numFilter}})</td>
                  </tr>
                  <tr>
                    <td class="tr">支付方式</td>
                    <td>
                      <div v-if="item.settlementType=='1'">月结</div>
                      <div v-if="item.settlementType=='2'">非月结</div>
                    </td>
                    <td class="tr">销售</td>
                    <td>{{item.saler}}</td>
                    <td class="tr">订单来源</td>
                    <td>{{item.orderChannels}}</td>
                  </tr>
                  <tr>
                    <td class="tr">平台</td>
                    <td>
                      <div v-if="item.platform=='1'">ERP系统</div>
                      <div v-if="item.platform=='2'">同业系统</div>
                    </td>
                    <td class="tr">操作</td>
                    <td>{{item.op}}</td>
                    <td class="tr">商户销售</td>
                    <td>{{item.indirectSale}}</td>
                  </tr>
                  <tr>
                    <td class="tr">订单总额</td>
                    <td>{{item.payable | numFilter}}</td>
                    <td class="tr">已付金额</td>
                    <td>{{item.paid | numFilter}}</td>
                  </tr>
                </table>
                <el-breadcrumb separator="|" class="confirm-time">
                  <el-breadcrumb-item class="breadCrumbPointer" @click.native="operation(item.id,1,item.orderCode)">备注</el-breadcrumb-item>
                  <el-breadcrumb-item class="breadCrumbPointer">收款</el-breadcrumb-item>
                  <el-breadcrumb-item class="breadCrumbPointer" @click.native="operation(item.id,2,item.orderCode)">流程管理</el-breadcrumb-item>
                  <el-breadcrumb-item class="breadCrumbPointer">退款</el-breadcrumb-item>
                  <el-breadcrumb-item class="breadCrumbPointer">发票申请</el-breadcrumb-item>
                  <el-breadcrumb-item class="breadCrumbPointer">出团通知书</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="but-row">
                    <span class="dot"></span>
                    <span>{{getOrderStatus(item.visaOrderStatus)}}</span>
                </div> 
                <!--退款状态-->
                <div class="but-row" v-if="item.refundStatus !=0">
                  <span class="dot"></span>
                  <span>{{getrefundStatus(item.refundStatus)}}</span>
                </div>
              </div>
            </transition>
          </div>
          <el-pagination v-if="pageshow" class="pagination"
            @size-change="handleSizeChange"
            background
            @current-change="handleCurrentChange"
            :current-page="1" 
            :page-sizes="[10, 30, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
          <visa-remarksinfor :orderId="orderId" :variable="variable" :dialogType="dialogType"></visa-remarksinfor>
          <visa-processmanage :orderId="orderId" :variable="variable" :dialogType="dialogType" @orderPage="orderPage"></visa-processmanage>
     </div>
  </div>
</template>

<script>
import visaRemarksinfor from './common/visaRemarksInfor';
import visaProcessmanage from './common/visaProcessManage';
export default {
  components:{
    "visa-remarksinfor":visaRemarksinfor,
    "visa-processmanage":visaProcessmanage
  },
  data() {
    return {
       orderCode:'',
       productName:'',
       groupCode:'',
       beginDate: '',
       endDate: '',
       destination:'',
       destinationID:0,
       isDes:false,
       orderContact:'',
       localcomp:'',
       localcompID:0,
       isToast:false,
       saler:'',
       orderStatusSearch:[
         {'status':0,'name':"全部"},
         {'status':0,'name':"下单成功(2)"},
         {'status':0,'name':"收到材料(2)"},
         {'status':0,'name':"材料审核(2)"},
         {'status':0,'name':"材料补交中(2)"},
         {'status':0,'name':"材料制作中(2)"},
         {'status':0,'name':"成功预约时间(2)"},
         {'status':0,'name':"送签(2)"},
         {'status':0,'name':"面签(2)"},
         {'status':0,'name':"使馆审理中(2)"},
         {'status':0,'name':"使馆审理完毕(2)"},
         {'status':0,'name':"过签(2)"},
         {'status':0,'name':"拒签(2)"},
         {'status':0,'name':"邮寄中(2)"},
         {'status':0,'name':"待评价(2)"},
         {'status':0,'name':"订单完成"},
         {'status':0,'name':"订单作废"},
       ],
       orderNum:0,
       orderStatus:0,
       refundStatusSearch:[
         {'status':0,'name':"申请退款(2)"},
         {'status':0,'name':"退款中(2)"},
         {'status':0,'name':"完成退款"},
         {'status':0,'name':"拒绝退款"},
       ],
       refundNum:null,
       refundStatus:0,
       //订单列表
       pageshow:true,
       showContent: null,
       pageSize: 10, 
       pageIndex: 1,
       total: 0,
       orderpage:[],
       orderId:0,
       variable:0, //设置一个变量展示弹窗
       dialogType:0,//弹窗类型  1：流程管理  2：备注信息
    }
  },
  watch:{

  },
  created(){
    this.orderPage();
  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  },
  methods: {
      //目的地
    querySearch(queryString, cb) {
      this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainforlist', {
        "object": {
          areaName: queryString
        }
      }).then(res => {
         if (res.data.objects.length > 0) {
          let tableData=[];
          for(let i=0;i<res.data.objects.length;i++){
            tableData.push({
              "value" : res.data.objects[i].areaName,
              "id":res.data.objects[i].id
            })
          }
          var results = queryString ? tableData.filter(this.createFilter(queryString)) : [];
          cb(results)
         }else{
            this.isDes = true;
            cb && cb([]);
          }
        }).catch(err => {
          console.log(err);
        })
      },
      createFilter(queryString){
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      departure(item){
        this.destinationID = item.id;
        this.destination = item.value;
      },
      //商户
      handleBusinessGet(queryString3, cb) {
        this.$http
          .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/list", {
            object: {
              name: queryString3,
              isDeleted: 0
            }
          })
          .then(res => {
            if (res.data.isSuccess == true) {
              let businessLists = [];
              this.isToast = false;
              for (let i = 0; i < res.data.objects.length; i++) {
                businessLists.push({
                  'value': res.data.objects[i].name,
                  'id': res.data.objects[i].id
                });
              }
              let results = queryString3 ? businessLists.filter(this.createFilter(queryString3)) : [];
              cb && cb(results);
            } else {
              this.isToast = true;
              cb && cb([]);
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      handleChooseOrgID(item) {
        this.localcompID = item.id;
      },
      isToastFun(i) {
        if(i==1){
          this.isDes = false;
          this.destination = "";
          this.destinationID = 0;
        }else{
          this.isToast = false;
          this.localcomp = "";
          this.localcompID = 0;
        }
      },
      endDateChange() {
        let beginTime = new Date(this.beginDate).getTime();
        let entTime = new Date(this.endDate).getTime();
        if (this.beginDate !== "") {
          if (entTime < beginTime) {
            this.$message.error("结束时间不能早于开始时间");
            this.endDate = "";
          }
        }
      },
      statusTab(num,index,status){
        if(num==1){
          this.orderNum = index;
          this.refundNum = null;
          this.orderStatus = status;
          this.refundStatus = 0;
        }
        if(num==2){
          this.refundNum = index;
          this.orderNum = null;
          this.refundStatus = status;
          this.orderStatus = 0;
        }
        this.orderPage(1,this.pageSize)
      },
      reset(){
        this.orderCode='';
        this.productName='';
        this.groupCode='';
        this.beginDate='';
        this.endDate='';
        this.destination='';
        this.destinationID=0;
        this.orderContact='';
        this.localcomp='';
        this.localcompID=0;
        this.saler='';
        this.showContent = null;
      },
      //订单列表
      toDecimal2(x) {
        let f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf(".");
        if (rs < 0) {
          rs = s.length;
          s += ".";
        }
        while (s.length <= rs + 2) {
          s += "0";
        }
        return s;
      },
      handleContentHeader(index){
        if(this.showContent != index){
          this.showContent = index;
        }else{
          this.showContent = null;
        }
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        this.orderPage(1,val);
      },
      handleCurrentChange(val){
        this.orderPage(val,this.pageSize);
        this.pageIndex=val;
      },
      orderPage(pageIndex=this.pageIndex,pageSize=this.pageSize,orderCode=this.orderCode,teamID=this.teamID,groupCode=this.groupCode,name=this.productName,beginDate=this.beginDate,endDate=this.endDate,visaArea = this.destination,destinationID=this.destinationID,saler=this.saler,productType=this.productType,orderStatus=this.orderStatus,refundStatus=this.refundStatus){
        this.pageshow = false;
        if(beginDate){
          let y=beginDate.getFullYear();
          let m=(beginDate.getMonth()+1)>9?beginDate.getMonth()+1:'0'+(beginDate.getMonth()+1);
          let d=beginDate.getDate()>9?beginDate.getDate():'0'+beginDate.getDate();
          beginDate=''+ y + '-' + m + '-' + d
        }else{
          beginDate = "0001-01-01";
        }
        if(endDate){
          let y=endDate.getFullYear();
          let m=(endDate.getMonth()+1)>9?endDate.getMonth()+1:'0'+(endDate.getMonth()+1);
          let d=endDate.getDate()>9?endDate.getDate():'0'+endDate.getDate();
          endDate=''+ y + '-' + m + '-' + d
        }else{
          endDate = "0001-01-01";
        }
        this.$http.post(this.GLOBAL.serverSrc + '/order/visa/api/orderpage',{
            "pageIndex": pageIndex,
            "pageSize": pageSize,
            "object":{            
                "orderCode":orderCode,   
                "teamID":teamID?teamID:0,
                "groupCode":groupCode,
                "name":this.productName,
                "beginDate": beginDate,
                "endDate": endDate,
                "visaArea":this.destination,
                //"destinationID":destinationID?destinationID:0,
                "saler":saler,
                "productType":productType ? productType : 0,
                "orderStatus":this.orderStatus,
                "refundStatus":this.refundStatus
             }
          }).then(res => {
            this.orderpage=[];
            this.total=res.data.total;
            if(res.data.isSuccess == true){
               this.orderpage=res.data.objects; 
               this.getOrderStatus(this.orderpage);             
            }
          }).catch(err => {
            console.log(err)
          })
          this.$nextTick(() => {
              this.pageshow = true;
          })
      },
      //列表订单状态显示
      getOrderStatus(status){
          switch(status){
            case 0:
              return '全部';
              break;
            case 1:
              return '下单成功';
              break;
            case 2:
              return '收到材料';
              break;
            case 3:
              return '材料审核';
              break;
            case 4:
              return '材料补交中';
              break;
            case 5:
              return '材料制作中';
              break;
            case 6:
              return '成功预约时间';
              break;
            case 7:
              return '送签';
              break;
            case 8:
              return '面签';
              break;
            case 9:
              return '使馆审理中';
              break;
            case 10:
              return '使馆审理完毕';
              break;
            case 11:
              return '过签';
              break;
            case 12:
              return '拒签';
              break;
            case 13:
              return '邮寄中';
              break;
            case 14:
              return '待评价';
              break;
            case 15:
              return '订单完成';
              break;
            case 16:
              return '订单作废';
              break;
            case 17:
              return '申请退款';
              break;
            case 18:
              return '退款中';
              break;
            case 19:
              return '完成退款';
              break;
            case 20:
              return '拒绝退款';
              break;
          }
      },
      //列表退款状态显示
      getrefundStatus(status) {
        switch (status) {
          case 1:
            return "退款中";
            break;
          case 2:
            return "拒绝退款";
            break;
          case 3:
            return "已退款";
            break;
          case 4:
            return "无退款";
            break;
          case 5:
            return "申请退款";
            break;
          case 6:
            return "完成退款";
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
          this.dialogType=i;         
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
       .order-status{float:left;width: 1000px;list-style-type:none;margin:13px 0 0 0;display:inline-block;padding: 0;font-size:14px;line-height: 35px;overflow: hidden;text-align: center;}
       .order-status1{float:left;width: 1000px;list-style-type:none;margin:0 0 0 90px;display:inline-block;padding: 0;font-size:14px;line-height: 35px;overflow: hidden;text-align: center;}
       .order-status1 li,.order-status li{float: left;width:120px;border:1px solid #eaeaea;cursor: pointer;margin-bottom: 8px}
       .search-but{clear:both;display:block;padding:13px 0 25px 17px;}
       .statusbg{background-color:#f6f6f6}
       .poa{position: absolute;left: 76px;top: 30px;width: 100px;color: red;font-size: 12px}
       .por {position: relative}
       /*订单列表*/
       .pro-info{font-size: 14px;background-color: #e4e4e4;margin:0 30px 30px 10px;line-height: 25px;padding:15px;width: 70%;min-width: 1120px; overflow: hidden;}
       .list-title{margin-left: 4px}
       .breadCrumbPointer{cursor: pointer;}
       .contentHeader{position: relative;}
       .contentHeaderIcon{position: absolute;right: 10px;top:18px;transform: translateY(-50%);}
       .tr{font-weight: bold;vertical-align: top;width:65px;}
       .but-row{margin: 10px 20px 10px 10px; float: left;}
       .confirm-time{float: right;margin-top: 46px;margin-right: 20px;}
       .pagination{text-align: center;margin: 50px 0;}
       .dot{display: inline-block;width: 7px;height: 7px;background-color: #7ec856;border-radius: 50%;margin-top: -2px;margin-right: 6px;}
</style>