<template>
  <div class="nav">
  <el-row class="tac">
  <el-col :span="12" class="col">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#27D8C9"
      :router='isRouter'
      @open='handleOpen'
      ref='menu'
      >
      <el-submenu v-for="(item,index) in category" :key="index" :index="String(index)" @mouseover.native="mouseOpen(index)">
        <template slot="title">
          <i :class='{ mouseActive : index == mouseActive}' :id="'d'+index"></i><i class="el-icon-setting"></i>
          <span>{{item.name}}</span>
        </template>
        <el-submenu :index="(index+ '-' +index1)" v-for="(data,index1) in item.items" :key="index1">
          <template slot="title">{{data.title}}</template>
          <el-menu-item class="suboptions" :index="(list.router)" v-for="(list,index2) in data.lists" :key="index2">{{list.value}}</el-menu-item>
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
                items: [
                    {
                    title:'账户信息',
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
  background:#27D8C9;
  display:block; 
}
.tac{text-align: left;height:100%;}
.nav{height:100%;}
.col{height:100%;}
</style>

