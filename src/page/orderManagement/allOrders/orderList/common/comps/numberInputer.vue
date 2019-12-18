<style lang="scss" scoped>

</style>

<template>
  <el-input-number ref="mainer" size="medium"
    v-model="num"
    :min="0"
    :max="max"
    :disabled="disabled"
    @change="changeHandler">
  </el-input-number>
</template>

<script>
export default {

  props: {
    max: Number,
    disabled: Boolean,
    proto: {
      type: Array,
      default(){
        return []
      }
    }
  },

  watch: {
    value: {
      handler(nval, oval){
        console.log(nval, oval)
      },
      deep: true,
      immediate: true
    }
  },

  data(){
    return {
      num: this.proto.length,
    }
  },

  methods: {
    changeHandler(nval, oval){
      console.log(nval, oval)
      // 未输入值就blur的情况
      if(this.$isNull(nval)){
        this.$refs.mainer.focus();
        return this.$nextTick(() => this.num= oval);
      }
      this.$emit('change', { varied: nval- oval, proto: this.proto });
    }
  }

}
</script>