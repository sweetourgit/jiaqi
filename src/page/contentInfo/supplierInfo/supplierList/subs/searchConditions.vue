<template>
  <el-form
    :model="submitForm"
    ref="submitForm"
    label-width="100px"
    style="width: 100%;"
    size="mini">
    <el-row :gutter="20">

      <el-col :span="6">
        <el-form-item label="供应商名称：" prop="name">
          <el-input size="small" v-model="submitForm.name" placeholder="供应商名称" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col> 

      <el-col :span="6">
        <el-form-item label="结算方式：" prop="isMonthly">
          <el-select v-model="submitForm.isMonthly" placeholder="结算方式" style="width: 100%;">
            <el-option
              v-for="item in IsMonthlyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item label="状态：" prop="UserState">
          <el-select v-model="submitForm.UserState" placeholder="状态" style="width: 100%;">
            <el-option
              v-for="item in ConditionTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item label="类别：" prop="supplierType">
          <el-select v-model="submitForm.supplierType" placeholder="供应类别" style="width: 100%;">
            <el-option
              v-for="item in SupplierTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <div style="display: flex; justify-content: space-between; padding-bottom: 10px;">
      <div>
        <slot></slot>
      </div>
      <div>
        <el-button size="small" type="primary" 
          @click="$emit('reset-pageinfo')">
          搜索
        </el-button>
        <el-button size="small" type="info" 
          @click="reset">
          重置
        </el-button>
      </div>
    </div>
  </el-form>
</template>

<script>
import { getDicOptions } from '../../api'

export default {

  mounted(){
    this.makeOptions();
  },

  data(){
    return Object.assign(
      // 数据
      {
        submitForm: {
          name: null,
          isMonthly: null,
          UserState: null,
          supplierType: null,
        }
      },
      // options
      {
        SupplierTypeOptions: [],
        IsMonthlyOptions: [],
        ConditionTypeOptions: [{ value: 1, label: "正常" },{value: 2, label: "停用"},{value: 0, label: "待审核"}]
      }
    )
  },

  methods: Object.assign(
    {
      init(conditions){
        this.reappearConditions(conditions);
      },

      reappearConditions(conditions){
        Object.assign(this.submitForm, conditions);
      },

      getConditions(){
        return this.$deepCopy(this.submitForm);
      },

      reset(){
        this.$refs.submitForm.resetFields();
        this.$emit('reset-pageinfo');
      }
    },

    // 业务有关方法
    {
      makeOptions(){
        Promise.all([
          getDicOptions('SupplierType'),
          getDicOptions('IsMonthly')
        ]).then(res => {
          this.SupplierTypeOptions.push(...res[0]);
          this.IsMonthlyOptions.push(...res[1]);
        })
      },
    }
  )
}
</script>