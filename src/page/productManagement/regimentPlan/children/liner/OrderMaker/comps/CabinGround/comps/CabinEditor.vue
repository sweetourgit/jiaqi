<template>
  <el-dialog title="舱房" width="600px"
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 600px;">
      <el-form
        size="small"
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules">
      </el-form>
    </div>
  </el-dialog>  
</template>

<script>
export default {

  data(){
    return {
      state: false,
      submitForm: {},
      rules: {}
    }
  },

  methods: {
    init(){
      this.state= true;
    },
    handleClose(){},
  }

}
</script>