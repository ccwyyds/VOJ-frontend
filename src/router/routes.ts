import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import NoAuthView from "@/views/NoAuthView.vue";

export const routes: Array<RouteRecordRaw> = [

  {
    path: "/",
    name: "题目信息",
    component: HomeView
  },
  {
    path: "/noAuth",
    name: "你没权限",
    component: NoAuthView
  },
  {
    path: "/admin",
    name: "仅管理员可见",
    component: AdminView,
    meta: {
      access: "acceptAdmin"
    }
  },
  {
    path: "/about",
    name: "关于我的",
    component: () => import("../views/AboutView.vue")
  }
];
