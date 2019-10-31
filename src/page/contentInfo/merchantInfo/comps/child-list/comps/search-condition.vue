<style lang="scss" scoped>
header{
  position: relative;
  padding-right: 220px;
  .condition-ground{
    .row-class{
      width: 320px;
      max-width: 33%;
    }
  } 
  .btn-ground{
    position: absolute;
    top: 4px;
    right: 0;
  }
}
</style>

<template>
  <header>
    <div class="condition-ground">
      <el-form
        label-width="100px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
      >
        <el-row :gutter="20">

          <el-col class="row-class">
            <el-form-item label="商户名称：" prop="name">
              <el-input style="width: 100%;" size="small" placeholder="请输入商户名称"
                v-model="submitForm.name"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col class="row-class">
            <el-form-item label="状态：" prop="state">
              <el-select style="width: 100%;" size="small"
                v-model="submitForm.state"
              >
                <el-option key="2" value="2" label="正常"></el-option>
                <el-option key="3" value="3" label="停用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col class="row-class">
            <el-form-item label="结算方式：" prop="settlementType">
              <el-select style="width: 100%;" size="small"
                v-model="submitForm.settlementType"
              >
                <el-option key="0" value="0" label="月结"></el-option>
                <el-option key="1" value="1" label="非月结"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </div>
    <div class="btn-ground">
      <el-button type="primary" size="small" @click="search">搜索</el-button>
      <el-button size="small" @click="reset">重置</el-button>
      <slot></slot>
    </div>
  </header>
</template>

<script>
export default {

  data(){
    return {
      submitForm: {
        name: '',
        state: null,
        settlementType: null
      },
      rules: {}
    }
  },

  methods: {
    search(){
      this.$emit('search', this.$deepCopy(this.submitForm))
    },
    reset(){
      this.$refs.submitForm.resetFields();
      this.$emit('search');
    }
  }

}
</script>