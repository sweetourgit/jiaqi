<template>
  <div>
     <div class="demo-input-suffix">
         <span class="search-title">客商名称</span>
         <el-input placeholder="请输入" v-model="customerName" class="el-input"></el-input>
         <span class="search-title">销售</span>
         <el-input placeholder="请输入" v-model="saler" class="el-input"></el-input>
         <el-button type="primary">搜索</el-button>
         <el-button type="primary">重置</el-button>
     </div>
     <el-button type="primary" class="add" plain>添加</el-button>
  </div>
</template>

<script>

export default {
  components:{

  },
  data() {
    return {
      customerName:'',
      saler:'',
    }
  },
  created(){

  },
  methods: {

     
   }
}
</script>

<style scoped>
    .demo-input-suffix{width: 900px}
    .el-input{width:250px;margin-right: 10px}
    .search-title{font-size: 14px;margin:0 10px}
    .search-but{margin:20px 10px;}
    .add{margin:30px 10px}
</style>