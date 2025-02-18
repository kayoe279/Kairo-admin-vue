<script setup lang="ts">
import { generatorMenu, generatorMenuMix } from "@/lib/utils/menu";
import { useAppStore, useRouteStore, useThemeSettingStore } from "@/store";
import type { MenuInst } from "naive-ui";
import type { MenuMixedOption } from "naive-ui/es/menu/src/interface";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Props {
  mode?: "vertical" | "horizontal";
  location?: "side" | "header";
  collapsed?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  mode: "vertical",
  location: "side"
});

const emit = defineEmits(["update:collapsed", "onMenuItemClick"]);

const route = useRoute();
const router = useRouter();
const routeStore = useRouteStore();
const themeStore = useThemeSettingStore();
const appStore = useAppStore();
const { inverted, darkNav } = storeToRefs(themeStore);
const { navMode, menuSetting } = storeToRefs(appStore);

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
  } else {
    if (navMode.value === "horizontal-mix") {
      updateDefaultExpandedKeys();
    }
  }
};

const updateMenus = () => {
  if (navMode.value === "horizontal-mix") {
    const matched = route.matched;
    const firstRouteName =
      (matched[0].meta?.activeMenu as string) || (matched[0].name as string) || "";
    menus.value = generatorMenuMix(routeStore.menus, firstRouteName, props.location);
  } else {
    menus.value = generatorMenu(routeStore.menus);
  }

  updateSelectedValues();
};

// 点击菜单
const onMenuItemClick = (key: string) => {
  if (/http(s)?:/.test(key)) {
    window.open(key);
  } else {
    router.push({ name: key });
  }
  emit("onMenuItemClick", key);
};

// 监听导航栏模式
watch(navMode, () => {
  updateMenus();
  if (props.collapsed) {
    emit("update:collapsed", !props.collapsed);
  }
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
    :inverted="inverted || darkNav"
    :mode="mode"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="20"
    :indent="24"
    :value="selectedValues"
    @update:value="onMenuItemClick"
    :default-expanded-keys="defaultExpandedKeys"
    :watch-props="['defaultExpandedKeys']"
    responsive
  />
</template>
