import { svgIconRender } from "@/lib";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/about",
    name: "about",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "关于",
      sort: 9,
      isRoot: true,
      icon: svgIconRender({ icon: "solar:info-circle-broken" })
    },
    children: [
      {
        path: "/about/index",
        name: "aboutIndex",
        meta: {
          title: "关于项目"
        },
        component: () => import("@/views/about/index.vue")
      }
    ]
  }
];

export default routes;
