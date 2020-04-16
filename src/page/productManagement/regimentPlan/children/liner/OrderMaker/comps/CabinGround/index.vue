<template>
  <div style="padding-bottom: 40px;">
    <div style="padding: 10px 0 10px 0;">
      <el-button type="primary" size="small"
        @click="awakeEditor">
        舱房
      </el-button>
    </div>
    <div style="padding-bottom: 22px;">
      <LinkTitleBar
        ref="titleBar" 
        :data-list="cabinTitles" 
        :options="{ deletable: true, badge: true }"
        @select="selectCabin"
        @close="removeCabin">
      </LinkTitleBar>
    </div>
    <div v-show="cabin.length">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm">
        <el-form-item label="拼住/整间：" prop="name">
          <div style="color: #333;font-weight: bold;">
            {{ CABIN_SPLIT_TYPE.getLabel(submitForm.cabin_type) }}
          </div>
        </el-form-item>
        <el-form-item label="报名人数：" prop="name" style="margin: 0;">
          <div style="display:flex;flex-direction:column;">
            <div class="info-bar">
              <div class="title no-wrap">成人</div>
              <div class="sign">￥</div>
              <div class="money">{{ computedPrice | priceFilter }}</div>
              <div class="sign">*</div>
              <div class="money">{{ currentCabin.guests.length }}</div>
            </div>
            <el-input-number size="small"
              ref="inputNumber"
              v-model="submitForm.num" 
              :min="0" 
              :max="skuPrice.max_stay* skuPrice.room_stock"
              :step="1"
              @change="changeHandler">
            </el-input-number>
            <div class="info-bar" style="padding-left: 0;">
              <div class="sign">剩余完整房间:</div>
              <div class="money">{{ computedInfo.all_rooms }}</div>
              <div class="sign">间&nbsp;</div>
              <div class="sign">可住:</div>
              <div class="money">{{ computedInfo.all_total }}</div>
              <div class="sign">人&nbsp;|&nbsp;</div>
              <div class="sign">剩余拼住房间:</div>
              <div class="money">{{ computedInfo.part_rooms }}</div>
              <div class="sign">间&nbsp;</div>
              <div class="sign">可住:</div>
              <div class="money">{{ computedInfo.part_total }}</div>
              <div class="sign">人&nbsp;|&nbsp;</div>
              <div class="sign">共可住:</div>
              <div class="money">{{ computedInfo.all_total+ computedInfo.part_total }}</div>
              <div class="sign">人</div>
            </div>
            <div class="info-bar" style="padding-left: 0;">
              <div class="sign">至少报名:</div>
              <div class="money">{{ computedInfo.least_add }}</div>
              <div class="sign">人&nbsp;|&nbsp;</div>
              <div class="sign">最多容纳:</div>
              <div class="money">{{ skuPrice.max_stay }}</div>
              <div class="sign">人</div>
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
  getSkuPriceDTO, getCabinDTO, getCabinGuestDTO 
} from '../../dictionary'
import LinkTitleBar from './comps/LinkTitleBar/index'
import CabinEditor from './comps/CabinEditor'

