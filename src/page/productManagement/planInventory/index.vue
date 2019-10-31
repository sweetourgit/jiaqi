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
          @click="beforeChangeChild('inventory')"
        > 库 存 </el-button>
        <el-button
          :type="vm.currentChild=== 'cost'? 'primary': ''"
          @click="beforeChangeChild('cost')"
        > 成 本 </el-button>
        <el-button
          :type="vm.currentChild=== 'price'? 'primary': ''"
          @click="beforeChangeChild('price')"
        > 价 格 </el-button>
      </el-button-group>
    </header>
    <component
      ref="child" 
      :is="vm.currentChild+ 'Child'"
      @emit-handler="emitHandler"
      @change-child="emitChangeChild"
    ></component>
  </div>
</template>

<script>
import inventoryChild from './comps/inventory-child/inventory-child'
import costChild from './comps/cost-child/cost-child'
import priceChild from './comps/price-child/price-child'

export default {

  components: { inventoryChild, priceChild, costChild },

  mounted(){
    // 修改页面高度问题
    document.querySelector(".content-body1").style.height= "100%";
    this.init();
  },

  beforeDestroy(){
    // 修改页面高度问题
    document.querySelector(".content-body1").style.height= null;
  },

  data(){
    return {
      vm: {
        currentChild: null,
      },
    }
  },

  methods: {
    init(){
      this.beforeChangeChild('inventory');
    },

    beforeChangeChild(child, payload){
      let current= this.vm.currentChild;
      if(current=== child) return;
      this.vm.currentChild= child;
      this.$nextTick(() => this.$refs.child.init(payload))
    },

    // 子emit事件总代理
    emitHandler(params){
      let { func, payload }= params;
      this[func](payload);
    },
    
    toCostChild(payload){
      this.beforeChangeChild('cost', payload);
    }
  }
}
</script>