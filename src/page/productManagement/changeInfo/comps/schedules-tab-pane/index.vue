<style lang="scss" scoped>
.schedules-tab-pane{
  &>header{
    font-size: 16px;
    line-height: 32px;
    margin-bottom: 15px;
  }
  .ground{
    display: flex;
    position: relative;
    width: 80%;
    nav{
      text-align: left;
      margin-left: 5px;
      .nav-bar{
        background-color: #eee;
        padding: 20px 30px;
        margin-bottom: 5px;
        border-radius: 4px;
        transition: all .1s ease-out;
      }
      .selected{
        background-color: #aeaeae;
        box-shadow: -2px 2px 2px #5e5e5e;
      }
    }
    main{
      width: 780px;
      padding: 10px;
      padding-top: 25px;
      background-color: #eee;
    }
  }
}
</style>

<template>
  <div class="schedules-tab-pane">
    <header>
      {{ 'DAY'+ vm.currentDay }}
    </header>
    <div class="ground">
      <main>
        <schedule-form
          v-for="(item, i) in schedules"
          v-show="vm.currentDay== i+ 1"
          :key="i"
          :error-prefix="'DAY'+ (i+ 1)" 
          :proto="item"
        ></schedule-form>
      </main>
      <nav @click="changeDay">
        <div :class="[ 'nav-bar', vm.currentDay=== day?'selected': '']"
          v-for="day in PROVIDE_DAY"
          :key="day"
          :data-day="day"
        >
          {{ 'DAY'+ day }}
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import scheduleForm from './comps/schedule-form'

export default {
  components: { scheduleForm },

  inject: ['PROVIDE_DAY'],

  props: {
    //package
    proto: [Array]
  },

  mounted(){
    this.init();
  },

  data(){
    return {
      vm: {
        currentDay: 1,
      },
      schedules: []
    }
  },

  methods: {
    // 初始化
    init(){
      this.schedules.push(...this.$deepCopy(this.proto))
    },

    // 点击侧边栏
    changeDay(e){
      let day= e.target.dataset.day;
      if(!day) return;
      this.vm.currentDay= parseInt(day);
    },


  }
}
</script>