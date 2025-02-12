import { renderIcon } from "@/lib/utils";
import { Layout } from "@/router/constant";
import { ProjectOutlined } from "@vicons/antd";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/about",
    name: "about",
    component: Layout,
    meta: {
      sort: 10,
      isRoot: true,
      activeMenu: "about_index",
      icon: renderIcon(ProjectOutlined)
    },
    children: [
      {
        path: "index",
        name: `about_index`,
        meta: {
          title: "关于项目",
          activeMenu: "about_index"
        },
        component: () => import("@/views/about/index.vue")
      }
    ]
  }
];

export default routes;
