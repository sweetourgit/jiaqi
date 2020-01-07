<style lang="scss" scoped>
$ruler: 16px;

.relation-bar{
  *{
    box-sizing: border-box;
  }
  .icon-outer{
    display: inline-block;
    height: 1.5* $ruler;
    width: 1.5* $ruler;
    padding: 0.25* $ruler;
    cursor: pointer;
  }
  .label{
    display: inline-block;
    padding: 0 5px;
    font-size: $ruler;
    line-height: 1.5* $ruler;
    cursor: pointer;
  }
  .hoverd{
    color: #d3d3d3;
    background-color: #000;
  }
  &>header{
    
  }
  &>main{
    position: relative;
    padding-left:1.5* $ruler; 
  }
  &>main::before{
    content: ' ';
    position: absolute;
    height: 100%;
    width: 1.5* $ruler;
    border-right: 1px dashed #000;
    transform: translateX(-150%);
  }
}
</style>
<template>
  <div class="relation-bar"
    v-if="state">
    <header
      @mouseover="hoverd=true"
      @mouseout="hoverd=false">
      <div class="icon-outer"
        @click.exact="awakeChild"
        @click.ctrl.exact="awakeChildDeeply">
        <i :class="[expended? 'el-icon-minus': 'el-icon-plus']"></i>
      </div>
      <div 
        :class="['label', hoverd && 'hoverd']">
        [预]123
      </div>
    </header>
    <main>
      <relation-bar 
        ref="relationBar">
      </relation-bar>
    </main>
    <footer
      @mouseover="hoverd=true"
      @mouseout="hoverd=false">
      <div class="icon-outer"
        @click.exact="awakeChild"
        @click.ctrl.exact="awakeChildDeeply">
        <i :class="[expended? 'el-icon-minus': 'el-icon-plus']"></i>
      </div>
      <div 
        :class="['label', hoverd && 'hoverd']">
        [预]123
      </div>
    </footer>
  </div>  
</template>

<script>
export default {

  name: 'RelationBar',

  props: {
    isRoot: Boolean,  // 是否是根节点
  },

  data(){
    return Object.assign(
      {
        state: this.isRoot, // 根节点默认显示,非根节点默认隐藏
        expended: false,  // 是否是展开状态
        hoverd: false, // 是否是悬停状态
      }
    )
  },

  methods: {
    setState(state){
      this.state= state;
      if(!state) this.expended= false;
    },
    awakeChild(){
      console.log('awakeChild');
      let bol= this.expended;
      this.$nextTick(() => {
        this.$refs.relationBar.setState(!bol);
      })
      this.expended= !this.expended;
    },
    awakeChildDeeply(){
      console.log('awakeChildDeeply')
    }
  }

}
</script>