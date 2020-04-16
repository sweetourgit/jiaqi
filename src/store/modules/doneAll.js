/*
*
* 已办
*
* */

export default {
  namespaced: true,
  state: {
    doneAllShowWhichTab: 'borrow',
    sheetCount: 0,
    sheetAroundCount: 0,
    collectionWhichTab: 'direct',
    collectionNumDirect: 0,
    collectionNumSame: 0,
    collectionNumInner: 0,
    collectionNumReimburse: 0,
    showSheetWhichTab: 'sheetTeam',  // 报账单的tab
    borrowAroundNoIncomeNum: 0,
    borrowAroundAdvanceNum: 0,
    borrowAroundBalanceNum: 0
  },
  mutations: {
    referDoneAllShowWhichTab (state, data) {
      state.doneAllShowWhichTab = data
    },
    showSheetCount (state, data) {
      state.sheetCount = data
    },
    aroundSheetCount (state, data) {
      state.sheetAroundCount = data
    },
    showCollectionTab (state, data) {
      state.collectionWhichTab = data
    },
    showSheetTab (state, data) { // 报账单的tab
      state.showSheetWhichTab = data
    },
    updateCollectionDirectNum (state, data) {
      state.collectionNumDirect = data
    },
    updateCollectionSameNum (state, data) {
      state.collectionNumSame = data
    },
    updateCollectionInnerNum (state, data) {
      state.collectionNumInner = data
    },
    updateCollectionReimburseNum (state, data) {
      state.collectionNumReimburse = data
    },
    updateBorrowAroundNoIncomeNum (state, data) {
      state.borrowAroundNoIncomeNum = data
    },
    updateBorrowAroundAdvanceNum (state, data) {
      state.borrowAroundAdvanceNum = data
    },
    updateBorrowAroundBalanceNum (state, data) {
      state.borrowAroundBalanceNum = data
    },
  }
}
