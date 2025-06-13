<template>
  <div class="register-container">
    <div class="login-form-wrapper">
      <a-form
        :model="form"
        :style="{ width: '400px' }"
        @submit="handleRegister"
      >
        <back
          theme="outline"
          size="24"
          fill="#ffffff"
          class="back-icon"
          @click="goBack"
        />

        <a-form-item field="userAccount" label="账号">
          <a-input v-model="form.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item field="userPassword" label="密码">
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item field="userPassword" label="确认密码">
          <a-input-password
            v-model="form.checkPassword"
            placeholder="再次输入密码"
          />
        </a-form-item>

        <a-form-item>
          <a-button html-type="submit" type="primary">注册</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { UserControllerService } from "../../../generated";
import { Back, Left } from "@icon-park/vue-next";

const router = useRouter();

const goBack = () => {
  router.push("/user/login");
};

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
});

const handleRegister = async () => {
  if (form.userPassword !== form.checkPassword) {
    message.error("两次密码输入不一致！");
    return;
  }
  try {
    const res = await UserControllerService.userRegisterUsingPost({
      userAccount: form.userAccount,
      userPassword: form.userPassword,
      checkPassword: form.checkPassword,
    });
    if (res.code === 0) {
      message.success("注册成功，请登录");
      router.push("/user/login");
    } else {
      message.error("注册失败：" + res.message);
    }
  } catch (error) {
    message.error("请求出错，请稍后重试");
  }
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.back-icon {
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
  z-index: 2;
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
</style>
