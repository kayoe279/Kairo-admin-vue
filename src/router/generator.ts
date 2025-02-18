import { constantRouterIcon } from "./icons";
import { svgIconRender } from "@/lib/svgIconRender";
import { Layout } from "@/router/constant";
import { adminMenus } from "@/service/api/system/menu";
import type { RouteRecordRaw } from "vue-router";

const Iframe = () => import("@/views/iframe/index.vue");
const LayoutMap = new Map<string, () => Promise<typeof import("*.vue")>>();

LayoutMap.set("LAYOUT", Layout);
LayoutMap.set("IFRAME", Iframe);

// 生成动态路由
export const generateRoutes = (routerMap, parent?): any[] => {
  return routerMap.map((item) => {
    const currentRoute: any = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${(parent && parent.path) ?? ""}/${item.path}`,
      // 路由名称，建议唯一
      name: item.name ?? "",
      // 该路由对应页面的 组件
      component: item.component,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        ...item.meta,
        label: item.meta.title,
        icon: constantRouterIcon[item.meta.icon] || null,
        permissions: item.meta.permissions || null
      }
    };

    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRoute.path = currentRoute.path.replace("//", "/");
    // 重定向
    item.redirect && (currentRoute.redirect = item.redirect);
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      //如果未定义 redirect 默认第一个子路由为 redirect
      !item.redirect && (currentRoute.redirect = `${item.path}/${item.children[0].path}`);
      // Recursion
      currentRoute.children = generateRoutes(item.children, currentRoute);
    }
    return currentRoute;
  });
};

/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
// export const generateDynamicRoutes2 = async (): Promise<RouteRecordRaw[]> => {
//   const result = await adminMenus();
//   const router = generateRoutes(result);
//   asyncImportRoute(router);
//   return router;
// };

/**
 * 查找views中对应的组件文件
 * */
const viewsModules = import.meta.glob("@/views/**/*.vue") as Record<
  string,
  () => Promise<Recordable>
>;
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

    // if (!item.component && item.meta?.href) {
    //   item.component = "IFRAME";
    // }
    // const { component, name } = item;
    // const { children } = item;
    // if (component) {
    //   const layoutFound = LayoutMap.get(component as string);
    //   if (layoutFound) {
    //     item.component = layoutFound;
    //   } else {
    //     item.component = dynamicImport(viewsModules, component as string);
    //   }
    // } else if (name) {
    //   item.component = ParentLayout;
    // }
    // children && asyncImportRoute(children);
  });

  return routes as RouteRecordRaw[];
};

/**
 * 动态导入
 * */
export const dynamicImport = (
  viewsModules: Record<string, () => Promise<Recordable>>,
  component: string
) => {
  const keys = Object.keys(viewsModules);
  const matchKeys = keys.filter((key) => {
    let k = key.replace("../views", "");
    const lastIndex = k.lastIndexOf(".");
    k = k.substring(0, lastIndex);
    return k === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return viewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    console.warn(
      "Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure"
    );
    return;
  }
};
