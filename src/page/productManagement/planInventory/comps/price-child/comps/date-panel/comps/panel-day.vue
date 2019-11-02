<style lang="scss" scoped>
.panel-day[ground="panel-day"]{
  display: inline-block;
  padding: 10px;
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
      line-height: 1;
      .share{
        padding: 0 2px;
        border-radius: 4px;
        font-size: 14px;
        color: #FFF;
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
}
.previous{
  background-color: #ddd;
}
</style>

<template>
  <li :class="['panel-day', current.after? '': 'previous']" ground="panel-day">
    <div class="day-ground">
      <header>
        <span :class="[current.today? 'today': '']">{{ current.day }}</span>
        <span>
          <span style="line-height: 0;" 
            v-show="current.vm && current.vm.cost"
          >
            <img class="cost-img" src="@/assets/image/warning.png" alt="">
          </span>
          <span class="share"
            v-show="current.vm && current.vm.share=== 1"  
          >
            共享
          </span>
        </span>
      </header>
    </div>
    <div>{{ current }}</div>
  </li>
</template>

<script>
import { getDayDTO } from '../../../../../dictionary'

export default {
  props: {
    proto: {
      type: [Object],
    },
  },

  props: ['proto'],

  data(){
    return {
      current: this.proto || getDayDTO(),
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
}
</script>