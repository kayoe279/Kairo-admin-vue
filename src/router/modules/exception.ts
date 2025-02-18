import { svgIconRender } from "@/lib/svgIconRender";
import { Layout } from "@/router/constant";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/exception",
    name: "exception",
    redirect: "/exception/403",
    component: Layout,
    meta: {
      title: "异常页面",
      icon: svgIconRender({ icon: "solar:confounded-circle-broken" }),
      sort: 2
    },
    children: [
      {
        path: "/exception/403",
        name: "exception-403",
        meta: {
          title: "403"
        },
        component: () => import("@/views/exception/403.vue")
      },
      {
        path: "/exception/404",
        name: "exception-404",
        meta: {
          title: "404"
        },
        component: () => import("@/views/exception/404.vue")
      },
      {
        path: "/exception/500",
        name: "exception-500",
        meta: {
          title: "500"
        },
        component: () => import("@/views/exception/500.vue")
      }
    ]
  }
];

export default routes;
