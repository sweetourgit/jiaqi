<template>
  <div>
    <div class="demo-input-suffix">
      <!--供应商-->
      <span class="search-title">供应商</span>
      <el-input placeholder="请输入" v-model="supplier" class="group-no"></el-input>
      <!--团期计划-->
      <span class="search-title">团期计划</span>
      <el-input placeholder="请输入" v-model="groupNo" class="group-no"></el-input>
      <!--操作-->
      <span class="search-title">操作</span>
      <el-input placeholder="请输入" v-model="op" class="group-no"></el-input>
      <!--出行日期-->
      <span class="search-title">起始时间</span>
      <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
        align="right" class="group-no" style="width:260px;"></el-date-picker>
      <br />
      <!--搜索-->
      <el-button type="primary" class="search-but" @click="search">搜索</el-button>
      <el-button type="primary" plain @click="reset">重置</el-button></div></br>
      <el-button plain type="primary" disabled>查看关联单据</el-button>

    </div>
  </div>
</template>

<script>
export default{
  data(){
    return {
      supplier:"",
      groupNo:"",
      op:"",
      date: "", 





    }
  },
  created(){
  },
  methods:{
    search(){

    },
    reset(){

    }
  }
};
</script>

<style>
/*search*/
.demo-input-suffix {
  padding: 20px 0 0px 20px;
  width: 1390px;
  background-color: #f7f7f7;
}
.el-input {
  width: auto;
  margin-right: 15px;
}
.group-no {
  margin-left: 10px;
}
.search-title {
  font-size: 14px;
  text-align:right;
}
.search-but {
  margin: 20px 0 15px 0;
  overflow: hidden;
}

</style>