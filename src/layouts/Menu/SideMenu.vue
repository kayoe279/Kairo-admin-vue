<script setup lang="ts">
import { useMenu } from "@/hooks";
import { useAppStore, useRouteStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import type { RouteRecordRaw } from "vue-router";

interface Props {
  routes?: RouteRecordRaw[];
}

const props = defineProps<Props>();
const routeStore = useRouteStore();

const appStore = useAppStore();
const { menuSetting } = storeToRefs(appStore);

// 使用传入的路由或默认路由
const menuRoutes = computed(() => props.routes || routeStore.rowRoutes);

const { menuInstRef, menus, defaultExpandedKeys, selectedValues, onMenuItemClick } = useMenu({
  routes: menuRoutes
});
</script>

<template>
  <NMenu
    ref="menuInstRef"
    mode="vertical"
    :accordion="menuSetting.accordion"
    :options="menus"
    :collapsed="menuSetting.collapsed"
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
