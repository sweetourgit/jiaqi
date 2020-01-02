<style>

</style>

<template>
  <el-dialog :title="isAgree? '通过审批': '驳回审批'" width="650px"
    ref="dialogRef" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <el-form
      label-width="120px" 
      ref="submitForm"
      :model="submitForm"
      :rules="rules">
      <el-form-item label="审批意见：" prop="commentText">
        <el-input placeholder="请输入" size="small" type="textarea" style="width: 450px;"
          v-model="submitForm.commentText">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" 
        @click="handleClose">
        取 消
      </el-button>
      <el-button type="primary" size="small" 
        @click="saveAction">
        保 存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {

  data(){
    return Object.assign(
      {
        state: false,
        isAgree: false,
      },
      {
        submitForm: {
          commentText: null
        },
        rules: {
          
        }
      }
    )
  },

  methods: {
    wakeup(isAgree){
      this.isAgree= isAgree;
      this.state= true;
    },

    handleClose(){
      this.$refs.submitForm.resetFields();
      this.state= false;
    },

    saveAction(){
      this.$refs.submitForm.validate(result => {
        if(!result) return;
        this.$emit('save-action', this.submitForm);
        this.handleClose();
      })
    }
  }
}
</script>