<script lang="ts" setup>
import { useAppStore } from "@/store/modules/appSetting";
// import { useScreenLockStore } from "@/store/modules/screenLock";
import { useFullscreen } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const collapsed = defineModel<boolean>("collapsed");

const router = useRouter();
const route = useRoute();

// const lockScreen = useScreenLockStore();

const appStore = useAppStore();
const { navMode, headerSetting, breadcrumbsSetting } = storeToRefs(appStore);

const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

const hideCollapseIcon = computed(() => {
  return (
    navMode.value === "horizontal" || (navMode.value === "horizontal-mix" && route.meta.isRoot)
  );
});

const generator = (routerMap) => {
  return routerMap.map((item) => {
    const currentMenu = {
      ...item,
      label: item.meta.title,
      key: item.name,
      disabled: item.path === "/"
    };
    if (item.children && item.children.length > 0) {
      currentMenu.children = generator(item.children);
    }
    return currentMenu;
  });
};

const breadcrumbList = computed(() => {
  return generator(route.matched);
});

const dropdownSelect = (key) => {
  router.push({ name: key });
};

const onIconClick = (key: "github" | "lock") => {
  console.log(key);
  if (key === "github") {
    window.open("https://github.com/jekip/naive-ui-admin");
  } else if (key === "lock") {
    // lockScreen.setLock(true);
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
          class="flex h-16 items-center justify-center overflow-hidden whitespace-nowrap max-md:hidden"
        />

        <Menu location="header" mode="horizontal" />
      </div>
      <div class="hidden items-center md:flex" v-else>
        <!-- 面包屑 -->
        <n-breadcrumb v-if="breadcrumbsSetting.show">
          <template
            v-for="routeItem in breadcrumbList"
            :key="routeItem.name === 'Redirect' ? void 0 : routeItem.name"
          >
            <n-breadcrumb-item v-if="routeItem.meta.title">
              <n-dropdown
                v-if="routeItem.children.length"
                :options="routeItem.children"
                @select="dropdownSelect"
              >
                <span>
                  <component
                    v-if="breadcrumbsSetting.showIcon && routeItem.meta.icon"
                    :is="routeItem.meta.icon"
                  />
                  {{ routeItem.meta.title }}
                </span>
              </n-dropdown>
              <span v-else>
                <component
                  v-if="breadcrumbsSetting.showIcon && routeItem.meta.icon"
                  :is="routeItem.meta.icon"
                />
                {{ routeItem.meta.title }}
              </span>
            </n-breadcrumb-item>
          </template>
        </n-breadcrumb>
      </div>
    </div>
    <div class="flex h-full items-center gap-x-6">
      <ButtonIcon icon="proicons:github" tooltipContent="GitHub" @click="onIconClick('github')" />

      <!--切换全屏-->
      <ButtonIcon
        :icon="
          isFullscreen ? 'solar:quit-full-screen-square-broken' : 'solar:full-screen-square-broken'
        "
        tooltipContent="全屏"
        @click="toggleFullScreen"
      />

      <!--设置-->
      <ButtonIcon
        icon="solar:settings-broken"
        tooltipContent="项目配置"
        @click="() => appStore.toggleDrawer()"
      />
      <!-- 切换主题 -->
      <ThemeSwitch />

      <!-- 个人中心 -->
      <User />
    </div>
  </div>
  <!--项目配置drawer -->
  <SettingDrawer />
</template>
