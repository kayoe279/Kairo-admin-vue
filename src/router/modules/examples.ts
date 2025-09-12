import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routeName = "examples";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/examples",
    name: "examples",
    component: () => import("@/layouts/Layout.vue"),
    redirect: "/examples/table",
    meta: {
      title: "组件示例",
      icon: svgIconRender({ icon: "proicons:component" }),
      sort: 2
    },
    children: [
      {
        path: "/examples/form",
        name: "examplesForm",
        redirect: "/examples/form/useForm",
        meta: {
          title: "表单"
        },
        children: [
          {
            path: "/examples/form/useForm",
            name: "examplesFormUseForm",
            meta: {
              title: "useForm"
            },
            component: () => import("@/views/examples/form/useForm.vue")
          },
          {
            path: "/examples/form/basic-form",
            name: "examplesFormBasicForm",
            meta: {
              title: "基础表单"
            },
            component: () => import("@/views/examples/form/basicForm.vue")
          },
          {
            path: "/examples/form/step-form",
            name: "examplesFormStepForm",
            meta: {
              title: "分步表单"
            },
            component: () => import("@/views/examples/form/stepForm/stepForm.vue")
          },
          {
            path: "/examples/form/detail",
            name: "examplesFormDetail",
            meta: {
              title: "表单详情"
            },
            component: () => import("@/views/examples/form/detail.vue")
          }
        ]
      },
      {
        path: "/examples/table",
        name: "examplesTable",
        redirect: "/examples/table/basic",
        meta: {
          title: "表格"
        },
        children: [
          {
            path: "/examples/table/basic",
            name: "examplesTableBasic",
            meta: {
              title: "基础表格"
            },
            component: () => import("@/views/examples/table/index.vue")
          },
          {
            path: "/examples/list/info/:id?",
            name: "examplesListInfo",
            meta: {
              title: "基础详情",
              hidden: true
            },
            component: () => import("@/views/examples/table/info.vue")
          }
        ]
      },
      {
        path: "/examples/upload",
        name: "examplesUpload",
        meta: {
          title: "上传图片"
        },
        component: () => import("@/views/examples/upload.vue")
      },
      {
        path: "/examples/modal",
        name: "examplesModal",
        meta: {
          title: "弹窗扩展"
        },
        component: () => import("@/views/examples/modal.vue")
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
