import { renderIcon, renderNew } from "@/lib/index";
import { Layout } from "@/router/constant";
import { SketchOutlined } from "@vicons/antd";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/newversion",
    name: "https://www.naiveadmin.com",
    component: Layout,
    meta: {
      title: "Pro 版本",
      extra: renderNew(),
      icon: renderIcon(SketchOutlined),
      sort: 12
    }
  }
];

export default routes;
