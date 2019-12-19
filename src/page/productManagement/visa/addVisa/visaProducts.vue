<template>
  <div class="visalist">
    <!--按钮-->
    <div class="button">
      <el-button>取消</el-button>
      <el-button type="primary">下一步</el-button>
    </div>
    <div class="bother">
      <!--左侧导航-->
      <div class="left">
        <div class="one">
          <div class="border">1</div>
          <div class="fl">基础信息</div>
        </div>
        <div class="line"></div>
        <div class="one">
          <div class="border">2</div>
          <div class="fl">签证信息</div>
        </div>
        <div class="line"></div>
        <div class="one">
          <div class="border">3</div>
          <div class="fl">重要提示</div>
        </div>
      </div>
      <!--右侧内容-->
      
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
  margin:10px 0 10px 0;
}
.fl{
  float:left;
  line-height:40px;
  margin:10px 0 0 10px;
}
.line{
  clear:both;
  width:3px;
  height:40px;
  background:#e6e6e6;
  margin:0 0 0 19px;
}
</style>


