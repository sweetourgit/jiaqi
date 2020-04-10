<style>

</style>

<template>
  <div style="padding:10px 0 40px 0; border-bottom: 1px solid #cecece; border-top: 1px solid #cecece;"
    v-show="guestCount">
    <el-form
      label-width="120px" 
      ref="submitForm">

      <el-form-item label="大巴车：" prop="name">
        <div style="display:flex;flex-direction:column;"
          v-for="(el, i) in deliver"
          :key="i">
          <label>
            <span>{{ `${el.title} ￥${el.sale_price} *${el.deliver_num}` }}</span>
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
        <div style="display:flex;flex-direction:column;"
          v-for="(el, i) in insure"
          :key="i">
          <label>
            <span>{{ `${el.title} ￥${el.sale_price} *${el.insure_num}` }}</span>
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