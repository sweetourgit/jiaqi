export default {
  namespaced: true,

  state: {
    materialShowState: false,
    materialSelectCb: null,
    materialIdList: null,
    previewItem: null
  },

  getters: {
    materialShowState: (state) => state.materialShowState,
    previewItem: (state) => state.previewItem,
  },

  mutations: {
    materialShowState: (state, val) => state.materialShowState= val,
    wakeupMaterial: (state, payload) => {
      let { idList, cb }= payload;
      state.materialShowState= true;
      state.materialSelectCb= cb;
      state.materialIdList= idList;
    },
    wakeupPreview: (state, item) => {
      state.previewItem= item;
    } 
  }
}