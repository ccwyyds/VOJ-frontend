// initial state
//存储的状态信息(用户登录信息)
import ACCESS_ENUM from "@/permissions/AccessEnum";
import { UserControllerService } from "../../generated";

const state = () => ({
  loginUser: {
    userName: "未登录",
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
  async getLoginUser({ commit, state }: any, payload: any) {
    const res = await UserControllerService.getLoginUserUsingGet();
    console.log(res);
    //res为状态码
    if (res.code === 0) {
      console.log(res.data);
      commit("updateUser", res.data);
    } else {
      commit("updateUser", {
        //...state.loginUser 是 JavaScript 中的 展开语法（spread syntax），它的作用是把 state.loginUser 这个对象里的所有属性“展开”复制到新的对象里
        ...state.loginUser,
        userRole: ACCESS_ENUM.NOT_LOGIN,
      });
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
