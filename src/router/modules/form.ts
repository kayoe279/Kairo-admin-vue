import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/form",
    name: "form",
    redirect: "/form/basic-form",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "表单页面",
      icon: svgIconRender({ icon: "solar:document-add-broken" }),
      sort: 3
    },
    children: [
      {
        path: "/form/basic-form",
        name: "form-basic-form",
        meta: {
          title: "基础表单"
        },
        component: () => import("@/views/form/basicForm/index.vue")
      },
      {
        path: "/form/step-form",
        name: "form-step-form",
        meta: {
          title: "分步表单"
        },
        component: () => import("@/views/form/stepForm/stepForm.vue")
      },
      {
        path: "/form/detail",
        name: "form-detail",
        meta: {
          title: "表单详情"
        },
        component: () => import("@/views/form/detail/index.vue")
      }
    ]
  }
];

export default routes;
