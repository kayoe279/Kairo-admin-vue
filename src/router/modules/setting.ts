import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/setting",
    name: "setting",
    redirect: "/setting/account",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "设置页面",
      icon: svgIconRender({ icon: "solar:settings-outline" }),
      sort: 8
    },
    children: [
      {
        path: "/setting/account",
        name: "setting-account",
        meta: {
          title: "个人设置"
        },
        component: () => import("@/views/setting/account/account.vue")
      },
      {
        path: "/setting/system",
        name: "setting-system",
        meta: {
          title: "系统设置"
        },
        component: () => import("@/views/setting/system/system.vue")
      }
    ]
  }
];

export default routes;
