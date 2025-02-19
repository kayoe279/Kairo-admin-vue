import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routeName = "dashboard";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/dashboard",
    name: routeName,
    redirect: "/dashboard/workplace",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "Dashboard",
      icon: svgIconRender({ icon: "ant-design:dashboard-outlined" }),
      sort: 0
    },
    children: [
      {
        path: "/dashboard/workplace",
        name: `${routeName}-workplace`,
        meta: {
          title: "工作台",
          keepAlive: true,
          affix: true
        },
        component: () => import("@/views/dashboard/workplace/workplace.vue")
      },
      {
        path: "/dashboard/console",
        name: `${routeName}-console`,
        meta: {
          title: "主控台",
          keepAlive: true
        },
        component: () => import("@/views/dashboard/console/console.vue")
      }
    ]
  }
];

export default routes;
