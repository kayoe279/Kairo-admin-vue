import { createRouterGuards } from "./guards";
import type { IModuleType } from "./types";
import { LoginRoute, RedirectRoute, RootRoute } from "@/router/base";
import type { App } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

const modules = import.meta.glob<IModuleType>("./modules/**/*.ts", { eager: true });

//需要验证权限
export const asyncRoutes: RouteRecordRaw[] = Object.keys(modules)
  .reduce((list, key) => {
    const mod = modules[key].default ?? {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    return [...list, ...modList];
  }, [])
  .sort((a, b) => {
    return ((a.meta?.sort as number) ?? 0) - ((b.meta?.sort as number) ?? 0);
  });
console.log(
  "%c [ asyncRoutes ]-43",
  "font-size:13px; background:pink; color:#bf2c9f;",
  asyncRoutes
);

//普通路由 无需验证权限
export const constantRouter: RouteRecordRaw[] = [LoginRoute, RootRoute, RedirectRoute];
console.log(
  "%c [ constantRouter ]-47",
  "font-size:13px; background:pink; color:#bf2c9f;",
  constantRouter
);

const router = createRouter({
  history: createWebHistory(),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export async function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);

  // 路由准备就绪后挂载 APP 实例
  // https://router.vuejs.org/api/interfaces/router.html#isready
  await router.isReady();
}

export default router;
