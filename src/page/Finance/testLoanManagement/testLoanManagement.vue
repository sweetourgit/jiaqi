<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="自由行借款记录" name="freeITour">
      <commonformquery ref="freeTour" :changedTab="changedTab"></commonformquery>
    </el-tab-pane>
    <el-tab-pane label="游轮借款记录" name="shipITour">
       <commonformquery ref="shipTour" :changedTab="changedTab"></commonformquery>
    </el-tab-pane>
    <el-tab-pane label="跟团游借款记录" name="groupITour">
       <commonformquery ref="groupTour" :changedTab="changedTab"></commonformquery>
    </el-tab-pane>


  </el-tabs>
</template>
<script>
  import commonformquery from '@/page/Finance/testLoanManagement/testformQuery/commonFormQuery'
  export default {
    data() {
      return {
        activeName: 'freeITour',
        changedTab:'',//选中tab的name
      };
    },
    mounted(){
      //初始化时加载页面的table数据
       this.$refs.freeTour.getPageList('freeITour') ;
      // this.$refs.shipTour.getPageList('shipITour')    
      // this.$refs.groupTour.getPageList('groupITour')     
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab.name);
        this.changedTab=tab.name //把选中的tab名传给子组件 为了渲染哪个tab下的内容显示
        if(tab.name==='freeITour'){//选中自由行
          console.log('自由行')
          this.$refs.freeTour.getPageList('freeITour')
        }
        if(tab.name==='shipITour'){//选中游轮行
          console.log('游轮行')
          this.$refs.shipTour.getPageList('shipITour')
        }
        if(tab.name==='groupITour'){//选中跟团行
          console.log('跟团行')
          this.$refs.groupTour.getPageList('groupITour')
        }
      }
    },
    components:{
        commonformquery
    }
  };
</script>
