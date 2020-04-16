<style lang="scss" scoped>
.order-page{
  position: relative;
  height: 100%; 
  overflow: auto;
  padding-right: 400px;
  &>header{
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding-right: 10px;
    background-color: transparent;
    .btn-ground{
      display: flex;
      justify-content: flex-end;
      padding-bottom: 10px;
      border-bottom: 1px solid #f4f4f4;
    }
    .total-ground{
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      line-height: 40px;
      padding-top: 10px;
      color: #606266;
      .money{
        position: relative;
        color: #333;
        font-weight: bold;
        padding-right: 20px; 
      }
      .money::before{
        content: '￥';
        color: #606266;
        font-weight: normal;
        position: absolute;
        left: 0;
        transform: translateX(-20px);
      }
    }
  }
  & >>> .no-wrap{
    word-break:keep-all;/* 不换行 */
    white-space:nowrap;/* 不换行 */
    overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow:ellipsis;
  }
  & >>> .info-bar{
    position: relative;
    padding-left: 150px;
    color: #606266;
    div{
      display: inline-block;
    }
    .title{
      color: #333;
      font-weight: bold;
      position: absolute;
      top: 0;
      left: 0;
      width: 150px;
    }
    .money{
      color: #333;
      font-weight: bold;
      padding: 0 5px;
    }
  }
}
</style>

<template>
  <div class="order-page">
    <header v-fixed-bar>
      <div class="btn-ground">
        <el-button size="small" type="info"
          @click="$router.go(-1)">
          取消
        </el-button>
        <el-button size="small" type="primary">预定不占</el-button>
        <el-button size="small" type="primary">预定占位</el-button>
        <el-button size="small" type="primary">确定占位</el-button>
      </div>
      <!-- <PositionPreview></!-->
      <div class="total-ground">
        <span>总价:</span>
        <span class="money">{{ priceCount }}</span>
      </div>
      <div class="total-ground"
        v-if="merchantState=== 'month'">
        <span>剩余预存款和额度:</span>
        <span class="money">{{ merchant.balance+ merchant.deposit }}</span>
      </div>
      <div class="total-ground"
        v-if="merchantState=== 'not_month'">
        <span>剩余预存款:</span>
        <span class="money">{{ merchant.deposit }}</span>
      </div>
    </header>
    <main style="padding-bottom: 40px;">
      <InfoGround ref="infoGround"></InfoGround>
      <ChannelGround ref="channelGround"
        @select-merchant="merchant= $event"
        @select-pricetype="selectPriceTypeHandler">
      </ChannelGround>
      <CabinGround ref="cabinGround"
        :price-type="priceType"
        @calcula="calculaHandler">
      </CabinGround>
      <OthersGround ref="othersGround"
        v-show="submitForm.cabin.length"
        :guest-count="guestCount"
        @calcula="calculaHandler">
      </OthersGround>
      <GuestsGround ref="guestsGround"
        v-show="submitForm.cabin.length">
      </GuestsGround>
    </main>
  </div>
</template>

<script>
/**
 * 下单流程,先走php验证接口,然后走.net提交接口,再将.net生成的id和orderCode带给php的提交接口 
 */

import './FixedBar'
// import PositionPreview from './comps/PositionPreview'
import InfoGround from './comps/InfoGround'
import ChannelGround from './comps/ChannelGround'
import CabinGround from './comps/CabinGround'
import OthersGround from './comps/OthersGround'
import GuestsGround from './comps/GuestsGround'
import { getSkuPlanInfo } from './api'

let skuPlanCache;
export default {

  components: { InfoGround, ChannelGround, CabinGround, OthersGround, GuestsGround },
  
  mounted(){
    let { sku_id, product_id }= this.$route.query;
    getSkuPlanInfo(sku_id) 
    .then(res => {
      skuPlanCache= res;
      this.init();
    })
  },

  beforeDestroy(){
    skuPlanCache= null;
  },

  computed: {
    merchantState(){
      if(!this.merchant) return;
      if(this.merchant.settlementType=== 1) return 'month';
      if(this.merchant.deposit!== 0) return 'not_month'
    }
  },

  data(){
    return {
      submitForm: {
        cabin: [],
      },
      priceType: 1,
      guestCount: 0,
      priceCount: 0,
      merchant: {
        id: null, 
        value: null,
        settlementType: null,
        deposit: 0,
        balance: 0
      }
    }
  },

  methods: {
    init(){
      this.$refs.infoGround.init(skuPlanCache);
      this.$refs.cabinGround.init(this.submitForm.cabin, skuPlanCache);
      this.$refs.othersGround.init(skuPlanCache);
      this.$refs.guestsGround.init(this.submitForm.cabin);
    },

    selectPriceTypeHandler(pricetype){
      this.priceType= pricetype;
      this.calculaHandler();
    },

    calculaHandler(){
      console.log('calculaHandler')
      this.$nextTick(() => {
        let guestCount= 0;  // 总数
        let priceCount= 0;  // 总价
        let warnArr= [];  // 报警数组
        let cabins= this.submitForm.cabin;
        let isCommonPrice= this.priceType=== 2;
        cabins.forEach(cabin => {
          let { sku_price, short, guests }= cabin;
          let { room_stock, adult_same_price, adult_straight_price }= sku_price;
          if(short) warnArr.push(cabin);
          guestCount+= guests.length;
          priceCount+= guests.length* (isCommonPrice? adult_same_price: adult_straight_price);
        })
        let othersCost= this.$refs.othersGround.getCost();
        this.guestCount= guestCount;
        this.priceCount= priceCount+ othersCost;
      })
    },
  }

}
</script>