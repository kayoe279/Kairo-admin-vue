import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "user",
    redirect: "/user/list",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "用户管理",
      icon: svgIconRender({ icon: "solar:settings-broken" }),
      sort: 5
    },
    children: [
      {
        path: "/user/list",
        name: "userList",
        meta: {
          title: "用户列表"
        },
        component: () => import("@/views/user/list.vue")
      },
      {
        path: "/user/add",
        name: "userAdd",
        meta: {
          title: "新增用户"
        },
        component: () => import("@/views/user/add.vue")
      },
      {
        path: "/user/edit/:id",
        name: "userEdit",
        meta: {
          title: "编辑用户",
          hidden: true
        },
        component: () => import("@/views/user/edit.vue")
      }
    ]
  }
];

export default routes;
