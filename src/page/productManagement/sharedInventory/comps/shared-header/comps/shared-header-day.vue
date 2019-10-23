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
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .blank{
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
  .previous::before{
    content: '过';
    font-weight: bold;
    position: absolute;
    top: -14px;
    left: 0;
    transform: translateX(-50%) scale(0.8);
    color: #aeaeae;
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
<!-- :style="{ backgroundColor: proto.day? 'transparent': 'rgba(0,0,0,0.1)'}" -->
  <div class="shared-header-day" @click="$emit('select-day', proto.day)">
    <span
      :data-count="proto.count"
      :class="[ 
        proto.count? 'count': '',
        proto.today? 'today': '',
        proto.dayInt=== current? 'select': '',
        proto.day? '': 'blank',
        proto.previous? 'previous': ''
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