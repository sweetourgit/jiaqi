<style lang="scss" scoped>
  .minepane-conditions{
    display: flex;
    .form-ground{
      max-width: 980px;
      .normal-input{
        width: 200px;
      }
    }
    .btn-ground{
      padding-left: 20px;
    }
  }
</style>
<template>
  <div class="minepane-conditions">
    <div class="form-ground">
      <el-form label-width="120px" size="small" style="width: 100%;"
        ref="submitForm"
        :model="submitForm">
        <el-row>
          <el-col style="width:320px;">
            <el-form-item label="发起时间：" prop="beginTime">
              <el-date-picker class="normal-input" type="date" placeholder="起始时间"
                v-model="submitForm.beginTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col style="width:320px;">
            <el-form-item label="截止时间：" prop="endTime">
              <el-date-picker class="normal-input" type="date" placeholder="截止时间"
                v-model="submitForm.endTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="btn-ground">
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
</template>

<script>
export default {

  mounted(){
    this.init();
  },

  data(){
    return Object.assign(
      // 数据
      {
        submitForm: {
          beginTime: null, 
          endTime: null,
        }
      },
    )
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
        if(this.submitForm[attr]) conditions[attr]= this.submitForm[attr];
      })
      return conditions;
    },

    reset(){
      this.$refs.submitForm.resetFields();
      this.$emit('reset-pageinfo');
    }
  }
}
</script>