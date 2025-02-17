import { svgIconRender } from "@/lib/svgIconRender";
import { Layout } from "@/router/constant";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/list",
    name: "List",
    redirect: "/list/basic-list",
    component: Layout,
    meta: {
      title: "列表页面",
      icon: svgIconRender({ icon: "solar:checklist-minimalistic-outline" }),
      sort: 2
    },
    children: [
      {
        path: "basic-list",
        name: "basic-list",
        meta: {
          title: "基础列表"
        },
        component: () => import("@/views/list/basicList/index.vue")
      },
      {
        path: "basic-info/:id?",
        name: "basic-info",
        meta: {
          title: "基础详情",
          hidden: true,
          activeMenu: "basic-list"
        },
        component: () => import("@/views/list/basicList/info.vue")
      }
    ]
  }
];

export default routes;
