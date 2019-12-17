<template>
  <div class="visalist">
    <!--按钮-->
    <div class="button">
      <el-button>取消</el-button>
      <el-button type="primary">下一步</el-button>
    </div>
    <div class="bother">
      <div class="left">
        <div class="one">
          <div class="border">1</div>
          <div class="fl">基础信息</div>
        </div>
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
 
}
.border{
  width:40px;
  height:40px;
  border:2px solid #e6e6e6;
  line-height:40px;
  text-align:center;
  border-radius:50%;
  float:left;
}
.fl{
  float:left;
  line-height:40px;
}
</style>


