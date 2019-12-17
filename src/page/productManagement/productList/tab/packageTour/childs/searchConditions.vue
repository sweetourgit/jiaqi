<style lang="scss" scoped>
.search-conditions{
  box-sizing: border-box;
  padding: 20px 20px 0 0;
  background-color:#F7F7F7;
}
</style>

<template>
  <div class="search-conditions">
    <el-form ref="submitForm" label-width="120px" style="width:100%;" size="small"
      :model="submitForm">

      <el-row>

        <el-col :span="6">
          <el-form-item label="ID：" prop="id">
            <el-input size="small" v-model="submitForm.id" placeholder="请输入产品ID" clearable style="width: 100%; max-width: 300px;"></el-input>
          </el-form-item>
        </el-col> 

        <el-col :span="6">
          <el-form-item label="产品名称：" prop="title">
            <el-input size="small" v-model="submitForm.title" placeholder="产品名称" clearable style="width: 100%; max-width: 300px;"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="产品操作人：" prop="createUser">
            <el-input size="small" v-model="submitForm.createUser" placeholder="产品操作人" clearable style="width: 100%; max-width: 300px;"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="状态：" prop="createUser">
            <el-select disabled size="small" v-model="submitForm.isMonthly" placeholder="产品上线状态" style="width: 100%; max-width: 300px;">

            </el-select>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>

        <el-col :span="6">
          <el-form-item label="出发地：">
            <el-autocomplete size="small" placeholder="出发地" clearable style="width:100%;max-width:300px;"
              ref="autocompleteRef"
              v-model="pod"
              :value-key="'areaName'"
              :fetch-suggestions="getFuzzyAction"
              :trigger-on-focus="false"
              @select="selectPod">
            </el-autocomplete>
          </el-form-item>
        </el-col> 

        <el-col :span="6">
          <el-form-item label="目的地：">
            <el-autocomplete size="small" placeholder="目的地" clearable style="width:100%;max-width:300px;"
              ref="autocompleteRef"
              v-model="destination"
              :value-key="'areaName'"
              :fetch-suggestions="getFuzzyAction"
              :trigger-on-focus="false"
              @select="selectDes">
            </el-autocomplete>
          </el-form-item>
        </el-col>

        <el-col :span="9">
          <el-row>
            <el-col style="width:270px;">
              <el-form-item label="价格：" prop="minPrice">
                <el-input size="small" v-model="submitForm.minPrice" placeholder="最低价格" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="width: 32px;">
              <div style="text-align:center;line-height:32px">-</div>
            </el-col>
            <el-col style="width:150px;">
              <el-form-item label-width="0" prop="maxPrice">
                <el-input size="small" v-model="submitForm.maxPrice" placeholder="最高价格" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
  </div>

</template>

<script>
import { getFuzzyAction } from '../api'

export default {

  watch:{
    pod(){
      this.submitForm.podID= void 0;
    },
    destination(){
      this.submitForm.destinationID= void 0;
    }
  },

  data(){
    return Object.assign(
      // 视图
      {
        pod: void 0,
        destination: void 0
      },
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
        let conditions= this.$deepCopy(this.submitForm);
        return conditions;
      },

      reset(){
        this.$refs.submitForm.resetFields();
        this.$emit('reset-pageinfo');
      },

      getFuzzyAction(queryString, cb){
        getFuzzyAction(queryString)
        .then(res => {
          if(!res.length) return cb([]);
          cb(res);
        })
      },
    },

    // patch
    {
      selectDes(destination){
        this.$nextTick(() => {
          this.submitForm.destinationID= destination.id;
        })
      },
      selectPod(pod){
        this.$nextTick(() => {
          this.submitForm.podID= pod.id;
        })
      }
    }
  )
}
</script>