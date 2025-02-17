import { svgIconRender } from "@/lib/svgIconRender";
import { Layout } from "@/router/constant";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/setting",
    name: "Setting",
    redirect: "/setting/account",
    component: Layout,
    meta: {
      title: "设置页面",
      icon: svgIconRender({ icon: "solar:settings-outline" }),
      sort: 5
    },
    children: [
      {
        path: "account",
        name: "setting-account",
        meta: {
          title: "个人设置"
        },
        component: () => import("@/views/setting/account/account.vue")
      },
      {
        path: "system",
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
