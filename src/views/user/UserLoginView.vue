<template>
  <div id="userLoginView">
    <!-- 登录表单 -->
    <div class="login-form-wrapper">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="Logo" class="login-logo" />
        <h2 class="login-title">欢迎登录VOJ</h2>
      </div>
      <a-form :model="form" :style="{ width: '400px' }" @submit="handleSubmit">
        <a-form-item field="userAccount" label="账号">
          <a-input v-model="form.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item field="userPassword" label="密码">
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" type="primary" style="margin-right: 30px"
            >登录
          </a-button>
          <a-button
            html-type="register"
            type="primary"
            style="margin-right: 90px"
            @click="goToRegister"
            >注册
          </a-button>
          <a href="#" style="color: #4141b4">忘记密码？</a>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";

const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const router = useRouter();
const route = useRoute();

/**
 * 登录表单提交逻辑
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    
    // 获取重定向地址，如果没有则默认跳转到题目列表页
    const redirect = route.query.redirect as string;
    if (redirect) {
      router.push({ path: redirect, replace: true });
    } else {
    router.push({ path: "/questions", replace: true });
    }
  } else {
    message.error("登录失败," + res.message);
  }
};

const goToRegister = () => {
  router.push("/user/register");
};
</script>

<style scoped>
#userLoginView {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.login-form-wrapper {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(30, 30, 30, 0.85);
  padding: 50px 60px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 新增头部区域样式 */
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px; /* 和表单的间距 */
}

.login-logo {
  width: 100px; /* 根据需求调节logo大小 */
  margin-bottom: 15px;
}

.login-title {
  color: #fff;
  font-weight: 700;
  font-size: 24px;
  margin: 0;
}
</style>
