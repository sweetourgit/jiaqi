
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
      {
        state: false,
        cb: null
      },
      {
        list: []
      }
    )
  },

  methods: {
    wakeup(idList, cb){
      this.list.push(...idList);
      this.cb= cb;
      this.state= true;
    },
    
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