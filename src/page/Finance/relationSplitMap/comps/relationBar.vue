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
        [预]123
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
      v-if="!isRoot"
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
        [预]123
      </div>
    </footer>
  </div>  
</template>

<script>
import { getRoot } from '../api'
import { RelationBar } from '../dictionary'

export default {

  name: 'RelationBar',

  props: {
    isRoot: Boolean,  // 是否是根节点
    proto: Object,
    state: Boolean,
    expended: Boolean,
    hoverd: Boolean,
    selected: Boolean,
    // data: Object,
    child: Object,
  },

  data(){
    return {

    }
  },

  methods: {
    awakeChild(){
      let child;
      if(this.child){
        this.child.state= !this.child.state;
        return this.$emit('update:expended', this.child.state);
      }
      getRoot()
      .then(res => {
        child= new RelationBar();
        child.state= true;
        this.$emit('update:expended', true);
        this.$emit('update:child', child);
      })
    },

    awakeChildDeeply(){
      console.log('awakeChildDeeply')
    },

    selectHandler(){
      let bol= this.selected;
      // 如果当前项为选中项
      if(bol) return this.$emit('update:selected', false);
      // 如果当前项不是选中项, 先重置当前选中项
      if(RelationBar.currentSelect)RelationBar.currentSelect.selected= false;
      RelationBar.currentSelect= this.proto;
      this.$emit('update:selected', true);
    }
  }

}
</script>