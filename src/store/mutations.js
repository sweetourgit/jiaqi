

export default {
  changeLogin(state,data){
    state.isLogin = data
  },
  saveToken(state,data){
    state.token = data
  },
  saveName(state, data){
    state.name = data
  },
  changeAdvance(state, data){
    state.advinceData++
  },
  changeAparoveState(state, data){ // 预付款 - 改变需要您审批的状态之后刷新借款记录列表
    state.updatAdvancePaymentData++
  }
}
