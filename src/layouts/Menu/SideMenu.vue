<script setup lang="ts">
import BaseMenu from "./BaseMenu.vue";
import { generatorMenu } from "@/lib/utils/menu";
import { useRouteStore } from "@/store";
import { computed } from "vue";
import type { RouteRecordRaw } from "vue-router";

interface Props {
  routes?: RouteRecordRaw[];
}

const props = defineProps<Props>();

const routeStore = useRouteStore();

// 使用传入的路由或默认路由
const menuRoutes = computed(() => props.routes || routeStore.rowRoutes);
</script>

<template>
  <BaseMenu
    mode="vertical"
    :routes="menuRoutes"
    :menu-generator="generatorMenu"
    :show-accordion="true"
    :show-collapsed="true"
  />
</template>
