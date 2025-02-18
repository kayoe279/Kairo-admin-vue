import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routeName = "dashboard";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/dashboard",
    name: routeName,
    redirect: "/dashboard/console",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "Dashboard",
      icon: svgIconRender({ icon: "ant-design:dashboard-outlined" }),
      sort: 0
    },
    children: [
      {
        path: "/dashboard/console",
        name: `${routeName}-console`,
        meta: {
          title: "主控台",
          affix: true
        },
        component: () => import("@/views/dashboard/console/console.vue")
      },
      {
        path: "/dashboard/monitor",
        name: `${routeName}-monitor`,
        meta: {
          title: "监控页"
        },
        component: () => import("@/views/dashboard/monitor/monitor.vue")
      },
      {
        path: "/dashboard/workplace",
        name: `${routeName}-workplace`,
        meta: {
          title: "工作台",
          keepAlive: true
        },
        component: () => import("@/views/dashboard/workplace/workplace.vue")
      }
    ]
  }
];

export default routes;
