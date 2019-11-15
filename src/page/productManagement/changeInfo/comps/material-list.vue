
<style lang="scss" scoped>

</style>

<template>
  <el-dialog width='1300px' top='5vh' append-to-body title="图片选择" custom-class="city_list"
    :visible.sync="state"
    :before-close="handleClose"
  >
    <MaterialList :imgData="list" v-on:checkList="emitCheckList" v-on:closeButton="state= false"></MaterialList>
  </el-dialog>
</template>

<script>
import MaterialList from '@/common/Image'

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
    return Object.assign(
      // 状态控制
      {
        state: false,
        cb: null
      },
      // 数据
      {
        list: []
      }
    )
  },

  methods: {
    // 初始化
    wakeup(idList, cb){
      this.list.push(...idList);
      this.state= true;
      this.cb= cb;
    },
    
    // 提交选中的数据
    emitCheckList(data){
      this.cb(data);
    },

    handleClose(){
      this.state= false;
      this.cb= null;
      this.list.splice(0);
    }
  }
}
</script>