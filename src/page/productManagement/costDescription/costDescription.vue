<template>
    <div>
      <div class="cost">
        费用说明
      </div>
      <div class="cost_button">
        <el-button type="primary" @click="getUEContent ()">添加说明</el-button>
      </div>
      <div class="cost_bg">
      <div class="cost_title">
        <span>名称：</span><el-input  placeholder="请输入内容" style="width: 750px;"></el-input>
      </div>
      <div class="cost_content">
        <UE :defaultMsg=defaultMsg :config=config ref="ue" id="1"></UE>
      </div>
      </div>
    </div>
</template>

<script>
  import UE from './components/ue.vue';
  export default {
    name: "costDescription",
    components: {UE},
    data() {
      return {
        defaultMsg: '这里是UE测试',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        }
      }
    },
    methods: {
      getUEContent() {
        let content = this.$refs.ue.getUEContent();
        console.log(content)
      },
      destroyed() {
        let content = this.$refs.ue.getUEContent();
        console.log(content)
      }
    }
  };
</script>

<style scoped>
  .cost{
    font-weight: bold;
    font-size: 18px;
    height: 23px;
    margin-top: 6px;
    text-align: left;
  }
  .cost_button{
    margin-top: 10px;
    text-align: left;
  }
  .cost_title{
    margin-top: 20px;
    padding-top: 20px;
    text-align: left;
    margin-left: 10px;
    font-family: 黑体;
    color: #333333;
  }
  .cost_content{
    width: 1000px;
    margin-left: 10px;
    margin-top: 20px;
    padding-bottom: 30px;
  }
  .cost_bg{
    background: #e6e6e6;
    width: 1050px;

  }
</style>
