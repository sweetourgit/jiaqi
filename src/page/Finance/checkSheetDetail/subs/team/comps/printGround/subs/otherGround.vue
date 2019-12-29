<style scoped>
  @import "~@/page/Finance/checkSheetDetail/subs/team/comps/printGround/print.css";
</style>
<template>
  
      <table cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td class="base label" colspan="3">
            <div class="cell">其他收入</div>
          </td>
        </tr>
        <tr>
          <td class="base label" style="width:40%;">
            <div class="cell">款项名称</div>
          </td>
          <td class="base label" style="width:30%;">
            <div class="cell">金额</div>
          </td>
          <td class="base label" style="width:30%;">
            <div class="cell">票号</div>
          </td>
        </tr>
        <!-- 占位 -->
        <tr v-show="others.length=== 0">
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

        <tr 
          v-for="(other, i) in others"
          :key="i">
          <td class="base">
            <div class="cell">{{ other.title }}</div>
          </td>
          <td class="base">
            <div class="cell">{{ other.price | priceFilter }}</div>
          </td>
          <td class="base">
            <div class="cell">{{ other.ticket }}</div>
          </td>
        </tr>
      </table>
</template>

<script>
export default {

  data(){
    return {
      others: [],
    }
  },

  filters: {
    priceFilter(val){
      if(!val) return 0;
      return val.toFixed(2);
    }
  },

  methods: {
    init(others){
      this.others= others;
    },

    getPrice(){
      let total= 0;
      this.others.forEach(other => total+= other.price);
      return total;
    }
  }
}
</script>