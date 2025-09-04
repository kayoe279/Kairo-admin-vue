<script setup lang="ts">
import BaseMenu from "./BaseMenu.vue";
import { generatorMenu } from "@/lib/utils/menu";
import { useRouteStore } from "@/store";

const routeStore = useRouteStore();
</script>

<template>
  <BaseMenu
    mode="horizontal"
    :routes="routeStore.rowRoutes"
    :menu-generator="generatorMenu"
    :show-accordion="false"
    :show-collapsed="false"
  />
</template>
