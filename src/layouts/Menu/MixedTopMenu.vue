<script setup lang="ts">
import BaseMenu from "./BaseMenu.vue";
import { generatorMenuMix } from "@/lib/utils/menu";
import { useRouteStore } from "@/store";
import type { RouteRecordRaw } from "vue-router";
import { useRoute } from "vue-router";

const route = useRoute();
const routeStore = useRouteStore();

// 创建 MixedTopMenu 专用的菜单生成器
const mixedTopMenuGenerator = (routes: RouteRecordRaw[]) => {
  const matched = route.matched;
  const firstRouteName =
    (matched[0].meta?.activeMenu as string) || (matched[0].name as string) || "";
  return generatorMenuMix(routes, firstRouteName, "header");
};
</script>

<template>
  <BaseMenu
    mode="horizontal"
    :routes="routeStore.rowRoutes"
    :menu-generator="mixedTopMenuGenerator"
    :show-accordion="false"
    :show-collapsed="false"
  />
</template>
