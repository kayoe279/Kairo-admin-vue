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
    path: "/auth/login",
    name: "login",
    component: () => import("@/views/auth/login.vue"),
    meta: {
      title: "登录",
      hidden: true,
      ignoreAuth: true
    }
  }
];

export const innerRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "/403",
        name: "403",
        component: () => import("@/views/exception/403.vue"),
        meta: {
          title: "用户无权限",
          hidden: true,
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
          hidden: true,
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
          hidden: true,
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
          hidden: true,
          ignoreAuth: true
        }
      }
    ]
  }
];
