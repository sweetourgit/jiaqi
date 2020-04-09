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
    <TitleBar 
      :data-list="cabinTitles" 
      :options="{ deletable: true, badge: true }"
      @select="selectCabin"
      @close="removeCabin">
    </TitleBar>
    <div style="padding: 22px 0 40px 0;border-bottom: 1px solid #cecece;">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules">
        <el-form-item label="拼住/整间：" prop="name"></el-form-item>
        <el-form-item label="报名人数：" prop="name" style="margin: 0;">
          <div style="display:flex;flex-direction:column;">
            <div>成人 ￥16999.00 * 2</div>
              <el-input-number v-model="submitForm.num" :min="1" :max="10000" :step="1" label="描述文字" size="small"
                @change="changeHandler">
              </el-input-number>
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

  computed: {
    cabinTitles(){
      return this.cabin.map((el, index) => {
        let skuPrice= el.sku_price;
        let { id, title }= skuPrice;
        return { key: id, label: title, selected: this.cabin.length=== index+ 1 };
      })
    }
  },

  data(){
    return {
      submitForm: {
        num: 0,
      },
      rules: {},
      skuCabins: [],
      cabin: [],
    }
  },

  methods: {
    init(cabin, skuPlan){
      // SkuPrice字典
      this.skuCabins= skuPlan.price;
      this.cabin= cabin;
    },

    awakeEditor(){
      this.$refs.editor.init();
    },

    changeHandler(nval, oval){
      console.log(nval, oval)
      this.submitForm.num+= 100;
    },

    addCabin(cabin){
      this.cabin.push(cabin);
    },

    selectCabin(cabin){

    },

    removeCabin(id){
      let result= this.cabin.splice(0).filter(el => {
        if(el.sku_price.id=== id) el.sku_price.selected= false;
        return el.sku_price.id!== id;
      });
      this.$nextTick(() => this.cabin.push(...result));  
    }
  }

}
</script>

