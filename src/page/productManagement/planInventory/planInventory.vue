<style lang="scss" scoped>
  .plan-inventory{
    height: 100%;
    &>header{
      display: flex;
      justify-content: center;
      padding-bottom: 20px;
    }
  }
</style>

<template>
  <div class="plan-inventory">
    <header>
      <el-button-group>
        <el-button
          :type="vm.currentChild=== 'inventory'? 'primary': ''"
          @click="beforeChangeChild"
        > 库 存 </el-button>
        <el-button
          :type="vm.currentChild=== 'price'? 'primary': ''"
          @click="beforeChangeChild"
        > 价 格 </el-button>
      </el-button-group>
    </header>
    <component 
      :is="vm.currentChild+ 'Child'"
      @change-child="emitChangeChild"
    ></component>
  </div>
</template>

<script>
import inventoryChild from './comps/inventory-child/inventory-child'
import priceChild from './comps/price-child/price-child'

export default {

  components: { inventoryChild, priceChild },

  mounted(){
    // 修改页面高度问题
    document.querySelector(".content-body1").style.height= "100%";
  },

  beforeDestroy(){
    // 修改页面高度问题
    document.querySelector(".content-body1").style.height= null;
  },

  data(){
    return {
      vm: {
        currentChild: 'inventory',
      },
    }
  },

  methods: {
    beforeChangeChild(){
      this.emitChangeChild();
    },

    emitChangeChild(){
      if(this.vm.currentChild=== 'price') return this.vm.currentChild= 'inventory';
      this.vm.currentChild= 'price';
    },
  }
}
</script>