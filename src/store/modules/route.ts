import { useUserStore } from "./user";
import { usePermission } from "@/hooks/usePermission";
import { PAGE } from "@/lib/constants";
import { StoreEnum } from "@/lib/enums/storeEnum";
import { $t } from "@/lib/i18n";
import { getUserInfo } from "@/lib/storage";
import { generateCacheRoutes, generateDynamicRoutes } from "@/router/generator";
import { asyncRoutes } from "@/router/index";
import { getUserRoutes } from "@/service/api/login";
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
    return routes.filter((route) => {
      if (route.children?.length) {
        route.children = filterRoutes(route.children);
      }
      return hasPermission(route.meta?.roles || []);
    });
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
      if (dynamicRoutes?.length) {
        resultRouter = generateDynamicRoutes(dynamicRoutes);
      }
    } else {
      resultRouter = cloneDeep(asyncRoutes);
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
