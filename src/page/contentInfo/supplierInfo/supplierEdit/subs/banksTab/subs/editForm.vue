<template>
  <el-dialog :title="isSave? '编辑账户信息': '新增账户信息'" width="650px" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 550px;">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules">

        <el-form-item label="汇款户名：" prop="cardName">
          <el-input size="small" placeholder="汇款户名" style="width: 100%;"
            v-model="submitForm.cardName">
          </el-input>
        </el-form-item>

        <el-form-item label="账号：" prop="cardNumber">
          <el-input size="small" placeholder="账号" style="width: 100%;"
            v-model="submitForm.cardNumber">
          </el-input>
        </el-form-item>

        <el-form-item label="开户行：" prop="bankName">
          <el-input size="small" placeholder="开户行" style="width: 100%;"
            v-model="submitForm.bankName">
          </el-input>
        </el-form-item>

        <el-form-item label="备注：" prop="memo">
          <el-input size="small" placeholder="备注" style="width: 100%;"
            v-model="submitForm.memo">
          </el-input>
        </el-form-item>

      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small"
        @click="handleClose">
        取 消
      </el-button>
      <el-button type="primary" size="small"
        @click="addAction">
        保 存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>

let needReset= function(){
  return {
    isSave: false,
    state: false,
    index: null
  }
}
export default {

  data(){
    return Object.assign(
      // 需要重置
      needReset(),

      {
        submitForm: {
          cardNumber: null,
          bankName: null,
          cardName: null,
          memo: null,

          // 非表单值
          isDeleted: 0,
          createTime: null
        },
        rules: {
          cardNumber: { required: true, message: '汇款户名不能为空', trigger: ['blur']},
          bankName: { required: true, message: '开户行不能为空', trigger: ['blur']},
          cardName: { required: true, message: '账号不能为空', trigger: ['blur']},
          memo: { required: true, message: '备注不能为空', trigger: ['blur']},
        }
      }
    )
  },

  methods: {

    init(payload, index){
      if(payload){
        this.isSave= !!this.$isNull(index);
        this.index= index;
        Object.assign(this.submitForm, payload);
      }
      this.state= true;
    },

    handleClose(){
      this.$refs.submitForm.resetFields();
      let newReset= needReset();
      // 重置状态
      Object.keys(newReset).forEach(attr => this[attr]= newReset[attr]);
    },

    preAdd(){
      let bol= false;
      this.$refs.submitForm.validate(validate => {
        bol= validate;
      });
      return bol;
    },

    addAction(){
      let bol= this.preAdd();
      if(!bol) return;
      this.$emit('save-bank', { index: this.index, data: this.$deepCopy(this.submitForm) });
      this.handleClose();
    }
  }
}
</script>