<script lang="ts" setup>
import { useMedia } from "@/hooks/useMedia";
import { cn } from "@/lib";
import { isRootMenu } from "@/lib/menu";
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

const showMenu = computed(() => {
  if (fullScreen.value) return false;
  const hideMixMenuSub = navMode.value === "horizontal-mix" && !isRootMenu(route.matched?.[0]);
  return !isMobile.value && (navMode.value === "vertical" || hideMixMenuSub);
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
  <NLayout position="absolute" has-sider>
    <NLayoutSider
      v-if="showMenu"
      @collapse="() => appStore.toggleMenuCollapsed(true)"
      @expand="() => appStore.toggleMenuCollapsed(false)"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="menuSetting.minMenuWidth"
      :width="desktopMenuWidth"
      :native-scrollbar="false"
      :inverted="darkNav"
      class="pb-4 !transition-all"
    >
      <Logo />
      <Menu />
    </NLayoutSider>

    <NDrawer v-model:show="showSideDrawer" :width="menuSetting.menuWidth" :placement="'left'">
      <NLayoutSider
        :collapsed="false"
        :width="menuSetting.menuWidth"
        :native-scrollbar="false"
        :inverted="darkNav"
      >
        <Logo />
        <Menu />
      </NLayoutSider>
    </NDrawer>

    <div
      :class="
        cn(
          'text-foreground bg-background-root relative h-screen min-w-0 flex-1',
          headerSetting.fixed ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'
        )
      "
    >
      <Header v-if="!fullScreen" />
      <TabsView v-if="multiTabsSetting.show" class="shrink-0" />

      <Main :class="cn('p-4', headerSetting.fixed && 'min-h-0 flex-1 overflow-y-auto')" />

      <n-back-top :right="80" />
    </div>
  </NLayout>
</template>
