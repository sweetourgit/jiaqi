<style lang="scss" scoped>
.instructions-pane{
  &>header{
    padding-bottom: 15px;
  }
}
</style>

<template>
  <div class="instructions-pane">
    <header>
      <el-button type="primary" size="small" 
        @click="addInstructions"
      >添加说明</el-button>
    </header>
    <common-editor
      ref="children" 
      v-for="(item, i) in list"
      :key="item.sign"
      :proto="item"
    >
      <el-button slot="delete" type="primary" size="small"
        @click="removeInstructions(i)"
      >删除说明</el-button>
    </common-editor>
  </div>
</template>

<script>
import commonEditor from './instructions-pane/comps/common-editor'
import { getInstructionDTO } from '../dictionary'

export default {
  components: { commonEditor },

  props: {
    proto: Array,
  },

  created(){
    this.init();
  },

  data(){
    return {
      list: [],
    }
  },

  methods: {
    init(){
      //用时间戳生成唯一标志
      let time= Date.now();
      let copy= this.$deepCopy(this.proto).map((el, i) => {
        return Object.assign(el, {sign: ''+ time+ i});
      })
      this.list.splice(0);
      this.list.push(...copy);
      this.checkProto= copy;
    },

    addInstructions(){
      this.list.push(
        Object.assign( getInstructionDTO(), { sign: Date.now() })
      );
    },

    removeInstructions(i){
      this.$confirm(`确定要删除当前项吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(i, 1);
        this.$forceUpdate();
      });
    },

    checkHasChange(){
      let bol= false;
      if(this.list.length!== this.proto.length) return true;
      let children= this.$refs.children || [];
      children.forEach(child => {
        !bol && (bol= child.checkHasChange());
      })
      return bol;
    },

    validate(){
      let bol= true;
      let children= this.$refs.children || [];
      children.forEach(child => {
        bol && (bol= child.validate());
      })
      return bol;
    },

    getData(){
      let result= [];
      let children= this.$refs.children || [];
      children.forEach(child => {
        result.push(child.getData());
      })
      return result;
    }
  }
}
</script>