<template>
  <div class="proList">
    <div class="cascade">
      <el-tree :data="data"class="treeDemo" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
	</div>
	<div class="check">
		<div class="checkTitle">
			<i class="el-icon-caret-right" style="color:#F38F00;"></i>
			<span>账户管理</span>
		</div>
		<el-checkbox v-for="item in fileList" :key="item.value">{{item.name}}</el-checkbox>
	</div>
  </div>
</template>

<script>
  export default {
	data(){
		return{

		fileList:[
			{name:'备选项'},
			{name:'123'},
			{name:'账户管理'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'123'},
			{name:'账户管理'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
			{name:'备选项'},
		],
			 data: [{
		      label: '全部',
		      children: [{
		        label: '账户管理',
		        children: [{
		          label: '用户列表'
		        },{
		          label: '组织列表'
		        },{
		          label: '职位列表'
		        },{
		          label: '角色列表'
		        }]
		      },{
		        label: '内容管理',
		        children: [{
		          label: '区域列表'
		        },{
		          label: '自定义地区'
		        },{
		          label: '景点列表'
		        },{
		          label: '标签列表'
		        },{
		          label: '素材列表'
		        },{
		          label: '酒店列表'
		        },{
		          label: '供应商列表'
		        },{
		          label: '商户列表'
		        },{
		          label: '功能列表'
		        },{
		          label: '权限列表'
		        }]
		      },{
		        label: '产品管理',
		        children: [{
		          label: '产品列表'
		        },{
		          label: '出行模板'
		        },{
		          label: '团期计划'
		        },{
		          label: '共享库存'
		        }]
		      },{
		        label: '订单管理',
		        children: [{
		          label: '订单管理'
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
      },
    }
  }
</script>

<style scoped>
.proList{font-family: '微软雅黑'; font-size: 11pt; margin: 0 0 100px 0;overflow: hidden;}
.cascade{ float: left; user-select: none; border: solid 2px #e6e6e6; position: absolute; width: 240px; height: 60%; overflow: auto; box-shadow:1px 1px 1px #EDEDED,1px -1px 1px #EDEDED,-1px 1px 1px #EDEDED,-1px -1px 1px #EDEDED; margin: 10px 0 0 0;}
.proList>>>.el-tree-node__label{ font-size: 16px;}
.treeDemo{margin: 20px 0 0 0;}
.check{float:left; margin: 0 0 0 280px; line-height: 40px; width: 800px;}
.checkTitle{font-size: 12pt; font-weight: bold;}
.el-checkbox>>>.el-checkbox{margin: 0 30px 0 0!important; }
</style>
