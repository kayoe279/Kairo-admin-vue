import { useUserStore } from "./user";
import { usePermission } from "@/hooks/usePermission";
import { PAGE, StoreEnum } from "@/lib";
import { getUserInfo } from "@/lib/cookie";
import { $t } from "@/lib/i18n";
import { generateCacheRoutes, generateDynamicRoutes } from "@/router/generator";
import { staticRoutes } from "@/router/index";
import { getUserRoutes } from "@/service";
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
    if (isInitAuthRoute.value) return;

    isInitAuthRoute.value = false;

    let resultRouter: RouteRecordRaw[] = [];

    try {
      if (import.meta.env.VITE_ROUTE_LOAD_MODE === "dynamic") {
        const userInfo = getUserInfo();
        if (!userInfo || !userInfo.id) {
          userStore.logout();
          return;
        }

        // 优化：添加超时和错误处理
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("获取路由超时")), 5000);
        });

        const routePromise = getUserRoutes({ id: userInfo.id });
        const { data: dynamicRoutes } = (await Promise.race([routePromise, timeoutPromise])) as any;

        resultRouter = generateDynamicRoutes(dynamicRoutes);
      } else {
        resultRouter = staticRoutes.map((route) => ({ ...route }));
      }

      if (!resultRouter.length) {
        window.$message.error($t(`app.getRouteError`));
        return;
      }

      // 路由权限过滤 - 优化：批量处理
      resultRouter = filterRoutes(resultRouter);

      // 优化：批量添加路由
      const addRoutePromises = resultRouter.map((item) => {
        return new Promise<void>((resolve) => {
          router.addRoute(item);
          resolve();
        });
      });

      await Promise.all(addRoutePromises);

      rowRoutes.value = resultRouter;

      // 生成keepalive 的缓存路由
      cacheRoutes.value = generateCacheRoutes(resultRouter);

      isInitAuthRoute.value = true;
    } catch (error) {
      console.error("路由初始化失败:", error);
      isInitAuthRoute.value = false;
      throw error;
    }
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
