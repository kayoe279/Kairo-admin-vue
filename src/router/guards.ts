import { usePermission, useRequireAuth } from "@/hooks";
import { PAGE } from "@/lib";
import { useRouteStore, useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import type { Router } from "vue-router";

const title = import.meta.env.VITE_GLOB_APP_TITLE;

export const setupRouterGuard = (router: Router) => {
  const routeStore = useRouteStore();
  const userStore = useUserStore();

  const { isAuthenticated } = storeToRefs(userStore);

  const { LOGIN_PATH, LOGIN_NAME, ERROR_PAGE_NAME, FORBIDDEN_PAGE_NAME } = PAGE;

  router.beforeEach(async (to, _, next) => {
    const requireAuth = useRequireAuth(to.meta);
    // 1. 判断是否是外链，如果是直接打开网页并拦截跳转
    if (to.meta?.externalLink) {
      window.open(to.meta.externalLink);
      return false;
    }

    window.$loadingBar?.start();

    // 1. 判断路由有无进行初始化
    if (!routeStore.isInitAuthRoute) {
      await routeStore.initAuthRoute();
      if (to.name === ERROR_PAGE_NAME) {
        next({
          path: to.fullPath,
          query: to.query,
          hash: to.hash,
          replace: true
        });
        return false;
      }
    }

    // 2. 判断有无token,登录鉴权
    if (!isAuthenticated.value) {
      if (to.name !== LOGIN_NAME) {
        next({ path: LOGIN_PATH, query: { redirect: to.fullPath } });
      } else {
        next();
      }
      return false;
    }

    // 3. 判断权限
    const { hasPermission } = usePermission();
    if (requireAuth && to?.meta?.roles && to?.meta?.roles?.length > 0) {
      if (!hasPermission(to?.meta?.roles)) {
        next({ name: FORBIDDEN_PAGE_NAME });
        return false;
      }
    }

    // 4. 判断当前页是否在login,则定位去首页
    if (to.name === LOGIN_NAME && isAuthenticated.value) {
      next({ path: "/" });
      return false;
    }

    next();
  });

  router.afterEach((to) => {
    document.title = `${to.meta.title} - ${title}`;
    window.$loadingBar?.finish();
  });

  router.onError((error) => {
    console.log(error, "路由错误");
  });
};
