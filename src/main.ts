import App from "./App.vue";
import { setupRouter } from "./router";
import "./styles/index.css";
import AppLoading from "@/components/ui/AppLoading.vue";
import { setupDirectives } from "@/directives";
import { setupI18n, setupNaive, setupNaiveDiscreteApi } from "@/plugins";
import { setupStore } from "@/store";
import "virtual:svg-icons-register";
import { createApp } from "vue";

async function setupApp() {
  // 载入全局loading加载状态
  const appLoading = createApp(AppLoading);
  appLoading.mount("#appLoading");

  const app = createApp(App);

  // 注册国际化
  setupI18n(app);

  // 挂载状态管理
  setupStore(app);

  // 挂载路由
  await setupRouter(app);

  // 注册全局常用的 naive-ui 组件
  setupNaive(app);

  // 挂载 naive-ui 脱离上下文的 Api
  setupNaiveDiscreteApi();

  // 注册全局自定义指令，如：v-permission权限指令
  setupDirectives(app);

  // https://www.naiveui.com/en-US/os-theme/docs/style-conflict#About-Tailwind's-Preflight-Style-Override
  const meta = document.createElement("meta");
  meta.name = "naive-ui-style";
  document.head.appendChild(meta);

  // 卸载载入动画
  appLoading.unmount();

  app.mount("#app", true);
}

setupApp();
