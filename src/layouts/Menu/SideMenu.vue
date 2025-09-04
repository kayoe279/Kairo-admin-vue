<script setup lang="ts">
import { generatorMenu } from "@/lib/utils/menu";
import { useAppStore, useRouteStore } from "@/store";
import type { MenuInst } from "naive-ui";
import type { MenuMixedOption } from "naive-ui/es/menu/src/interface";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const routeStore = useRouteStore();
const appStore = useAppStore();
const { menuSetting, locale } = storeToRefs(appStore);

const menuInstRef = ref<MenuInst | null>(null);
const menus = ref<MenuMixedOption[]>([]);
const defaultExpandedKeys = ref<string[]>(route.matched?.map((item) => item.name as string) || []);
const selectedValues = ref<string>(route.name as string);

const updateDefaultExpandedKeys = () => {
  defaultExpandedKeys.value = route.matched?.map((item) => item.name as string) || [];
};

// 更新选中的值
const updateSelectedValues = () => {
  selectedValues.value = (route.meta?.activeMenu as string) || (route.name as string);
  if (menuSetting.value.accordion) {
    updateDefaultExpandedKeys();
  }
};

const updateMenus = () => {
  menus.value = generatorMenu(routeStore.rowRoutes);
  updateSelectedValues();
};

// 点击菜单
const onMenuItemClick = (key: string) => {
  if (/http(s)?:/.test(key)) {
    window.open(key);
  } else {
    router.push({ name: key });
  }
};

// 监听语言变化
watch(locale, () => {
  updateMenus();
});

// 跟随页面路由变化，切换菜单选中状态
watch(
  () => route.fullPath,
  () => {
    menuInstRef.value?.showOption(route.name as string);
    updateMenus();
  },
  {
    immediate: true
  }
);

onMounted(() => {
  updateMenus();
});
</script>

<template>
  <n-menu
    ref="menuInstRef"
    :accordion="menuSetting.accordion"
    :options="menus"
    mode="vertical"
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
