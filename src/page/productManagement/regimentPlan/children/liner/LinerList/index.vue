<style lang="scss" scoped>

</style>

<template>
  <div class="liner-list">
    <ListHeader></ListHeader>
    <ListMain></ListMain>
  </div>  
</template>

<script>
import ListHeader from './comps/ListHeader'
import ListMain from './comps/ListMain'

export default {

  components: { ListHeader, ListMain },

}
</script>