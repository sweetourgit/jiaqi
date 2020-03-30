<template>
  <header style="background:#F7F7F7;padding-top: 20px;">
    <div class="form-ground">
      <el-form label-width="120px" style="width: 100%;"
        ref="submitForm"
        :model="submitForm">
        <el-row >
          <el-col style="width: 320px;">
            <el-form-item label="产品名称：" prop="product_name">
              <el-input placeholder="团期计划" size="small"
                v-model="submitForm.product_name">
              </el-input>
            </el-form-item>
          </el-col> 

          <el-col style="width: 320px;">
            <el-form-item label="报账团号：" prop="tour_no">
              <el-input placeholder="报账人" size="small"
                v-model="submitForm.tour_no">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col style="width: 470px;">
            <el-form-item label="出行日期：" prop="teamProTitle">
              <el-date-picker
                v-model="submitForm.time"
                type="daterange"
                size="small"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col style="width: 320px;">
            <el-form-item label="操作人员：" prop="create_uid">
              <el-input placeholder="报账人" size="small"
                v-model="submitForm.create_uid">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 320px;">
            <el-form-item label="报账状态：" prop="bill_status">
              <el-select size="small" style="width: 200px;"
                v-model="submitForm.bill_status"
                placeholder="报账状态">
                <el-option
                  v-for="item in CHECK_STATUS"
                  :key="item.value"
                  :label="item.label" 
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="width: 470px;">
            <div style="display: flex; justify-content: flex-end; align-items: center;height: 40px; line-height: 40px;">
              <el-button size="small" type="primary" style="display: inline-block; height: 32px;" 
                @click="$emit('reset-pageinfo')">
                搜索
              </el-button>
              <el-button size="small" type="info" style="display: inline-block; height: 32px;" 
                @click="reset">
                重置
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </header>
</template>

<script>
import { CHECK_STATUS } from '../dictionary'

export default {

  data(){
    return {
      submitForm: {
        product_name: null,
        tour_no: null,
        time: null,
        create_uid: null,
        bill_status: null,
      },
      CHECK_STATUS
    }
  },

  methods: {
    init(conditions){
      this.reappearConditions(conditions);
    },

    reappearConditions(conditions){
      Object.assign(this.submitForm, conditions);
    },

    getConditions(){
      let conditions= {};
      Object.keys(this.submitForm).forEach(attr => {
        if(this.$isNull(this.submitForm[attr])) return;
        if(attr=== 'time') conditions= this.timeAdaptor(conditions);
        if(attr!== 'time') conditions[attr]= this.submitForm[attr];
      })
      return conditions;
    },

    timeAdaptor(source){
      let time= source.time;
      source.start_at= this.$moment(time[0]).format('YYYY-MM-DD');
      source.end_at= this.$moment(time[1]).format('YYYY-MM-DD');
      return source;
    },

    reset(){
      this.$refs.submitForm.resetFields();
      this.$emit('reset-pageinfo');
    }
  }

}
</script>