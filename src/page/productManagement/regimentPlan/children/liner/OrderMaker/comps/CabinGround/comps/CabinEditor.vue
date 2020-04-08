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

        <el-form-item label="舱房：" prop="id">
          <el-select style="width: 360px;"
            v-model="submitForm.id">
            <el-option 
              v-for="(item, i) in skuCabins"
              :key="i" 
              :label="item.name" 
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="拼住/整间：" prop="cabin_type">
          <el-radio-group v-model="submitForm.cabin_type">
            <el-radio :label="CABIN_SPLIT_TYPE.PART">{{ CABIN_SPLIT_TYPE.getLabel(CABIN_SPLIT_TYPE.PART) }}</el-radio>
            <el-radio :label="CABIN_SPLIT_TYPE.ALL">{{ CABIN_SPLIT_TYPE.getLabel(CABIN_SPLIT_TYPE.ALL) }}</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
    </div>
    <div slot="footer" style="display: flex; justify-content: flex-end; padding-top: 20px;">
      <el-button size="small" 
        @click="handleClose">
        取 消
      </el-button>
      <el-button size="small" type="primary"
        @click="submitHandler">
        保 存
      </el-button>
    </div>
  </el-dialog>  
</template>

<script>
import { getCabinDTO, CABIN_SPLIT_TYPE } from '../../../dictionary'

console.log(Object.keys(CABIN_SPLIT_TYPE))
export default {
  props: {
    skuCabins: {
      type: Array,
      default(){
        return []
      }
    },
  },

  data(){
    return {
      state: false,
      submitForm: {
        id: null,
        cabin_type: CABIN_SPLIT_TYPE.PART
      },
      rules: {
        id: { required: true, message: '请选择舱房', trigger: "blur" },
        cabin_type: { required: true, message: '请选择舱房', trigger: "blur" }
      },
      CABIN_SPLIT_TYPE
    }
  },

  methods: {
    init(){
      this.state= true;
    },
    submitHandler(){},
    handleClose(){},
  }

}
</script>