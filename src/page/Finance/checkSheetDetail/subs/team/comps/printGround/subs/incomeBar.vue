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
        <div class="cell"></div>
      </td>
      <!-- 来源 -->
      <td class="base">
        <div class="cell"></div>
      </td>
      <!-- 类型 -->
      <td class="base" style="width:5%;">
        <div class="cell"></div>
      </td>
      <!-- 练团人 -->
      <td class="base">
        <div class="cell"></div>
      </td>
      <!-- 人数 -->
      <td class="base" style="width:5%;">
        <div class="cell"></div>
      </td>
      <!-- 订单收入 -->
      <td class="base" style="width:5%;">
        <div class="cell"></div>
      </td>
      <td class="base" style="width:5%;">
        <div class="cell"></div>
      </td>
      <td class="base" style="width:5%;">
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
      <td class="base">
        <div class="cell"></div>
      </td>
    </tr>
    
    <tr>
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
      <td class="base" colspan="2">
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
  }



}
</script>