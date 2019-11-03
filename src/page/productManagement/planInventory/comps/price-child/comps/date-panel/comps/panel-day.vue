<style lang="scss" scoped>
.panel-day[ground="panel-day"]{
  display: inline-block;
  padding: 10px 5px;
  width: 14.28%;
  height: 150px;
  overflow: hidden;
  line-height: normal;
  cursor: pointer;
  user-select: none;
  border: 1px solid #ddd;
  .day-ground{
    line-height: normal;
    &>header{
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      line-height: 30px;
      .share{
        height: 20px;
        line-height: 20px;
        padding: 0 2px;
        border-radius: 4px;
        font-size: 14px;
        color: #000;
        background-color: red;
      }
      .today{
        font-weight: bold;
        color: blue;
      }
    }
    .cost-img{
      height: 18px;
    }
  }
  .child-ground{
    height: 100px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    .name{
      color: #e6e6e6;
      line-height: 40px;
      background: #3096fb;
    }
    .money{
      line-height: 30px;
      background-color: #f6f6f6;
    }
  }
}
.previous{
  background-color: #EEE;
}
.selected{
  border: 1px solid red !important;
}
</style>

<template>
  <li ground="panel-day"
    :class="[
      'panel-day', 
      !current.after? 'previous': '',
      current.selected? 'selected': '',
    ]"
    @click="select"
  >
    <div class="day-ground">
      <header>
        <div :class="[current.today? 'today': '']">{{ current.day }}</div>
        <div style="display: flex; align-items: center;">
          <div style="line-height: 0;" 
            v-show="current.vm && current.vm.cost"
          >
            <img class="cost-img" src="@/assets/image/warning.png" alt="">
          </div>
          <div class="share"
            v-show="current.vm && current.vm.share=== 1"  
          >
            共享
          </div>
        </div>
      </header>
    </div>
    <div class="child-ground" v-if="children.length">
      <div class="name">
        {{ children[0].enrollName }}
      </div>
      <div class="money">
        销售价:{{ children[0].price_01 }}
      </div>
      <div class="money">
        同业价:{{ children[0].price_02 }}
      </div>
    </div>
  </li>
</template>

<script>
import { getDayDTO } from '../../../../../dictionary'

export default {
  props: {
    proto: {
      type: [Object],
    }
  },

  props: ['proto'],

  data(){
    return {
      current: this.proto || getDayDTO(),
    }
  },

  computed: {
    children(){
      return (this.current.vm && this.current.vm.plan_Enrolls) || []
    }
  },

  watch: {
    proto:{
      handler(nval){
        this.current= nval || getDayDTO();
      },
      deep: true
    }
  },

  methods: {
    select(){
      let { day, selected }= this.current;
      // 不是当月日期
      if(!day) return;
      !selected?
        this.$emit('select-day', this.current):
          this.$emit('unselect-day', this.current);
    },
  }
}
</script>