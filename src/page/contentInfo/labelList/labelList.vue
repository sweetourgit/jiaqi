<template>
	<div class="tagList">
		<!--添加标签按钮-->
	    <el-button @click="addbutton" class="button" type="primary">添加标签</el-button>
	    <!--表格开始-->
	    <!--标题-->
		<table class="title" cellpadding="0" cellspacing="1">
			<tr>
				<td width="30%">标签类别</td>
				<td width="30%">分类</td>
				<td width="40%">具体名称</td>
			</tr>
		</table>
		<!--产品标签-->
		<table class="product" cellpadding="0" cellspacing="0" v-if="seen">
			<tr>
				<td width="30%" class="butts_01" rowspan="5">产品标签
					<span class="butts">
						<div class="icon">
			                <i @click="open1()" class="el-icon-edit"></i>
			                <i @click="open6()" class="el-icon-remove-outline"></i>
			                <i @click="open2()" class="el-icon-circle-plus-outline"></i>
		                </div>
	                </span>
				</td>
			</tr>
			<!--产品类型-->
			<tr v-if="genre">
				<td width="30%" class="butts_01">产品类型
					<span class="butts">
						<div class="icon">
			                <i @click="open3()" class="el-icon-edit"></i>
			                <i @click="open7()" class="el-icon-remove-outline"></i>
			                <i @click="open4()" class="el-icon-circle-plus-outline"></i>
		                </div>
	                </span>
				</td>
				<td width="40%">
					<table class="type" border="0" cellpadding="0" cellspacing="0">
						<!--第一条-->
						<tr class="bottom">
							<td>
								<div class="designation">跟团游
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">周边游
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">自由行
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">签证
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
							</td>
						</tr>
						<!--第一条结束-->
						<!--第一条-->
						<tr>
							<td>
								<div class="designation">机票
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
							</td>
						</tr>
						<!--第二条结束-->
					</table>
				</td>
			</tr>
			<!--产品类型结束-->
			<!--产品主题-->
			<tr>
				<td width="30%" class="butts_01">产品主题
					<span class="butts">
						<div class="icon">
			                <i @click="open3()" class="el-icon-edit"></i>
			                <i class="el-icon-remove-outline"></i>
			                <i  @click="open4()" class="el-icon-circle-plus-outline"></i>
		                </div>
	                </span>
				</td>
				<td width="40%">
					<table class="type" border="0" cellpadding="0" cellspacing="0">
						<!--第一条-->
						<tr class="bottom">
							<td>
								<div class="designation">亲子游
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">毕业旅行
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">浪漫蜜月
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">红色之旅
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
							</td>
						</tr>
						<!--第一条结束-->
						<!--第二条-->
						<tr>
							<td>
								<div class="designation">海岛
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">父母安心游
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
							</td>
						</tr>
						<!--第二条结束-->
					</table>
				</td>
			</tr>
			<!--产品主题结束-->
			<!--产品特色-->
			<tr>
				<td width="30%" class="butts_01">产品特色
					<span class="butts">
						<div class="icon">
			                <i @click="open3()" class="el-icon-edit"></i>
			                <i class="el-icon-remove-outline"></i>
			                <i @click="open4()" class="el-icon-circle-plus-outline"></i>
		                </div>
	                </span>
				</td>
				<td width="40%">
					<table class="type" border="0" cellpadding="0" cellspacing="0">
						<!--第一条-->
						<tr class="bottom">
							<td>
								<div class="designation">免签
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">超值行程
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">休闲购物
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">观光美食
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
							</td>
						</tr>
						<!--第一条结束-->
						<!--第二条-->
						<tr>
							<td>
								<div class="designation">纯玩无购物
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">全程无自费
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
							</td>
						</tr>
						<!--第二条结束-->
					</table>
				</td>
			</tr>
			<!--产品特色结束-->
			<!--运营标签-->
			<tr>
				<td width="30%" class="butts_01">运营标签
					<span class="butts">
						<div class="icon">
			                <i @click="open3()" class="el-icon-edit"></i>
			                <i class="el-icon-remove-outline"></i>
			                <i @click="open4()" class="el-icon-circle-plus-outline"></i>
		                </div>
	                </span>
				</td>
				<td width="40%">
					<table class="type" border="0" cellpadding="0" cellspacing="0">
						<!--第一条-->
						<tr>
							<td>
								<div class="designation">热门
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">特价
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
								<div class="designation">促销
									<span class="designation_01">
										<div class="icon_01">
							                <i @click="open5()" class="el-icon-edit"></i>
							                <i class="el-icon-remove-outline"></i>
						                </div>
					                </span>
								</div>
							</td>
						</tr>
						<!--第一条结束-->
					</table>
				</td>
			</tr>
			<!--运营标签结束-->
		</table>
		<!--产品结束-->
		







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
		<!--添加分类弹窗-->
		<div class="add" v-show="classshow">
			<div class="label">
				<div class="left">添加分类</div>
				<div @click="down" class="right">×</div>
			</div>
			<div class="content">
				<div class="according">
					<div class="text">分类名称:</div>
					<el-input class="input" v-model="input" placeholder=""></el-input>
				</div>
				<div class="judge">
					<el-button @click="down">取消</el-button>
	  				<el-button type="primary">确定</el-button>
				</div>
			</div>
		</div>
		<!--添加分类弹窗结束-->
		<!--编辑分类弹窗-->
		<div class="add" v-show="kindshow">
			<div class="label">
				<div class="left">编辑分类</div>
				<div @click="occlude" class="right">×</div>
			</div>
			<div class="content">
				<div class="according">
					<div class="text">分类名称:</div>
					<el-input class="input" v-model="input" placeholder=""></el-input>
				</div>
				<div class="judge">
					<el-button @click="occlude">取消</el-button>
	  				<el-button type="primary">确定</el-button>
				</div>
			</div>
		</div>
		<!--编辑分类弹窗结束-->
		<!--编辑具体名称弹窗-->
		<div class="add" v-show="nameshow">
			<div class="label">
				<div class="left">编辑具体名称</div>
				<div @click="cut" class="right">×</div>
			</div>
			<div class="content">
				<div class="according">
					<div class="text">具体名称:</div>
					<el-input class="input" v-model="input" placeholder=""></el-input>
				</div>
				<div class="judge">
					<el-button @click="cut">取消</el-button>
	  				<el-button type="primary">确定</el-button>
				</div>
			</div>
		</div>
		<!--编辑具体名称弹窗结束-->
		<!--是否删除弹窗-->
		<div class="add" v-show="tableshow">
			<div class="label">
				<div class="left">删除标签</div>
				<div @click="turn_off" class="right">×</div>
			</div>
			<div class="content">
				<div class="specific">是否删除标签</div>
				<div class="judge">
					<el-button @click="turn_off">取消</el-button>
	  				<el-button @click="confirm" type="primary">确定</el-button>
				</div>
			</div>
		</div>
		<!--是否删除弹窗结束  -->
	</div>




