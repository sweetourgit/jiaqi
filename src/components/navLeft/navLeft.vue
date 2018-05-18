<template>
        <div class="nav">
          <ul class="nav-tab">
              <li v-for="(item,index) in category"  :class="{active:index == num}" @click="tab(index)">{{item.name}}</li>
          </ul>
          <div class="nav-tabCon">
            <div v-for='(itemCon,index) in category' v-show=" index == num">
               <div v-for="data in itemCon.items">
                 <router-link :to="data.router">{{data.value}}</router-link>
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
                        value: '用户列表',
                        router:'userList'
                    },
                    { 
                        value: '组织列表',
                        router:'organList'
                    },
                    { 
                        value: '角色模板',
                        router:'role'
                    },
                    { 
                        value: '权限列表',
                        router:'perList'
                    }
                ]
            },
            {
                name: '个人中心',
                items: [
                     {
                        value: '账户信息',
                        router:'accountInfor'
                     },
                     {
                        value: '密码修改',
                        router:'pwModifi'
                     }
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
    .nav{cursor:pointer;font-size:25px;line-height:50px;height:100%}
    .nav-tab{float:left;width:200px;background-color:#7b7e9d;color:#fff;margin:0;padding:0;height:800px;}
    .nav-tabCon{float:left;padding-left:20px}
</style>
