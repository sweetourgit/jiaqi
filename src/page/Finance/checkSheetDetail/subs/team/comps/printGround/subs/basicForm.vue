<template>
  <el-dialog title="编辑基本信息" width="650px"
    ref="dialogRef" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <el-form
      label-width="120px" 
      ref="submitForm"
      :model="submitForm"
      :rules="rules">

      <el-form-item label="导陪：" prop="guideName">
        <el-input placeholder="请输入" size="small" style="width: 450px;"
          v-model="submitForm.guideName">
        </el-input>
      </el-form-item>

      <el-form-item label="接团社：" prop="localName">
        <el-input placeholder="请输入" size="small" style="width: 450px;"
          v-model="submitForm.localName">
        </el-input>
      </el-form-item>

      <el-form-item label="其他收入：" prop="title">
        <el-input placeholder="款项名称" size="small" style="width: 450px;"
          v-model="submitForm.title">
        </el-input>
      </el-form-item>
      
      <el-form-item label=" " prop="price">
        <el-input placeholder="金额" size="small" style="width: 450px;"
          v-model="submitForm.price">
        </el-input>
      </el-form-item>

      <el-form-item label=" " prop="ticket">
        <el-input placeholder="票号" size="small" style="width: 450px;"
          v-model="submitForm.ticket">
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
        state: false
      },
      {
        submitForm: {
          guideName: null,
          localName: null,
          title: null,
          price: null,
          ticket: null
        },
        rules: {
          price: { pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的价格格式', trigger: 'blur' }
        }
      }
    )
  },

  methods: {
    wakeup(payload){
      let { guideName, localName, title, price, ticket }= payload;
      Object.assign(this.submitForm, {
        guideName, localName, title, price, ticket
      });
      this.state= true;
    },

    handleClose(){
      this.$refs.submitForm.resetFields();
      this.state= false;
    },

    saveAction(){
      this.$refs.submitForm.validate(result => {
        if(!result) return;
        this.adaptor();
        this.$emit('save-action', this.submitForm);
        this.handleClose();
      })
    },

    adaptor(){
      if(!this.$isNull(this.submitForm.price))
        this.submitForm.price= parseFloat(this.submitForm.price);
    }
  }
}
</script>