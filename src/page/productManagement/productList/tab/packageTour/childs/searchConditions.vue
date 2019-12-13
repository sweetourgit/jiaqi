<template>
  <el-form ref="submitForm" label-width="120px" style="width: 100%;" size="small"
    :model="submitForm">

    <el-row>

      <el-col :span="6">
        <el-form-item label="ID：" prop="id">
          <el-input size="small" v-model="submitForm.id" placeholder="请输入产品ID" style="width: 100%; max-width: 300px;"></el-input>
        </el-form-item>
      </el-col> 

      <el-col :span="6">
        <el-form-item label="产品名称：" prop="title">
          <el-input size="small" v-model="submitForm.title" placeholder="产品名称" style="width: 100%; max-width: 300px;"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item label="产品操作人：" prop="createUser">
          <el-input size="small" v-model="submitForm.createUser" placeholder="产品操作人" style="width: 100%; max-width: 300px;"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item label="状态：" prop="createUser">
          <el-select size="small" v-model="submitForm.isMonthly" placeholder="产品上线状态" style="width: 100%; max-width: 300px;">
            <el-option
              v-for="item in IsMonthlyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

    </el-row>

    <el-row>

      <el-col :span="6">
        <el-form-item label="出发地：" prop="id">
          <el-autocomplete size="small" placeholder="出发地" style="width:100%;max-width:300px;"
            ref="autocompleteRef"
            v-model="submitForm.inputVal"
            :fetch-suggestions="getFuzzyAction"
            :trigger-on-focus="false"
            @select="select">
          </el-autocomplete>
        </el-form-item>
      </el-col> 

      <el-col :span="6">
        <el-form-item label="目的地：" prop="id">
          <el-autocomplete size="small" placeholder="目的地" style="width:100%;max-width:300px;"
            ref="autocompleteRef"
            v-model="submitForm.inputVal"
            :fetch-suggestions="getFuzzyAction"
            :trigger-on-focus="false"
            @select="select">
          </el-autocomplete>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item label="产品操作人：" prop="createUser" label-width="140px">
          <el-input size="small" v-model="submitForm.createUser" placeholder="产品操作人" style="width: 300px;"></el-input>
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
import { getFuzzyAction } from '../api'

export default {

  mounted(){
    this.makeOptions();
  },

  data(){
    return Object.assign(
      // 数据
      {
        submitForm: { 
          id: void 0,
          title: void 0,
          createUser: void 0,
          minPrice: void 0,
          maxPrice: void 0,
          podID: void 0,
          destinationID: void 0
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
      },

      getFuzzyAction(queryString, cb){
        getFuzzyAction(queryString)
        .then(res => {
          return console.log(res)
          let { isSuccess, object }= res.data;
          if(!object) return cb();
          // 字段对应不上，转接一下
          this.flightOptions= [object];
          cb([{ value: object.number+ '' }]);
        })
      },

      select(){}
    },

    // 业务有关方法
    {
      makeOptions(){
        // Promise.all([
        //   getDicOptions('SupplierType'),
        //   getDicOptions('IsMonthly')
        // ]).then(res => {
        //   this.SupplierTypeOptions.push(...res[0]);
        //   this.IsMonthlyOptions.push(...res[1]);
        // })
      },
    }
  )
}
</script>