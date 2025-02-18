import { useAppStore } from "./appSetting";
import { useUserStore } from "./user";
import { usePermission } from "@/hooks/usePermission";
import { PageEnum } from "@/lib/enums/pageEnum";
import { StoreEnum } from "@/lib/enums/storeEnum";
import { local } from "@/lib/storage";
import router from "@/router";
import { dynamicRoutes } from "@/router/dynamic";
import { generateDynamicRoutes } from "@/router/generator";
import { asyncRoutes, constantRouter } from "@/router/index";
import { store } from "@/store";
import { defineStore } from "pinia";
import { computed, ref, toRaw, unref } from "vue";
import { type RouteRecordRaw } from "vue-router";

interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: "id",
  children: "children",
  pid: "pid"
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

export interface IAsyncRouteState {
  menus: RouteRecordRaw[];
  routers: any[];
  routersAdded: any[];
  cacheRoutes: string[];
  isDynamicRouteAdded: boolean;
}

function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] {
  config = getConfig(config);
  const children = config.children as string;

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }

  return listFilter(tree);
}

export const useRouteStore = defineStore(StoreEnum.asyncRoute, () => {
  const appStore = useAppStore();
  const userStore = useUserStore();
  const { hasPermission } = usePermission();

  const rowRoutes = ref<RouteRecordRaw[]>([]);

  const activeMenu = ref<string | null>(null);
  const menus = ref<RouteRecordRaw[]>([]);
  const routers = ref<RouteRecordRaw[]>(constantRouter);
  const routersAdded = ref<RouteRecordRaw[]>([]);
  const cacheRoutes = ref<string[]>([]);
  const isDynamicRouteAdded = ref<boolean>(false);
  const isInitAuthRoute = ref<boolean>(false);

  const homeRoute = computed(() => {
    const home = routers.value.find((item) => item.name === PageEnum.HOME_NAME);
    return home?.children?.find(
      (item) => item.meta?.affix || item.name === PageEnum.BASE_HOME_NAME
    );
  });

  // set the currently highlighted menu key
  const setActiveMenu = (key: string) => {
    activeMenu.value = key;
  };

  const getRouters = () => {
    return toRaw(routersAdded.value);
  };

  const setDynamicRouteAdded = (added: boolean) => {
    isDynamicRouteAdded.value = added;
  };
  // 设置动态路由
  const setRouters = (_routers: RouteRecordRaw[]) => {
    routersAdded.value = _routers;
    routers.value = constantRouter.concat(_routers);
  };
  // 设置菜单
  const setMenus = (_menus: RouteRecordRaw[]) => {
    menus.value = _menus;
  };
  // 设置需要缓存的组件
  const setKeepAliveComponents = (compNames: string[]) => {
    cacheRoutes.value = compNames;
  };
  // 生成路由
  const generateRoutes = async (data) => {
    let accessedRouters;
    const permissionsList = data.permissions ?? [];
    const routeFilter = (route) => {
      const { meta } = route;
      const { permissions } = meta || {};
      if (!permissions) return true;
      return permissionsList.some((item) => permissions.includes(item.value));
    };
    if (unref(appStore.permissionMode) === "BACK") {
      // 动态获取菜单
      // try {
      //   accessedRouters = await generateDynamicRoutes();
      // } catch (error) {
      //   console.log(error);
      // }
    } else {
      try {
        //过滤账户是否拥有某一个权限，并将菜单从加载列表移除
        accessedRouters = filter(asyncRoutes, routeFilter);
      } catch (error) {
        console.log(error);
      }
    }
    accessedRouters = accessedRouters.filter(routeFilter);
    setRouters(accessedRouters);
    setMenus(accessedRouters);
    return toRaw(accessedRouters);
  };

  const initAuthRoute = async () => {
    isInitAuthRoute.value = false;

    let resultRouter: RouteRecordRaw[] = [];

    if (import.meta.env.VITE_ROUTE_LOAD_MODE === "dynamic") {
      const userInfo = local.get("userInfo");
      if (!userInfo || !userInfo.id) {
        userStore.logout();
        return;
      }

      // TODO: 获取用户路由
      // const { data } = await fetchUserRoutes({
      //   id: userInfo.id,
      // })
      // if (data) {
      //   return data
      // }
      resultRouter = generateDynamicRoutes(dynamicRoutes);
    } else {
      resultRouter = asyncRoutes;
    }

    // Route permission filtering
    resultRouter = resultRouter.filter((i) => hasPermission(i.meta?.roles));
    rowRoutes.value = resultRouter;
    console.log(
      "%c [ resultRouter ]-158",
      "font-size:13px; background:pink; color:#bf2c9f;",
      resultRouter
    );
    resultRouter.forEach((item) => {
      router.addRoute(item);
    });

    // 生成菜单
    // this.menus = createMenus(rowRoutes)

    // 生成keepalive 的缓存路由
    // this.cacheRoutes = generateCacheRoutes(rowRoutes);

    isInitAuthRoute.value = true;
    console.log(
      "%c [ isInitAuthRoute.value ]-182",
      "font-size:13px; background:pink; color:#bf2c9f;",
      isInitAuthRoute.value
    );
  };

  return {
    activeMenu,
    menus,
    routers,
    routersAdded,
    cacheRoutes,
    isDynamicRouteAdded,
    homeRoute,
    isInitAuthRoute,
    initAuthRoute,
    setActiveMenu,
    getRouters,
    setDynamicRouteAdded,
    setRouters,
    setMenus,
    setKeepAliveComponents,
    generateRoutes
  };
});

// Need to be used outside the setup
export function useAsyncRoute() {
  return useRouteStore(store);
}
