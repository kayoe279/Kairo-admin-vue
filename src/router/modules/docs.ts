import { renderIcon } from "@/lib/index";
import { Layout } from "@/router/constant";
import { DocumentTextOutline } from "@vicons/ionicons5";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/external",
    name: "https://docs.naiveadmin.com",
    component: Layout,
    meta: {
      title: "项目文档",
      icon: renderIcon(DocumentTextOutline),
      sort: 11
    }
  }
];

export default routes;
