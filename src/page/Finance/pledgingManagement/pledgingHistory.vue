<template>
  <div class="vivo" style="position:relative">
    <div>
      
      <el-button type="primary" @click="cancel()" size="medium" plain>取消</el-button>
    </div>

  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {

      }
    },
    methods: {
      cancel(){
        this.$router.go(-1);
      }
    },
    created() {
    }
  }

</script>
<style lang="scss" scoped>
</style>
