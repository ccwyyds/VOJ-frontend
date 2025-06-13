<template>
  <div id="globalHeader">
    <a-row class="grid-demo" style="margin-bottom: 16px" align="center">
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
      <a-col flex="100px">
        <div>
          {{ store.state.user.loginUser.userName }}
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";

import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/permissions/checkAccess";
import ACCESS_ENUM from "@/permissions/AccessEnum";

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
