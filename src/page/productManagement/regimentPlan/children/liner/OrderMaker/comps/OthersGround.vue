<style>

</style>

<template>
  <div style="padding:10px 0 40px 0; border-bottom: 1px solid #cecece; border-top: 1px solid #cecece;">
    <el-form
      label-width="120px" 
      ref="submitForm">

      <el-form-item label="大巴车：" prop="name">
        <div v-if="insure.length=== 0" style="color: gray;">(无)</div>
        <div v-else style="display:flex;flex-direction:column;"
          v-for="(el, i) in deliver"
          :key="i">
          <label class="info-bar">
            <div class="title">{{ el.title }}</div>
            <div class="sign">￥</div>
            <div class="money">{{ el.sale_price }}</div>
            <div class="sign">*</div>
            <div class="money">{{ el.deliver_num }}</div>
          </label>
          <el-input-number size="small"
            v-model="el.deliver_num" 
            :min="0" 
            :max="guestCount"
            :step="1">
          </el-input-number>
        </div>
      </el-form-item>

      <el-form-item label="保险：" prop="name" style="margin: 0;">
        <div v-if="insure.length=== 0" style="color: gray;">(无)</div>
        <div v-else style="display:flex;flex-direction:column;"
          v-for="(el, i) in insure"
          :key="i">
          <label class="info-bar">
            <div class="title">{{ el.title }}</div>
            <div class="sign">￥</div>
            <div class="money">{{ el.sale_price }}</div>
            <div class="sign">*</div>
            <div class="money">{{ el.insure_num }}</div>
          </label>
          <el-input-number size="small"
            v-model="el.insure_num" 
            :min="0" 
            :max="guestCount"
            :step="1">
          </el-input-number>
        </div>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    guestCount: Number,
  },

  watch: {
    // 
    guestCount(nval, oval){
      if(nval> oval) return;
      this.deliver.forEach(item => item.deliver_num> nval && (item.deliver_num= nval));
      this.insure.forEach(item => item.insure_num> nval && (item.insure_num= nval));
    }
  },

  data(){
    return {
      deliver: [],
      insure: [],
    }
  },

  methods: {
    init(skuPlan){
      let { deliver, insure }= skuPlan;
      this.deliver= deliver.map(el => this.deliverAdaptor(el));
      this.insure= insure.map(el => this.insureAdaptor(el));
    },

    deliverAdaptor(deliver){
      let { id, sale_price, title }= deliver;
      return {
        id, title, 
        sale_price: parseFloat(sale_price),
        deliver_num: 0,
      }
    },

    insureAdaptor(insure){
      let { id, sale_price, title }= insure;
      return {
        id, title, 
        sale_price: parseFloat(sale_price),
        insure_num: 0,
      }
    },

    getData(){
      let max= this.guestCount;
      if(this.deliver.deliver_num> max) this.deliver.deliver_num= max;
      if(this.insure.insure_num> max) this.insure.insure_num= max;
      return { deliver:this.deliver, insure: this.insure }
    },

    getCost(){
      let { deliver, insure }= this.getData();
      return deliver.deliver_num* deliver.sale_price+ insure.insure_num* insure.sale_price;
    }
  }
}
</script>