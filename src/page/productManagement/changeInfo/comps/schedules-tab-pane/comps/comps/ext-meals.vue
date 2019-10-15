<style lang="scss" scoped>

</style>

<template>
  <div class="ext-meals">
    <el-col>
      <span style="margin-right: 10px;">{{ label }}</span>
      <el-radio-group v-model="submitForm.Myself" @change="change">
        <el-radio :label="1">自理</el-radio>
        <el-radio :label="0">详细说明</el-radio>
      </el-radio-group>
    </el-col>
    <el-col v-if="!submitForm.Myself">
      <el-input placeholder="餐饮说明" style="width: 300px;" size="small"
        v-model="submitForm.Detail"
        @change="change"
      ></el-input>
    </el-col>
  </div>
</template>

<script>
/**
 * @description: 
 * 1. 在watch中初始化，因为第一次传的value是void 0
 */

export default {

  props: {
    proto: [Object],
    label: [String]
  },

  mounted(){
    this.init();
  },

  data(){
    return {
      submitForm: {
        Myself: 0,
        Detail: ''
      }
    }
  },

  methods: {
    init(){
      this.checkProto= this.$deepCopy(this.proto);
      this.submitForm= this.$deepCopy(this.proto);
    },

    validate(){
      if(this.submitForm.Myself || this.submitForm.Detail) return true;
      return false;
    },

    change(){
      this.validate() 
        && this.$emit('change-validate');
    },

    getData(){
      return this.$deepCopy(this.submitForm)
    }
  }

}
</script>