<script lang="ts" setup>
import { appConfig } from "@/lib/settings/app";
import { isRootRoute } from "@/lib/utils/menu";
import { useAppStore } from "@/store";
import { useFullscreen } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

const collapsed = defineModel<boolean>("collapsed");

const route = useRoute();
const appStore = useAppStore();
const { navMode, headerSetting } = storeToRefs(appStore);

const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

const hideCollapseIcon = computed(() => {
  return (
    navMode.value === "horizontal" ||
    (navMode.value === "horizontal-mix" && isRootRoute(route.matched[0]))
  );
});

const onIconClick = (key: "github" | "lock") => {
  if (key === "github") {
    window.open(appConfig.github);
  }
};
</script>

<template>
  <div
    class="z-10 flex w-full items-center justify-between gap-x-5 px-4 shadow-xs transition-all duration-200 ease-in-out md:px-5"
    :style="{ height: headerSetting.height + 'px' }"
  >
    <div class="flex h-full min-w-0 flex-1 items-center gap-x-5">
      <ButtonIcon
        v-if="!hideCollapseIcon"
        :icon="collapsed ? 'line-md:menu-fold-right' : 'line-md:menu-fold-left'"
        hideTooltip
        @click="collapsed = !collapsed"
      />
      <!--顶部菜单-->
      <div
        v-if="navMode === 'horizontal' || navMode === 'horizontal-mix'"
        class="flex h-full min-w-0 flex-1 items-center gap-x-5"
      >
        <Logo
          v-if="navMode === 'horizontal'"
          class="flex h-16 shrink-0 items-center justify-center overflow-hidden whitespace-nowrap max-md:hidden"
        />
        <Menu location="header" mode="horizontal" />
      </div>

      <!-- 面包屑 -->
      <Breadcrumb v-else class="hidden items-center md:flex" />
    </div>
    <div class="flex h-full items-center gap-x-6">
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
  <!--项目配置drawer -->
  <SettingDrawer />
</template>
