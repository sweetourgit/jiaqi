/*
* 待办
*
* */

export default {
  namespaced: true,
  state: {
    countNoInTeam: 0, // 二级tab
    countAdvanceTeam: 0,
    countReimburseTeam: 0,
    countRefundTeam: 0,
    countSheetTeam: 0,
    countCollectTeamDirect: 0, // 三级tab
    countCollectTeamSame: 0,
    countCollectTeamInner: 0,
    countCollectTeamReimburse: 0,
  },
  mutations: {
    showCountNoInTeam (state, data) {
      state.countNoInTeam = data
    },
    showCountAdvanceTeam (state, data) {
      state.countAdvanceTeam = data
    },
    showCountReimburseTeam (state, data) {
      state.countReimburseTeam = data
    },
    showCountRefundTeam (state, data) {
      state.countRefundTeam = data
    },
    showCountSheetTeam (state, data) {
      state.countSheetTeam = data
    },
    showCountCollectTeamDirect (state, data) {
      state.countCollectTeamDirect = data
    },
    showCountCollectTeamSame (state, data) {
      state.countCollectTeamSame = data
    },
    showCountCollectTeamInner (state, data) {
      state.countCollectTeamInner = data
    },
    showCountCollectTeamReimburse (state, data) {
      state.countCollectTeamReimburse = data
    },
  },
  getters: {
    countNoIn: state => { // 一级tab -> 无收入的总数量 = 二级tab游轮总数 + 二级tab跟团总数
      return state.countNoInTeam;
    },
    countAdvance: state => {
      return state.countAdvanceTeam;
    },
    countReimburse: state => {
      return state.countReimburseTeam;
    },
    countRefund: state => {
      return state.countRefundTeam;
    },
    countSheet: state => {
      return state.countSheetTeam;
    },
    countCollect: (state, getters) => {
      return getters.countCollectTeam
    },
    countCollectTeam: state => { // 二级tab -> 收款管理下面的跟团总数
      return state.countCollectTeamDirect + state.countCollectTeamSame + state.countCollectTeamInner + state.countCollectTeamReimburse;
    }
  }
}
