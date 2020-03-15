
<style lang="scss" scoped>

</style>

<template>
  <el-dialog width='1300px' top='5vh' append-to-body title="图片选择" custom-class="city_list"
    :visible.sync="state"
    :before-close="handleClose"
  >
    <MaterialList :imgData="list" v-on:checkList="emitCheckList" v-on:closeButton="handleClose"></MaterialList>
  </el-dialog>
</template>

<script>
import MaterialList from '@/common/Image'

export default {
  components: { MaterialList },

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
      // this.list.push(...idList);
      this.cb= cb;
      this.state= true;
    },
    
    // 提交选中的数据
    emitCheckList(data){
      this.cb(data);
    },

    handleClose(){
      this.list.splice(0);
      this.cb= null;
      this.state= false;
    }
  }
}
</script>