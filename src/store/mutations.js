

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
  },
  changeBankData(state, data){ // 银行流水单 -- 收款/手续费 数据改变同时刷新另一项
    state.bankDataUpdate = data;
  },
  referDoneAllShowWhichTab(state, data){
    state.doneAllShowWhichTab = data
  },
  showSheetCount(state, data){
    state.sheetCount = data
  },
  showCollectionTab(state, data){
    state.collectionWhichTab = data
  }
}
