<script setup lang="ts">
import BetterScroll from "@/components/atoms/BetterScroll.vue";
import { useMedia } from "@/hooks/useMedia";
import { TAB_DATA_ID } from "@/lib/constants";
import { PageEnum } from "@/lib/enums/pageEnum";
import { typedBoolean } from "@/lib/utils";
import { useAppSettingStore } from "@/store/modules/appSetting";
import { useTabsViewStore } from "@/store/modules/tabsView";
import type { TabNamedNodeMap } from "@/types/utils";
import { useElementBounding } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, nextTick, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

const { isMobile } = useMedia();
const settingStore = useAppSettingStore();
const { multiTabsSetting } = storeToRefs(settingStore);

const route = useRoute();
const tabsViewStore = useTabsViewStore();
const { tabsList, activeTabId } = storeToRefs(tabsViewStore);
const { initTabs, addTab, closeCurrentTab, switchTabItem } = tabsViewStore;

const bsWrapper = ref<HTMLElement>();
const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapper);
const bsScroll = ref<InstanceType<typeof BetterScroll>>();
const tabRef = ref<HTMLElement>();

const dropdown = reactive({
  visible: false,
  x: 0,
  y: 0,
  tabId: ""
});

// 获取标签页右键菜单禁用项
const menuDisabledKeys = computed(() => {
  const tabId = dropdown.tabId || route.name;
  const disabledKeys: DropdownKey[] = [];
  const tabItemIndex = tabsList.value.findIndex((item) => item.name === tabId);
  if (tabItemIndex === tabsList.value.length - 1) {
    disabledKeys.push("closeRight");
  }
  if (tabItemIndex === 0) {
    disabledKeys.push("closeLeft");
  }

  const isFixed = tabsList.value.find((item) => item.name == tabId)?.meta?.affix ?? false;
  if (isFixed || tabId === PageEnum.BASE_HOME_NAME) {
    const homeDisable: DropdownKey[] = ["closeCurrent", "closeLeft"];
    disabledKeys.push(...homeDisable);
  }

  return disabledKeys;
});

const removeFocus = () => {
  (document.activeElement as HTMLElement)?.blur();
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
  () => tabsViewStore.activeTabId,
  () => {
    scrollToActiveTab();
  }
);
</script>

<template>
  <div
    class="flex w-full gap-x-4 px-4 py-1.5 transition-all duration-1000 ease-in-out"
    :style="{ height: multiTabsSetting.height + 'px' }"
  >
    <div ref="bsWrapper" class="flex min-w-0 flex-1 items-center">
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
            class="tabs-card-scroll-item relative flex !h-8 cursor-pointer items-center justify-center rounded-md px-4 py-1.5"
            :[TAB_DATA_ID]="tab.name"
            secondary
            :type="activeTabId === tab.name ? 'primary' : 'default'"
            @click="switchTabItem(tab.name)"
            @contextmenu="handleContextMenu($event, tab.name)"
          >
            <span>{{ tab?.meta?.title }}</span>
            <SvgIcon v-if="tab?.meta?.affix" icon="la:thumbtack" class="ml-1 text-base" />
            <button v-else @click.stop="closeCurrentTab(tab.name)">
              <SvgIcon icon="ant-design:close-outlined" class="ml-2" />
            </button>
          </n-button>
        </div>
      </BetterScroll>
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
