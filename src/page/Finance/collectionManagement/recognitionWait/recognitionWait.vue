<template>
  <div class="vivo" style="position:relative">
    <el-tabs type="border-card">
      <el-tab-pane label="手动生成">
        <manualCollection></manualCollection>
      </el-tab-pane>
      <el-tab-pane label="自动生成">
        <automaticCollection></automaticCollection>
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

      }
    },
    methods: {
    },
    created() {
    }
  }

</script>
<style lang="scss" scoped>
</style>
