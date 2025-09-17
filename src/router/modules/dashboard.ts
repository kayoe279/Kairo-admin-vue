import { svgIconRender } from "@/lib";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/dashboard",
    name: "dashboard",
    redirect: "/dashboard/workplace",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "仪表盘",
      icon: svgIconRender({ icon: "solar:chart-square-broken" }),
      sort: 0
    },
    children: [
      {
        path: "/dashboard/workplace",
        name: "dashboardWorkplace",
        meta: {
          title: "工作台",
          keepAlive: true,
          affix: true
        },
        component: () => import("@/views/dashboard/workplace.vue")
      },
      {
        path: "/dashboard/analysis",
        name: "dashboardAnalysis",
        meta: {
          title: "数据分析",
          keepAlive: true
        },
        component: () => import("@/views/dashboard/analysis.vue")
      },
      {
        path: "/dashboard/monitor",
        name: "dashboardMonitor",
        meta: {
          title: "实时监控"
        },
        component: () => import("@/views/dashboard/monitor.vue")
      }
    ]
  }
];

export default routes;
