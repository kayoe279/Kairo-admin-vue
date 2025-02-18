import { svgIconRender } from "@/lib/svgIconRender";
import { Layout } from "@/router/constant";
import type { RouteRecordRaw } from "vue-router";

const routeName = "comp";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/comp",
    name: routeName,
    component: Layout,
    redirect: "/comp/table",
    meta: {
      title: "组件示例",
      icon: svgIconRender({ icon: "proicons:component" }),
      sort: 6
    },
    children: [
      {
        path: "/comp/table",
        name: `${routeName}-table`,
        redirect: "/comp/table/basic",
        meta: {
          title: "表格"
        },
        children: [
          {
            path: "/comp/table/basic",
            name: `${routeName}-table-basic`,
            meta: {
              title: "基础表格"
            },
            component: () => import("@/views/comp/table/basic.vue")
          },
          {
            path: "/comp/table/editCell",
            name: `${routeName}-table-editCell`,
            meta: {
              title: "单元格编辑"
            },
            component: () => import("@/views/comp/table/editCell.vue")
          },
          {
            path: "/comp/table/editRow",
            name: `${routeName}-table-editRow`,
            meta: {
              title: "整行编辑"
            },
            component: () => import("@/views/comp/table/editRow.vue")
          }
        ]
      },
      {
        path: "/comp/form",
        name: `${routeName}-form`,
        redirect: "/comp/form/basic",
        meta: {
          title: "表单"
        },
        children: [
          {
            path: "/comp/form/basic",
            name: `${routeName}-form-basic`,
            meta: {
              title: "基础使用"
            },
            component: () => import("@/views/comp/form/basic.vue")
          },
          {
            path: "/comp/form/useForm",
            name: `${routeName}-form-useForm`,
            meta: {
              title: "useForm"
            },
            component: () => import("@/views/comp/form/useForm.vue")
          }
        ]
      },
      {
        path: "/comp/upload",
        name: `${routeName}-upload`,
        meta: {
          title: "上传图片"
        },
        component: () => import("@/views/comp/upload/index.vue")
      },
      {
        path: "/comp/modal",
        name: `${routeName}-modal`,
        meta: {
          title: "弹窗扩展"
        },
        component: () => import("@/views/comp/modal/index.vue")
      },
      {
        path: "/comp/richtext",
        name: `${routeName}-richtext`,
        meta: {
          title: "富文本"
        },
        component: () => import("@/views/comp/richtext/vue-quill.vue")
      },
      {
        path: "/comp/drag",
        name: `${routeName}-drag`,
        meta: {
          title: "拖拽"
        },
        component: () => import("@/views/comp/drag/index.vue")
      }
    ]
  }
];

export default routes;
