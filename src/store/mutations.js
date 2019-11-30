

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
    console.log(state,data)
    state.advinceData = data
  }
}
