import { PAGE } from "@/lib/constants";
import { cloneDeep } from "lodash-es";
import { MenuMixedOption } from "naive-ui/es/menu/src/interface";
import type { RouteRecordRaw } from "vue-router";

/**
 * 判断根路由 Router
 * */
export function isRootRouter(item) {
  return (
    item.meta?.alwaysShow != true &&
    item?.children?.filter((item) => !Boolean(item?.meta?.hidden))?.length === 1
  );
}

/**
 * 排除Router
 * */
export function filterRouter(routerMap: Array<RouteRecordRaw>) {
  return routerMap.filter((item) => {
    return (
      (item.meta?.hidden || false) != true &&
      !["/:path(.*)*", "/", PAGE.REDIRECT_PATH, PAGE.LOGIN_PATH].includes(item.path)
    );
  });
}

/**
 * 递归组装子菜单
 * */
export function getChildrenMenu(routerMap: Array<RouteRecordRaw>) {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item);
    const info = isRoot ? (item.children || [])[0] : item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name
    } as MenuMixedOption;
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = getChildrenMenu(info.children);
    }
    return currentMenu;
  });
}

/**
 * 递归组装菜单格式
 */
export function generatorMenu(routerMap: Array<RouteRecordRaw>) {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item);
    const info = isRoot ? (item.children || [])[0] : item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
      icon: isRoot ? item.meta?.icon : info.meta?.icon
    } as MenuMixedOption;
    // 是否有子菜单，并递归处理
    if (info?.children && info?.children.length > 0) {
      // Recursion
      currentMenu.children = generatorMenu(info.children);
    }
    return currentMenu;
  });
}

/**
 * 混合菜单
 * */
export function generatorMenuMix(
  routerMap: Array<RouteRecordRaw>,
  routerName: string,
  location: "side" | "header"
) {
  const cloneRouterMap = cloneDeep(routerMap);
  const newRouter = filterRouter(cloneRouterMap);
  if (location === "header") {
    const firstRouter: MenuMixedOption[] = [];
    newRouter.forEach((item) => {
      const isRoot = isRootRouter(item);
      const info = isRoot ? (item.children || [])[0] : item;
      info.children = undefined;
      const currentMenu = {
        ...info,
        ...info.meta,
        label: info.meta?.title,
        key: info.name
      } as MenuMixedOption;
      firstRouter.push(currentMenu);
    });
    return firstRouter;
  } else {
    return getChildrenMenu(newRouter.filter((item) => item.name === routerName));
  }
}

// 处理菜单的展开项 expanded key, 仅当菜单为手风琴模式的时候使用
export function findParentKeys(
  menus: MenuMixedOption[],
  targetKey: string,
  prevKeys: string[] = []
): string[] {
  const keys: string[] = [];
  for (const menu of menus) {
    // 如果当前路由的 key 匹配目标 key，返回当前路径
    if (menu.key === targetKey && menu.key) {
      keys.push(...prevKeys, menu.key);
    } else {
      // 如果当前路由有子路由，递归查找
      const children = menu.children as MenuMixedOption[];
      if (children) {
        const result = findParentKeys(children, targetKey, [...prevKeys, menu.key as string]);
        if (result) {
          keys.push(...result);
        }
      }
    }
  }

  return keys;
}
