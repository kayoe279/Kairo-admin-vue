import { svgIconRender } from "@/lib";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/system",
    name: "system",
    redirect: "/system/user",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "系统管理",
      icon: svgIconRender({ icon: "solar:settings-minimalistic-broken" }),
      sort: 6
    },
    children: [
      // 用户管理
      {
        path: "/system/user",
        name: "systemUser",
        redirect: "/system/user/list",
        meta: {
          title: "用户管理"
        },
        children: [
          {
            path: "/system/user/list",
            name: "systemUserList",
            meta: {
              title: "用户列表"
            },
            component: () => import("@/views/system/user/list.vue")
          },
          {
            path: "/system/user/detail/:id",
            name: "systemUserDetail",
            meta: {
              title: "用户详情",
              hidden: true
            },
            component: () => import("@/views/system/user/detail.vue")
          }
        ]
      },
      // 角色管理 - 二级路由
      {
        path: "/system/role",
        name: "systemRole",
        redirect: "/system/role/list",
        meta: {
          title: "角色管理"
        },
        children: [
          {
            path: "/system/role/list",
            name: "systemRoleList",
            meta: {
              title: "角色列表"
            },
            component: () => import("@/views/system/role/list.vue")
          },
          {
            path: "/system/role/detail/:id",
            name: "systemRoleDetail",
            meta: {
              title: "角色详情",
              hidden: true
            },
            component: () => import("@/views/system/role/detail.vue")
          },
          {
            path: "/system/role/permissions/:id",
            name: "systemRolePermissions",
            meta: {
              title: "角色权限",
              hidden: true
            },
            component: () => import("@/views/system/role/permissions.vue")
          }
        ]
      },
      // 菜单管理
      {
        path: "/system/menu",
        name: "systemMenu",
        redirect: "/system/menu/list",
        meta: {
          title: "菜单管理"
        },
        children: [
          {
            path: "/system/menu/list",
            name: "systemMenuList",
            meta: {
              title: "菜单列表"
            },
            component: () => import("@/views/system/menu/list.vue")
          },
          {
            path: "/system/menu/detail/:id?",
            name: "systemMenuDetail",
            meta: {
              title: "菜单详情",
              hidden: true
            },
            component: () => import("@/views/system/menu/detail.vue")
          }
        ]
      },
      // 部门管理
      {
        path: "/system/dept",
        name: "systemDept",
        redirect: "/system/dept/list",
        meta: {
          title: "部门管理"
        },
        children: [
          {
            path: "/system/dept/list",
            name: "systemDeptList",
            meta: {
              title: "部门列表"
            },
            component: () => import("@/views/system/dept/list.vue")
          },
          {
            path: "/system/dept/detail/:id?",
            name: "systemDeptDetail",
            meta: {
              title: "部门详情",
              hidden: true
            },
            component: () => import("@/views/system/dept/detail.vue")
          }
        ]
      }
    ]
  }
];

export default routes;
