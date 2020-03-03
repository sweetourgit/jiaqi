<template>
  <div class="shipDetailAdd">
    <!-- <div class="buttonDv">
      <el-button @click="next" type="primary">下一步</el-button>
      <el-button @click="cancel" type="primary" plain>取消</el-button>
    </div> -->
    <div class="leftStep">
      <el-steps direction="vertical" :active="activeIndex">
        <el-step title="基础信息" :status="status[0]" @click.native="tabTo(0)"></el-step>
        <el-step title="舱房介绍" :status="status[1]" @click.native="tabTo(1)"></el-step>
        <el-step title="海上美食" :status="status[2]" @click.native="tabTo(2)"></el-step>
        <el-step title="邮轮玩乐" :status="status[3]" @click.native="tabTo(3)"></el-step>
        <el-step title="邮轮服务" :status="status[4]" @click.native="tabTo(4)"></el-step>
        <el-step title="甲板导航" :status="status[5]" @click.native="tabTo(5)"></el-step>
      </el-steps>

      
    </div>
    <div class="rightContent">
      <baseMsg v-if="activeIndex == 0"></baseMsg>
      <cabinMsg v-if="activeIndex == 1"></cabinMsg>
      <foodMsg v-if="activeIndex == 2"></foodMsg>
      <playMsg v-if="activeIndex == 3"></playMsg>
      <serviceMsg v-if="activeIndex == 4"></serviceMsg>
      <gpsMsg v-if="activeIndex == 5"></gpsMsg>
    </div>
  </div>
</template>
<script type="text/javascript">
import baseMsg from '@/page/contentInfo/cruiseShip/detailAddStep/baseMsg.vue'
import cabinMsg from '@/page/contentInfo/cruiseShip/detailAddStep/cabinMsg.vue'
import foodMsg from '@/page/contentInfo/cruiseShip/detailAddStep/foodMsg.vue'
import playMsg from '@/page/contentInfo/cruiseShip/detailAddStep/playMsg.vue'
import serviceMsg from '@/page/contentInfo/cruiseShip/detailAddStep/serviceMsg.vue'
import gpsMsg from '@/page/contentInfo/cruiseShip/detailAddStep/gpsMsg.vue'
export default {
  name: "shipDetailAdd",
  components: {
    baseMsg,
    cabinMsg,
    foodMsg,
    playMsg,
    serviceMsg,
    gpsMsg
  },
  data() {
    return {
      activeIndex: 0,
      status: ['','','','','','']
    }
  },
  computed: {},
  watch: {},
  methods: {
    next() {
      // alert(this.activeIndex);
      // alert(this.activeIndex + 1);
      this.$set(this.status, this.activeIndex, 'success');

      this.$set(this.status, this.activeIndex + 1, 'finish');
      if (this.activeIndex++ >= 5) this.activeIndex = 0;
    },
    cancel() {
      this.$router.back();
    },
    tabTo(index, str) {
      // alert(index);
      if(str == "creat"){
        this.activeIndex = index - 0;
        this.$set(this.status, this.activeIndex, 'finish');
        for(let i = 0; i < index; i++){
          this.$set(this.status, i, 'success');
        }
        
      }else{
        for(let i = 0; i < index; i++){
          this.$set(this.status, i, 'success');
        }
        if(this.status[index] == 'success'){
          this.activeIndex = index;
          this.$set(this.status, this.activeIndex, 'finish');
        }
      }
      
    }
  },
  created() {
    // alert(this.$route.query.step);
    if(this.$route.query.step || this.$route.query.step == 0){
      if(this.$route.query.step == 0){
        for(let i = 0; i < 6; i++){
          console.log(i);
          this.$set(this.status, i, 'success');
        }
        this.$set(this.status, 0, 'finish');
      }else{
        this.tabTo(this.$route.query.step, 'creat')
      }
    }
    
  },
  mounted() {
    
  }
}

</script>
<style lang="scss" scoped>
  .shipDetailAdd{
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    .buttonDv{
      width: 100%;
      text-align: right;
      margin-bottom: 10px;
    }
    .leftStep{
      width: 180px;
      height: 500px;
      margin-top: 15px;
    }
    .rightContent{
      width: calc(100% - 180px);
    }
  }
</style>