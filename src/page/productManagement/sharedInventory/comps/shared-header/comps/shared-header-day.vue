<style lang="scss" scoped>
$tdHeight: 60px;
$tdWidth: 64px;
$fontHeight: 32px;
.shared-header-day{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: $tdHeight;
  span{
    display: block;
    position: absolute;
    box-sizing: border-box;
    width: $fontHeight;
    height: $fontHeight;
    margin: 0 auto;
    line-height: $fontHeight;
    left: 50%;
    transform: translateX(-50%);
  }
  // 当前选择的日期
  .select{
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .today::before{
    content: '今';
    font-weight: bold;
    position: absolute;
    top: -14px;
    left: 0;
    transform: translateX(-50%);
    color: #409EFF;
  }
  .count::after{
    content: attr(data-count);
    font-weight: bold;
    position: absolute;
    top: -14px;
    right: 0;
    transform: translateX(50%);
    color: #409EFF;
  }
}
</style>

<template>
  <div class="shared-header-day">
    <span
      :data-count="proto.count"
      :class="[ 
        proto.count? 'count': '',
        proto.today? 'today': '',
        proto.dayInt=== current? 'select': ''
      ]"
    >{{ proto.day }}</span>
  </div>
</template>

<script>
import { getDayDTO } from '../../../dictionary'

export default {
  props: {
    current: Number,
    proto: {
      type: [Object],
      default(){
        return getDayDTO();
      }
    },
  },

  watch: {
    proto(){
      this.$forceUpdate();
    }
  }
}
</script>