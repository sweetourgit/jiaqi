<template>
  <div class="nav">
  <el-row class="tac">
  <el-col :span="12" class="col">  <!-- :default-active="this.$route.name"-->
    <el-menu   
      class="el-menu-vertical-demo"
      background-color="#0F2350"
      text-color="#B9B9BB"
      active-text-color="#fff"
      :router='isRouter'
      @open='handleOpen'
      ref='menu'
      >
      <el-submenu class="nav_mouseActive" v-for="(item,index) in menu" :key="index" :index="String(index)">
        <template slot="title">
          <i class='mouseActive' :id="'d'+index"></i><img :src="('../static/navLeft/'+item.img)" width="15px" alt="">
          <span class="actionName">{{item.name}}</span>
        </template>
        <template v-for="(data,index1) in item.items" style="min-height:50px">
          <el-menu-item :class="{'is-active': $route.path.split('/')[1] == data.uri.split('/')[1], 'suboptions' : true}" :index="data.name" :route="{path:data.uri}"  :key="index1">{{data.name}}</el-menu-item>
          <!--<el-menu-item class="suboptions" :index="data.value" :route="{path:data.router}"  :key="index1">{{data.value}}</el-menu-item>-->
        </template>
      </el-submenu>
    </el-menu>
  </el-col>
</el-row>
</div>
</template>

<script>
  export default {
  data(){
    return {
        menu:[],
        isRouter:true,
        menuNumber:[],
        index: '',
        img:['account.png','content.png','product.png','order.png','order.png']
    }
  },
  mounted(){
    this.getMainList();
  },
  methods:{
    //获取一级菜单
    getMainList(key,mainMenuId){
       this.$http.post(this.GLOBAL.serverSrc + '/org/jurisdiction/api/initmenu').then(res => {
                this.menu = res.data.objects;
                for(let i=0;i<this.menu.length;i++){
                   this.menu[i].img = this.img[i];
                }
        })
    },
    //获取二级菜单
    getMenuList(key,mainMenuId){
       this.$http.post(this.GLOBAL.serverSrc + '/org/jurisdiction/api/menus',{
             "object": {
                "id": mainMenuId,
              }
            }).then(res => {
              this.$set(this.menu[key],"items",res.data.objects);         
        })
    },
    handleOpen(key){
      this.getMenuList(key,this.menu[key].id);
      let aa = Number(key)
      this.menuNumber=[];
      for(let i=0;i<this.menu.length;i++){
        this.menuNumber[i] = i
      }
      if(this.menuNumber.indexOf(aa) !== -1){
        for(let i=0;i<this.menuNumber.length;i++){
          if(aa !== this.menuNumber[i]){
            let bb = String(this.menuNumber[i])
            this.$refs.menu.close(bb);
          }
        }
      }     
    }
  }
}
</script>
<style scoped>
.suboptions{
  float: left;
  min-width: 0 !important;
  max-width: 200px;
  width: 200px;
  background: #183984 !important
}
.el-menu-vertical-demo{
  height: 100%;
  width: 200px;
  user-select:none;
}
.tac{text-align: left;height:100%;}
.nav{height:100%;}
.col{height:100%;}
.actionName{margin-left: 7px;}
.twoLevel>>>.el-submenu__title{
  background: #183984 !important;
}
.suboptions:hover{
  color: #fff !important;
}
.el-submenu>>>.el-submenu__title:hover{
  color: #fff !important;
}
.nav_mouseActive:hover .mouseActive {
  content:'';
  position:absolute;
  top:0;
  left: 0;
  width:4px;
  height:100%;
  background:#3095FA;
  display:block;
}
  .is-active{
    color: #fff!important;
  }
</style>

