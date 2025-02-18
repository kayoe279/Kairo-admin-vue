import { svgIconRender } from "@/lib/svgIconRender";
import { Layout } from "@/router/constant";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/setting",
    name: "setting",
    redirect: "/setting/account",
    component: Layout,
    meta: {
      title: "设置页面",
      icon: svgIconRender({ icon: "solar:settings-outline" }),
      sort: 8
    },
    children: [
      {
        path: "/setting/menu",
        name: "setting-menu",
        meta: {
          title: "菜单权限"
        },
        component: () => import("@/views/system/menu/menu.vue")
      },
      {
        path: "/setting/role",
        name: "setting-role",
        meta: {
          title: "角色权限"
        },
        component: () => import("@/views/system/role/role.vue")
      },
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
