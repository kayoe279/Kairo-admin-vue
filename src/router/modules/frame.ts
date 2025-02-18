import { svgIconRender } from "@/lib/svgIconRender";
import { Layout } from "@/router/constant";
import type { RouteRecordRaw } from "vue-router";

const IFrame = () => import("@/views/iframe/index.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/frame",
    name: "frame",
    redirect: "/frame/docs",
    component: Layout,
    meta: {
      title: "外部页面",
      sort: 7,
      icon: svgIconRender({ icon: "solar:euro-broken" })
    },
    children: [
      {
        path: "/frame/naive-admin",
        name: "frame-naive-admin",
        meta: {
          title: "NaiveAdmin",
          href: "https://www.naiveadmin.com"
        },
        component: IFrame
      },
      {
        path: "/frame/docs",
        name: "frame-docs",
        meta: {
          title: "项目文档(内嵌)",
          href: "https://jekip.github.io/docs"
        },
        component: IFrame
      },
      {
        path: "/frame/naive",
        name: "frame-naive",
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
