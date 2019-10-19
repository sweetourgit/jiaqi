<style>
.common-editor{

}
</style>

<template>
  <div class="common-editor">
    <vue-editor v-model="submitForm.mark"></vue-editor>
    
  </div>
</template>

<script>
/**
 * @description: 未富文本编辑器包裹一层
 */
// 第三方组件
import { VueEditor } from 'vue2-editor'

export default {
  components: { VueEditor }

}
</script>