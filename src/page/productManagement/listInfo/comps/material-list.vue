
<style lang="scss" scoped>

</style>

<template>
  <el-dialog width='1300px' top='5vh' append-to-body title="图片选择" :visible.sync="vm.state" custom-class="city_list">
    <MaterialList v-if="vm.state" :imgData="list" v-on:checkList="emitCheckList" v-on:closeButton="vm.state= false"></MaterialList>
  </el-dialog>
</template>

<script>
import MaterialList from '@/common/image-ground'

export default {
  components: { MaterialList },

  props: {
    proto: Array,
  },
  
  // watch:{
  //   proto(){
  //     this.list.splice(0);
  //     this.list.push(...this.proto);
  //   }
  // },

  data(){
    return {
      vm: {
        state: false,
      },
      list: [],
    }
  },

  methods: {
    // 提交选中的数据
    emitCheckList(data){
      this.$emit('submit-list', data);
    }
  }
}
</script>