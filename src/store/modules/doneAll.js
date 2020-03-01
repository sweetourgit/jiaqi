export default{
  namespaced:true,
  state:{
    doneAllShowWhichTab: 'borrow',
    sheetCount: 0,
    collectionWhichTab: 'direct',
    collectionNumDirect: 0,
    collectionNumSame: 0,
    collectionNumInner: 0,
    collectionNumReimburse: 0
  },
  mutations:{
    referDoneAllShowWhichTab(state, data){
      state.doneAllShowWhichTab = data
    },
    showSheetCount(state, data){
      state.sheetCount = data
    },
    showCollectionTab(state, data){
      state.collectionWhichTab = data
    },
    updateCollectionDirectNum(state, data){
      state.collectionNumDirect = data
    },
    updateCollectionSameNum(state, data){
      state.collectionNumSame = data
    },
    updateCollectionInnerNum(state, data){
      state.collectionNumInner = data
    },
    updateCollectionReimburseNum(state, data){
      state.collectionNumReimburse = data
    }
  }
}
