<style lang="scss" scoped>
.shared-inventory{
  padding-bottom: 50px;
}
</style>

<template>
  <div class="shared-inventory">
    <header>
      <shared-header></shared-header>
    </header>
  </div>
</template>

<script>
import sharedHeader from './comps/shared-header/shared-header.vue'

export default {
  components: { sharedHeader },
}
</script>