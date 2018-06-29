<template>
  <div class="opentime">
    <div class="title">添加开放时间
      <span class="iconfont">
        <span
        @click="close"
        class="el-icon-close"
        style="cursor:pointer"
        ></span>
      </span>
    </div>
    <div class="type">
      <span class="type-name">选择类型</span>
      <el-date-picker
        class="date"
        v-model="date"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
    </div>
    <div class="state">初始状态</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: ''
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }

}
</script>

<style lang='stylus' scoped>
.opentime
  border-radius 5px
  position absolute
  height 200%
  width 100%
  background #fff
  left 0
  top 0
  .title
    height 50px
    background #e6e6e6
    line-height 50px
    margin-bottom 10px
    .iconfont
      position absolute
      right 20px
      a
        text-decoration none
  .type
    overflow hidden
    height 50px
    line-height 50px
    .type-name
      float left
      margin-left 20px
    .date
      margin-left -600px
  .state
    text-align left 
      
</style>
