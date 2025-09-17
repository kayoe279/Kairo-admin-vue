import { svgIconRender, typedBoolean } from "@/lib";
import { $t } from "@/lib/i18n";
import type { MenuOption } from "naive-ui";
import type { RouteMeta, RouteRecordRaw } from "vue-router";

//排除隐藏的route
export const filterRoutes = (routerMap: Array<RouteRecordRaw>) => {
  return routerMap.filter((item) => !item.meta?.hidden);
};

//判断根路由
export const isRootMenu = (item: RouteRecordRaw) => {
  const children = filterRoutes(item.children || []);
  return item.meta?.isRoot || children.length === 1;
};

export const renderMenuIcon = (meta: RouteMeta | undefined) => {
  if (meta?.icon && typeof meta.icon === "string") {
    return svgIconRender({ icon: meta.icon });
  }
  return meta?.icon;
};

// 普通菜单
export const transformToMenus = (routes: Array<RouteRecordRaw>, onlyFirstLevel = false) => {
  const menuItems = filterRoutes(routes).map((item) => {
    const isRoot = isRootMenu(item);
    const info = isRoot ? item.children?.[0] : item;
    if (!info) return;

    const menu = {
      key: info.name,
      label: $t(`route.${String(info.name)}`, String(info.meta?.title)),
      icon: renderMenuIcon({ ...(info.meta || {}), ...(item.meta || {}) })
    } as MenuOption;

    if (info?.children && info?.children.length > 0 && !onlyFirstLevel) {
      menu.children = transformToMenus(info.children, onlyFirstLevel);
    }
    return menu;
  });

  return menuItems.filter(typedBoolean);
};