</template>










<script>
  export default {
  data () {
    return {
    	addshow:false,
    	editorshow:false,
    	classshow:false,
    	kindshow:false,
    	nameshow:false,
    	tableshow:false,
    	seen:true,
    	genre:true,
    	theme:true,
    	}
    
	},
	methods: {
      open1(){
      	this.editorshow=true;
      },
      close(){
      	this.editorshow=false;
      },
      open2(){
      	this.addshow=true;
      },
      shut(){
      	this.addshow=false;
      },
      open3(){
      	this.kindshow=true;
      },
      occlude(){
      	this.kindshow=false;
      },
      open4(){
      	this.classshow=true;
      },
      down(){
      	this.classshow=false;
      },
      open5(){
      	this.nameshow=true;
      },
      cut(){
      	this.nameshow=false;
      },
      open6(){
      	this.tableshow=true;
      },
      turn_off(){
      	this.tableshow=false;
      },
      confirm(){
      	this.seen=false;
      	this.tableshow=false;
      },
      open7(){
      	this.genre=false;
      },
      addbutton(){
      	this.addshow=true;
      }

   
   

    	}
}

   

</script>














<style scoped>
	.tagList{margin: 0 0 100px 0;}
	.button{float: left; clear: both; margin: 20px 0 20px 0;}
	.title{text-align: center; line-height: 33px; background: #e6e6e6; clear: both; overflow: hidden; width: 100%;}
	.title tr{background: #fff;}
	.title td{background: #f6f6f6;}

	.product{text-align: center; line-height: 33px;overflow: hidden; width: 100%; border-left: 1px solid #e6e6e6;}
	.product td{ border-bottom: 1px solid #e6e6e6;  border-right: 1px solid #e6e6e6;}
	.type{text-align: center; line-height: 33px;overflow: hidden; width: 100%;border-collapse: collapse;border-bottom: 0px solid #e6e6e6;}
	.bottom{border-bottom: 1px solid #e6e6e6;}

	.butts{visibility: hidden;position: relative;}
	.butts_01:hover .butts{ visibility: visible;}
	.icon{position: absolute; top:-5px; right:-60px; width:60px; color: #c2c2c2;}

	.designation{float: left;text-align:left; width: 120px; margin: 0 0 0 10px;}
	.designation_01{visibility: hidden;position: relative;}
	.designation:hover .designation_01{visibility: visible;}
	.icon_01{position: absolute; top:-5px; right:-60px; width:60px; color: #c2c2c2;}

	.add{width: 450px; height: 250px;margin: auto;position: fixed; top:50%; left:50%; margin-top:-125px; margin-left:-225px; background: #fff; overflow: hidden; border:1px solid #eeeeee; border-radius: 3px;}
	.label{ background: #f6f6f6; border-bottom: 1px solid #eee;height: 40px; line-height: 40px; width: 450px;}
	.left{ float: left; margin: 0 0 0 10px; }
	.right{float: right; margin: 0 10px 0 0;font-size: 20pt;cursor:pointer; }
	.content{ width: 310px; overflow: hidden;margin-left:auto;margin-right:auto;}
	.according{margin: 50px 0 0 0;margin-left:auto;margin-right:auto;}
	.text{float: left; line-height: 40px;}
	.input{float: left; width: 180px; margin: 0 0 0 15px;}
	.judge{padding: 30px 0 0 0; clear: both;}
	.specific{text-align: center; margin: 50px 0 0 0;}



	.show{display: block;}
	.hide{display: none;}

</style>
