<script setup lang="ts">
import { useMenu } from "@/hooks";
import { useRouteStore } from "@/store";

const routeStore = useRouteStore();

const { menuInstRef, menus, defaultExpandedKeys, selectedValues, onMenuItemClick } = useMenu({
  routes: routeStore.rowRoutes,
  onlyFirstLevel: true
});
</script>

<template>
  <NMenu
    ref="menuInstRef"
    :options="menus"
    mode="horizontal"
    :collapsed-width="64"
    :icon-size="20"
    :collapsed-icon-size="20"
    :indent="24"
    :value="selectedValues"
    @update:value="onMenuItemClick"
    :default-expanded-keys="defaultExpandedKeys"
    :watch-props="['defaultExpandedKeys']"
    responsive
  />
</template>
