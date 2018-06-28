<template>
  <div class="opentime">
    <div class="title">添加开放时间
      <span class="iconfont">
        <a
        @click="close"
        href="#" class="el-icon-error"></a>
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
  position fixed
  height 80%
  width 60%
  background #fff
  left calc(50% - 30%)
  top calc(50% - 40%)
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
      margin-left 5px
    .date
      margin-left -800px
</style>
