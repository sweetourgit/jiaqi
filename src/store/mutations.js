

export default {
  changeLogin(state,data){
    state.isLogin = data
  },
  saveToken(state,data){
    state.token = data
  },
  saveUserId(state, data){
    state.userId = data
  }
}
