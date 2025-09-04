<script setup lang="ts">
import { useAppStore } from "@/store";
import { storeToRefs } from "pinia";

interface Props {
  location?: "side" | "header";
}
withDefaults(defineProps<Props>(), {
  location: "side"
});

const appStore = useAppStore();
const { navMode } = storeToRefs(appStore);
</script>

<template>
  <!-- 垂直模式菜单 -->
  <SideMenu v-if="navMode === 'vertical'" />

  <!-- 水平模式菜单 -->
  <TopMenu v-else-if="navMode === 'horizontal'" />

  <!-- 混合模式-侧边栏菜单 -->
  <MixedSideMenu v-else-if="navMode === 'horizontal-mix' && location === 'side'" />

  <!-- 混合模式-顶部菜单 -->
  <MixedTopMenu v-else-if="navMode === 'horizontal-mix' && location === 'header'" />
</template>
