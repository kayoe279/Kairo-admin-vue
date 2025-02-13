<template>
  <div
    class="flex w-full px-4 py-1.5 transition-all duration-1000 ease-in-out"
    :style="{ height: multiTabsSetting.height + 'px' }"
  >
    <div class="flex max-w-full min-w-full items-center">
      <div
        ref="navWrap"
        :class="
          cn('relative flex h-full flex-1 items-center overflow-hidden', {
            'overflow-hidden px-8': state.scrollable
          })
        "
      >
        <button
          :class="
            cn(
              'absolute top-1/2 left-0 w-8 -translate-y-1/2 cursor-pointer text-center',
              !state.scrollable && 'hidden'
            )
          "
          @click="scrollPrev"
        >
          <nIcon size="16" class="!flex !size-8 !items-center" :component="LeftOutlined" />
        </button>
        <button
          :class="
            cn(
              'absolute top-1/2 right-0 w-8 -translate-y-1/2 cursor-pointer text-center',
              !state.scrollable && 'hidden'
            )
          "
          @click="scrollNext"
        >
          <nIcon
            size="16"
            class="!flex !size-8 !items-center !justify-center"
            :component="RightOutlined"
          />
        </button>
        <div ref="navScroll" class="flex h-full items-center overflow-hidden whitespace-nowrap">
          <Draggable :list="tabsList" animation="300" item-key="fullPath" class="flex">
            <template #item="{ element }">
              <div
                :id="`tag${element.fullPath.split('/').join('\/')}`"
                :class="
                  cn(
                    'tabs-card-scroll-item text-foreground hover:text-primary bg-background relative mr-1.5 flex h-8 cursor-pointer items-center justify-center rounded-md px-4 py-1.5 transition-all',
                    state.activeKey === element.fullPath && 'text-primary'
                  )
                "
                @click.stop="goPage(element)"
                @contextmenu="handleContextMenu($event, element)"
              >
                <span>{{ element.meta.title }}</span>
                <nIcon
                  v-if="!element.meta.affix"
                  size="14"
                  :component="CloseOutlined"
                  class="ml-2 !flex !size-3.5 !items-center"
                  @click.stop="closeTabItem(element)"
                />
              </div>
            </template>
          </Draggable>
        </div>
      </div>

      <div class="size-8 cursor-pointer rounded-xs text-center">
        <n-dropdown
          trigger="hover"
          @select="closeHandleSelect"
          placement="bottom-end"
          :options="TabsMenuOptions"
        >
          <div class="flex size-full items-center justify-center">
            <nIcon size="16" :component="DownOutlined" />
          </div>
        </n-dropdown>
      </div>
      <n-dropdown
        :show="state.showDropdown"
        :x="state.dropdownX"
        :y="state.dropdownY"
        @clickoutside="onClickOutside"
        placement="bottom-start"
        @select="closeHandleSelect"
        :options="TabsMenuOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGo } from "@/hooks/web/usePage";
import { storage } from "@/lib/Storage";
import { PageEnum } from "@/lib/enums/pageEnum";
import { cn } from "@/lib/utils";
import { renderIcon } from "@/lib/utils";
import { useAppSettingStore } from "@/store/modules/appSetting";
import { useAsyncRouteStore } from "@/store/modules/asyncRoute";
import { useTabsViewStore } from "@/store/modules/tabsView";
import type { RouteItem } from "@/store/modules/tabsView";
import { TABS_ROUTES } from "@/store/mutation-types";
import {
  CloseOutlined,
  ColumnWidthOutlined,
  DownOutlined,
  LeftOutlined,
  MinusOutlined,
  ReloadOutlined,
  RightOutlined
} from "@vicons/antd";
import elementResizeDetectorMaker from "element-resize-detector";
import { useMessage } from "naive-ui";
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, provide, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Draggable from "vuedraggable";

const settingStore = useAppSettingStore();
const { headerSetting, multiTabsSetting } = storeToRefs(settingStore);

const message = useMessage();
const route = useRoute();
const router = useRouter();
const tabsViewStore = useTabsViewStore();
const asyncRouteStore = useAsyncRouteStore();

// Refs
const navScroll = ref<HTMLElement | null>(null);
const navWrap = ref<HTMLElement | null>(null);
const isCurrent = ref(false);
const go = useGo();

