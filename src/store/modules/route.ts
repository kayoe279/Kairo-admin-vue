import { useAppStore } from "./appSetting";
import { useUserStore } from "./user";
import { usePermission } from "@/hooks/usePermission";
import { PAGE } from "@/lib/constants";
import { StoreEnum } from "@/lib/enums/storeEnum";
import { getUserInfo } from "@/lib/storage";
import router from "@/router";
import { dynamicRoutes } from "@/router/dynamic";
import { generateCacheRoutes, generateDynamicRoutes } from "@/router/generator";
import { asyncRoutes } from "@/router/index";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { type RouteRecordRaw } from "vue-router";

export const useRouteStore = defineStore(StoreEnum.asyncRoute, () => {
  const appStore = useAppStore();
  const userStore = useUserStore();
  const { hasPermission } = usePermission();

  const rowRoutes = ref<RouteRecordRaw[]>([]);
  const cacheRoutes = ref<string[]>([]);
  const isInitAuthRoute = ref<boolean>(false);

  const homeRoute = computed(() => {
    const home = rowRoutes.value.find((item) => item.name === PAGE.HOME_NAME);
    return home?.children?.find(
      (item) => item.meta?.affix || item.name === PAGE.HOME_NAME_REDIRECT
    );
  });

  const filterRoutes = (routes: RouteRecordRaw[]) => {
    return routes.filter((route) => {
      if (route.children?.length) {
        route.children = filterRoutes(route.children);
      }
      return hasPermission(route.meta?.roles);
    });
  };

  const initAuthRoute = async () => {
    isInitAuthRoute.value = false;

    let resultRouter: RouteRecordRaw[] = [];

    if (import.meta.env.VITE_ROUTE_LOAD_MODE === "dynamic") {
      const userInfo = getUserInfo();
      console.log(
        "%c [ userInfo ]-143",
        "font-size:13px; background:pink; color:#bf2c9f;",
        userInfo
      );

      // if (!userInfo || !userInfo.id) {
      //   userStore.logout();
      //   return;
      // }

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

    // 路由权限过滤
    resultRouter = filterRoutes(resultRouter);

    filterRoutes(resultRouter).forEach((item) => {
      router.addRoute(item);
    });

    rowRoutes.value = resultRouter;

    // 生成keepalive 的缓存路由
    cacheRoutes.value = generateCacheRoutes(resultRouter);

    isInitAuthRoute.value = true;
  };

  return {
    homeRoute,
    rowRoutes,
    cacheRoutes,
    isInitAuthRoute,
    initAuthRoute
  };
});
