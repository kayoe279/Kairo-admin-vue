import { svgIconRender } from "@/lib";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/exception",
    name: "exception",
    redirect: "/exception/403",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "异常页面",
      icon: svgIconRender({ icon: "solar:confounded-circle-broken" }),
      sort: 4
    },
    children: [
      {
        path: "/exception/403",
        name: "exception403",
        meta: {
          title: "403"
        },
        component: () => import("@/views/exception/403.vue")
      },
      {
        path: "/exception/404",
        name: "exception404",
        meta: {
          title: "404"
        },
        component: () => import("@/views/exception/404.vue")
      },
      {
        path: "/exception/500",
        name: "exception500",
        meta: {
          title: "500"
        },
        component: () => import("@/views/exception/500.vue")
      }
    ]
  }
];

export default routes;
