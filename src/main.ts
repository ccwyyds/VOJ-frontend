import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ArcoVue from "@arco-design/web-vue";
import store from "./store";
import "@arco-design/web-vue/dist/arco.css";
import "@/permissions";
import "bytemd/dist/index.css";

createApp(App).use(store).use(router).use(ArcoVue).mount("#app");

//解决在页面频繁触发 元素尺寸变化（如表格滚动、窗口缩放） 的时候，控制台频繁出现警告：
const ignoreErrors = [
  "ResizeObserver loop completed with undelivered notifications",
  "ResizeObserver loop limit exceeded",
];

window.addEventListener("error", (e) => {
  let errorMsg = e.message;
  ignoreErrors.forEach((m) => {
    if (errorMsg.startsWith(m)) {
      console.error(errorMsg);
      if (e.error) {
        console.error(e.error.stack);
      }

      // 隐藏开发环境 overlay 报错界面
      const resizeObserverErrDiv = document.getElementById(
        "webpack-dev-server-client-overlay-div"
      );
      const resizeObserverErr = document.getElementById(
        "webpack-dev-server-client-overlay"
      );
      if (resizeObserverErr) {
        resizeObserverErr.setAttribute("style", "display: none");
      }
      if (resizeObserverErrDiv) {
        resizeObserverErrDiv.setAttribute("style", "display: none");
      }
    }
  });
});
