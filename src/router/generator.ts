import { DynamicRoute } from "@/types";
import type { RouteRecordRaw } from "vue-router";

const Layout = () => import("@/layouts/Layout.vue");

// 生成动态路由
let viewsModules: Record<string, () => Promise<Record<string, any>>>;
export const generateDynamicRoutes = (routes: DynamicRoute[], level = 1) => {
  if (!routes.length) return [];

  viewsModules = viewsModules || import.meta.glob("@/views/**/*.vue");

  routes.forEach((item) => {
    if (level === 1 && item.component) {
      item.component = Layout;
    }
    if (level > 1 && item.component) {
      const Component = viewsModules[`/src/views${item.component}`];
      if (Component) {
        item.component = Component;
      }
    }
    if (item.children) {
      generateDynamicRoutes(item.children, level + 1);
    }
  });

  return routes as RouteRecordRaw[];
};

// 生成 keep alive 路由
export const generateCacheRoutes = (routes: RouteRecordRaw[]) => {
  return routes.filter((i) => i.meta?.keepAlive).map((i) => i.name) as string[];
};
