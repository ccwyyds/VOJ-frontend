/**
 * 定义通用权限的方法
 */
import ACCESS_ENUM from "@/permissions/AccessEnum";

/**
 * 检查当前用户是否有需要的权限
 * loginUser:当前登录用户
 * needAccess:需要的权限
 */

const checkAccess = (userInfo: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  //获取当前用户的userRole,如果没有，默认赋值为未登录
  const role = userInfo?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }
  //如果需要用户登录才能访问(除了未登录都能访问)
  if (needAccess === ACCESS_ENUM.USER && role === ACCESS_ENUM.NOT_LOGIN) {
    return false;
  }
  //管理员才能登录
  if (needAccess === ACCESS_ENUM.ADMIN && role !== ACCESS_ENUM.ADMIN) {
    return false;
  }
  return true;
};

export default checkAccess;
