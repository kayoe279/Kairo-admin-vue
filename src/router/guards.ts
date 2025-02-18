import { PAGE } from "@/lib/constants";
import { getUserToken } from "@/lib/cookie";
import { useAppStore, useRouteStore, useTabsStore, useUser } from "@/store";
import type { Router } from "vue-router";

const title = import.meta.env.VITE_GLOB_APP_TITLE;

export const setupRouterGuard = (router: Router) => {
  const routeStore = useRouteStore();

  const { LOGIN_PATH, LOGIN_NAME, ERROR_PAGE_NAME } = PAGE;

  router.beforeEach(async (to, _, next) => {
    // 判断是否是外链，如果是直接打开网页并拦截跳转
    if (to.meta?.externalLink) {
      window.open(to.meta.externalLink);
      return false;
    }
    // 开始 loadingBar
    window.$loadingBar?.start();

    // 判断有无TOKEN,登录鉴权
    const isLogin = Boolean(getUserToken());
    if (!isLogin) {
      if (to.name !== LOGIN_NAME) {
        const redirect = to.name === "404" ? undefined : to.fullPath;
        next({ path: LOGIN_PATH, query: { redirect } });
      } else {
        next();
      }
      return false;
    }

    // 判断路由有无进行初始化
    if (!routeStore.isInitAuthRoute) {
      await routeStore.initAuthRoute();
      // 动态路由加载完回到根路由
      if (to.name === ERROR_PAGE_NAME) {
        // 等待权限路由加载好了，回到之前的路由,否则404
        next({
          path: to.fullPath,
          query: to.query,
          hash: to.hash,
          replace: true
        });
        return false;
      }
    }

    // 判断当前页是否在login,则定位去首页
    if (to.name === LOGIN_NAME) {
      next({ path: "/" });
      return false;
    }

    next();
  });

  router.afterEach((to) => {
    // 修改网页标题
    document.title = `${to.meta.title} - ${title}`;
    // 结束 loadingBar
    window.$loadingBar?.finish();
  });

  router.onError((error) => {
    console.log(error, "路由错误");
  });
};
