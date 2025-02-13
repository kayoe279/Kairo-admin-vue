<template>
  <NMenu
    :options="menus"
    :inverted="inverted || darkNav"
    :mode="mode"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="20"
    :indent="24"
    :expanded-keys="openKeys"
    :value="getSelectedKeys"
    @update:value="clickMenuItem"
    @update:expanded-keys="menuExpanded"
    responsive
  />
</template>

<script setup lang="ts">
import { generatorMenu, generatorMenuMix } from "@/lib/utils";
import { useAppSettingStore } from "@/store/modules/appSetting";
import { useAsyncRouteStore } from "@/store/modules/asyncRoute";
import { useThemeSettingStore } from "@/store/modules/themeSetting";
import { MenuMixedOption } from "naive-ui/es/menu/src/interface";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, unref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Props {
  mode?: "vertical" | "horizontal";
  collapsed?: boolean;
  location?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "vertical",
  location: "left"
});

const emit = defineEmits(["update:collapsed", "clickMenuItem"]);

const currentRoute = useRoute();
const router = useRouter();
const asyncRouteStore = useAsyncRouteStore();
const themeStore = useThemeSettingStore();
const settingStore = useAppSettingStore();
const { inverted, darkNav } = storeToRefs(themeStore);
const { navMode } = storeToRefs(settingStore);

const menus = ref<MenuMixedOption[]>([]);
const selectedKeys = ref<string>(currentRoute.name as string);
const headerMenuSelectKey = ref<string>("");

// 获取当前打开的子菜单
const matched = currentRoute.matched;
const getOpenKeys = matched && matched.length ? (matched.map((item) => item.name) as string[]) : [];
const openKeys = ref<string[]>(getOpenKeys);

const getSelectedKeys = computed(() => {
  const location = props.location;
  return location === "left" || (location === "header" && unref(navMode.value) === "horizontal")
    ? unref(selectedKeys)
    : unref(headerMenuSelectKey);
});

function updateSelectedKeys() {
  const matched = currentRoute.matched;
  openKeys.value = matched.map((item) => item.name as string);
  const activeMenu: string = (currentRoute.meta?.activeMenu as string) || "";
  selectedKeys.value = activeMenu ? (activeMenu as string) : (currentRoute.name as string);
}

function updateMenu() {
  if (navMode.value === "horizontal-mix") {
    //混合菜单
    const firstRouteName: string = (currentRoute.matched[0].name as string) || "";
    menus.value = generatorMenuMix(asyncRouteStore.getMenus, firstRouteName, props.location);
    const activeMenu: string = currentRoute?.matched[0].meta?.activeMenu as string;
    headerMenuSelectKey.value = (activeMenu ? activeMenu : firstRouteName) || "";
  } else {
    menus.value = generatorMenu(asyncRouteStore.getMenus);
  }
  updateSelectedKeys();
}

// 点击菜单
function clickMenuItem(key: string) {
  if (/http(s)?:/.test(key)) {
    window.open(key);
  } else {
    router.push({ name: key });
  }
  emit("clickMenuItem", key);
}

//展开菜单
function menuExpanded(keys: string[]) {
  if (!keys) return;
  const latestOpenKey = keys.find((key) => openKeys.value.indexOf(key) === -1);
  const isExistChildren = findChildrenLen(latestOpenKey as string);
  openKeys.value = isExistChildren ? (latestOpenKey ? [latestOpenKey] : []) : keys;
}

//查找是否存在子路由
function findChildrenLen(key: string) {
  if (!key) return false;
  const subRouteChildren: string[] = [];
  for (const item of menus.value) {
    const itemKey = item.key;
    const children = item.children as MenuMixedOption[];
    if (children && children.length) {
      subRouteChildren.push(itemKey as string);
    }
  }
  return subRouteChildren.includes(key);
}

// 监听导航栏模式
watch(navMode, () => {
  updateMenu();
  if (props.collapsed) {
    emit("update:collapsed", !props.collapsed);
  }
});

// 跟随页面路由变化，切换菜单选中状态
watch(
  () => currentRoute.fullPath,
  () => {
    updateMenu();
  }
);

onMounted(() => {
  updateMenu();
});
</script>
