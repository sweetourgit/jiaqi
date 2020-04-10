<template>
  <div style="padding-bottom: 40px;">
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
        <el-form-item label="拼住/整间：" prop="name">
          {{ CABIN_SPLIT_TYPE.getLabel(submitForm.cabin_type) }}
        </el-form-item>
        <el-form-item label="报名人数：" prop="name" style="margin: 0;">
          <div style="display:flex;flex-direction:column;">
            <div>
              <span>成人 ￥</span>
              <span>{{ computedPrice | priceFilter }}</span>
              <span>{{ ` * ${ currentCabin.guests.length }` }}</span>
            </div>
            <el-input-number size="small"
              v-model="submitForm.num" 
              :min="skuPrice.min_stay" 
              :max="skuPrice.max_stay* skuPrice.room_stock"
              :step="1"
              @change="changeHandler">
            </el-input-number>
            <div>
              <span>{{ `剩余完整房间：${computedInfo.all_rooms}间 可住${computedInfo.all_total}人  ` }}</span>
              <span>{{ `|   剩余拼住房间：${computedInfo.part_rooms}间 可住${computedInfo.part_total}人  |` }}</span>
              <span>{{ `  可住${computedInfo.all_total+ computedInfo.part_total}人` }}</span>
            </div>
            <div>
              {{ `至少报名 ${skuPrice.min_stay} 人` }}
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
import { 
  CABIN_SPLIT_TYPE,
  getSkuPriceDTO, getCabinDTO 
} from '../../dictionary'
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
      let { adult_same_price, adult_straight_price }= this.skuPrice;
      return this.isCommonPrice? adult_same_price: adult_straight_price;
    },
    computedInfo(){
      let all_rooms= 0;
      let all_nums= 0;
      let all_total= 0;
      let part_rooms= 0;
      let part_nums= 0;
      let part_total= 0;
      this.cabin.forEach(el => {
        let { guests, cabin_type }= el;
        let { room_stock, max_stay }= el.sku_price;
        if(cabin_type=== CABIN_SPLIT_TYPE.ALL){
          all_total+= room_stock* max_stay
          all_rooms+= room_stock;
          all_rooms-= Math.ceil(guests.length/max_stay);
          all_nums+= guests.length;
          all_total-= guests.length;
        }
        if(cabin_type=== CABIN_SPLIT_TYPE.PART){
          part_total+= room_stock* max_stay
          part_rooms+= room_stock;
          part_rooms-= Math.ceil(guests.length/max_stay);
          part_nums+= guests.length;
          console.log(guests)
          part_total-= guests.length;
        }
      })
      return { all_rooms, all_nums, all_total, part_rooms, part_nums, part_total };
    }
  },

  data(){
    return Object.assign(
      {
        submitForm: {
          num: 3,
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
        CABIN_SPLIT_TYPE
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
      this.currentCabin.guests.push({});
    },

    partChangeHandler(){

    },

    allChangeHandler(){

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
      this.$assign(this.submitForm, { num: cabin.guests.length, cabin_type: cabin.cabin_type });
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

