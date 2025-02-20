import App from "./App.vue";
import { setupRouter } from "./router";
import "./styles/index.css";
import { setupDirectives } from "@/directives";
import { setupI18n, setupNaive, setupNaiveDiscreteApi } from "@/plugins";
import { setupStore } from "@/store";
import { createApp } from "vue";

async function bootstrap() {
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

  app.mount("#app", true);
}

void bootstrap();
