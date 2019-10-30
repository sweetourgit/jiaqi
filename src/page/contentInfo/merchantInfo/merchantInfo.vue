<style lang="scss" scoped>

</style>

<template>
  <component 
    :is="'child'+ vm.currentChild"
    @change-child="emitChangeChild"
  ></component> 
</template>

<script>
import childList from './comps/child-list/child-list'
import childAdd from './comps/child-add'

export default {

  components: {
    childlist: childList,
    childadd: childAdd
  },

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
        currentChild: 'list',
      },
    }
  },

  methods: {
    emitChangeChild(){
      if(this.vm.currentChild=== 'list') return this.vm.currentChild= 'add';
      this.vm.currentChild= 'list';
    },
  }
}
</script>
