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
          ref="children"
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
import { getTeamScheduleDTO } from '../../dictionary'
import scheduleForm from './comps/schedule-form'

export default {
  components: { scheduleForm },

  inject: ['PROVIDE_DAY', 'PROVIDE_PACKAGE_ID'],

  props: {
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
    init(){
      this.schedules.splice(0);
      let payload= this.PROVIDE_DAY- this.proto.length;
      if(!payload) return this.schedules.push(...this.$deepCopy(this.proto));
      payload> 0? this.plusInit(payload): this.minusInit(payload);
    },
    
    plusInit(payload){
      let length= this.proto.length;
      let result= [];
      for(let i= length+ 1; i<= length+ payload; i++){
        let schedule= getTeamScheduleDTO(i);
        if(this.PROVIDE_PACKAGE_ID) schedule.packageID= this.PROVIDE_PACKAGE_ID;
        result.push(schedule);
      }
      this.schedules.push(...this.$deepCopy(this.proto), ...result);
    },
    
    minusInit(payload){
      let length= this.proto.length+ payload;
      this.schedules.push(...this.$deepCopy(this.proto.slice(0, length)));
    },

    changeDay(e){
      let day= e.target.dataset.day;
      if(!day) return;
      this.vm.currentDay= parseInt(day);
    },

    checkHasChange(){
      let bol= false;
      let children= this.$refs.children;
      bol= (this.schedules.length!== this.proto.length)
      children.forEach(child => {
        !bol && (bol= child.checkHasChange());
      })
      bol && console.warn(`schedules-tab-pane checkHasChange: ${bol}`)
      return bol;
    },

    validate(){
      let bol= true;
      let children= this.$refs.children;
      children.forEach(child => {
        bol && (bol= child.validate());
      })
      return bol;
    },

    getData(){
      let children= this.$refs.children;
      return children.map(child => child.getData());
    }
  }
}
</script>