<template>
  <div
    class="z-10 flex h-16 w-full items-center justify-between gap-x-5 px-4 shadow-xs transition-all duration-200 ease-in-out md:px-5"
  >
    <div class="flex h-full min-w-0 flex-1 items-center gap-x-5">
      <button v-if="!hideCollapseIcon" class="size-5" @click="handleMenuCollapsed">
        <NIcon :component="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" size="20" />
      </button>
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
        <AsideMenu location="header" mode="horizontal" />
      </div>
      <div class="hidden items-center md:flex" v-else>
        <!-- 刷新 -->
        <button v-if="headerSetting.isReload" class="mr-3 size-5" @click="reloadPage">
          <NIcon size="20" :component="ReloadOutlined" />
        </button>
        <!-- 面包屑 -->
        <NBreadcrumb v-if="crumbsSetting.show">
          <template
            v-for="routeItem in breadcrumbList"
            :key="routeItem.name === 'Redirect' ? void 0 : routeItem.name"
          >
            <NBreadcrumbItem v-if="routeItem.meta.title">
              <NDropdown
                v-if="routeItem.children.length"
                :options="routeItem.children"
                @select="dropdownSelect"
              >
                <span>
                  <component
                    v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                    :is="routeItem.meta.icon"
                  />
                  {{ routeItem.meta.title }}
                </span>
              </NDropdown>
              <span v-else>
                <component
                  v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                  :is="routeItem.meta.icon"
                />
                {{ routeItem.meta.title }}
              </span>
            </NBreadcrumbItem>
          </template>
        </NBreadcrumb>
      </div>
    </div>
    <div class="flex h-full items-center gap-x-6">
      <button
        class="size-5"
        v-for="item in iconList"
        :key="item.icon"
        @click="onIconClick(item.icon)"
      >
        <NTooltip placement="bottom">
          <template #trigger>
            <NIcon size="20" :component="item.component" />
          </template>
          <span>{{ item.tips }}</span>
        </NTooltip>
      </button>
      <!--切换全屏-->
      <button class="size-5" @click="toggleFullScreen">
        <NTooltip placement="bottom">
          <template #trigger>
            <NIcon size="20">
              <component :is="fullScreenIcon" />
            </NIcon>
          </template>
          <span>全屏</span>
        </NTooltip>
      </button>
      <!--设置-->
      <button class="size-5" @click="() => settingStore.toggleDrawer()">
        <NTooltip placement="bottom">
          <template #trigger>
            <NIcon size="20">
              <SettingOutlined />
            </NIcon>
          </template>
          <span>项目配置</span>
        </NTooltip>
      </button>
      <!-- 切换主题 -->

      <button class="size-5 cursor-pointer">
        <NTooltip placement="bottom">
          <template #trigger>
            <ThemeSwitch />
          </template>
          <span>主题切换</span>
        </NTooltip>
      </button>

      <!-- 个人中心 -->
      <div class="flex items-center justify-center" @click="avatarSelect">
        <NDropdown trigger="hover" @select="avatarSelect" :options="avatarOptions">
          <div class="flex cursor-pointer items-center justify-center">
            <NAvatar :src="websiteConfig.logo">
              <template #fallback>
                <UserOutlined />
              </template>
            </NAvatar>
            <span class="ml-2">{{ userStore?.info?.username ?? "" }}</span>
          </div>
        </NDropdown>
      </div>
    </div>
  </div>
  <!--项目配置-->
  <ProjectSetting />
</template>

<script lang="ts" setup>
import ProjectSetting from "./ProjectSetting.vue";
import { websiteConfig } from "@/config/website.config";
import ThemeSwitch from "@/layout/Header/components/ThemeMode/ThemeSwitch.vue";
import AsideMenu from "@/layout/Menu/index.vue";
import { useProjectSettingStore } from "@/store/modules/projectSetting";
import { useScreenLockStore } from "@/store/modules/screenLock";
import { useUserStore } from "@/store/modules/user";
import { TABS_ROUTES } from "@/store/mutation-types";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  SettingOutlined,
  UserOutlined
} from "@vicons/antd";
import { useDialog, useMessage } from "naive-ui";
import { storeToRefs } from "pinia";
import { computed, shallowRef, unref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { avatarOptions, iconList } from "~/mock/system/menu";

// Props 定义
const props = withDefaults(
  defineProps<{
    collapsed: boolean;
  }>(),
  {
    collapsed: false
  }
);

// Emits 定义
const emit = defineEmits(["update:collapsed"]);

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const lockScreen = useScreenLockStore();
const message = useMessage();
const dialog = useDialog();
const settingStore = useProjectSettingStore();
const { navMode, headerSetting, crumbsSetting } = storeToRefs(settingStore);

const fullScreenIcon = shallowRef(FullscreenOutlined);

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

// 刷新页面
const reloadPage = () => {
  router.push({
    path: "/redirect" + unref(route).fullPath
  });
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

// 切换全屏图标
const toggleFullscreenIcon = () =>
  (fullScreenIcon.value =
    document.fullscreenElement !== null ? FullscreenExitOutlined : FullscreenOutlined);

// 监听全屏切换事件
document.addEventListener("fullscreenchange", toggleFullscreenIcon);

// 全屏切换
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

const onIconClick = (key) => {
  console.log(key);
  if (key === "GithubOutlined") {
    window.open("https://github.com/jekip/naive-ui-admin");
  } else if (key === "LockOutlined") {
    lockScreen.setLock(true);
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

const handleMenuCollapsed = () => {
  emit("update:collapsed", !props.collapsed);
};
</script>

<style scoped>
.n-icon {
  cursor: pointer;
}
</style>
