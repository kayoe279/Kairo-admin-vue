import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const Layout = () => import("@/layouts/Layout.vue");

const viewsModules = import.meta.glob("@/views/**/*.vue") as Record<
  string,
  () => Promise<Recordable>
>;
// 生成动态路由
export const generateDynamicRoutes = (routes: AppRoute.DynamicRouteRecordRaw[]) => {
  if (!routes.length) return [];

  routes.forEach((item) => {
    if (item.meta?.isRoot || (item.redirect && item.component)) {
      item.component = Layout;
    }
    if (item.component && !item.meta?.isRoot && !item.redirect) {
      item.component = viewsModules[`/src/views${item.component}`];
    }
    if (item?.meta?.icon) {
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
