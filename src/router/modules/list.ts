import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/list",
    name: "list",
    redirect: "/list/basic-list",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "列表页面",
      icon: svgIconRender({ icon: "solar:checklist-minimalistic-outline" }),
      sort: 1
    },
    children: [
      {
        path: "/list/basic-list",
        name: "list-basic-list",
        meta: {
          title: "基础列表"
        },
        component: () => import("@/views/list/basicList/index.vue")
      },
      {
        path: "/list/basic-info/:id?",
        name: "list-basic-info",
        meta: {
          title: "基础详情",
          hidden: true
        },
        component: () => import("@/views/list/basicList/info.vue")
      }
    ]
  }
];

export default routes;
