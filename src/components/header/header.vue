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
        
        <!-- <el-badge :value="100" :max="99" class="icon el-icon-bell"> -->
        <el-badge class="icon el-icon-bell">
          <div style="position:absolute;width:30px;height:30px;top:0;" @click="bugReporter"></div>
        </el-badge>
        <div class="vertical-line"></div>
        <div class="icon el-icon-user"><span @click="onlineList">当前在线人数：{{onlineNumber}}</span></div>
        <div class="vertical-line1"></div>
        <div class="icon el-icon-service"><span id="nameNum" @click="listUser">{{name}}</span></div>
        <div class="vertical-line1"></div>
        <div v-on:click="submit" class="icon1">退出</div>
      </div>
      <el-dialog title="在线人员" custom-class="city_list" :visible.sync="dialogFormVisible" width="970px" style="margin-top:-70px">
           <div style="padding-bottom:40px;overflow: hidden">
             <div class="peo-list" v-for="item in peoList">{{item.orgName}}-{{item.name}}</div>
           </div>
      </el-dialog>
    </div> 
</template>

<script>
    export default {
    	data () {
    	  return {
          name: '',
          timeName: null,
          onlineNumber: 0,
          dialogFormVisible: false,
          peoList: [],
	      }
	    },
      created () {
        this.name = localStorage.getItem('name')
      },
      
      mounted () {
        new ClipboardJS('.clip-btn');
        this.play();
        this.getonlineNumber();
      },
	    methods: {
        submit:function() {
          this.$router.push({ path: '/login' })
          localStorage.clear();
          sessionStorage.clear();
          window.clearInterval(this.timeName);  
        },
        listUser () {
          this.$router.push({ path: '/accountInfor' })
        },
        bugReporter () {
          let { path, query, name }= this.$route;
          let queryStr= '?';
          Object.keys(query).forEach(attr => {
            queryStr+= `${attr}=${query[attr]}&`
          })
          queryStr= queryStr.substring(0, queryStr.length- 1);
          let bugStr= `${name}：${path}${queryStr}`;
          this.$refs.clipInput.value= bugStr;
          this.$refs.clipBtn.click();
        },
        play () {
          this.timeName = window.setInterval(() => {
            setTimeout(this.getonlineNumber(), 0)
          },60000)
        },
        getonlineNumber () {
          this.$http.post(this.GLOBAL.serverSrc + '/org/user/api/online').then(res => {
            this.onlineNumber = res.data.count;
            }).catch(err => {
              console.log(err)
            })
        },
        onlineList () {
           this.$http.post(this.GLOBAL.serverSrc + '/org/jurisdiction/api/ollist').then(res => {
              this.peoList = res.data.objects;
              this.dialogFormVisible = true;
            }).catch(err => {
                console.log(err)
           })           
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
.el-icon-user{float:left; position: relative; top: 20px; right: 20px;cursor: pointer;}
.icon1{float: right; margin: 20px 0 15px 0; cursor:pointer;}
.icon1:hover{color: #409EFF;}
.log{float: left; width: 200px; height: 60px; background: #0D142B;color:#fff;}
span:hover{color: #409EFF;}
#nameNum{margin:0 0 0 10px; cursor:pointer;}
.el-icon-bell{float:left;margin: 17px 50px 0 0;font-size:22px;}
.peo-list{float:left;width:160px;margin:3px 0 3px 25px;}
</style>