import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const Layout = () => import("@/layouts/Layout.vue");

// 生成动态路由
let viewsModules: Record<string, () => Promise<Recordable>>;
export const generateDynamicRoutes = (routes: AppRoute.DynamicRouteRecordRaw[]) => {
  if (!routes.length) return [];

  viewsModules = viewsModules || import.meta.glob("@/views/**/*.vue");

  routes.forEach((item) => {
    if (item.meta?.isRoot || (item.redirect && item.component)) {
      item.component = Layout;
    }
    if (item.component && !item.meta?.isRoot && !item.redirect) {
      const Component = viewsModules[`/src/views${item.component}`];
      if (Component) {
        item.component = Component;
      }
    }
    if (item?.meta?.icon && typeof item.meta.icon === "string") {
      item.meta.icon = svgIconRender({ icon: item.meta.icon });
    }
    if (item.children) {
      generateDynamicRoutes(item.children);
    }
  });

  return routes as RouteRecordRaw[];
};

// 生成 keep alive 路由
export const generateCacheRoutes = (routes: RouteRecordRaw[]) => {
  return routes.filter((i) => i.meta?.keepAlive).map((i) => i.name) as string[];
};
