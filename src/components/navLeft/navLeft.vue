<template>
        <div class="nav">
          <ul class="nav-tab">
              <li class="el-icon-setting" v-for="(item,index) in category"  :class="{active:index == num}" @click="tab(index)">   {{item.name}}</li>
          </ul>
          <div class="nav-tabCon">
            <div v-for='(itemCon,index) in category' v-show="index == num">
               <div v-for="data in itemCon.items">
                  <div class="title-bg">{{data.title}}</div>
                  <div v-for="list in data.lists">
                     <router-link :to="list.router">{{list.value}}</router-link>
                 </div>
               </div>
            </div>
          </div>
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
            }
        ],
        num: 0
    }
  },
  methods: {
        tab(index) {
            this.num = index;
        }
  }
}



</script>
<style scoped>
    .nav{font-size:16px;line-height:50px;height:100%}
    .nav-tab{float:left;width:150px;background-color:#545c64;color:#fff;margin:0;padding:0;height:100%;cursor:pointer;}
    .nav-tabCon{float:left;padding-left:0px}
    .title-bg{background-color:#eee;width:150px}
    .router-link-active {color:#eb663d;text-decoration:none;}
    a{color:#000;text-decoration:none;}
</style>

