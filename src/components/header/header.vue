<template>
        <div class="header">
          <div class="log">
           <!-- <div class="el-icon-star-on"></div> -->
            <div class="left">嘉琪管理后台</div>
          </div>
          <div class="right">
           	<div class="icon el-icon-bell"></div>
            <div class="aa"></div>
           		<div class="icon el-icon-service"><span style="margin:0 0 0 10px;">账号名称</span></div>
              <div class="bb"></div>
           		<div v-on:click="submit" class="icon1">退出</div>
          </div>
        </div>
</template>

<script>
    export default {
    	data () {
    	    return {
	        
	    }
	    },
	    methods: {
	            submit:function() {
	                this.$router.push({ path: '/login' })
	            }
	        }
    }

</script>

<style scoped>
    .header{height:60px;}
    .left{margin: 20px; font-weight: 700px; font-size: 18px;}
    .right{float: right; margin: 0 120px 0 0;}
    .el-icon-bell{float:left;margin: 20px 50px 0 0;}
    .aa{float: left; width:30px; height:20px; border-left: solid 1px #CCCCCC;position: relative; top: 20px; right: 20px;}
    .el-icon-service{float:left; position: relative; top: 20px; right: 20px;}
    .bb{float: left; width:30px; height:20px; border-left: solid 1px #CCCCCC;margin: 20px 0 0 15px}
    .icon1{float: right; margin: 20px 0 15px 0;}
    .log{float: left; width: 200px; height: 60px; background: #0D142B;color:#fff;}
</style>
