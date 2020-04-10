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
    <div style="padding-bottom: 22px;">
      <TitleBar 
        :data-list="cabinTitles" 
        :options="{ deletable: true, badge: true }"
        @select="selectCabin"
        @close="removeCabin">
      </TitleBar>
    </div>
    <div v-show="cabin.length">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm">
        <el-form-item label="拼住/整间：" prop="name"></el-form-item>
        <el-form-item label="报名人数：" prop="name" style="margin: 0;">
          <div style="display:flex;flex-direction:column;">
            <div>
              <span>成人 ￥</span>
              <span>{{ computedPrice | priceFilter }}</span>
              <span>{{ ` *${ currentCabin.guests.length }` }}</span>
            </div>
            <el-input-number v-model="submitForm.num" :min="1" :max="10000" :step="1" label="描述文字" size="small"
              @change="changeHandler">
            </el-input-number>
            <div>
              剩余完整房间：4间 可住16人  |   剩余拼住房间：1间 可住3人  |  可住19人
            </div>
            <div>
              {{ this.skuPrice }}
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
import { getSkuPriceDTO } from '@/page/productManagement/planInventory/liner/dictionary'
import { getCabinDTO } from '../../dictionary'
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
    },
    computedPrice(){
      // let { adult_same_price, adult_straight_price }= this.skuPrice;
      return this.isCommonPrice? this.skuPrice.adult_same_price: this.skuPrice.adult_straight_price;
    }
  },

  data(){
    return Object.assign(
      {
        submitForm: {
          num: 0,
        },
        // 下单中报站的舱房类型
        cabin: [],
        // 是否是同业价格
        isCommonPrice: false,
      },
      // 字典 
      {
        skuCabins: [],
        currentCabin: getCabinDTO(),
        skuPrice: getSkuPriceDTO(),
      }
    )
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
      this.selectCabin(cabin);
    },

    /**
     * @description: 
     * @param {CabinTitle/Cabin/Null} cabin: 由外向内选通过cabin, 由内向外选通过cabinTitle
     */
    selectCabin(cabin){
      if(!cabin) return this.$assign(this.skuPrice, getSkuPriceDTO());
      if('key' in cabin) cabin= this.cabin.find(el => el.sku_price.id=== cabin.key);
      this.currentCabin= cabin;
      this.$assign(this.skuPrice, cabin.sku_price);
    },

    removeCabin(index){
      let result= this.cabin.splice(0).filter((el, i) => {
        if(index=== i) el.sku_price.selected= false;
        return index!== i;
      });
      this.$nextTick(() => {
        this.cabin.push(...result);
        this.selectCabin(this.cabin[index]);
      });  
    }
  }

}
</script>

