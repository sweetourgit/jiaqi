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
 * @description: 处理经停整体的逻辑 
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
    // 初始化在这里进行
    proto(nval){
      if(this.vm.inited) return;
      this.vm.inited= true;
      this.vm.hasChanged= false;
      this.bars.push(...JSON.parse(nval));
    }
  },

  data(){
    return {
      vm: {
        inited: false,
        hasChanged: false
      },
      bars: [],
      rules: {},
    }
  },

  methods: {
    /**
     * @description: 添加和删除动作就默认数据已经发生改变
     */
    addExtStopover(){
      this.vm.hasChanged= true;
      this.bars.push({
        timestamp: Date.now(),
        stopCity: '',
        stopDate: ''
      })
    },
    removeStopover(index){
      this.vm.hasChanged= true;
      this.bars.splice(index, 1);
    },

    /**
     * @description: 检查是否有数据变动
     */
    checkHasChange(){
      let bol= this.vm.hasChanged;
      let children= this.$refs.children || [];
      children.forEach(child => {
        !bol && (bol= child.checkHasChange());
      })
      bol && console.warn(`ext-stopover checkHasChange: ${bol}`)
      return bol;
    },

    validate(){
      let bol= true
      let children= this.$refs.children || [];
      children.forEach(child => {
        bol && (bol= child.validate());
      })
      return bol;
    },

    /**
     * @description: 得到数据
     */
    getData(){
      let children= this.$refs.children;
      if(!children) return "[]";
      return JSON.stringify(children.map(el => el.getData()));
    }
  },
}
</script>