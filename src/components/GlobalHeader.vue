<template>
  <div id="globalHeader">
    <a-row class="grid-demo" style="margin-bottom: 10px" align="center">
      <div flex="100px">
        <img class="logo" src="../assets/logo.png" />
      </div>
      <a-col flex="auto">
        <div>
          <a-menu
            mode="horizontal"
            :selected-keys="selectKeys"
            @menu-item-click="doMenuClick"
          >
            <a-menu-item key="0" :style="{ padding: 0 }" disabled>
            </a-menu-item>

            <a-menu-item v-for="item in showRoutes" :key="item.path">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </div>
      </a-col>
      <a-col flex="200px">
        <div style="display: flex; align-items: center">
          <a-dropdown>
            <div
              style="
                display: flex;
                align-items: center;
                cursor: pointer;
                padding: 8px;
                border-radius: 6px;
                transition: background-color 0.2s;
              "
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <a-avatar trigger-type="mask" style="margin: 10px 20px 0 0">
                <img alt="avatar" :src="avatarImg" />
              </a-avatar>
              <span style="color: #333; font-weight: 500">{{
                store.state.user.loginUser.userName
              }}</span>
              <IconDown
                style="margin-left: 8px; font-size: 12px; color: #666"
              />
            </div>
            <template #content>
              <a-doption @click="handleEditAvatar">
                <IconEdit style="margin-right: 8px" />
                修改头像
              </a-doption>
              <a-doption @click="handleEditProfile">
                <IconUser style="margin-right: 8px" />
                个人资料
              </a-doption>
              <a-doption @click="handleLogout" style="color: #f53f3f">
                <IconExport style="margin-right: 8px" />
                退出登录
              </a-doption>
            </template>
          </a-dropdown>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";

import {
  IconCamera,
  IconEdit,
  IconUser,
  IconDown,
  IconExport,
} from "@arco-design/web-vue/es/icon";

import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/permissions/checkAccess";
import AvatarUploadModal from "./AvatarUploadModal.vue";

const router = useRouter();

// 获取状态变量store
const store = useStore();

// 调用user模块的action
const userInfo = computed(() => store.state.user.loginUser);

//将可显示的路由过滤出来放到数组中进行显示
const showRoutes = computed(() => {
  return routes.filter((item, index) => {
    //所有人都隐藏的菜单
    if (item.meta?.hideInMenu) {
      return false;
    }
    //对特定类型用户隐藏的菜单
    if (!checkAccess(userInfo.value, item.meta?.access as string)) {
      return false;
    }
    return true;
  });
});

const selectKeys = ref(["/"]);
/**
 * 方法一：使用router.afterEach点击后采用ref响应式数据动态修改高亮
 * 每次路由跳转完成之后，自动执行某段代码
 * to: 要跳转到的路由对象
 * from: 当前离开的路由对象
 */
// router.afterEach((to,form)=>{
//   selectKeys.value = [to.path];
// })

//方法二：采用事件监听
const route = useRoute();
watch(
  () => route.path,
  (newPath) => {
    selectKeys.value = [newPath];
  }
);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

// 鼠标悬浮效果
const handleMouseEnter = (event: Event) => {
  const target = event.target as HTMLElement;
  target.style.backgroundColor = "#f5f5f5";
};

const handleMouseLeave = (event: Event) => {
  const target = event.target as HTMLElement;
  target.style.backgroundColor = "transparent";
};

const avatarImg = ref(new URL("../assets/avatar.jpg", import.meta.url).href);
// 修改头像
const handleEditAvatar = () => {
  // TODO: 实现修改头像功能
  console.log("修改头像");
};

// 个人资料
const handleEditProfile = () => {
  // TODO: 实现个人资料功能
  console.log("个人资料");
};

// 退出登录
const handleLogout = async () => {
  try {
    // 清除用户信息
    store.commit("user/updateUser", {
      userName: "未登录",
    });
    // 跳转到登录页面
    router.push("/user/login");
  } catch (error) {
    console.error("退出登录失败:", error);
  }
};

// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     username: "vv",
//     userRole: ACCESS_ENUM.ADMIN,
//   });
// }, 2000);
</script>

<style scoped>
.logo {
  margin-top: 20px;
  margin-left: 30px;
  height: 40px;
}
</style>
