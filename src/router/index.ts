import { setupRouterGuard } from "./guards";
import { baseRoutes, errorRoutes } from "@/router/base";
import type { App } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

const modules = import.meta.glob<AppRoute.IModuleType>("./modules/**/*.ts", { eager: true });

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

//普通路由 无需验证权限
export const constantRouter: RouteRecordRaw[] = [...baseRoutes, ...errorRoutes];

const { VITE_BASE_URL, VITE_ROUTE_MODE } = import.meta.env;

const router = createRouter({
  history:
    VITE_ROUTE_MODE === "hash"
      ? createWebHashHistory(VITE_BASE_URL)
      : createWebHistory(VITE_BASE_URL),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export async function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  setupRouterGuard(router);

  // 路由准备就绪后挂载 APP 实例
  // https://router.vuejs.org/api/interfaces/router.html#isready
  await router.isReady();
}

export default router;
