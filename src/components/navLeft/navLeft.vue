<template>
  <div class="nav">
  <el-row class="tac">
  <el-col :span="12" class="col">
    <el-menu
      :default-active="this.$route.name"
      class="el-menu-vertical-demo"
      background-color="#0F2350"
      text-color="#B9B9BB"
      active-text-color="#fff"
      :router='isRouter'
      @open='handleOpen'
      ref='menu'
      >
      <el-submenu class="nav_mouseActive" v-for="(item,index) in category" :key="index" :index="String(index)">
        <template slot="title">
          <i class='mouseActive' :id="'d'+index"></i><img :src="('../static/navLeft/'+item.img)" width="15px" alt="">
          <span class="actionName">{{item.name}}</span>
        </template>
        <template v-for="(data,index1) in item.items">
          <el-menu-item class="suboptions" :index="data.value" :route="{path:data.router}"  :key="index1">{{data.value}}</el-menu-item>
        </template>
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
              img: 'account.png',
              items: [
                {
                  value: '用户列表',
                  router:'/userList'
                },
                {
                  value: '组织列表',
                  router:'/organList'
                },
                {
                  value: '职位列表',
                  router:'/positionList'
                },
                {
                  value: '角色模板',
                  router:'/role'
                }
              ]
            },
            {
              name: '内容管理',
              img: 'content.png',
              items: [
                {
                  value: '区域列表',
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
                },
                {
                  value: '供应商信息',
                  router:'/supplierInfo'
                },
                {
                  value: '商户信息',
                  router:'/merchantInfo'
                },
                {
                  value: '功能管理',
                  router:'/priList'
                },{
                  value: '权限列表',
                  router:'/proList'
                },{
                  value: '黑名单',
                  router:'/blacklist'
                }
              ]
            },
            {
              name: '产品管理',
              img: 'product.png',
              items: [
                {
                  value: '产品列表',
                  router:'/productList'
                },
                {
                  value: '出行模板',
                  router:'/travelTemplate'
                },
                {
                  value: '团期计划',
                  router:'/regimentPlan/teamPlanList'
                },
                {
                  value: '共享库存',
                  router:'/sharedInventory'
                },
              ]
            },
            {
              name: '订单管理',
              img: 'order.png',
              items: [
                {
                  value: '订单管理',
                  router:'/orderList'
                }
              ],
            },
          {
            name: '财务管理',
            img: 'order.png',
            items: [
              {
                value: '无收入借款管理',
                router:'/loanManagement'
              },
              {
                value: '预付款管理',
                router:'/advancePayment'
              },
              {
                value: '收款管理',
                router:'/collectionManagement'
              },
              {
                value: '报销管理',
                router:'/reimburseManagement'
              },
              {
                value: '欠款管理',
                router:'/arrearsManagement'
              },
              {
                value: '银行账号管理',
                router:'/bankAccount'
              },
            ],
          }
        ],
        isRouter:true,
        menuNumber:[],
        index: ''
    }
  },
  methods: {
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
</style>

