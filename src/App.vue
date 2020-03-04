<template>
  <div id="app">
    <el-header class="page-header"><page-header v-if="$route.meta.keepAlive"></page-header></el-header>
    <el-container class="container">
       <el-aside class="navigation" v-if="$route.meta.keepAlive"><nav-left></nav-left></el-aside>
       <el-main class="content-body">
        <div class="content-position">{{this.$route.name}}</div>
          <div class="el-mainl content-body1">
            <router-view></router-view>
          </div>
         </el-main>
    </el-container>
  </div>
</template>


<script>
import pageHeader from './components/header/header'
import navLeft from './components/navLeft/navLeft'
export default {
  name: 'App',
  components: {
    pageHeader,
    navLeft
  },
  created() {
    this.getBrowserInfo()
  },
  watch:{
    $route: {
    handler: function(val, oldVal){
          if(val.fullPath != "/login"){
             let jurisdiction = JSON.parse(sessionStorage.getItem('jurisdiction'));
             let butPermission=[];
             for (let i = 0;i < jurisdiction.length;i++){
                if(jurisdiction[i].Uri == val.fullPath){
                  if(jurisdiction[i].Act.length > 0){
                    for (let j = 0;j < jurisdiction[i].Act.length;j++){
                       butPermission.push(jurisdiction[i].Act[j].Characteristic);
                     }
                   }
                }
             }
             sessionStorage.setItem('butPermission',JSON.stringify(butPermission));
          }
        },
        deep: true
      }
  },
  methods: {
    getBrowserInfo() {
      let ua = navigator.userAgent.toLocaleLowerCase();
      if (!(ua.match(/chrome/) != null && navigator.mimeTypes.length == 4)) {
        this.$alert('请使用谷歌浏览器访问该页面', '提示', {
          dangerouslyUseHTMLString: true,
          showClose: false,
          callback: () => {
            window.location.href = 'https://www.google.cn/intl/zh-CN/chrome/'
          }
        });
      }
    }
  }
}
</script>


<style>
#app {
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  height: 100%;
  min-width: 1440px;
  overflow-x:auto;
  overflow-y:hidden;
}
body{
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-y:hidden;
}
html{
  height: 100%;
}
.el-mainl {
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 20px;
}
.router{float:left;margin:50px;font-size:25px;}
.page-header{height:auto !important;padding:0px !important}
.container{height: 100%;}
.navigation{width:222px !important;margin: 0 0 60px 0;}
.content-body{margin-left: -22px; background: #F7F7F7; line-height: 100%; }
.content-body1{margin: 18px 0 0 3px; background: #FFF; line-height: 100%; min-height: 94%;width:99.6%;}
.content-position{border-left: 3px solid #F38F00; text-align: left; padding-left: 20px; font-size: 16px;height: 23px;line-height: 23px;margin: -3px 0 0 3px;}
.el-message-box.delete_country p{margin: 0 0 0 50px;}  /* 城市列表删除 */
.el-message-box.delete_country .delete_country_determine{margin: 20px 100px 20px 0; width: 80px;}
.el-message-box.delete_country .delete_country_determine1{margin: 20px 20px 20px 0; width: 80px;}
.city_list .el-dialog__header{background: #F6F6F6; height: 29px;padding-top: 16px} /* 弹框样式 */
.city_list .el-dialog__title{ float: left; }
.el-upload-list__item{display: inline;width: auto !important;float:left;margin-left: 10px}
.el-menu-vertical-demo .el-menu-item.is-active{background: #3095FA !important;} /* 导航选中 */
body .el-table th.gutter{ display: table-cell!important; } /* 表格头部固定 */
/*模糊查询下拉框样式*/
.el-autocomplete-suggestion li:hover{background-color: #3095fa !important;color: #fff !important}
.el-popper[x-placement^=bottom] .popper__arrow::after{border-bottom-color:#e9eaea !important}
.el-popper[x-placement^=top] .popper__arrow::after{border-top-color:#e9eaea !important}
.el-autocomplete-suggestion{background-color: #e9eaea !important}
/*select下拉框样式*/
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover{background-color: #3095fa !important;color: #fff !important}
.el-select-dropdown{background-color: #e9eaea !important}
.navigation::-webkit-scrollbar { width: 0 !important } /* 隐藏导航栏滚动条 */
.select-option{width:auto !important;}
</style>
