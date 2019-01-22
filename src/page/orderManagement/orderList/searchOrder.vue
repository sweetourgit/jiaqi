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
       endTime: ''
    }
  },
  mounted(){

  },
  methods: {
      statusTab(num,index){
        if(num==1){
          this.orderNum=index;
        }
        if(num==2){
          this.refundNum=index;
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
</style>