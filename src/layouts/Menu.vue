<script setup lang="ts">
import MixedSideMenu from "./Menu/MixedSideMenu.vue";
import MixedTopMenu from "./Menu/MixedTopMenu.vue";
import SideMenu from "./Menu/SideMenu.vue";
import TopMenu from "./Menu/TopMenu.vue";
import { useAppStore } from "@/store";
import { storeToRefs } from "pinia";
import { watch } from "vue";

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

const appStore = useAppStore();
const { navMode } = storeToRefs(appStore);

// 点击菜单事件
const onMenuItemClick = (key: string) => {
  emit("onMenuItemClick", key);
};

// 更新折叠状态事件
const onUpdateCollapsed = (value: boolean) => {
  emit("update:collapsed", value);
};

// 监听导航栏模式
watch(navMode, () => {
  if (props.collapsed) {
    emit("update:collapsed", !props.collapsed);
  }
});
</script>

<template>
  <!-- 垂直模式菜单 -->
  <SideMenu v-if="navMode === 'vertical'" @onMenuItemClick="onMenuItemClick" />

  <!-- 水平模式菜单 -->
  <TopMenu v-else-if="navMode === 'horizontal'" @onMenuItemClick="onMenuItemClick" />

  <!-- 混合模式-侧边栏菜单 -->
  <MixedSideMenu
    v-else-if="navMode === 'horizontal-mix' && location === 'side'"
    @onMenuItemClick="onMenuItemClick"
  />

  <!-- 混合模式-顶部菜单 -->
  <MixedTopMenu
    v-else-if="navMode === 'horizontal-mix' && location === 'header'"
    @onMenuItemClick="onMenuItemClick"
  />
</template>
