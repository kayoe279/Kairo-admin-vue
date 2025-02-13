<template>
  <n-layout :position="fixedMenu" has-sider>
    <n-layout-sider
      v-show="showMenu"
      show-trigger="bar"
      @collapse="collapsed = true"
      @expand="collapsed = false"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="menuSetting.minMenuWidth"
      :width="desktopMenuWidth"
      :native-scrollbar="false"
      :inverted="inverted || darkNav"
      class="!z-[12] !shadow-xs !transition-all duration-200 ease-in-out"
    >
      <Logo :collapsed="collapsed" />
      <Menu v-model:collapsed="collapsed" v-model:location="getMenuLocation" />
    </n-layout-sider>

    <n-drawer v-model:show="showSideDrawer" :width="menuSetting.menuWidth" :placement="'left'">
      <n-layout-sider
        :position="fixedMenu"
        :collapsed="false"
        :width="menuSetting.menuWidth"
        :native-scrollbar="false"
        :inverted="inverted || darkNav"
      >
        <Logo :collapsed="collapsed" />
        <Menu v-model:location="getMenuLocation" />
      </n-layout-sider>
    </n-drawer>

    <div class="relative h-screen min-w-0 flex-1 overflow-hidden">
      <n-layout
        :inverted="inverted"
        :position="fixedHeader"
        :native-scrollbar="false"
        class="!bg-background-root h-full"
      >
        <n-layout-header :inverted="inverted" :position="fixedHeader" class="!z-10">
          <Header v-model:collapsed="collapsed" />
          <TagsView v-if="multiTabsSetting.show" v-model:collapsed="collapsed" />
        </n-layout-header>

        <main class="px-4 pt-4" :style="mainStyles">
          <Main />
        </main>

        <n-back-top :right="100" />
      </n-layout>
    </div>
  </n-layout>
</template>

<script lang="ts" setup>
import { useMedia } from "@/hooks/useMedia";
import { useAppSettingStore } from "@/store/modules/appSetting";
import { useThemeSettingStore } from "@/store/modules/themeSetting";
import { NLayoutHeader } from "naive-ui";
import { storeToRefs } from "pinia";
import { computed, ref, unref } from "vue";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const { isMobile } = useMedia();

const settingStore = useAppSettingStore();
const themeStore = useThemeSettingStore();
const { inverted, darkNav } = storeToRefs(themeStore);
const { navMode, headerSetting, menuSetting, multiTabsSetting } = storeToRefs(settingStore);

const collapsed = ref<boolean>(false);

const fixedHeader = computed(() => (headerSetting.value.fixed ? "absolute" : "static"));
const fixedMenu = computed(() => (headerSetting.value.fixed ? "absolute" : "static"));
const showMenu = computed(() => {
  const hideMixMenuSub = navMode.value === "horizontal-mix" && !currentRoute.meta.isRoot;
  return !isMobile.value && (navMode.value === "vertical" || hideMixMenuSub);
});
const mainStyles = computed(() => {
  const headerHeight = headerSetting.value.height || 0;
  const multiTabsHeight = multiTabsSetting.value.height || 0;
  const showMultiTabs = multiTabsSetting.value.show;
  if (headerSetting.value.fixed) {
    return {
      "padding-top": `${headerHeight + (showMultiTabs ? multiTabsHeight : 0) + 16}px`
    };
  }
  return undefined;
});

const desktopMenuWidth = computed(() => {
  const { minMenuWidth, menuWidth } = unref(menuSetting);
  return collapsed.value ? minMenuWidth : menuWidth;
});

const getMenuLocation = computed(() => {
  return unref(navMode) === "horizontal" ? "header" : "left";
});

// 控制显示或隐藏移动端侧边栏
const showSideDrawer = computed({
  get: () => isMobile.value && collapsed.value,
  set: (val) => (collapsed.value = val)
});
</script>
