import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const IFrame = () => import("@/views/iframe/index.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/frame",
    name: "frame",
    redirect: "/frame/docs",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "外部页面",
      sort: 7,
      icon: svgIconRender({ icon: "solar:euro-broken" })
    },
    children: [
      {
        path: "/frame/naive-admin",
        name: "frameNaiveAdmin",
        meta: {
          title: "NaiveAdmin",
          href: "https://www.naiveadmin.com"
        },
        component: IFrame
      },
      {
        path: "/frame/naive",
        name: "frameNaive",
        meta: {
          title: "NaiveUi(内嵌)",
          href: "https://www.naiveui.com"
        },
        component: IFrame
      }
    ]
  }
];

export default routes;
