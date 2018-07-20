<template>
<div class="labelList">
	<!--添加标签按钮-->
    <div class="add_button"><el-button @click="addbutton" type="primary">添加标签</el-button></div>
    <!--添加标签按钮结束-->
    <div class="search"><el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input></div>
  	<!--列表-->
  	<div class="block">
  		<el-tree class="filter-tree" :data="data4":props="defaultProps" default-expand-all :filter-node-method="filterNode" :render-content="renderContent"ref="tree2" 
  :expand-on-click-node="false"></el-tree>
  	</div>
  
  
  <!--添加标签弹窗-->
    <div class="add" v-show="addshow">
      <div class="label">
        <div class="left">添加标签</div>
        <div @click="shut" class="right">×</div>
      </div>
      <div class="content">
        <div class="according">
          <div class="text">标签类别名称:</div>
          <el-input class="input" v-model="isinput" placeholder=""></el-input>
        </div>
        <div class="judge">
          <el-button @click="shut">取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </div>
    </div>
    <!--添加标签弹窗结束-->
    <!--编辑标签弹窗-->
    <div class="add" v-show="editorshow">
      <div class="label">
        <div class="left">编辑标签</div>
        <div @click="close" class="right">×</div>
      </div>
      <div class="content">
        <div class="according">
          <div class="text">标签类别名称:</div>
          <el-input class="input" v-model="input" placeholder=""></el-input>
        </div>
        <div class="judge">
          <el-button @click="close">取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </div>
    </div>
    <!--编辑标签弹窗结束-->

 
</div>
</template>










<script>
let id = 1000;
  export default {
    data() {      
        const data = [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }];
        return {
          filterText: '',
          data4: JSON.parse(JSON.stringify(data)),
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          addshow:false,
          editorshow:false,
        }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
      append(data) {
        const newChild = { id: id++, label: '级别', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      isshow(node,data){
          this.editorshow=true;
      },

      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span style="margin-left:10px;">
              <el-button class="el-icon-edit" size="mini" type="text" on-click={ () => this.isshow(node, data) }></el-button>
              <el-button class="el-icon-remove-outline" size="mini" type="text" on-click={ () => this.remove(node, data) }></el-button>
              <el-button class="el-icon-circle-plus-outline" size="mini" type="text" on-click={ () => this.append(data) }></el-button>
            </span>
          </span>);
      },
      addbutton(){
        this.addshow=true;
      },
      shut(){
        this.addshow=false;
      },
      close(){
        this.editorshow=false;
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    }
}

   

</script>














<style scoped>
	.labelList{ font-family: '微软雅黑'; font-size: 11pt; position: relative; margin: 0 0 100px 0;}

	.add_button{ float: left;}

	.block{clear: both; padding:30px 0 0 0; font-size: 13pt;}

  .custom-tree-node {flex: 1;display: flex;align-items: center;justify-content: space-between;font-size: 14px;padding-right: 8px;}

	.search{width: 200px; padding: 30px 0 0 0; clear: both;}

  .add{width: 450px; height: 250px;margin: auto;position: fixed; top:50%; left:50%; margin-top:-125px; margin-left:-225px; background: #fff; overflow: hidden; border:1px solid #eeeeee; border-radius: 3px;}
  .label{ background: #f6f6f6; border-bottom: 1px solid #eee;height: 40px; line-height: 40px; width: 450px;}
  .left{ float: left; margin: 0 0 0 10px; }
  .right{float: right; margin: 0 10px 0 0;font-size: 20pt;cursor:pointer; }
  .content{ width: 310px; overflow: hidden;margin-left:auto;margin-right:auto;}
  .according{margin: 50px 0 0 0;margin-left:auto;margin-right:auto;}
  .text{float: left; line-height: 40px;}
  .input{float: left; width: 180px; margin: 0 0 0 15px;}
  .judge{padding: 30px 0 0 0; clear: both;}
   

	
	
</style>




