import { svgIconRender } from "@/lib/svgIconRender";
import { Layout } from "@/router/constant";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/external",
    name: "https://docs.naiveadmin.com",
    component: Layout,
    meta: {
      title: "项目文档",
      icon: svgIconRender({ icon: "solar:document-outline" }),
      sort: 11
    }
  }
];

export default routes;
