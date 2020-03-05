<template>
  <div class="all" id="Liner">
    邮轮
    <el-button @click="routerToAdd" type="warning">添加</el-button>
  </div>
</template>

<script>
  export default {
    name: "Liner",
    data() {
      return {
        
      };
    },
    created(){

    },
    methods: {
      routerToAdd(){
        this.$router.push({
            path: '/productLiner/liner',
            name: '邮轮/ 添加'
        });
        
      },
    }
  }
</script>

<style>
</style>
