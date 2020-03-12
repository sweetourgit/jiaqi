<template>
  <el-dialog title="修改" width="650px" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 550px; height: 186px;">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules">
        <el-row>
          <el-col style="width: 290px;">
            <el-form-item ref="prefixRef" label="团期计划：" prop="tour_no_prefix">
              <el-input placeholder="团号前缀" size="small"
                v-model="submitForm.tour_no_prefix"
                :disabled="sku_status=== SKU_STATUS.CAN_LINE">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 90px;">
            <el-form-item label-width="0" style="text-align: center; color: #aeaeae;">- 日期 -</el-form-item>
          </el-col>
          <el-col style="width: 170px;">
            <el-form-item ref="suffixRef" label-width="0" prop="tour_no_suffix">
              <el-input placeholder="团号后缀" size="small"
                v-model="submitForm.tour_no_suffix"
                :disabled="sku_status=== SKU_STATUS.CAN_LINE">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col style="width: 290px;"> 
          <el-form-item label="清位天数：" prop="clearance_time">
            <el-select placeholder="清位天数" size="small"
              v-model="submitForm.clearance_time">
              <el-option
                v-for="item in CLEARANCE_TIME_OPTIONS"
                :key="item.value"
                :label="item.label" 
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col style="width: 290px;"> 
          <el-form-item label="出行模板：" prop="uptoDay">
            <el-select placeholder="出行模板" size="small"
              v-model="submitForm.suppliertype">
              <el-option
                v-for="item in CLEARANCE_TIME_OPTIONS"
                :key="item.value"
                :label="item.label" 
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small"
        @click="handleClose">
        取 消
      </el-button>
      <el-button type="primary" size="small" 
        @click="submitAction">
        保 存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import { CLEARANCE_TIME_OPTIONS, SKU_STATUS } from '@/page/productManagement/planInventory/liner/dictionary'
import { saveSkuAttributeAction, getTourAroundAction } from '@/page/productManagement/planInventory/liner/api'

let cache;
let getSkuProto= function(){
  return {
    id: null,
    tour_no_prefix: '',
    tour_no_suffix: '',
    clearance_time: null,
    travel_template: null
  }
}
export default {
  data(){
    return {
      state: false,
      sku_status: SKU_STATUS.UN_INITED,
      submitForm: getSkuProto(),
      rules: {
        tour_no_prefix: [
          { required: true, message: '请填写团号前缀', trigger: ['blur']},
          { required: true, validator: this.codeValidator, trigger: ['blur']},
        ],
        tour_no_suffix: [
          { required: true, message: '请填写团号后缀', trigger: ['blur']},
          { required: true, validator: this.codeValidator, trigger: ['blur']},
        ],
        clearance_time: { required: true, message: '请选择清位时间', trigger: 'blur'}
      },
      CLEARANCE_TIME_OPTIONS,
      SKU_STATUS
    }
  },

  methods: {
    
    open(sku){
      cache= sku;
      this.sku_status= sku.sku_status;
      this.$assign(this.submitForm,  this.$deepCopy(sku));
      this.state= true;
    },

    handleClose(){
      cache= null;
      this.sku_status= SKU_STATUS.UN_INITED;
      this.$assign(this.submitForm,  getSkuProto());
      this.$refs.submitForm.clearValidate();
      this.state= false;
    },

    submitAction(){
      this.$refs.submitForm.validate(bol => {
        if(!bol) return;
        console.log(123)
        saveSkuAttributeAction(this.submitForm).then(() => {
          this.$message.success('保存成功');
          this.handleClose();
        })
      })
    },

    codeValidator(rule, value, cb){
      // 如果已经设置过则直接返回
      // if(this.inited) return cb();
      let { tour_no_prefix, tour_no_suffix }= this.submitForm;
      if(!tour_no_prefix || !tour_no_suffix) return cb();
      this.$refs.prefixRef.clearValidate();
      this.$refs.suffixRef.clearValidate();
      getTourAroundAction({ tour_no_prefix, tour_no_suffix }).then(() => {
        cb();
      }).catch((err) => {
        cb(new Error('团号重复'))
      })
    }, 

  }

}
</script>