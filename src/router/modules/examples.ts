import { svgIconRender } from "@/lib";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/examples",
    name: "examples",
    redirect: "/examples/form",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "组件示例",
      icon: svgIconRender({ icon: "solar:code-square-broken" }),
      sort: 1
    },
    children: [
      // 表单示例 - 三级路由
      {
        path: "/examples/form",
        name: "examplesForm",
        redirect: "/examples/form/basic",
        meta: {
          title: "表单示例"
        },
        children: [
          {
            path: "/examples/form/basic",
            name: "examplesFormBasic",
            meta: {
              title: "基础表单"
            },
            component: () => import("@/views/examples/form/basic.vue")
          },
          {
            path: "/examples/form/advanced",
            name: "examplesFormAdvanced",
            meta: {
              title: "高级表单"
            },
            component: () => import("@/views/examples/form/advanced.vue")
          },
          {
            path: "/examples/form/step",
            name: "examplesFormStep",
            meta: {
              title: "分步表单"
            },
            component: () => import("@/views/examples/form/step.vue")
          },
          {
            path: "/examples/form/validation",
            name: "examplesFormValidation",
            meta: {
              title: "表单验证"
            },
            component: () => import("@/views/examples/form/validation.vue")
          }
        ]
      },
      // 表格示例 - 三级路由
      {
        path: "/examples/table",
        name: "examplesTable",
        redirect: "/examples/table/basic",
        meta: {
          title: "表格示例"
        },
        children: [
          {
            path: "/examples/table/basic",
            name: "examplesTableBasic",
            meta: {
              title: "基础表格"
            },
            component: () => import("@/views/examples/table/basic.vue")
          },
          {
            path: "/examples/table/advanced",
            name: "examplesTableAdvanced",
            meta: {
              title: "高级表格"
            },
            component: () => import("@/views/examples/table/advanced.vue")
          },
          {
            path: "/examples/table/editable",
            name: "examplesTableEditable",
            meta: {
              title: "可编辑表格"
            },
            component: () => import("@/views/examples/table/editable.vue")
          },
          {
            path: "/examples/table/virtual",
            name: "examplesTableVirtual",
            meta: {
              title: "虚拟滚动表格"
            },
            component: () => import("@/views/examples/table/virtual.vue")
          }
        ]
      },
      // 其他组件示例
      {
        path: "/examples/chart",
        name: "examplesChart",
        meta: {
          title: "图表示例"
        },
        component: () => import("@/views/examples/chart.vue")
      },
      {
        path: "/examples/upload",
        name: "examplesUpload",
        meta: {
          title: "文件上传"
        },
        component: () => import("@/views/examples/upload.vue")
      },
      {
        path: "/examples/richtext",
        name: "examplesRichtext",
        meta: {
          title: "富文本"
        },
        component: () => import("@/views/examples/richtext.vue")
      },
      {
        path: "/examples/drag",
        name: "examplesDrag",
        meta: {
          title: "拖拽"
        },
        component: () => import("@/views/examples/drag.vue")
      },
      {
        path: "/examples/directive",
        name: "examplesDirective",
        meta: {
          title: "指令示例"
        },
        component: () => import("@/views/examples/directive.vue")
      }
    ]
  }
];

export default routes;
