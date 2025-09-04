import { typedBoolean } from ".";
import { $t } from "@/lib/i18n";
import { svgIconRender } from "@/lib/svgIconRender";
import { cloneDeep } from "lodash-es";
import type { MenuOption } from "naive-ui";
import type { RouteMeta, RouteRecordRaw } from "vue-router";

//排除隐藏的route
export function filterRoutes(routerMap: Array<RouteRecordRaw>) {
  return routerMap.filter((item) => !item.meta?.hidden);
}

//判断根路由
export function isRootRoute(item: RouteRecordRaw) {
  const children = filterRoutes(item.children || []);
  return item.meta?.isRoot || children.length === 1;
}

const renderMenuIcon = (meta: RouteMeta | undefined) => {
  if (meta?.icon && typeof meta.icon === "string") {
    return svgIconRender({ icon: meta.icon });
  }
  return meta?.icon;
};

// 普通菜单
export function generatorMenu(routes: Array<RouteRecordRaw>) {
  return filterRoutes(routes)
    .map((item) => {
      const isRoot = isRootRoute(item);
      const info = isRoot ? item.children?.[0] : item;
      if (!info) return;

      const menu = {
        key: info.name,
        label: $t(`route.${String(info.name)}`, String(info.meta?.title)),
        icon: renderMenuIcon({ ...(info.meta || {}), ...(item.meta || {}) })
      } as MenuOption;

      if (info?.children && info?.children.length > 0) {
        menu.children = generatorMenu(info.children);
      }
      return menu;
    })
    .filter(typedBoolean);
}

//混合菜单 (用于顶部混合菜单)
export function generatorMenuMix(
  routes: Array<RouteRecordRaw>,
  routerName: string,
  location: "side" | "header"
) {
  const cloneRouterMap = cloneDeep(routes);
  const newRouter = filterRoutes(cloneRouterMap);
  if (location === "header") {
    const firstRouter: MenuOption[] = [];
    newRouter.forEach((item) => {
      const isRoot = isRootRoute(item);
      const info = isRoot ? item.children?.[0] : item;

      if (info) {
        const menu = {
          key: info.name,
          label: $t(`route.${String(info.name)}`, String(info.meta?.title)),
          icon: renderMenuIcon({ ...(info.meta || {}), ...(item.meta || {}) }),
          children: undefined
        } as MenuOption;
        firstRouter.push(menu);
      }
    });
    return firstRouter;
  } else {
    return generatorMenu(newRouter.filter((item) => item.name === routerName));
  }
}
