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
    span{
      display: block;
      box-sizing: border-box;
      width: $fontHeight;
      height: $fontHeight;
    }
    // 右下角关联的团期个数
    // .relative::after{
    //   content: attr(data-relative);
    //   font-weight: bold;
    //   position: absolute;
    //   bottom: -14px;
    //   right: 0;
    //   transform: translateX(50%);
    //   color: #409EFF;
    // }
  }
  // 当前选择的日期
  .select{
    border-radius: 4px;
    background-color: yellow;
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
  .plan::after{
    content: '有';
    font-weight: bold;
    position: absolute;
    top: -14px;
    right: 0;
    transform: translateX(50%) scale(0.8);
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
        proto.plan? 'plan': '',
        proto.isToday? 'today': '',
        proto.selected? 'select': '',
        proto.isBlank? 'blank': '',
        proto.isPassed? 'previous': ''
      ]"
    >
      <span
        :data-relative="relative" 
        :class="[ relative? 'relative': '', ]"
      >{{ proto.date }}</span>
    </span>
  </div>
</template>

<script>

export default {
  props: {
    proto: {
      type: [Object],
      default(){
        return { isBlank: true };
      }
    },
  },

  watch: {
    proto(){
      this.$forceUpdate();
    }
  },

  computed: {
    relative(){
      if(!this.proto.children) return 0;
      let count= 0;
      this.proto.children.forEach(el => count+= el.relaInventory);
      return count;
    }
  }
}
</script>