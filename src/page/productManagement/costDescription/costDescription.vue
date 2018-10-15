<template>
  <div style="overflow: hidden">
    <div class="cost">
      费用说明
    </div>
    <div class="cost_button">
      <el-button type="primary" @click="getUEContent()">添加说明</el-button>
      <el-button type="primary" @click="getSaveContent()">获取值</el-button>
    </div>

    <div class="cost_bg"  v-for="(domain, index) in copy.domains"
         :key="domain.key">
      <div class="cost_title">
        <span>名称：</span><el-input  placeholder="请输入内容" style="width: 750px;"></el-input>
      </div>
      <div class="cost_content" style="background: #FFFFFF">
        <vue-editor v-model="copy.domains[index].content"></vue-editor>
      </div>
    </div>
  </div>
</template>

<script>
  import { VueEditor } from 'vue2-editor'
  export default {
    name: "costDescription",
    components: {
      VueEditor
    },
    data() {
      return {
        copy :{
          domains: [{
            content: '<h1>Some initial content</h1>'
          }]
        },
        content: '<h1>Some initial content</h1>',
      }
    },
    methods:{
      getUEContent(){
        this.copy.domains.push({
          value: '请点击添加',
          key: Date.now()
        });
        console.log(this.copy)
      },
      getSaveContent(){
        for (var i=0;i<this.copy.domains.length;i++){
          alert(this.copy.domains[i].content)
        }
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

  }
  .cost_bg{
    background: #e6e6e6;
    width: 1050px;
    padding-bottom: 50px;

  }
</style>
