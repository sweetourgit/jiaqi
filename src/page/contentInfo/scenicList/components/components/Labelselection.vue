<template>
  <div class="label">
    <div class="title">标签选择
      <span
        @click="handlecloselabel"
        class="iconfont">
          <a style="cursor:pointer" class="el-icon-close"></a>
        </span>
    </div>
    <el-tabs
      v-model="activeName" 
      @tab-click="handleClick"
      class="el-tab"
    >
      <el-tab-pane label="景点" name="first">
        <div class="scenic">
          <span class="lable">标签:</span>
          <el-input class="lable-input" v-model="lable" placeholder="请输入内容"></el-input>
          <el-button type="primary">添加</el-button>
        </div>
        <div class="checkbox-content">
          <el-checkbox class="checkbox">地标</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
        </div>
      </el-tab-pane>
      <el-tab-pane label="美食" name="second">
         <div class="scenic">
          <span class="lable">标签:</span>
          <el-input class="lable-input" v-model="lable" placeholder="请输入内容"></el-input>
          <el-button type="primary">添加</el-button>
        </div>
        <div class="checkbox-content">
          <el-checkbox class="checkbox">美食</el-checkbox>
          <el-checkbox class="checkbox">美食</el-checkbox>
          <el-checkbox class="checkbox">美食</el-checkbox>
          <el-checkbox class="checkbox">美食</el-checkbox>
          <el-checkbox class="checkbox">美食</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
        </div>
      </el-tab-pane>
      <el-tab-pane label="购物" name="third">
         <div class="scenic">
          <span class="lable">标签:</span>
          <el-input class="lable-input" v-model="lable" placeholder="请输入内容"></el-input>
          <el-button type="primary">添加</el-button>
        </div>
        <div class="checkbox-content">
          <el-checkbox class="checkbox">购物</el-checkbox>
          <el-checkbox class="checkbox">购物</el-checkbox>
          <el-checkbox class="checkbox">购物</el-checkbox>
          <el-checkbox class="checkbox">购物</el-checkbox>
          <el-checkbox class="checkbox">购物</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
        </div>
      </el-tab-pane>
      <el-tab-pane label="活动" name="fourth">
         <div class="scenic">
          <span class="lable">标签:</span>
          <el-input class="lable-input" v-model="lable" placeholder="请输入内容"></el-input>
          <el-button type="primary">添加</el-button>
        </div>
        <div class="checkbox-content">
          <el-checkbox class="checkbox">活动</el-checkbox>
          <el-checkbox class="checkbox">活动</el-checkbox>
          <el-checkbox class="checkbox">活动</el-checkbox>
          <el-checkbox class="checkbox">活动</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
          <el-checkbox class="checkbox">地标</el-checkbox>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="subbtn">
       <el-button
        @click="handlecloselabel"
        style="width:100px"
        plain
       >
        取消
       </el-button>
       <el-button
        @click="handlesubmit"
        style="width:100px"
        type="primary" 
        plain
       >
        确认
       </el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'second',
      lable: ''
    }
  },
  methods: {
    handlecloselabel () {
      this.$emit('close')
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handlesubmit () {
      alert('ajax')
      this.$emit('close')
    }
  }
}
</script>

<style lang='stylus' scoped>
.label
  width 60%
  height 60%
  background #fff
  position absolute
  left calc(50% - 30%)
  top calc(50% - 30%)
  border-radius 3px
  box-shadow 0px 5px 50px 13px rgba(0,0,0,0.4)
  z-index 20
  .subbtn
    position absolute
    bottom 30px
    left 32%
  .title
    height 50px
    line-height 50px
    font-size 14px
    background #e6e6e6
    position relative
    .iconfont
      position absolute
      right 10px
  .el-tab
    margin 0 auto
    width 80%
    .scenic
      height 50px
      overflow hidden
      line-height 50px
      .lable
        float left
      .lable-input
        float left
        width 200px
        margin-left 20px
        margin-right 20px
    .checkbox-content
      overflow hidden
      margin-top 20px
      .checkbox
        float left
        width 20%
        margin 5px 10px
</style>
