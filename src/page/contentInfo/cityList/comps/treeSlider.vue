<style lang="scss" scoped>
.tree-slider{
  position: relative;
  box-sizing: border-box;
  height: 100%;
  padding: 0 10px;
  padding-top: 32px;
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  & /deep/ *{
    font-size: 14px;
  }
  header{
    position: absolute;
    top: 0;
    right: 10px;
    height: 32px;
    line-height: 32px;
    text-align: right;
    box-sizing: border-box;
  }

}
</style>

<template>
  <div class="tree-slider">
    <header>
      <span>
        <i class="el-icon-refresh-left" style="font-size: 16px; cursor: pointer;" title="收起"></i>
      </span>
    </header>
    <main>
      <el-tree lazy node-key="id"
        :data="treeProto"
        :props="{ label: 'areaName', children: 'children' }"
        :load="loadNode"
        :expand-on-click-node="false"
        @node-click="nodeClick"
      ></el-tree>
    </main>
  </div>
</template>

<script>
import { getSonTreeByPidAction } from '../api'

export default {
  data(){
    return Object.assign(
      // 视图
      {
        inited: false,
      },
      // 数据
      {
        treeProto: []
      }
    )
  },

  methods: {
    init(){
      let pid= -1;
      this.inited= false;
      getSonTreeByPidAction(pid)
      .then(children => {
        this.treeProto.splice(0);
        this.treeProto.push(...this.makeStandardProto(null, children));
        this.inited= true;
      })
    },

    loadNode(node, resolve){
      if(!this.inited) return resolve([]);
      let { data }= node;
      if(data.inited) return resolve(data.children);
      getSonTreeByPidAction(data.id)
      .then(children => {
        let standardProtoList= this.makeStandardProto(data, children);
        data.inited= true;
        data.children.push(...standardProtoList);
        resolve(standardProtoList);
        console.log(data.children.length)
      })
    },

    makeStandardProto(parent, arr){
      return arr.map(el => {
        if(el.standard) return el;
        el.children? el.children.splice(0): el.children= [];
        el.inited= false; // 是否已在tree中初始化
        el.standard= true; // 是否已标准化
        el.parent= parent;
        el.level= parent? parent.level+ 1: 1;
        return el;
      })
    },

    nodeClick(data, node, vm){
      this.$emit('node-click', data);
    }
  }
}
</script>