/*
*
* 用于 sheetDetail/team 向 sheetDetail/team/.../review.vue 子组件传参
*
* */

export default {
    namespaced: true,
    state: {
        reviewList: []
    },
    mutations: {
        setReviewList(state, data) {
          
            state.reviewList = data
        }
    }
}
