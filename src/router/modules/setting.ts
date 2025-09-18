import { svgIconRender } from "@/lib";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/setting",
    name: "setting",
    redirect: "/setting/account",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "系统设置",
      icon: svgIconRender({ icon: "solar:settings-outline" }),
      sort: 7
    },
    children: [
      {
        path: "/setting/account",
        name: "settingAccount",
        meta: {
          title: "用户设置"
        },
        component: () => import("@/views/setting/account.vue")
      },
      {
        path: "/setting/theme",
        name: "settingTheme",
        meta: {
          title: "主题设置"
        },
        component: () => import("@/views/setting/theme.vue")
      },
      {
        path: "/setting/security",
        name: "settingSecurity",
        meta: {
          title: "安全设置"
        },
        component: () => import("@/views/setting/security.vue")
      }
    ]
  }
];

export default routes;