// Reactive state
const state = reactive({
  activeKey: route.fullPath,
  scrollable: false,
  dropdownX: 0,
  dropdownY: 0,
  showDropdown: false,
  isMultiHeaderFixed: false
});

// 获取简易的路由对象
const getSimpleRoute = (route): RouteItem => {
  const { fullPath, hash, meta, name, params, path, query } = route;
  return { fullPath, hash, meta, name, params, path, query };
};

//tags 右侧下拉菜单
const TabsMenuOptions = computed(() => {
  const isDisabled = tabsList.value.length <= 1;
  return [
    {
      label: "刷新当前",
      key: "1",
      icon: renderIcon(ReloadOutlined)
    },
    {
      label: `关闭当前`,
      key: "2",
      disabled: isCurrent.value || isDisabled,
      icon: renderIcon(CloseOutlined)
    },
    {
      label: "关闭其他",
      key: "3",
      disabled: isDisabled,
      icon: renderIcon(ColumnWidthOutlined)
    },
    {
      label: "关闭全部",
      key: "4",
      disabled: isDisabled,
      icon: renderIcon(MinusOutlined)
    }
  ];
});

let cacheRoutes: RouteItem[] = [];
const simpleRoute = getSimpleRoute(route);
try {
  const routesStr = storage.get(TABS_ROUTES) as string | null | undefined;
  cacheRoutes = routesStr ? JSON.parse(routesStr) : [simpleRoute];
} catch {
  cacheRoutes = [simpleRoute];
}

// 将最新的路由信息同步到 localStorage 中
const routes = router.getRoutes();
cacheRoutes.forEach((cacheRoute) => {
  const route = routes.find((route) => route.path === cacheRoute.path);
  if (route) {
    cacheRoute.meta = route.meta || cacheRoute.meta;
    cacheRoute.name = (route.name || cacheRoute.name) as string;
  }
});

// 初始化标签页
tabsViewStore.initTabs(cacheRoutes);

//监听滚动条
function onScroll(e) {
  const scrollTop =
    e.target.scrollTop ||
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop; // 滚动条偏移量
  state.isMultiHeaderFixed = !!(!headerSetting.value.fixed && scrollTop >= 64);
}

// 移除缓存组件名称
const delKeepAliveCompName = () => {
  if (route.meta.keepAlive) {
    const name = router.currentRoute.value.matched.find((item) => item.name == route.name)
      ?.components?.default.name;
    if (name) {
      asyncRouteStore.keepAliveComponents = asyncRouteStore.keepAliveComponents.filter(
        (item) => item != name
      );
    }
  }
};

// 标签页列表
const tabsList: any = computed(() => tabsViewStore.tabsList);
const whiteList: string[] = [
  PageEnum.BASE_LOGIN_NAME,
  PageEnum.REDIRECT_NAME,
  PageEnum.ERROR_PAGE_NAME
];

watch(
  () => route.fullPath,
  (to) => {
    if (whiteList.includes(route.name as string)) return;
    state.activeKey = to;
    tabsViewStore.addTab(getSimpleRoute(route));
    updateNavScroll(true);
  },
  { immediate: true }
);

// 在页面关闭或刷新之前，保存数据
window.addEventListener("beforeunload", () => {
  storage.set(TABS_ROUTES, JSON.stringify(tabsList.value));
});

// 关闭当前页面
const removeTab = (route) => {
  if (tabsList.value.length === 1) {
    return message.warning("这已经是最后一页，不能再关闭了！");
  }
  delKeepAliveCompName();
  tabsViewStore.closeCurrentTab(route);
  // 如果关闭的是当前页
  if (state.activeKey === route.fullPath) {
    const currentRoute = tabsList.value[Math.max(0, tabsList.value.length - 1)];
    state.activeKey = currentRoute.fullPath;
    router.push(currentRoute);
  }
  updateNavScroll();
};

// 刷新页面
const reloadPage = () => {
  delKeepAliveCompName();
  router.push({
    path: "/redirect" + route.fullPath
  });
};

// 关闭左侧
// const closeLeft = (route) => {
//   tabsViewStore.closeLeftTabs(route);
//   state.activeKey = route.fullPath;
//   router.replace(route.fullPath);
//   updateNavScroll();
// };