export default {

  components: { LinkTitleBar, CabinEditor },

  props: {
    priceType: Number
  },

  computed: {
    cabinTitles(){
      return this.cabin.map((el, index) => {
        let skuPrice= el.sku_price;
        let { id, title }= skuPrice;
        return { key: id, label: title, selected: this.cabin.length=== index+ 1 };
      })
    },
    isCommonPrice(){
      return this.priceType=== 2;
    }, 
    computedPrice(){
      let { adult_same_price, adult_straight_price }= this.skuPrice;
      return this.isCommonPrice? adult_same_price: adult_straight_price;
    },
    computedInfo(){
      let all_rooms= 0;
      let all_nums= 0;
      let all_total= 0;
      let all_price= 0;
      let part_rooms= 0;
      let part_nums= 0;
      let part_total= 0;
      let part_price= 0;
      let least_add= 0;
      this.cabin.forEach(el => {
        let { guests, cabin_type }= el;
        let { room_stock, max_stay, min_stay, adult_same_price, adult_straight_price }= el.sku_price;
        let price= this.isCommonPrice? adult_same_price: adult_straight_price;
        if(cabin_type=== CABIN_SPLIT_TYPE.ALL){
          all_total+= room_stock* max_stay
          all_rooms+= room_stock;
          all_rooms-= Math.ceil(guests.length/max_stay);
          all_nums+= guests.length;
          all_total-= guests.length;
          all_price+= (guests.length* (price* 100))/100;
          least_add= all_total%max_stay=== 0? min_stay: 1;
        }
        if(cabin_type=== CABIN_SPLIT_TYPE.PART){
          part_total+= room_stock* max_stay
          part_rooms+= room_stock;
          part_rooms-= Math.ceil(guests.length/max_stay);
          part_nums+= guests.length;
          part_total-= guests.length;
          part_price+= (guests.length* (price* 100))/100;
          least_add= 1;
        }
      })
      return { all_rooms, all_nums, all_total, all_price, part_rooms, part_nums, part_total, part_price, least_add };
    }
  },

  watch:{
    currentCabin:{
      deep: true,
      handler(nval, oval){
        // 切换cabin不激活这个handler
        if(nval.sku_price!== oval.sku_price) return this.$emit('calcula');
        let { max_stay, min_stay }= this.skuPrice;
        let { guests, cabin_type }= nval;
        let left;
        this.submitForm.num= guests.length;
        if(cabin_type=== CABIN_SPLIT_TYPE.PART) return;
        left= guests.length% max_stay;
        if(left>= min_stay || (guests.length && left=== 0)) return this.setCabinShort(0);
        if(guests.length< min_stay) {
          this.$message.error({
            message: `还需增加${min_stay- guests.length}个报名,才能满足下单条件`,
            duration: 5000
          });
          return this.setCabinShort((min_stay- guests.length)* -1);
        }
        let short= min_stay- left;
        this.$message.error({
          message: `还需减少${short}个或增加${min_stay- short}个报名,才能满足下单条件`,
          duration: 5000
        });
        return this.setCabinShort(short);
      },
    }
  },

  data(){
    return Object.assign(
      {
        submitForm: {
          num: 0,
          cabin_type: CABIN_SPLIT_TYPE.PART
        },
        // 下单中报站的舱房类型
        cabin: [],
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
    // 选择拼住，无需满足最少报名人数
    changeHandler(nval, oval){
      if(!nval && nval!== 0) return this.$nextTick(() => this.submitForm.num= oval);
      let step= nval- oval;
      step> 0? this.plusChangeHandler(step, oval): this.minusChangeHandler(step, oval);
      return;
    },

    minusChangeHandler(step, oval){
      let want= step; // 预期
      let handWarn= 0;  // 手动值
      let clear= false; // 是否为空
      let removed= []; // 移除数组
      let pointer= 0;  // 跳人指针
      let minHold;  // 最少人数
      let { guests, cabin_type }= this.currentCabin;
      let { min_stay, max_stay, room_stock }= this.skuPrice;
      let currentGuestsNum= guests.length;
      let deletableGuests= guests.filter(guest => !guest.isFilled());
      minHold= cabin_type=== CABIN_SPLIT_TYPE.ALL? min_stay: 1;
      step= Math.abs(step)> deletableGuests.length? deletableGuests.length* -1: step;
      if(step!== want) handWarn= step- want;
      if(cabin_type=== CABIN_SPLIT_TYPE.ALL){
        let left= (currentGuestsNum+ step)% max_stay;
        step+= (left>= min_stay || left=== 0? 0: (min_stay- left)); 
      }
      if(step=== 0 && deletableGuests.length!== 0) step= min_stay* -1;
      if(step=== 0) this.$nextTick(() => this.submitForm.num= oval);
      clear= Math.abs(step)=== guests.length;
      while(guests.length> minHold && removed.length< Math.abs(step) && pointer< guests.length){
        let max= guests.length- 1- pointer;
        guests[max].isFilled()? pointer++: removed.push(guests.splice(max, 1)[0]);
      }
      // bug min_stay为2, guests为2时, 手动删减一个, 再手动归0
      minHold= guests.length< minHold? guests.length: minHold;
      if(clear) this.$nextTick(() => this.submitForm.num= minHold);
      if(step!== want || clear)  
        this.$message.info(`预期减少${Math.abs(want)}人, 实际减少${Math.abs(step)- (clear? minHold: 0)}人, ${handWarn? `${handWarn}名填写过信息的旅客请手动删除`: ''}`);
    },

    plusChangeHandler(step, oval){
      let want= step;
      let { guests, cabin_type }= this.currentCabin;
      let { min_stay, max_stay, room_stock }= this.skuPrice;
      let currentGuestsNum= guests.length;
      if(cabin_type=== CABIN_SPLIT_TYPE.ALL){
        let left= (currentGuestsNum+ step)% max_stay;
        step+= (left>= min_stay || left=== 0? 0: (min_stay- left)); 
      }
      if(currentGuestsNum+ step> room_stock* max_stay) step= room_stock* max_stay- oval;
      if(step!== want) 
        this.$message.info(`预期增加${Math.abs(want)}人, 实际增加${Math.abs(step)}人`);
      for(let i= 0; i< step; i++){
        guests.push(getCabinGuestDTO(this.skuPrice));
      }
    },

    /**
     * @description: 
     * @param {CabinTitle/Cabin/Null} cabin: 由外向内选通过cabin, 由内向外选通过cabinTitle
     */
    selectCabin(index){
      if(index < 0) return;
      let cabin= this.cabin[index];
      this.currentCabin= cabin;
      this.$assign(this.skuPrice, cabin.sku_price);
      this.$assign(this.submitForm, { num: cabin.guests.length, cabin_type: cabin.cabin_type });
    },

    // watch里会触发calcula
    addCabin(cabin){
      this.cabin.push(cabin);
    },

    removeCabin(index){
      let removed= this.cabin[index];
      let isFilled= removed.guests.find(guest => guest.isFilled());
      if(isFilled) return this.$message.error('该报名类型下存在游客信息,请手动删除游客后,再执行删除操作');
      this.cabin.splice(index, 1);
      removed.sku_price.selected= false;
      removed= null;
      // 如果删除的是当前选择,则watch里会emit,如果删除的不是当前选择,则手动触发一次
      if(this.currentCabin!== removed) this.$emit('calcula'); 
    },

    setCabinShort(short){
      this.currentCabin.short= short;
      this.$emit('calcula')
    },
  }

}
</script>