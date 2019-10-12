<template>
  <div class="ext-stopover">
    <ext-stopover-bar
      ref="children"
      v-for="(bar, i) in bars"
      :proto="bar"
      :key="bar.timestamp"
    >
      <el-button type="text" size="small" @click="removeStopover(i)">删除</el-button>
    </ext-stopover-bar>
  </div>
</template>

<script>
/**
 * @description: 逻辑组件，处理经停的逻辑 
 */
import extStopoverBar from './ext-stopover-bar'

export default {
  props: {
    proto: [String]
  },

  components: {
    extStopoverBar
  },

  watch:{
    proto(nval){
      this.vm.inited= true;
      this.bars.push(...JSON.parse(nval));
    }
  },

  data(){
    return {
      vm: {
        inited: false,
      },
      bars: [],
      rules: {},
    }
  },

  methods: {
    addExtStopover(){
      this.bars.push({
        timestamp: Date.now(),
        stopCity: '',
        stopDate: ''
      })
    },

    removeStopover(index){
      this.bars.splice(index, 1);
    },

    /**
     * @description: 检查是否有数据变动
     */
    checkHasChange(){
      let bol= false;
      let children= this.$refs.children || [];
      children.forEach(child => {
        !bol && (bol= child.checkHasChange());
      })
      return bol;
    }
  },
}
</script>