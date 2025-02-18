import { svgIconRender } from "@/lib/svgIconRender";
import { Layout } from "@/router/constant";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/result",
    name: "result",
    redirect: "/result/success",
    component: Layout,
    meta: {
      title: "结果页面",
      icon: svgIconRender({ icon: "solar:emoji-funny-circle-linear" }),
      sort: 4
    },
    children: [
      {
        path: "/result/success",
        name: "result-success",
        meta: {
          title: "成功页"
        },
        component: () => import("@/views/result/success.vue")
      },
      {
        path: "/result/fail",
        name: "result-fail",
        meta: {
          title: "失败页"
        },
        component: () => import("@/views/result/fail.vue")
      },
      {
        path: "/result/info",
        name: "result-info",
        meta: {
          title: "信息页"
        },
        component: () => import("@/views/result/info.vue")
      }
    ]
  }
];

export default routes;
