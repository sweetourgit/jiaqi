
<style lang="scss" scoped>

</style>

<template>
  <el-dialog width='1300px' top='5vh' append-to-body title="图片选择" :visible.sync="state" custom-class="city_list">
    <MaterialList v-if="state" :imgData="list" v-on:checkList="emitCheckList" v-on:closeButton="state= false"></MaterialList>
  </el-dialog>
</template>

<script>
import MaterialList from '@/common/Image'

export default {
  components: { MaterialList },
  
  data(){
    return {
      vm: {
        state: false,
      },
      list: [],
    }
  },

  methods: {
    emitCheckList(){
      
    }
  }
}
</script>