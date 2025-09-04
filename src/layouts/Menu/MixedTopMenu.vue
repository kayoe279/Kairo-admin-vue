<script setup lang="ts">
import { generatorMenuMix } from "@/lib/utils/menu";
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
const { locale } = storeToRefs(appStore);

const menuInstRef = ref<MenuInst | null>(null);
const menus = ref<MenuMixedOption[]>([]);
const selectedValues = ref<string>(route.name as string);

// 更新选中的值
const updateSelectedValues = () => {
  selectedValues.value = (route.meta?.activeMenu as string) || (route.name as string);
};

const updateMenus = () => {
  const matched = route.matched;
  const firstRouteName =
    (matched[0].meta?.activeMenu as string) || (matched[0].name as string) || "";
  menus.value = generatorMenuMix(routeStore.rowRoutes, firstRouteName, "header");
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
    :options="menus"
    mode="horizontal"
    :icon-size="20"
    :value="selectedValues"
    @update:value="onMenuItemClick"
    responsive
  />
</template>
