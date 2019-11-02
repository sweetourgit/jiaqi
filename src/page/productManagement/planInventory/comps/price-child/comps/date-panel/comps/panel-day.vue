<style lang="scss" scoped>

</style>

<template>
  <div>
    {{ proto.vm }}
  </div>
</template>

<script>
export default {
  props: ['proto'],

  watch: {
    proto(nval){
      this.$forceUpdate();
    }
  },
}
</script>