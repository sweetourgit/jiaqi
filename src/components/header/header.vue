<template>
        <div class="header">
          <div class="log">
           <!-- <div class="el-icon-star-on"></div> -->
            <div class="left">嘉麒管理后台</div>
          </div>
          <div class="right">
           	<el-badge :value="100" :max="99" class="icon el-icon-bell">
              <div class=""></div>
            </el-badge>
            <div class="vertical-line"></div>
           		<div class="icon el-icon-service"><span id="nameNum" @click="listUser">{{name}}</span></div>
              <div class="vertical-line1"></div>
           		<div v-on:click="submit" class="icon1">退出</div>
          </div>
        </div>
</template>

<script>
    export default {
    	data () {
    	    return {
            name: ''
	    }
	    },
      created (){
        this.name = localStorage.getItem('name')
      },
	    methods: {
          submit:function() {
            this.$router.push({ path: '/login' })
            localStorage.clear()
            sessionStorage.clear()
          },
          listUser() {
            this.$router.push({ path: '/accountInfor' })
          }
	        }
    }

</script>

<style scoped>
.header{height:60px;}
.left{margin: 20px; font-weight: 700px; font-size: 18px;text-align: center;}
.right{float: right; margin: 0 120px 0 0;}
.el-icon-bell{float:left;margin: 20px 50px 0 0;}
.vertical-line{float: left; width:30px; height:20px; border-left: solid 1px #CCCCCC;position: relative; top: 20px; right: 20px;}
.el-icon-service{float:left; position: relative; top: 20px; right: 20px;}
.vertical-line1{float: left; width:30px; height:20px; border-left: solid 1px #CCCCCC;margin: 20px 0 0 15px}
.icon1{float: right; margin: 20px 0 15px 0; cursor:pointer;}
.icon1:hover{color: #409EFF;}
.log{float: left; width: 200px; height: 60px; background: #0D142B;color:#fff;}
span:hover{color: #409EFF;}
#nameNum{margin:0 0 0 10px; cursor:pointer;}
.el-icon-bell{float:left;margin: 17px 50px 0 0;font-size:22px;}
</style>
