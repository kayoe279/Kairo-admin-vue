import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/dashboard",
    name: "dashboard",
    redirect: "/dashboard/workplace",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "工作台",
      icon: svgIconRender({ icon: "solar:emoji-funny-square-broken" }),
      sort: 0
    },
    children: [
      {
        path: "/dashboard/workplace",
        name: "dashboardWorkplace",
        meta: {
          title: "首页",
          keepAlive: true,
          affix: true
        },
        component: () => import("@/views/dashboard/workplace/workplace.vue")
      },
      {
        path: "/dashboard/console",
        name: "dashboardMonitor",
        meta: {
          title: "监控",
          keepAlive: true
        },
        component: () => import("@/views/dashboard/monitor/monitor.vue")
      }
    ]
  }
];

export default routes;
