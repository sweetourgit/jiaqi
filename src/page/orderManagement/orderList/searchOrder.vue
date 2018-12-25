<template>
  <div>
     <div class="demo-input-suffix">
          <span class="search-title">团号计划</span>
          <el-input v-model="groupNo" class="input"></el-input>
          <span class="search-title">团号计划</span>
          <el-input v-model="groupNo" class="input"></el-input>
     </div>
     <div class="line"></div>
     <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
       groupNo:'',

    }
  },
  mounted(){

  },
  methods: {

      }
}
</script>

<style scoped>
       .demo-input-suffix{width: 900px}
       .input{margin:0 10px;width: 150px}
       .search-title{font-size: 14px;margin-left: 10px}
</style>