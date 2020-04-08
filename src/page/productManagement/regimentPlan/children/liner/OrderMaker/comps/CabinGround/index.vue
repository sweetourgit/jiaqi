<style>

</style>

<template>
  <div style="padding-bottom: 40px; border-bottom: 1px solid #cecece;">
    <div style="padding: 10px 0 10px 0;">
      <el-button type="primary" size="small"
        @click="awakeEditor">
        舱房
      </el-button>
    </div>
    <TitleBar :options="{ deletable: true, badge: true }"></TitleBar>
    <div style="padding: 22px 0 40px 0;border-bottom: 1px solid #cecece; display: none;">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules">
        <el-form-item label="拼住/整间：" prop="name" ref="supplierRef">{{ 123 }}</el-form-item>
        <el-form-item label="报名人数：" prop="name" ref="supplierRef" style="margin: 0;">
          <div style="display:flex;flex-direction:column;">
            <div>成人 ￥16999.00 * 2</div>
            <el-input-number v-model="submitForm.num" :min="1" :max="10" label="描述文字" size="small"></el-input-number>
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
    <CabinEditor ref="editor"
      :sku-cabins="skuCabins"
      @submit="addCabin">
    </CabinEditor>
  </div>
</template>

<script>
import TitleBar from './comps/TitleBar'
import CabinEditor from './comps/CabinEditor'

export default {

  components: { TitleBar, CabinEditor },

  data(){
    return {
      cabins: [],
      submitForm: {},
      rules: {},
      skuCabins: [],
    }
  },

  methods: {
    init(skuPlan){
      this.skuCabins= skuPlan.price;
    },

    awakeEditor(){
      this.$refs.editor.init();
    },

    addCabin(){}
  }

}
</script>

