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
      sort: 6
    },
    children: [
      {
        path: "/setting/account",
        name: "settingAccount",
        meta: {
          title: "个人设置"
        },
        component: () => import("@/views/setting/account.vue")
      },
      {
        path: "/setting/system",
        name: "settingSystem",
        meta: {
          title: "系统设置"
        },
        component: () => import("@/views/setting/system.vue")
      }
    ]
  }
];

export default routes;
