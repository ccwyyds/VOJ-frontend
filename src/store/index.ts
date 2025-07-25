import { createStore } from "vuex";
import user from "@/store/user";
import question from "@/store/question";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    question,
  },
});
