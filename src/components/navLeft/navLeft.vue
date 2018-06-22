<template>
  <div class="nav">
  <el-row class="tac">
  <el-col :span="12" class="col">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#0F2350"
      text-color="#fff"
      active-text-color="#3095FA"
      :router='isRouter'
      @open='handleOpen'
      ref='menu'
      >
      <el-submenu v-for="(item,index) in category" :key="index" :index="String(index)" @mouseover.native="mouseOpen(index)">
        <template slot="title">
          <i :class='{ mouseActive : index == mouseActive}' :id="'d'+index"></i><img :src="('../static/navLeft/'+item.img)" width="15px" alt="">
          <span class="actionName">{{item.name}}</span>
        </template>
        <el-submenu :index="(index+ '-' +index1)" v-for="(data,index1) in item.items" :key="index1">
          <template slot="title">{{data.title}}</template>
          <el-menu-item class="suboptions" :index="(index+ '-' +index1+ '-' +index2)" :route="{path:list.router}" v-for="(list,index2) in data.lists" :key="index2">{{list.value}}</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </el-col>
</el-row>
</div>
</template>

<script>
  export default {
  data () {
    return {
        category: [
            {
                name: '账户管理',
                img: '账户管理.png',
                items: [
                    {
                    title:'用户管理',
                    lists:[{
                        value: '用户列表',
                        router:'/userList'
                    }
                    ]},
                {
                title:'组织管理',
                lists:[{
                        value: '组织列表',
                        router:'/organList'
                    },
                    {
                        value: '职位列表',
                        router:'/positionList'
                    }
                    ]},
                {
                title:'权限管理',
                lists:[{
                        value: '角色模板',
                        router:'/role'
                    },
                    {
                        value: '权限列表',
                        router:'/perList'
                    }]
                    }
                ]
            },
            {
                name: '个人中心',
                img: '个人中心.png',
                items: [
                    {
                    title:'账户设置',
                    lists:[{
                        value: '账户信息',
                        router:'/accountInfor'
                     },
                     {
                        value: '密码修改',
                        router:'/pwModifi'
                     }
                    ]}
                ]
            },
            {
                name: '内容信息',
                img: '内容信息.png',
                items: [
                    {
                    title:'内容信息',
                    lists:[{
                        value: '城市列表',
                        router:'/cityList'
                     },
                     {
                        value: '自定义地区',
                        router:'/customArea'
                     },
                     {
                        value: '景点列表',
                        router:'/scenicList'
                     },
                     {
                        value: '标签列表',
                        router:'/labelList'
                     },
                     {
                        value: '素材列表',
                        router:'/materialList'
                     },
                     {
                        value: '酒店列表',
                        router:'/hotelList'
                     }
                    ]}
                ]
            },
        ],
        isRouter:true,
        mouseActive:0,
        menuNumber:[],
    }
  },
  methods: {   
    mouseOpen(key) {
      this.mouseActive = key;
    },
    handleOpen(key){
      let aa = Number(key)
      for(let i=0;i<this.category.length;i++){
        this.menuNumber[i] = i
      }
      if(this.menuNumber.indexOf(aa) !== -1){
        for(let i=0;i<this.menuNumber.length;i++){
          if(aa !== this.menuNumber[i]){
            let bb = String(this.menuNumber[i])
            this.$refs.menu.close(bb)
          }
        }
      }
    },
  }
}
</script>
<style scoped>
.suboptions{
  float: left;
  min-width: 0 !important;
  max-width: 200px;
  width: 200px;
}
.el-menu-vertical-demo{
  height: 100%;
  width: 200px;
  user-select:none;
}
.mouseActive{
  content:'';
  position:absolute;
  top:0;
  left: 0;
  width:4px;
  height:100%;
  background:#3095FA;
  display:block; 
}
.tac{text-align: left;height:100%;}
.nav{height:100%;}
.col{height:100%;}
.actionName{margin-left: 7px;}
</style>

