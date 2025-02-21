import type { RouteRecordRaw } from "vue-router";

export const baseRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "root",
    redirect: "/dashboard/workplace",
    meta: {
      title: "Root"
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      withoutTab: true,
      ignoreAuth: true
    }
  }
];

export const innerRoutes: RouteRecordRaw[] = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/exception/403.vue"),
    meta: {
      title: "用户无权限",
      withoutTab: true,
      ignoreAuth: true
    }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/exception/404.vue"),
    meta: {
      title: "找不到页面",
      icon: "icon-park-outline:ghost",
      withoutTab: true,
      ignoreAuth: true
    }
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/exception/500.vue"),
    meta: {
      title: "服务器错误",
      icon: "icon-park-outline:close-wifi",
      withoutTab: true,
      ignoreAuth: true
    }
  },
  {
    path: "/:path(.*)*",
    name: "404",
    component: () => import("@/views/exception/404.vue"),
    meta: {
      title: "找不到页面",
      icon: "icon-park-outline:ghost",
      withoutTab: true,
      ignoreAuth: true
    }
  }
];
