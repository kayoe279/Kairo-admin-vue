import { svgIconRender } from "@/lib/svgIconRender";
import { Layout } from "@/router/constant";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/permissions",
    name: "Permissions",
    redirect: "/permissions/example",
    component: Layout,
    meta: {
      title: "权限",
      icon: svgIconRender({ icon: "solar:shield-user-broken" }),
      sort: 3
    },
    children: [
      {
        path: "example",
        name: "permissions-example",
        meta: {
          title: "权限展示"
        },
        component: () => import("@/views/permissions/example.vue")
      }
    ]
  }
];

export default routes;
