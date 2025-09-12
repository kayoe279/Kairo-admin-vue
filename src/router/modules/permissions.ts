import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/permissions",
    name: "permissions",
    redirect: "/permissions/example",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "权限",
      icon: svgIconRender({ icon: "solar:shield-user-broken" }),
      sort: 4
    },
    children: [
      {
        path: "/permissions/example",
        name: "permissionsExample",
        meta: {
          title: "权限展示"
        },
        component: () => import("@/views/permissions/example.vue")
      },
      {
        path: "/permissions/super",
        name: "permissionsSuper",
        meta: {
          title: "超级管理员",
          roles: ["super"]
        },
        component: () => import("@/views/permissions/super.vue")
      }
    ]
  }
];

export default routes;
