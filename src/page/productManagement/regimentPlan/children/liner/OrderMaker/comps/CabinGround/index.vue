<style>

</style>

<template>
  <div>
    <div style="padding: 10px 0 10px 0;">
      <el-button type="primary" size="small">
        舱房
      </el-button>
    </div>
    <TitleBar :options="{ deletable: true, badge: true }"></TitleBar>
    <div style="padding: 22px 0 40px 0;border-bottom: 1px solid #cecece;">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules">
        <el-form-item label="拼住/整间：" prop="name" ref="supplierRef">{{ 123 }}</el-form-item>
        <el-form-item label="报名人数：" prop="name" ref="supplierRef" style="margin: 0;">
          <div style="display:flex;flex-direction:column;">
            <div>成人 ￥16999.00 * 2</div>
            <el-input-number v-model="num" @change="handleChange" :min="1" :max="10" label="描述文字" size="small"></el-input-number>
            <div>
              剩余完整房间：4间 可住16人  |   剩余拼住房间：1间 可住3人  |  可住19人
            </div>
            <div>
              至少报名3人
            </div>
          </div>
          
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import TitleBar from './comps/TitleBar'

export default {

  components: { TitleBar },

  data(){
    return {
      submitForm: {},
      rules: {},
    }
  }

}
</script>

