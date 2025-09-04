<script setup lang="ts">
import { useAppStore } from "@/store";
import type { MenuInst } from "naive-ui";
import type { MenuMixedOption } from "naive-ui/es/menu/src/interface";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { useRoute, useRouter } from "vue-router";

interface Props {
  mode?: "vertical" | "horizontal";
  routes: RouteRecordRaw[];
  menuGenerator: (routes: RouteRecordRaw[]) => MenuMixedOption[];
  showAccordion?: boolean;
  showCollapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "vertical",
  showAccordion: true,
  showCollapsed: true
});

const route = useRoute();
const router = useRouter();
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
  if (props.showAccordion && menuSetting.value.accordion) {
    updateDefaultExpandedKeys();
  }
};

const updateMenus = () => {
  menus.value = props.menuGenerator(props.routes);
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

// 监听路由变化
watch(
  () => props.routes,
  () => {
    updateMenus();
  },
  { deep: true }
);

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
    :accordion="showAccordion ? menuSetting.accordion : false"
    :options="menus"
    :mode="mode"
    :collapsed="showCollapsed ? menuSetting.collapsed : false"
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
