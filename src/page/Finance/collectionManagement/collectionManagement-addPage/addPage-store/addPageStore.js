import Vue from 'vue'

export default {
  // let {GLOBAL}= Vue.prototype;
  namespaced: true,

  state: {
    ArrearsList: [], // 关联欠款列表
    Collection: { // 收款管理
      accountShow: false, // 控制收款账户模态框是否展示
      accountTable: [], // 收款账户列表
    }
  },

  getters: {
    getArrearsList: state => state.ArrearsList,
    //通过计算属性获取收款用户列表
    getCollection: state => state.Collection,
    //固定上传路径
    uploadUrl:state =>{
      return Vue.prototype.GLOBAL.serverSrc+'/upload/obs/api/file'
    }
  },

  mutations: {
    //原则通过action 改变状态 我懒
    setArrearsList: (state, val) => state.ArrearsList = val,
    //获取收款用户列表并赋值
    setCollection: (state, val) => state.Collection = val,
    // 获取 表格头部背景颜色
    getRowClass: ({row,column,rowIndex,columnIndex}) => {
      if (rowIndex == 0) {
     return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }}
  },
  actions:{
    //异步获取收款用户列表
    getCollectionList:(context)=>{
      Vue.prototype.$http.post(
          Vue.prototype.GLOBAL.serverSrc + "/finance/collectionaccount/api/list", {
            "object": {
              "isDeleted": 0,
              'orgID': sessionStorage.getItem('topID')
            },
          }, )
        .then(function(obj) {
          let accountTable = obj.data.objects
          accountTable.forEach(function(v, k, arr) {
            if (arr[k]['cardType'] == 1) {
              arr[k]['cardType'] = '收款账户'
            } else if (arr[k]['cardType'] == 2) {
              arr[k]['cardType'] = '付款账户'
            }
          })
          let collection = {
            accountShow: true,
            accountTable: accountTable
          }
          context.commit('setCollection',collection)
        })
    }
  }
}
