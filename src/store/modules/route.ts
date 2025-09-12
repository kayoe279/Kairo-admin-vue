import { useUserStore } from "./user";
import { usePermission } from "@/hooks/usePermission";
import { PAGE } from "@/lib/constants";
import { StoreEnum } from "@/lib/enums/storeEnum";
import { $t } from "@/lib/i18n";
import { getUserInfo } from "@/lib/storage";
import { generateCacheRoutes, generateDynamicRoutes } from "@/router/generator";
import { staticRoutes } from "@/router/index";
import { getUserRoutes } from "@/service/api";
import cloneDeep from "lodash-es/cloneDeep";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { type RouteRecordRaw, useRouter } from "vue-router";

export const useRouteStore = defineStore(StoreEnum.asyncRoute, () => {
  const router = useRouter();
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
    const filterFunc = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
      return routes
        .filter((route) => hasPermission(route.meta?.roles || []))
        .map((route) => {
          const newRoute = { ...route };
          if (newRoute.children && newRoute.children.length) {
            newRoute.children = filterFunc(newRoute.children);
          }
          return newRoute;
        });
    };
    return filterFunc(routes).sort((a, b) => (a.meta?.sort || 0) - (b.meta?.sort || 0));
  };

  const initAuthRoute = async () => {
    isInitAuthRoute.value = false;

    let resultRouter: RouteRecordRaw[] = [];

    if (import.meta.env.VITE_ROUTE_LOAD_MODE === "dynamic") {
      const userInfo = getUserInfo();
      if (!userInfo || !userInfo.id) {
        userStore.logout();
        return;
      }

      const { data: dynamicRoutes } = await getUserRoutes({
        id: userInfo.id
      });

      resultRouter = generateDynamicRoutes(dynamicRoutes);
    } else {
      resultRouter = cloneDeep(staticRoutes);
    }

    if (!resultRouter.length) {
      window.$message.error($t(`app.getRouteError`));
      return;
    }

    // 路由权限过滤
    resultRouter = filterRoutes(resultRouter);

    resultRouter.forEach((item) => {
      router.addRoute(item);
    });

    rowRoutes.value = resultRouter;

    // 生成keepalive 的缓存路由
    cacheRoutes.value = generateCacheRoutes(resultRouter);

    isInitAuthRoute.value = true;
  };

  const resetRoutes = () => {
    rowRoutes.value.forEach((route) => {
      const name = route.name as string;
      if (router.hasRoute(name)) {
        router.removeRoute(name);
      }
    });
    rowRoutes.value = [];
    cacheRoutes.value = [];
    isInitAuthRoute.value = false;
  };

  return {
    homeRoute,
    rowRoutes,
    cacheRoutes,
    isInitAuthRoute,
    initAuthRoute,
    resetRoutes
  };
});
