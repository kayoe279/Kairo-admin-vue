import { storage } from "@/lib/Storage2";
import { ACCESS_TOKEN, PAGE } from "@/lib/constants";
import { PageEnum } from "@/lib/enums/pageEnum";
import { useAppStore, useRouteStore, useTabsStore, useUser } from "@/store";
import type { RouteRecordRaw, Router } from "vue-router";
import { isNavigationFailure } from "vue-router";

// const BASE_LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;
// const whitePathList = [LOGIN_PATH]; // no redirect whitelist

// export function createRouterGuards(router: Router) {
//   const userStore = useUser();
//   const routeStore = useRouteStore();

//   const { LOGIN_PATH, LOGIN_NAME } = PAGE;

//   router.beforeEach(async (to, from, next) => {
//     const loadingBar = window["$loadingBar"] || null;
//     loadingBar && loadingBar.start();
//     if (from.name === BASE_LOGIN_NAME && to.name === "errorPage") {
//       next(PageEnum.BASE_HOME);
//       return;
//     }

//     // Whitelist can be directly entered
//     if (whitePathList.includes(to.path as PageEnum)) {
//       next();
//       return;
//     }

//     const token = storage.get(ACCESS_TOKEN);

//     if (!token) {
//       // You can access without permissions. You need to set the routing meta.ignoreAuth to true
//       if (to.meta.ignoreAuth) {
//         next();
//         return;
//       }
//       // redirect login page
//       const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
//         path: LOGIN_PATH,
//         replace: true
//       };
//       if (to.path) {
//         redirectData.query = {
//           ...redirectData.query,
//           redirect: to.path
//         };
//       }
//       next(redirectData);
//       return;
//     }

//     if (routeStore.isDynamicRouteAdded) {
//       next();
//       return;
//     }

//     const userInfo = await userStore.getInfo();

//     const routes = await routeStore.generateRoutes(userInfo);

//     // 动态添加可访问路由表
//     routes.forEach((item) => {
//       router.addRoute(item as unknown as RouteRecordRaw);
//     });

//     //添加404
//     // const isErrorPage = router.getRoutes().findIndex((item) => item.name === ErrorPageRoute.name);
//     // if (isErrorPage === -1) {
//     //   router.addRoute(ErrorPageRoute as unknown as RouteRecordRaw);
//     // }

//     const redirectPath = (from.query.redirect || to.path) as string;
//     const redirect = decodeURIComponent(redirectPath);
//     const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
//     routeStore.setDynamicRouteAdded(true);
//     next(nextData);
//     loadingBar && loadingBar.finish();
//   });

//   // router.beforeResolve((to) => {
//   //   // 设置菜单高亮
//   //   routeStore.setActiveMenu((to.meta?.activeMenu as string) ?? (to.name as string));
//   // });

//   router.afterEach((to, _, failure) => {
//     document.title = (to?.meta?.title as string) || document.title;
//     if (isNavigationFailure(failure)) {
//       //console.log('failed navigation', failure)
//     }
//     const routeStore = useRouteStore();
//     // 在这里设置需要缓存的组件名称
//     const cacheRoutes = routeStore.cacheRoutes;
//     const currentComName: any = to.matched.find((item) => item.name == to.name)?.name;
//     if (currentComName && !cacheRoutes.includes(currentComName) && to.meta?.keepAlive) {
//       // 需要缓存的组件
//       cacheRoutes.push(currentComName);
//     } else if (!to.meta?.keepAlive || to.name == "Redirect") {
//       // 不需要缓存的组件
//       const index = routeStore.cacheRoutes.findIndex((name) => name == currentComName);
//       if (index != -1) {
//         cacheRoutes.splice(index, 1);
//       }
//     }
//     routeStore.setKeepAliveComponents(cacheRoutes);
//     const loadingBar = window["$loadingBar"] || null;
//     loadingBar && loadingBar.finish();
//   });

//   router.onError((error) => {
//     console.log(error, "路由错误");
//   });
// }

const title = import.meta.env.VITE_GLOB_APP_TITLE;

export const setupRouterGuard = (router: Router) => {
  const routeStore = useRouteStore();

  const { LOGIN_PATH, LOGIN_NAME } = PAGE;

  router.beforeEach(async (to, _, next) => {
    // 判断是否是外链，如果是直接打开网页并拦截跳转
    if (to.meta.href) {
      window.open(to.meta.href);
      return false;
    }
    // 开始 loadingBar
    window.$loadingBar?.start();

    // 判断有无TOKEN,登录鉴权
    const isLogin = Boolean(storage.get(ACCESS_TOKEN));
    console.log("%c [ isLogin ]-134", "font-size:13px; background:pink; color:#bf2c9f;", isLogin);
    if (!isLogin) {
      if (to.name !== LOGIN_NAME) {
        const redirect = to.name === "404" ? undefined : to.fullPath;
        next({ path: LOGIN_PATH, query: { redirect } });
      } else {
        next();
      }
    }
    console.log(
      "%c [ to.name ]-137",
      "font-size:13px; background:pink; color:#bf2c9f;",
      to.name,
      routeStore.isInitAuthRoute
    );

    // 判断路由有无进行初始化
    if (!routeStore.isInitAuthRoute) {
      await routeStore.initAuthRoute();
      // 动态路由加载完回到根路由
      if (to.name === "404") {
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
