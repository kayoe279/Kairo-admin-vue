<script setup lang="ts">
import SideMenu from "./SideMenu.vue";
import { useRouteStore } from "@/store";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const routeStore = useRouteStore();

// 获取过滤后的路由，只显示当前激活的顶级路由的子菜单
const filteredRoutes = computed(() => {
  const matched = route.matched;
  const firstRouteName =
    (matched[0].meta?.activeMenu as string) || (matched[0].name as string) || "";

  // 过滤出当前激活的顶级路由
  return routeStore.rowRoutes.filter((routeItem) => routeItem.name === firstRouteName);
});
</script>

<template>
  <SideMenu :routes="filteredRoutes" />
</template>
