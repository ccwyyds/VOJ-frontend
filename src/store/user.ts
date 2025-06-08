// initial state
//存储的状态信息(用户登录信息)
const state = () => ({
  loginUser: {
    username: "未登录",
    //默认为用户
    role: "default",
  },
});

// mutations
//修改用户的信息（类似于增删改）
const mutations = {
  updateUser(state: any, payload: any) {
    state.loginUser = payload;
  },
};

// actions
//执行异步操作，触发mutations的更改
const actions = {
  getLoginUser({ commit, state }: any, payload: any) {
    // todo 从远程获取用户信息
    commit("updateUser", { username: "123132", role: "admin" });
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
