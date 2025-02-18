import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/about",
    name: "about",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      sort: 10,
      isRoot: true,
      icon: svgIconRender({ icon: "ix:about" })
    },
    children: [
      {
        path: "/about/index",
        name: `about-index`,
        meta: {
          title: "关于项目"
        },
        component: () => import("@/views/about/index.vue")
      }
    ]
  }
];

export default routes;
