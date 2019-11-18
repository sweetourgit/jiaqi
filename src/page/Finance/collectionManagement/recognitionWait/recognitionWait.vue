<template>
  <div class="vivo" style="position:relative">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" class="card_style">
      <el-tab-pane label="手动生成" name="first">
        <manualCollection ref="manualCollection"></manualCollection>
      </el-tab-pane>
      <el-tab-pane label="自动生成" name="second">
        <automaticCollection ref="automaticCollection"></automaticCollection>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
  import automaticCollection from '@/page/Finance/collectionManagement/recognitionWait/automaticCollection.vue'//自动生成
  import manualCollection from '@/page/Finance/collectionManagement/recognitionWait/manualCollection.vue'//手动生成
  export default {
    components: {
      automaticCollection,
      manualCollection
    },
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
      handleClick(tab, event) {
//        console.log(tab, event);
        if(tab.name == 'first'){
          this.$refs.manualCollection.loadData();
        }else if(tab.name == 'second'){
          this.$refs.automaticCollection.loadData();
        }
      },
    },
    created() {
    }
  }

</script>
<style lang="scss" scoped>
  .card_style{
    margin: 25px auto;
  }
</style>
