import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/directive",
    name: "directive",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      sort: 9,
      isRoot: true,

      icon: svgIconRender({ icon: "solar:compass-broken" })
    },
    children: [
      {
        path: "/directive/index",
        name: `directive-index`,
        meta: {
          title: "指令示例"
        },
        component: () => import("@/views/directive/index.vue")
      }
    ]
  }
];

export default routes;
