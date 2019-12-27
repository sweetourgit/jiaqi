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
        <div class="cell">{{ order.arrearsPrice | priceFilter }}</div>
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
      <td class="base">
        <div class="cell">{{ order.mark }}</div>
      </td>
    </tr>
    
    <tr 
      v-for="(item, i) in subs"
      :key="i">
      <td class="base" colspan="6">
        <div class="cell">123</div>
      </td>
      <td class="base" style="width:5%;">
        <div class="cell"></div>
      </td>
      <td class="base" colspan="3">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
      <td class="base">
        <div class="cell"></div>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {

  props: {
    rank: Number,
    proto: Object,
  },

  filters: {
    priceFilter(val){
      if(!val) return 0;
      return val.toFixed(2);
    }
  },

  watch: {
    proto: {
      handler(nval, oval){
        if(nval) this.init(nval);
      },
      immediate: true
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
      this.subsMaker(collectionNumber, ticketNumber);
    },

    subsMaker(collection, ticket){
      let result= [];
      let length;
      collection= JSON.parse(collection);
      ticket= JSON.parse(ticket);
      length= collection.length > ticket.length? collection.length: ticket.length;
      for(let i= 0; i< length; i++){
        result.push({
          price: collection[i] && collection[i].Price,
          collectionNumber: collection[i] && collection[i].CollectionID,
          ticketNumber: ticket[i] && ticket[i].TicketNumber
        })
      }
    }
  }
}
</script>