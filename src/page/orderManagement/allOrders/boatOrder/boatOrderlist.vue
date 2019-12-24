<template>
  <!-- 搜索begin -->
  <div class="boatSearch">
    <span class="searchName">订单ID</span>
    <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
    <span class="searchName">产品名称</span>
    <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
    <span class="searchName">下单日期</span>
    <el-date-picker
      v-model="beginDate"
      type="date"
      placeholder="开始日期"
      class="startTime"
      @blur="beginDateBlur()"
      @change="endDateChange()"
    ></el-date-picker>
    <div class="dateLine"></div>
    <el-date-picker
      v-model="endDate"
      type="date"
      placeholder="终止日期"
      class="startTime"
      @blur="endDateBlur()"
      @change="endDateChange()"
    ></el-date-picker>
    <br />
    <span class="searchName">团期计划</span>
    <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
    <span class="searchName">出发地</span>
    <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
    <span class="searchName">目的地</span>
    <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
    <br />
    <span class="searchName">商户名称</span>
    <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
    <span class="searchName">销售</span>
    <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
    <span class="searchName">订单联系人</span>
    <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
    <br />
    <span class="searchName">订单状态</span>
    <ul class="orderStatus">
      <li
        v-for="(item,index) in orderStatusSearch"
        :key="index"
        @click="statusTab(1,index,item.status)"
        v-bind:class="{statusbg: orderNum==index}"
      >{{item.name}}</li>
    </ul>
  </div>
  <!-- 搜索end -->
</template>

<script>
export default {
  data() {
    return {
      orderCode: "",
      orderStatusSearch: [
        { status: 0, name: "全部", type: 1 },
        { status: 7, name: "未确认", type: 1 },
        { status: 1, name: "补充资料", type: 1 },
        { status: 8, name: "签署合同", type: 1 },
        { status: 4, name: "出行中", type: 1 },
        { status: 5, name: "待点评", type: 1 },
        { status: 6, name: "完成订单", type: 1 },
        { status: 9, name: "作废订单", type: 1 },
        { status: 5, name: "申请退款", type: 2 },
        { status: 1, name: "退款中", type: 2 },
        { status: 6, name: "完成退款", type: 2 },
        { status: 2, name: "拒绝退款", type: 2 }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.boatSearch {
  .searchName {
    font-size: 14px;
    margin-left: 5px;
    display: inline-block;
    width: 75px;
    text-align: center;
  }
  .searchInput {
    margin: 10px 5px;
    width: 145px;
  }
  .startTime {
    margin-left: 10px;
    width: 135px !important;
  }
  .dateLine {
    width: 15px;
    border-bottom: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 -10px 3px 0;
  }
  .orderStatus {
    list-style-type: none;
    margin: 13px 0 0 0;
    display: inline-block;
    padding: 0;
    font-size: 14px;
    border: 1px solid #eaeaea;
    border-right: 0;
    line-height: 35px;
    overflow: hidden;
    text-align: center;
    width: 500px;
    li {
      float: left;
      width: 120px;
      border-right: 1px solid #eaeaea;
      cursor: pointer;
    }
  }
}
</style>