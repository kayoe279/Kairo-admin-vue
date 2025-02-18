<script lang="ts" setup>
import { TABS_ROUTES } from "@/lib/constants";
import { websiteConfig } from "@/lib/websiteConfig";
import { useAppStore } from "@/store/modules/appSetting";
// import { useScreenLockStore } from "@/store/modules/screenLock";
import { useUserStore } from "@/store/modules/user";
import { useFullscreen } from "@vueuse/core";
import { useDialog, useMessage } from "naive-ui";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { avatarOptions } from "~/mock/system/menu";

const collapsed = defineModel<boolean>("collapsed");

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
// const lockScreen = useScreenLockStore();
const message = useMessage();
const dialog = useDialog();
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

// 退出登录
const doLogout = () => {
  dialog.info({
    title: "提示",
    content: "您确定要退出登录吗",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      userStore.logout().then(() => {
        message.success("成功退出登录");
        // 移除标签页
        localStorage.removeItem(TABS_ROUTES);
        router
          .replace({
            name: "Login",
            query: {
              redirect: route.fullPath
            }
          })
          .finally(() => location.reload());
      });
    },
    onNegativeClick: () => {}
  });
};

const onIconClick = (key: "github" | "lock") => {
  console.log(key);
  if (key === "github") {
    window.open("https://github.com/jekip/naive-ui-admin");
  } else if (key === "lock") {
    // lockScreen.setLock(true);
  }
};

//头像下拉菜单
const avatarSelect = (key) => {
  switch (key) {
    case 1:
      router.push({ name: "Setting" });
      break;
    case 2:
      doLogout();
      break;
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
        <div
          v-if="navMode === 'horizontal'"
          class="flex h-16 items-center justify-center overflow-hidden whitespace-nowrap max-md:hidden"
        >
          <img class="size-10" :src="websiteConfig.logo" alt="" />
        </div>
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
      <div class="flex items-center justify-center" @click="avatarSelect">
        <n-dropdown trigger="hover" @select="avatarSelect" :options="avatarOptions">
          <div class="flex cursor-pointer items-center justify-center">
            <n-avatar :src="websiteConfig.logo" />
            <span class="ml-2">{{ userStore?.info?.username ?? "" }}</span>
          </div>
        </n-dropdown>
      </div>
    </div>
  </div>
  <!--项目配置drawer -->
  <SettingDrawer />
</template>
