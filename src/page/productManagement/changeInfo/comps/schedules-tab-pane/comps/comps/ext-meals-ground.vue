<style lang="scss" scoped>

</style>

<template>
  <div class="ext-meals-ground">
    <ext-meals
      ref="extMeals" 
      v-for="(item, i) in meals"
      :key="i"
      :proto="item"
      :label="labels[i]"
      @change-validate="emitChangeValidate"
    ></ext-meals>
  </div>
</template>

<script>
/**
 * @description: 
 */
import extMeals from './ext-meals'

export default {
  components: { extMeals },
  
  props: {
    value: [String, Error]
  },

  watch: {
    value(nval){
      if(nval && !this.vm.inited) this.init();
    }
  },

  data(){
    return {
      vm: {
        inited: false,
      },
      meals: [],
      labels: ['早餐', '午餐', '晚餐'],
    }
  },

  methods: {
    init(){
      this.vm.inited= true;
      let proto= JSON.parse(this.value)
      this.checkProto= [...this.$deepCopy(proto)];
      this.meals.push(...this.$deepCopy(proto));
    },

    validate(){
      let bol= true;
      let children= this.$refs.extMeals;
      children.forEach(child => {
        bol && (bol= child.validate());
      })
      !bol && this.$emit('input', new Error('餐饮说明不能为空'));
      return bol;
    },

    getData(){
      let children= this.$refs.extMeals;
      let result= children.map(child => {
        return child.getData();
      });
      return JSON.stringify(result);
    },

    emitChangeValidate(){
      this.$emit('input', JSON.stringify(this.checkProto));
      this.$emit('change-validate');
    }
  }

}
</script>