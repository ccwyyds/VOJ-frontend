/**
 * 全局权限管理
 * 原有的路由拦截，权限校验逻辑放到一个地方
 */

import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/permissions/AccessEnum";
import checkAccess from "@/permissions/checkAccess";

router.beforeEach(async (to, from, next) => {
  // 自动登录的功能，避免每次刷新页面都要重新更新
  // @ts-ignore
  let userInfo = store.state.user.loginUser;

  // 如果用户信息不存在或没有角色，尝试获取登录用户信息
  if (!userInfo || !userInfo.userRole) {
    try {
      await store.dispatch("user/getLoginUser");
      // @ts-ignore
      userInfo = store.state.user.loginUser;
    } catch (error) {
      console.error("获取用户信息失败:", error);
      // 如果获取用户信息失败，清除可能存在的无效用户信息
      await store.dispatch("user/logout");
      userInfo = null;
    }
  }

  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;

  // 如果用户访问需要权限的页面
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果没有用户信息或没有角色
    if (!userInfo || !userInfo.userRole) {
      // 跳转到登录页面，并且重定向到to要的路由地址
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }

    // 检查用户是否有访问权限
    if (!checkAccess(userInfo, needAccess)) {
      next("/noAuth");
      return;
    }
  }

  next();
});
