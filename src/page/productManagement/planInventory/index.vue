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
          @click="toCostChild(null)"
        > 成 本 </el-button>
        <el-button
          :type="vm.currentChild=== 'price'? 'primary': ''"
          @click="toPriceChild(null)"
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
// api
import { getTeamListPackages, getEnrollTypeDictionary } from './planInventory'

// comps
import inventoryChild from './comps/inventory-child/inventory-child'
import costChild from './comps/cost-child/cost-child'
import priceChild from './comps/price-child/price-child'

export default {

  components: { inventoryChild, priceChild, costChild },

  provide: {
    PACKAGE_LIST: []
  },

  mounted(){
     // 修改页面高度问题
    document.querySelector(".content-body1").style.height= "auto";
    document.querySelector(".content-body1").style.paddingBottom= "50px";
    // TODO预警
    this.todoWarn();
    this.init();
  },

  beforeDestroy(){
    // 修改页面高度问题
    document.querySelector(".content-body1").style.height= null;
    document.querySelector(".content-body1").style.paddingBottom= null;
  },

  data(){
    return {
      vm: {
        currentChild: 'inventory',
      },
    }
  },

  methods: {
    emitChangeChild(){},
    // TODO记录
    todoWarn(){
      console.warn('TODO: /cost-child/edit-form 尚未获取编辑用户，接口提交的是假值');
      console.warn('TODO: /cost-child/edit-form addCost接口有问题默认传值很奇怪');
      console.warn('TODO: /price-child/panel-day props无法传递任何绑定！！！');
      console.warn('TODO: enrollcard可以按enrolla类别分类排列');
      console.warn('TODO: 可以通过传入routeQuery tab&package来直接进入子tab');
    },

    // 可传入packageId
    init(pacId){
      console.warn(JSON.stringify(this.$route.query));
      let { id, pac_id, tab, timestamp }= this.$route.query;
      let payloadAssign= {};
      if(!id) return this.$message.error('页面初始参数出错，请回退到上一页');
      // 处理一次性路由参数
      if(pac_id || tab || timestamp){
        this.$router.replace({ path: this.$route.path, query: { id } });
        // 讲路由套餐id以参数传入
        if(pac_id) pacId= parseInt(pac_id);
        if(tab) this.vm.currentChild= tab;
        if(timestamp) payloadAssign.timestamp= timestamp;
      }
      // 初始化字典
      getEnrollTypeDictionary();
      getTeamListPackages(id).then(objects => {
        let result= this.mixinFactory(objects);
        // 将套餐列表分享
        this._provided.PACKAGE_LIST.splice(0);
        this._provided.PACKAGE_LIST.push(...result);
        // 初始化库存
        let pac= result.find(el => el.id=== pacId);
        pac? this.$refs.child.init(Object.assign(payloadAssign, pac))
          : this.$refs.child.init();
      })
    },

    mixinFactory(objects){
      return objects.map(object => {
        object.sign= '未设置'
        if(object.codePrefix && object.codeSuffix){
          object.sign= `${object.codePrefix} - 日期 - ${object.codeSuffix}`;
          object.inited= true;
        }
        return object;
      })
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
      if(!payload) payload= this.findFirstInitedPackage();
      if(!payload) return this.$message.error('产品下套餐都未设置团号');
      this.beforeChangeChild('cost', payload);
    },

    toPriceChild(payload){
      if(!payload) payload= this.findFirstInitedPackage();
      if(!payload) return this.$message.error('产品下套餐都未设置团号');
      this.beforeChangeChild('price', payload);
    },

    findFirstInitedPackage(){
      return this._provided.PACKAGE_LIST.find(el => el.inited);
    }
  }
}
</script>