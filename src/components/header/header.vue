<template>
    <div class="header">
      <div class="log">
        <!-- <div class="el-icon-star-on"></div> -->
        <div class="left">嘉麒管理后台</div>
      </div>
      <div class="right">

        <!-- bugReporter -->
        <input ref="clipInput" type="text" id="clip" value="123" style="height: 1px; width: 1px; opacity: 0;" />
        <button ref="clipBtn" data-clipboard-target="#clip" class="clip-btn" style="height: 1px; width: 1px; opacity: 0;"></button>
        <!-- bugReporter -->
        
        <el-badge :value="100" :max="99" class="icon el-icon-bell">
          <div style="position:absolute;width:30px;height:30px;top:0;" @click="bugReporter"></div>
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
      
      mounted(){
        new ClipboardJS('.clip-btn');
      },

	    methods: {
        submit:function() {
          this.$router.push({ path: '/login' })
          localStorage.clear()
          sessionStorage.clear()
        },
        listUser() {
          this.$router.push({ path: '/accountInfor' })
        },
        bugReporter(){
          let { path, query, name }= this.$route;
          let queryStr= '?';
          Object.keys(query).forEach(attr => {
            queryStr+= `${attr}=${query[attr]}&`
          })
          queryStr= queryStr.substring(0, queryStr.length- 1);
          let bugStr= `${name}：${path}${queryStr}`;
          this.$refs.clipInput.value= bugStr;
          this.$refs.clipBtn.click();
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
