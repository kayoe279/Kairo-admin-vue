<script setup lang="ts">
import { renderIcon } from "@/lib/utils";
import { useAppSettingStore } from "@/store/modules/appSetting";
import { useAsyncRouteStore } from "@/store/modules/asyncRoute";
import { useTabsViewStore } from "@/store/modules/tabsView";
import {
  CloseOutlined,
  ColumnWidthOutlined,
  LeftOutlined,
  MinusOutlined,
  ReloadOutlined,
  RightOutlined
} from "@vicons/antd";
import { computed, nextTick, ref } from "vue";
import type { VNode } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "ContextMenu"
});

interface Props {
  /** ClientX */
  x: number;
  /** ClientY */
  y: number;
  tabId: string;
  excludeKeys?: DropdownKey[];
  disabledKeys?: DropdownKey[];
}

const props = withDefaults(defineProps<Props>(), {
  excludeKeys: () => [],
  disabledKeys: () => []
});

const visible = defineModel<boolean>("visible");

const route = useRoute();
const router = useRouter();
const isCurrentTab = ref(false);
const settingStore = useAppSettingStore();
const asyncRouteStore = useAsyncRouteStore();
const { closeCurrentTab, closeOtherTabs, closeAllTabs, closeLeftTabs, closeRightTabs } =
  useTabsViewStore();

type DropdownOption = {
  key: DropdownKey;
  label: string;
  icon?: () => VNode;
  disabled?: boolean;
};

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: "刷新",
      key: "reloadCurrent",
      icon: renderIcon(ReloadOutlined)
    },
    {
      label: `关闭`,
      key: "closeCurrent",
      icon: renderIcon(CloseOutlined)
    },
    {
      label: `关闭左边`,
      key: "closeLeft",
      icon: renderIcon(LeftOutlined)
    },
    {
      label: `关闭右边`,
      key: "closeRight",
      icon: renderIcon(RightOutlined)
    },
    {
      label: "关闭其他",
      key: "closeOther",
      icon: renderIcon(ColumnWidthOutlined)
    },
    {
      label: "关闭全部",
      key: "closeAll",
      icon: renderIcon(MinusOutlined)
    }
  ];

  const result = opts.filter((opt) => !props.excludeKeys.includes(opt.key));
  result.forEach((item) => {
    if (props.disabledKeys.includes(item.key)) {
      item.disabled = true;
    }
    if (item.key === "reloadCurrent" && props.tabId !== route.name) {
      item.disabled = true;
    }
  });

  return result;
});

const hideDropdown = () => {
  visible.value = false;
};

// 移除缓存组件名称
const delKeepAliveCompName = () => {
  if (route.meta.keepAlive) {
    const name = router.currentRoute.value.matched.find((item) => item.name == route.name)
      ?.components?.default.name;
    if (name) {
      asyncRouteStore.cacheRoutes = asyncRouteStore.cacheRoutes.filter((item) => item != name);
    }
  }
};

const dropdownAction: Record<DropdownKey, () => void> = {
  async reloadCurrent() {
    delKeepAliveCompName();
    await settingStore.reloadPage();
  },
  closeCurrent() {
    closeCurrentTab(props.tabId, () => {
      delKeepAliveCompName();
    });
  },
  closeOther() {
    closeOtherTabs(props.tabId);
  },
  closeLeft() {
    closeLeftTabs(props.tabId);
  },
  closeRight() {
    closeRightTabs(props.tabId);
  },
  closeAll() {
    closeAllTabs();
  }
};

function handleDropdown(optionKey: DropdownKey) {
  dropdownAction[optionKey]?.();
  hideDropdown();
}
</script>

<template>
  <n-dropdown
    :show="visible"
    placement="bottom-start"
    trigger="manual"
    :x="x"
    :y="y"
    :options="options"
    @clickoutside="hideDropdown"
    @select="handleDropdown"
  />
</template>
