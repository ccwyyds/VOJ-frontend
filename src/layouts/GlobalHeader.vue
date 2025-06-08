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
            <a-menu-item v-for="item in routes" :key="item.path">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </div>
      </a-col>
      <a-col flex="100px">
        <div>
          {{ store.state.user.loginUser.username }}
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";

import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useStore } from "vuex";

const router = useRouter();

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

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

// 获取状态变量store
const store = useStore();
store.dispatch("user/getLoginUser");
</script>

<style scoped>
.logo {
  margin-top: 20px;
  margin-left: 30px;
  height: 40px;
}
</style>
