import { svgIconRender } from "@/lib/svgIconRender";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/product",
    name: "product",
    redirect: "/product/list",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "产品管理",
      icon: svgIconRender({ icon: "solar:box-broken" }),
      sort: 1
    },
    children: [
      {
        path: "/product/list",
        name: "productList",
        meta: {
          title: "产品列表"
        },
        component: () => import("@/views/product/list.vue")
      },
      {
        path: "/product/category",
        name: "productCategory",
        meta: {
          title: "产品分类"
        },
        component: () => import("@/views/product/category.vue")
      }
    ]
  }
];

export default routes;
