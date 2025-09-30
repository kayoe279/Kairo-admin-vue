<script lang="ts" setup>
import { isRootMenu } from "@/lib/menu";
import { appConfig } from "@/lib/settings/app";
import { useAppStore } from "@/store";
import { useFullscreen } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const appStore = useAppStore();
const { navMode, headerSetting, menuSetting } = storeToRefs(appStore);

const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

const showCollapsed = computed(() => {
  return (
    navMode.value === "vertical" ||
    (navMode.value === "horizontal-mix" && !isRootMenu(route.matched[0]))
  );
});

const showMenu = computed(() => {
  return navMode.value === "horizontal" || navMode.value === "horizontal-mix";
});

const onIconClick = (key: "github" | "lock") => {
  if (key === "github") {
    window.open(appConfig.github);
  }
};
</script>

<template>
  <div
    class="bg-background flex w-full shrink-0 items-center justify-between gap-x-5 px-4 transition-all duration-200 ease-in-out md:px-5"
    :style="{ height: headerSetting.height + 'px' }"
  >
    <div class="flex h-full min-w-0 flex-1 items-center gap-x-5">
      <!-- 折叠按钮 -->
      <ButtonIcon
        v-if="showCollapsed"
        :icon="menuSetting.collapsed ? 'line-md:menu-fold-right' : 'line-md:menu-fold-left'"
        hideTooltip
        @click="appStore.toggleMenuCollapsed()"
      />
      <!--顶部菜单-->
      <div v-if="showMenu" class="flex h-full min-w-0 flex-1 items-center gap-x-5">
        <Logo
          v-if="navMode === 'horizontal'"
          class="flex h-16 shrink-0 items-center justify-center overflow-hidden whitespace-nowrap max-md:hidden"
        />
        <Menu location="header" />
      </div>

      <!-- 面包屑 -->
      <Breadcrumb v-else class="hidden items-center md:flex" />
    </div>
    <div class="flex h-full items-center gap-x-4 sm:gap-x-6">
      <ButtonIcon icon="proicons:github" tooltipContent="GitHub" @click="onIconClick('github')" />

      <!--切换全屏-->
      <ButtonIcon
        :icon="
          isFullscreen ? 'solar:quit-full-screen-square-broken' : 'solar:full-screen-square-broken'
        "
        :tooltipContent="$t('app.fullScreen')"
        @click="toggleFullScreen"
      />

      <!-- 切换语音 -->
      <LanguageSwitch />

      <!-- 切换主题 -->
      <ThemeSwitch />

      <!--设置-->
      <ButtonIcon
        icon="solar:settings-broken"
        :tooltipContent="$t('app.projectSetting')"
        @click="() => appStore.toggleDrawer()"
      />

      <!-- 个人中心 -->
      <User />
    </div>
  </div>

  <SettingDrawer />
</template>
