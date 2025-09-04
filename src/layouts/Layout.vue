<script lang="ts" setup>
import { useMedia } from "@/hooks/useMedia";
import { isRootRoute } from "@/lib/utils/menu";
import { useAppStore, useThemeStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed, unref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { isMobile } = useMedia();

const appStore = useAppStore();
const themeStore = useThemeStore();
const { darkNav } = storeToRefs(themeStore);
const { navMode, headerSetting, menuSetting, multiTabsSetting, fullScreen } = storeToRefs(appStore);

const collapsed = computed(() => menuSetting.value.collapsed);

const fixedHeader = computed(() => (headerSetting.value.fixed ? "absolute" : "static"));
const fixedMenu = computed(() => (headerSetting.value.fixed ? "absolute" : "static"));
const showMenu = computed(() => {
  if (fullScreen.value) return false;
  const hideMixMenuSub = navMode.value === "horizontal-mix" && !isRootRoute(route.matched?.[0]);
  return !isMobile.value && (navMode.value === "vertical" || hideMixMenuSub);
});
const mainStyles = computed(() => {
  const headerHeight = headerSetting.value.height;
  const multiTabsHeight = multiTabsSetting.value.height;
  const showMultiTabs = multiTabsSetting.value.show;
  if (headerSetting.value.fixed) {
    return {
      "padding-top": `${(fullScreen.value ? 0 : headerHeight) + (showMultiTabs ? multiTabsHeight : 0) + 16}px`
    };
  }
  return undefined;
});

const desktopMenuWidth = computed(() => {
  const { minMenuWidth, menuWidth } = unref(menuSetting);
  return collapsed.value ? minMenuWidth : menuWidth;
});

// 控制显示或隐藏移动端侧边栏
const showSideDrawer = computed({
  get: () => isMobile.value && !collapsed.value,
  set: () => appStore.toggleMenuCollapsed()
});
</script>

<template>
  <n-layout :position="fixedMenu" has-sider>
    <n-layout-sider
      v-if="showMenu"
      @collapse="() => appStore.toggleMenuCollapsed(true)"
      @expand="() => appStore.toggleMenuCollapsed(false)"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="menuSetting.minMenuWidth"
      :width="desktopMenuWidth"
      :native-scrollbar="false"
      :inverted="darkNav"
      class="!z-[12] !shadow-xs !transition-all !duration-300"
    >
      <Logo />
      <Menu />
    </n-layout-sider>

    <n-drawer v-model:show="showSideDrawer" :width="menuSetting.menuWidth" :placement="'left'">
      <n-layout-sider
        :position="fixedMenu"
        :collapsed="false"
        :width="menuSetting.menuWidth"
        :native-scrollbar="false"
        :inverted="darkNav"
      >
        <Logo />
        <Menu />
      </n-layout-sider>
    </n-drawer>

    <div class="relative h-screen min-w-0 flex-1 overflow-hidden">
      <n-layout
        :position="fixedHeader"
        :native-scrollbar="false"
        class="!bg-background-root h-full"
      >
        <n-layout-header :position="fixedHeader" class="!z-10">
          <Header v-if="!fullScreen" />
          <TabsView v-if="multiTabsSetting.show" />
        </n-layout-header>

        <main class="p-4" :style="mainStyles">
          <Main />
        </main>

        <n-back-top :right="80" />
      </n-layout>
    </div>
  </n-layout>
</template>
