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
       <el-select v-model="type" placeholder="请选择">
        <el-option
          v-for="item of seenictype"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <div class="state">初始状态</div>
    <div class="weeked">星期一
    <el-button style="background:#3095fa;color:#fff;margin-left:12px" size="small">+添加营业时间</el-button>
    <div class="hours">
      <el-checkbox v-model="businesshours">24小时营业</el-checkbox>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: '',
      businesshours: false,
      seenictype: ['时期选择','文字描述']
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
  width 100%
  height 180%
  background #fff
  left 0
  top 0
  bottom 0
  .title
    height 78px
    line-height 78px
    margin-bottom 10px
    color #666666
    font-size 16px
    border-bottom solid 1px #f2f2f2
    .iconfont
      position absolute
      right 20px
      span
        text-decoration none
        font-size 18px
        color #3095fa
  .type
    overflow hidden
    height 50px
    line-height 50px
    .type-name
      float left
      margin-left 20px
      font-size 14px
      color #666666
    .date
      margin-left -660px
  .state
    text-align left
    margin-left 20px
    color #666666
    font-size 14px
    margin-top 28px
  .weeked
    text-align left
    height 30px
    line-height 30px
    margin-left 32px
    margin-top 20px
  .hours
    margin-left 91px
</style>
