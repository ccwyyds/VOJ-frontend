/**
 * 全局权限管理
 * 原有的路由拦截，权限校验逻辑放到一个地方
 */

import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/permissions/AccessEnum";
import checkAccess from "@/permissions/checkAccess";

router.beforeEach(async (to, form, next) => {
  // 自动登录的功能，避免每次刷新页面都要重新更新
  // @ts-ignore
  let userInfo = store.state.user.loginUser;

  if (!userInfo || !userInfo.userRole) {
    await store.dispatch("user/getLoginUser");
    // @ts-ignore
    userInfo = store.state.user.loginUser;
  }

  const needAccept = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  //如果用户登录到一个必须要权限的页面
  if (needAccept !== ACCESS_ENUM.NOT_LOGIN) {
    //如果没有数据，即从未登录过
    if (!userInfo || !userInfo.userRole) {
      // 跳转到登录页面，并且重定向到to要的路由地址
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    if (!checkAccess(userInfo, needAccept)) {
      next("/noAuth");
      return;
    }
  }

  next();
});
