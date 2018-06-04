<template>
        <div class="header">
           <div class="el-icon-star-on"></div>
           <div class="left">嘉琪管理后台</div>
           <div class="right">
           		<div class="icon el-icon-bell"></div>
           		<div class="icon el-icon-service"><span style="margin:0 0 0 10px;">账号名称</span></div>
           		<div v-on:click="submit" class="icon">退出</div>
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
     .header{height:50px;background-color:#545c64;color:#fff;line-height:50px;}
     .left{float: left; margin: 0 0 0 10px;}
     .right{float: right; margin: 0 100px 0 0;}
     .icon{float: left; margin: 0 30px 0 0; line-height: 50px;}
     .el-icon-star-on{float: left; margin: 0 0 0 160px; line-height: 50px;}
</style>
