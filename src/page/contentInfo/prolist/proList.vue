<template>
  <div class="proList">
    <div class="cascade">
      <el-tree :data="data" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
	</div>
  </div>
</template>

<script>
  export default {
	data(){
		return{
			 data: [{
		      label: '一级 1',
		      children: [{
		        label: '二级 1-1',
		        children: [{
		          label: '三级 1-1-1'
		        }]
		      }]
		    }, {
		      label: '一级 2',
		      children: [{
		        label: '二级 2-1',
		        children: [{
		          label: '三级 2-1-1'
		        }]
		      }, {
		        label: '二级 2-2',
		        children: [{
		          label: '三级 2-2-1'
		        }]
		      }]
		    }, {
		      label: '一级 3',
		      children: [{
		        label: '二级 3-1',
		        children: [{
		          label: '三级 3-1-1'
		        }]
		      }, {
		        label: '二级 3-2',
		        children: [{
		          label: '三级 3-2-1'
		        }]
		      }]
		    }],
		    defaultProps: {
		      children: 'children',
		      label: 'label'
		    }
		}
	},
	methods: {
      handleNodeClick(data) {
        console.log(data);
      }
    }
  }
</script>

<style scoped>
.proList{font-family: '微软雅黑'; font-size: 11pt; margin: 0 0 100px 0;overflow: hidden;}
.cascade{ float: left; user-select: none; border: solid 2px #e6e6e6; position: absolute; width: 240px; height: 60%; overflow: auto; box-shadow:1px 1px 1px #EDEDED,1px -1px 1px #EDEDED,-1px 1px 1px #EDEDED,-1px -1px 1px #EDEDED;
}
</style>