// // 关闭右侧
// const closeRight = (route) => {
//   tabsViewStore.closeRightTabs(route);
//   state.activeKey = route.fullPath;
//   router.replace(route.fullPath);
//   updateNavScroll();
// };

// 关闭其他
const closeOther = (route) => {
  tabsViewStore.closeOtherTabs(route);
  state.activeKey = route.fullPath;
  router.replace(route.fullPath);
  updateNavScroll();
};

// 关闭全部
const closeAll = () => {
  tabsViewStore.closeAllTabs();
  router.replace(PageEnum.BASE_HOME);
  updateNavScroll();
};

//tab 操作
const closeHandleSelect = (key: string) => {
  switch (key) {
    //刷新
    case "1":
      reloadPage();
      break;
    //关闭
    case "2":
      removeTab(route);
      break;
    //关闭其他
    case "3":
      closeOther(route);
      break;
    //关闭所有
    case "4":
      closeAll();
      break;
  }
  updateNavScroll();
  state.showDropdown = false;
};

/**
 * @param value 要滚动到的位置
 * @param amplitude 每次滚动的长度
 */
function scrollTo(value: number, amplitude: number) {
  const currentScroll = navScroll.value?.scrollLeft || 0;
  const scrollWidth =
    (amplitude > 0 && currentScroll + amplitude >= value) ||
    (amplitude < 0 && currentScroll + amplitude <= value)
      ? value
      : currentScroll + amplitude;
  navScroll.value && navScroll.value.scrollTo(scrollWidth, 0);
  if (scrollWidth === value) return;
  return window.requestAnimationFrame(() => scrollTo(value, amplitude));
}

function scrollPrev() {
  const containerWidth = navScroll.value?.offsetWidth || 0;
  const currentScroll = navScroll.value?.scrollLeft || 0;

  if (!currentScroll) return;
  const scrollLeft = currentScroll > containerWidth ? currentScroll - containerWidth : 0;
  scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20);
}

function scrollNext() {
  const containerWidth = navScroll.value?.offsetWidth || 0;
  const navWidth = navScroll.value?.scrollWidth || 0;
  const currentScroll = navScroll.value?.scrollLeft || 0;

  if (navWidth - currentScroll <= containerWidth) return;
  const scrollLeft =
    navWidth - currentScroll > containerWidth * 2
      ? currentScroll + containerWidth
      : navWidth - containerWidth;
  scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20);
}

/**
 * @param autoScroll 是否开启自动滚动功能
 */
async function updateNavScroll(autoScroll?: boolean) {
  await nextTick();
  if (!navScroll.value) return;
  const containerWidth = navScroll.value.offsetWidth;
  const navWidth = navScroll.value.scrollWidth;

  if (containerWidth < navWidth) {
    state.scrollable = true;
    if (autoScroll) {
      const tagList = navScroll.value.querySelectorAll(".tabs-card-scroll-item") || [];
      Array.from(tagList).forEach((tag: HTMLElement) => {
        // fix SyntaxError
        if (tag.id === `tag${state.activeKey.split("/").join("\/")}`) {
          tag.scrollIntoView && tag.scrollIntoView();
        }
      });
    }
  } else {
    state.scrollable = false;
  }
}

function handleResize() {
  updateNavScroll(true);
}

function handleContextMenu(e: MouseEvent, item: RouteItem) {
  e.preventDefault();
  isCurrent.value = PageEnum.BASE_HOME_REDIRECT === item.path;
  state.showDropdown = false;
  nextTick().then(() => {
    state.showDropdown = true;
    state.dropdownX = e.clientX;
    state.dropdownY = e.clientY;
  });
}

function onClickOutside() {
  state.showDropdown = false;
}

//tags 跳转页面
function goPage(e) {
  const { fullPath } = e;
  if (fullPath === route.fullPath) return;
  state.activeKey = fullPath;
  go(e, true);
}

//删除tab
function closeTabItem(e) {
  const { fullPath } = e;
  const routeInfo = tabsList.value.find((item) => item.fullPath == fullPath);
  removeTab(routeInfo);
}

onMounted(() => {
  onElementResize();
  window.addEventListener("scroll", onScroll, true);
});

function onElementResize() {
  const observer = elementResizeDetectorMaker();
  observer.listenTo(navWrap.value, handleResize);
}

// Provide
provide("reloadPage", reloadPage);
</script>
