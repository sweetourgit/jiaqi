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
        <i 
          v-show="!isLoading"
          :class="[expended? 'el-icon-minus': 'el-icon-plus']">
        </i>
        <i class="el-icon-loading"
          v-show="isLoading">
        </i>
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
        :proto="child"
        :brother="subChild">
      </relation-bar>
    </main>
    <footer
      v-if="brother"
      @mouseover="$emit('update:hoverd', true)"
      @mouseout="$emit('update:hoverd', false)">
      <div class="icon-outer"
        @click.exact="awakeChild"
        @click.ctrl.exact="awakeChildDeeply">
        <i 
          v-show="!isLoading"
          :class="[expended? 'el-icon-minus': 'el-icon-plus']">
        </i>
        <i class="el-icon-loading"
          v-show="isLoading">
        </i>
      </div>
      <div 
        :class="['label', hoverd && 'hoverd', selected && 'selected']"
        @click="selectHandler">
        {{ labelMaker(brother) }}
      </div>
    </footer>
  </div>  
</template>

<script>
import { getNode } from '../api'
import { RelationBar, relationBarMaker } from '../dictionary'

export default {

  name: 'RelationBar',

  props: Object.assign(
    // 值传
    {
      isRoot: Boolean,  // 是否是根节点
      proto: Object,
      brother: Object
    },
    // .sync中拆分出来的
    {
      ...new RelationBar()
    }
  ),

  created(){
    if(this.isRoot) this.proto.mountVm(this);
  },

  data(){
    return {

    }
  },

  methods: {
    awakeChild(){
      this.proto.awakeChild();
    },

    awakeChildDeeply(){
      console.log('awakeChildDeeply')
    },

    selectHandler(){
      let result= this.proto.select();
    },

    labelMaker(info){
      let source= info || this.info;
      let { paymentType, price }= source;
      return paymentType=== 1? `[无] ${price}`: `[预] ${price}`;
    }
  }

}
</script>