// initial state
//存储的状态信息(题目信息)

const state = () => ({
  questionId: 0,
});
// mutations
//修改题目的id
const mutations = {
  updateQuestionId(state: any, questionId: number) {
    state.questionId = questionId;
  },
};

// actions
//执行异步操作，触发mutations的更改
const actions = {
  setQuestionId({ commit }: any, questionId: number) {
    commit("updateQuestionId", questionId);
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
