import { svgIconRender } from "@/lib";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/permissions",
    name: "permissions",
    redirect: "/permissions/example",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "权限管理",
      icon: svgIconRender({ icon: "solar:shield-user-broken" }),
      sort: 5
    },
    children: [
      {
        path: "/permissions/example",
        name: "permissionsExample",
        meta: {
          title: "权限示例"
        },
        component: () => import("@/views/permissions/example.vue")
      },
      {
        path: "/permissions/super",
        name: "permissionsSuper",
        meta: {
          title: "超级权限",
          roles: ["super"]
        },
        component: () => import("@/views/permissions/super.vue")
      }
    ]
  }
];

export default routes;
