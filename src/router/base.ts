import { PageEnum } from "@/lib/enums/pageEnum";
import { ErrorPage, Layout, RedirectName } from "@/router/constant";
import type { RouteRecordRaw } from "vue-router";

// 404 on a page
export const ErrorPageRoute: RouteRecordRaw = {
  path: "/:path(.*)*",
  name: "ErrorPage",
  component: Layout,
  meta: {
    title: "ErrorPage",
    hideBreadcrumb: true
  },
  children: [
    {
      path: "/:path(.*)*",
      name: "ErrorPageSon",
      component: ErrorPage,
      meta: {
        title: "ErrorPage",
        hideBreadcrumb: true
      }
    }
  ]
};

export const RedirectRoute: RouteRecordRaw = {
  path: "/redirect",
  name: RedirectName,
  component: Layout,
  meta: {
    title: RedirectName,
    hideBreadcrumb: true
  },
  children: [
    {
      path: "/redirect/:path(.*)",
      name: `${RedirectName}Child`,
      component: () => import("@/views/redirect/index.vue"),
      meta: {
        title: RedirectName,
        hideBreadcrumb: true
      }
    }
  ]
};

export const RootRoute: RouteRecordRaw = {
  path: "/",
  name: "Root",
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: "Root"
  }
};

export const LoginRoute: RouteRecordRaw = {
  path: "/login",
  name: "Login",
  component: () => import("@/views/login/index.vue"),
  meta: {
    title: "登录"
  }
};
