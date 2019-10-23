<style lang="scss" scoped>
.shared-inventory{
  padding-bottom: 50px;
}
</style>

<template>
  <div class="shared-inventory">
    <header>
      <shared-header
        @submit-inventory="emitSubmitInventory"
      ></shared-header>
      <el-button type="primary" size="small">添加库存</el-button>
    </header>
  </div>
</template>

<script>
import sharedHeader from './comps/shared-header/shared-header.vue'

export default {
  components: { sharedHeader },

  methods: {
    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    emitSubmitInventory(day){
      console.log(day)
    }
  }
}
</script>