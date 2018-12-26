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
          </el-select>



     </div>
     <div class="line"></div>
     <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
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

      }
}
</script>

<style scoped>
       .demo-input-suffix{width: 1150px;}
       .input{margin:10px 5px;width: 145px;}
       .search-title{font-size: 14px;margin-left: 10px;display: inline-block;width: 75px;text-align: center;}
       .start-time{margin-left:10px;width: 135px}
       .date-line{width:15px;border-bottom:1px solid #e6e6e6;display:inline-block;margin:0 -10px 3px 0}
       .sec-type{margin-left:10px}
</style>