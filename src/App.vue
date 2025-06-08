<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

router.beforeEach((to, form, next) => {
  if (to.meta.access === "acceptAdmin") {
    if (store.state.user.loginUser.role !== "admin") {
      console.log(to);
      next("/noAuth");
      return;
    }
  }
  next();
});
</script>

<style scoped></style>
