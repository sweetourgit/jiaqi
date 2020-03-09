<style lang="scss" scoped>
.table-input{
  .table-input-outer{
    display: flex;
    padding: 0 20px;
  }
}
</style>

<template>
  <div class="table-input">
    <div class="table-input-outer"
      v-if="inEdit">
      <el-input size="mini"
        v-model="val"
        :placeholder="options.placeholder">
      </el-input>
      <el-button size="mini" type="success" icon="el-icon-check" style="padding: 7px 7px;"
        @click="submitVal"></el-button>
      <el-button size="mini" type="info" icon="el-icon-close" style="margin: 0;padding: 7px 7px;"
        @click="inEdit= false">
      </el-button>
    </div>
    <div @click="inEdit= true"
      v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script>

/**
 * @description: table行内可编辑单元
 */

export default {
  props: {
    value: [String, Number],
    options: {
      type: Object,
      default: function(){
        return {
          placeholder: '',  // String
          pattern: null, // RegExp
          validator: null, // Function
          message: null, // String 提示
        }
      }
    },
  },

  data(){
    return {
      inEdit: false,
      val: this.value
    }
  },

  methods: {
    submitVal(){
      let { pattern, validator, message }= this.options;
      if(pattern && !pattern.test(this.val)) return this.$message.error(message);
      if(validator && !validator(this.val)) return this.$message.error(message);
      this.$emit('input', this.val);
      this.inEdit= false;
    }
  }
}
</script>