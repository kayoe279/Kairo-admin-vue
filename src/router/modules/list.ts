import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/basic-list",
    name: "List",
    redirect: "/basic-list",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "列表页面",
      icon: svgIconRender({ icon: "solar:checklist-minimalistic-outline" }),
      sort: 1
    },
    children: [
      {
        path: "/basic-list",
        name: "basic-list",
        meta: {
          title: "基础列表"
        },
        component: () => import("@/views/basicList/index.vue")
      },
      {
        path: "/basic-info/:id?",
        name: "list-basic-info",
        meta: {
          title: "基础详情",
          hidden: true
        },
        component: () => import("@/views/basicList/info.vue")
      }
    ]
  }
];

export default routes;
