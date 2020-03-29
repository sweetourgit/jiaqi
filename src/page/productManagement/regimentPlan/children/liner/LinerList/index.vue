<style lang="scss" scoped>
.list-page{
  height: 100%; 
  overflow: auto;
}
</style>

<template>
  <div class="list-page">
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