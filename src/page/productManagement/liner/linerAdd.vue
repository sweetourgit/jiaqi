<template>
  <div class="linerAdd">
    <!-- <div class="buttonDv">
      <el-button @click="next" type="primary">下一步</el-button>
      <el-button @click="cancel" type="primary" plain>取消</el-button>
    </div> -->
    <div class="leftStep">
      <el-steps direction="vertical" :active="activeIndex">
        <el-step title="基础信息" :status="status[0]" @click.native="tabTo(0)"></el-step>
        <el-step title="行程信息" :status="status[1]" @click.native="tabTo(1)"></el-step>
        <el-step title="接送大巴" :status="status[2]" @click.native="tabTo(2)"></el-step>
        <el-step title="附加服务" :status="status[3]" @click.native="tabTo(3)"></el-step>
        <el-step title="签证说明" :status="status[4]" @click.native="tabTo(4)"></el-step>
        <el-step title="费用说明" :status="status[5]" @click.native="tabTo(5)"></el-step>
        <el-step title="其它说明" :status="status[6]" @click.native="tabTo(6)"></el-step>
      </el-steps>

      
    </div>
    <div class="rightContent">
      <baseMsg v-if="activeIndex == 0"></baseMsg>
      <tripMsg v-if="activeIndex == 1"></tripMsg>
      <coachMsg v-if="activeIndex == 2"></coachMsg>
      <serviceMsg v-if="activeIndex == 3"></serviceMsg>
      <visaMsg v-if="activeIndex == 4"></visaMsg>
      <costMsg v-if="activeIndex == 5"></costMsg>
      <otherMsg v-if="activeIndex == 6"></otherMsg>
    </div>
  </div>
</template>
<script type="text/javascript">
import baseMsg from '@/page/productManagement/liner/addStep/0baseMsg.vue'
import tripMsg from '@/page/productManagement/liner/addStep/1tripMsg.vue'
import coachMsg from '@/page/productManagement/liner/addStep/2coachMsg.vue'
import serviceMsg from '@/page/productManagement/liner/addStep/3serviceMsg.vue'
import visaMsg from '@/page/productManagement/liner/addStep/4visaMsg.vue'
import costMsg from '@/page/productManagement/liner/addStep/5costMsg.vue'
import otherMsg from '@/page/productManagement/liner/addStep/6otherMsg.vue'
export default {
  name: "linerAdd",
  components: {
    baseMsg,
    tripMsg,
    coachMsg,
    serviceMsg,
    visaMsg,
    costMsg,
    otherMsg
  },
  data() {
    return {
      activeIndex: 0,
      status: ['','','','','','','']
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
      if (this.activeIndex++ >= 6) this.activeIndex = 0;
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
        if(this.status[index] != 'wait' && this.status[index] != ''){
          for(let i = 0; i < index; i++){
            this.$set(this.status, i, 'success');
          }
          this.activeIndex = index;
          this.$set(this.status, this.activeIndex, 'finish');
        } else {
          this.$message.warning("请按步骤填写产品信息！");
        }
      }
      
    }
  },
  created() {
    // alert(this.$route.query.step);
    if(this.$route.query.step || this.$route.query.step == 0){
      if(this.$route.query.step == 0){
        for(let i = 0; i < 7; i++){
          // console.log(i);
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
  .linerAdd{
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