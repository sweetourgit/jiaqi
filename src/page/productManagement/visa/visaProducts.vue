<template>
  <div class="visalist">
    <!--按钮-->
    <div class="button">
      <el-button>取消</el-button>
      <el-button type="primary">下一步</el-button>
    </div>
    <div class="bother">
      <div class="left">
        <div class="one">1</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.visalist{
  max-width: 1200px; 
  overflow: hidden;
}
.button{
  float:right;
}
.bother{
  clear:both;
}
.left{
  float:left;
  width:150px;
}
.one{
  width:40px; 
  hidden:40px;
  bother:2px solid 
}
</style>


