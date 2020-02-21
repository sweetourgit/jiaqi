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
    proto: {
      handler(nval, oval){
        this.num= nval.length
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
      console.log('changeHandler')
      let varied;
      // 未输入值就blur的情况
      if(this.$isNull(nval)){
        this.$refs.mainer.focus();
        return this.$nextTick(() => this.num= oval);
      }
      this.$emit('change', { varied: nval- oval, proto: this.proto, cb: this.reset });
    },

    reset(val){
      this.$refs.mainer.focus();
      return this.$nextTick(() => {
        this.num= this.$isNull(val)? this.proto.length: val
      });
    }
  }

}
</script>