<style scoped>
  @import "~@/page/Finance/checkSheetDetail/subs/team/comps/printGround/print.css";
</style>
<template>
  <tbody>
    <tr>
      <!-- 序号 -->
      <td class="base" style="width:5%;">
        <div class="cell">{{ rank + 1 }}</div>
      </td>
      <!-- 订单号 -->
      <td class="base">
        <div class="cell">{{ order.orderCode }}</div>
      </td>
      <!-- 来源 -->
      <td class="base">
        <div class="cell">{{ order.orderSource }}</div>
      </td>
      <!-- 类型 -->
      <td class="base" style="width:5%;">
        <div class="cell">{{ order.orderChannelEX }}</div>
      </td>
      <!-- 练团人 -->
      <td class="base">
        <div class="cell">{{ order.joinPeople }}</div>
      </td>
      <!-- 人数 -->
      <td class="base" style="width:5%;">
        <div class="cell">{{ order.peopleCount }}</div>
      </td>
      <!-- 订单收入 -->
      <td class="base" style="width:5%;">
        <div class="cell">{{ order.orderPrice | priceFilter }}</div>
      </td>
      <td class="base" style="width:5%;">
        <div class="cell">{{ order.incomePrice | priceFilter }}</div>
      </td>
      <td class="base" style="width:5%;">
        <div class="cell">{{ order.arrearsPrice | noNegativeFilter | priceFilter }}</div>
      </td>
      <td class="base">
        <div class="cell">{{ order.orderProfit | priceFilter }}</div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
      <td class="base" style="cursor:pointer;"
        @click="wakeupMark">
        <div class="cell" v-if="order.mark">{{ order.mark }}</div>
        <div class="editable-cell" v-else>点击编辑</div>
      </td>
    </tr>
    
    <tr 
      v-for="(item, i) in subs"
      :key="i">
      <td class="base" colspan="10">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell">
          <div class="label">{{ item.collectionNumber }}</div>
          <div>{{ item.price | priceFilter(true) }}</div>
        </div>
      </td>
      <td class="base">
        <div class="cell">
          <div class="label">{{ item.ticketNumber }}</div>
          <div>{{ item.invoicePrice | priceFilter(true) }}</div>
        </div>
      </td>
      <td class="base">
        <div class="cell">{{ item.mark }}</div>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {

  props: {
    rank: Number,
    proto: Object,
    pageType: String, // add normal mine
  },

  filters: {
    priceFilter(val, noZero){
      if(!val) return noZero? ' ': 0;
      return val.toFixed(2);
    },
    noNegativeFilter(val){
      if(val< 0) return 0;
      return val;
    }
  },

  watch: {
    proto: {
      handler(nval, oval){
        if(nval) this.init(nval);
      },
      immediate: true,
      deep: true
    }
  },

  data(){
    return {
      order: {},
      subs: [],
    }
  },

  methods: {
    init(income){
      let { collectionNumber, ticketNumber, ...order }= income;
      this.order= order;
      this.subs= this.subsMaker(collectionNumber, ticketNumber);
    },

    subsMaker(collection, ticket){
      let length;
      let result= [];
      collection= JSON.parse(collection);
      ticket= JSON.parse(ticket);
      length= collection.length > ticket.length? collection.length: ticket.length;
      for(let i= 0; i< length; i++){
        result.push({
          price: collection[i] && collection[i].MatchingPrice,
          collectionNumber: collection[i] && collection[i].CollectionID,
          ticketNumber: ticket[i] && ticket[i].InvoiceNumber,
          invoicePrice: ticket[i] && ticket[i].InvoicePrice
        })
      }
      return result;
    },

    /**
     * @description: mark里默认会有一个空注释
     */
    markMaker(mark){
      if(mark=== 'string') return [];
      mark= JSON.parse(mark || "[]");
      if(mark.length=== 1 && !mark.Mark) return []; 
      return mark;
    },

    wakeupMark(){
      if(this.pageType=== 'add') this.$emit('wakeup-mark', this.rank);
    },
  }
}
</script>
