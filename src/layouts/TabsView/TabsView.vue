<script setup lang="ts">
import BetterScroll from "@/components/atoms/BetterScroll.vue";
import { useMedia } from "@/hooks/useMedia";
import { TAB_DATA_ID } from "@/lib/constants";
import { typedBoolean } from "@/lib/utils";
import { useAppStore, useTabsStore } from "@/store";
import type { TabNamedNodeMap } from "@/types/utils";
import { useElementBounding, useElementSize } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, nextTick, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

const { isMobile } = useMedia();
const appStore = useAppStore();
const { multiTabsSetting } = storeToRefs(appStore);

const route = useRoute();
const tabsStore = useTabsStore();
const { tabsList, activeTabId } = storeToRefs(tabsStore);
const { initTabs, addTab, closeCurrentTab, switchTabItem } = tabsStore;

const bsWrapper = ref<HTMLElement>();
const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapper);
const bsScroll = ref<InstanceType<typeof BetterScroll>>();
const tabRef = ref<HTMLElement>();
const { width: tabsContentWidth } = useElementSize(tabRef);

// 滚动遮罩状态
const scrollState = reactive({
  canScrollLeft: false,
  canScrollRight: false,
  isScrollable: false
});

const dropdown = reactive({
  visible: false,
  x: 0,
  y: 0,
  tabId: ""
});

// 获取标签页右键菜单禁用项
const menuDisabledKeys = computed(() => {
  const tabId = dropdown.tabId || route.name;
  const disabledKeys: Tabs.DropdownKey[] = [];
  const tabItemIndex = tabsList.value.findIndex((item) => item.name === tabId);
  if (tabItemIndex === tabsList.value.length - 1) {
    disabledKeys.push("closeRight");
  }
  if (tabItemIndex === 0) {
    disabledKeys.push("closeLeft");
  }

  const isFixed = tabsList.value.find((item) => item.name == tabId)?.meta?.affix ?? false;
  if (isFixed) {
    const homeDisable: Tabs.DropdownKey[] = ["closeCurrent", "closeLeft"];
    disabledKeys.push(...homeDisable);
  }

  return disabledKeys;
});

const removeFocus = () => {
  (document.activeElement as HTMLElement)?.blur();
};

// 更新滚动状态
const updateScrollState = () => {
  if (!bsScroll.value?.instance) return;

  const { x, maxScrollX } = bsScroll.value.instance;

  // 判断是否可以滚动
  scrollState.isScrollable = tabsContentWidth.value > bsWrapperWidth.value;

  // 判断是否可以向左滚动
  scrollState.canScrollLeft = x < 0;

  // 判断是否可以向右滚动
  scrollState.canScrollRight = x > maxScrollX;
};

const scrollByClientX = (clientX: number) => {
  const currentX = clientX - bsWrapperLeft.value;
  const deltaX = currentX - bsWrapperWidth.value / 2;

  if (bsScroll.value?.instance) {
    const { maxScrollX, x: leftX, scrollBy } = bsScroll.value.instance;

    const rightX = maxScrollX - leftX;
    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX);

    scrollBy(update, 0, 300);
  }
};

const scrollToActiveTab = async () => {
  await nextTick();
  if (!tabRef.value) return;

  const { children } = tabRef.value;

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];

    const { value: tabId } = (child.attributes as TabNamedNodeMap)[TAB_DATA_ID];

    if (tabId === activeTabId.value) {
      const { left, width } = child.getBoundingClientRect();
      const clientX = left + width / 2;

      setTimeout(() => {
        scrollByClientX(clientX);
      }, 50);

      break;
    }
  }
};

const isClickContextMenu = ref(false);
const handleDropdownVisible = (visible: boolean) => {
  if (!isClickContextMenu.value) {
    dropdown.visible = visible;
  }
};

const handleContextMenu = (e: MouseEvent, tabId: string) => {
  e.preventDefault();
  isClickContextMenu.value = true;
  const DURATION = dropdown.visible ? 300 : 0;

  dropdown.visible = false;
  setTimeout(() => {
    dropdown.visible = true;
    dropdown.x = e.clientX;
    dropdown.y = e.clientY;
    dropdown.tabId = tabId;
    isClickContextMenu.value = false;
  }, DURATION);
};

watch(
  () => route.fullPath,
  () => {
    initTabs();
    addTab(route);
  },
  { immediate: true }
);

watch(
  () => tabsStore.activeTabId,
  () => {
    scrollToActiveTab();
  }
);

// 监听容器和内容尺寸变化，更新滚动状态
watch([bsWrapperWidth, tabsContentWidth], () => {
  updateScrollState();
});

// 监听BetterScroll实例创建，绑定滚动事件
watch(
  () => bsScroll.value?.instance,
  (instance) => {
    if (instance) {
      instance.on("scroll", updateScrollState);
      instance.on("scrollEnd", updateScrollState);
      // 初始化滚动状态
      updateScrollState();
    }
  }
);
</script>

<template>
  <div
    class="flex w-full gap-x-4 px-4 py-2 transition-all duration-1000 ease-in-out"
    :style="{ height: multiTabsSetting.height + 'px' }"
  >
    <div ref="bsWrapper" class="relative flex min-w-0 flex-1 items-center">
      <!-- 左侧滚动遮罩 -->
      <div
        v-show="scrollState.isScrollable && scrollState.canScrollLeft"
        class="pointer-events-none absolute top-0 left-0 z-10 h-full w-8 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900"
      />

      <BetterScroll
        ref="bsScroll"
        :options="{ scrollX: true, scrollY: false, click: isMobile }"
        @click="removeFocus"
        class="min-w-0 flex-1 overflow-hidden"
      >
        <div
          ref="tabRef"
          class="flex h-full items-center gap-x-2 overflow-hidden whitespace-nowrap"
        >
          <n-button
            v-for="tab in tabsList.filter(typedBoolean)"
            :key="tab.name"
            class="tabs-card-scroll-item relative flex !h-8 max-h-12 min-h-8 cursor-pointer items-center justify-center !rounded-lg px-4 py-1.5"
            :[TAB_DATA_ID]="tab.name"
            secondary
            :type="activeTabId === tab.name ? 'primary' : 'default'"
            @click="switchTabItem(tab.name)"
            @contextmenu="handleContextMenu($event, tab.name)"
          >
            <span>{{ $t(`route.${tab?.name}`, String(tab?.meta?.title)) }}</span>
            <SvgIcon v-if="tab?.meta?.affix" icon="la:thumbtack" class="ml-1 text-base" />
            <button v-else @click.stop="closeCurrentTab(tab.name)">
              <SvgIcon icon="ant-design:close-outlined" class="ml-2" />
            </button>
          </n-button>
        </div>
      </BetterScroll>

      <!-- 右侧滚动遮罩 -->
      <div
        v-show="scrollState.isScrollable && scrollState.canScrollRight"
        class="pointer-events-none absolute top-0 right-0 z-10 h-full w-8 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900"
      />
    </div>

    <div class="flex items-center gap-x-4">
      <ReloadButton />
      <FullScreen />
      <TabsContextMenu
        type="dropdown"
        :tabId="String(route.name)"
        :disabledKeys="menuDisabledKeys"
      />
    </div>

    <TabsContextMenu
      v-model:visible="dropdown.visible"
      :tabId="dropdown.tabId"
      :disabledKeys="menuDisabledKeys"
      :x="dropdown.x"
      :y="dropdown.y"
      @update:visible="handleDropdownVisible"
    />
  </div>
</template>
