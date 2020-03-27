<template>
  <el-dialog width="750px" 
    :title="isSave?'修改':'添加'"
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 650px;">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules">
        <el-form-item label="标题：" prop="title">
          <el-input placeholder="标题" size="small" maxlength="40" show-word-limit
            v-model="submitForm.title">
          </el-input>
        </el-form-item>
        <el-form-item label="售卖价格：" prop="sale_price">
          <el-input placeholder="售卖价格" size="small"
            v-model="submitForm.sale_price">
          </el-input>
        </el-form-item>
        <el-form-item label="保险说明：" prop="remark">
          <el-input type="textarea" rows="10" placeholder="保险说明" maxlength="1000" show-word-limit
            v-model="submitForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" style="padding-right: 60px;">
      <el-button type="primary" size="small"
        @click="handleSubmit">
        保存
      </el-button>
      <el-button type="info" size="small"
        @click="handleClose">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveInsure } from '@/page/productManagement/planInventory/liner/api'

let cache;
export default {

  data(){
    return {
      state: false,
      isSave: false,
      submitForm: this.getInsureDto(),
      rules: {
        title: { required: true, message: '标题不能为空' },
        sale_price: [
          { required: true, message: '价格不能为空', trigger: ["submit", "blur"]},
          { pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的价格', trigger: ["submit", "blur"]},
        ],
        remark: { required: true, message: '保险说明不能为空' },
      }
    }
  },

  beforeDestroy(){
    cache= null;
  },

  methods: {
    open(insure){
      let { product_id }= this.$route.query;
      if(insure) this.isSave= true;
      if(!insure) insure= this.getInsureDto(product_id);
      cache= insure;
      this.$assign(this.submitForm, insure);
      this.state= true;
    },
    
    handleSubmit(){
      if(this.noChange()) return this.$message.info('数据无变化');
      this.$refs.submitForm.validate(bol => {
        if(!bol) return;
        saveInsure(this.submitForm).then((id) => {
          this.$message.success(`${this.isSave? '保存':'新增'}保险信息成功`);
          this.$assign(cache, this.submitForm);
          if(!this.isSave){
            cache.id= id;
            this.$emit('add-insure', cache);
          }
          this.handleClose();
        })
      })
    },

    handleClose(){
      cache= null;
      this.state= false;
      this.isSave= false;
    },

    noChange(){
      return this.$checkLooseEqual(cache, this.submitForm);
    },

    getInsureDto(product_id){
      let { id, orgID }= this.$storageLoader({ loader: sessionStorage, attrs: ['id', 'orgID'] });
      return {
        title: null,
        sale_price: null,
        remark: null,
        product_id,
        create_uid: parseFloat(id),
        org_id: parseFloat(orgID),
        line_status: 2
      }
    }
  }

}
</script>