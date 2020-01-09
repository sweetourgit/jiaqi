<style lang="scss" scoped>
$ruler: 16px;

.relation-bar{
  user-select: none;
  * {
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
    box-sizing: border-box;
    cursor: pointer;
  }
  .hoverd{
    color: #d3d3d3;
    background-color: #000;
  }
  .selected{
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
      @mouseover="$emit('update:hoverd', true)"
      @mouseout="$emit('update:hoverd', false)">
      <div class="icon-outer"
        @click.exact="awakeChild"
        @click.ctrl.exact="awakeChildDeeply">
        <i :class="[expended? 'el-icon-minus': 'el-icon-plus']"></i>
      </div>
      <div 
        :class="['label', hoverd && 'hoverd', selected && 'selected']"
        @click="selectHandler">
        {{ labelMaker() }}
      </div>
    </header>
    <main>
      <relation-bar
        ref="relationBarRef"
        v-if="child"
        v-bind.sync="child"
        :proto="child">
      </relation-bar>
    </main>
    <footer
      v-if="!subChild"
      @mouseover="$emit('update:hoverd', true)"
      @mouseout="$emit('update:hoverd', false)">
      <div class="icon-outer"
        @click.exact="awakeChild"
        @click.ctrl.exact="awakeChildDeeply">
        <i :class="[expended? 'el-icon-minus': 'el-icon-plus']"></i>
      </div>
      <div 
        :class="['label', hoverd && 'hoverd', selected && 'selected']"
        @click="selectHandler">
        {{ labelMaker(subChild) }}
      </div>
    </footer>
  </div>  
</template>

<script>
import { getNode } from '../api'
import { RelationBar, relationBarMaker } from '../dictionary'

export default {

  name: 'RelationBar',

  props: {
    isRoot: Boolean,  // 是否是根节点
    proto: Object,
    state: Boolean,
    expended: Boolean,
    hoverd: Boolean,
    selected: Boolean,
    info: Object,
    child: Object,
    subChild: Object
  },

  data(){
    return {

    }
  },

  methods: {
    awakeChild(){
      let child;
      let { id }= this.info;
      if(this.child){
        console.log('child exsit')
        this.child.state= !this.child.state;
        return this.$emit('update:expended', this.child.state);
      }
      getNode(id)
      .then(res => {
        let { trees, ...info }= res;
        child= relationBarMaker(trees[0]);
        if(!child){
          this.$emit('update:expended', true);
          return this.$message.info('no split');
        }
        child.state= true;
        this.$emit('update:expended', true);
        this.$emit('update:child', child);
      })
    },

    awakeChildDeeply(){
      console.log('awakeChildDeeply')
    },

    selectHandler(){
      this.proto.select();
    },

    labelMaker(){
      let { paymentType, price }= this.info
      return paymentType=== 1? `[无] ${price}`: `[预] ${price}`;
    }
  }

}
</script>