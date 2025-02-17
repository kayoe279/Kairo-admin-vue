<script setup lang="ts">
import { svgIconRender } from "@/lib/svgIconRender";
import { useAppSettingStore } from "@/store/modules/appSetting";
import { useAsyncRouteStore } from "@/store/modules/asyncRoute";
import { useTabsViewStore } from "@/store/modules/tabsView";
import { type VNode, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "TabsContextMenu"
});

type DropdownOption = {
  key: DropdownKey;
  label: string;
  icon?: () => VNode;
  disabled?: boolean;
};

interface Props {
  tabId: string;
  x?: number;
  y?: number;
  excludeKeys?: DropdownKey[];
  disabledKeys?: DropdownKey[];
  type?: "button" | "dropdown";
}
const props = withDefaults(defineProps<Props>(), {
  type: "button",
  x: 0,
  y: 0,
  excludeKeys: () => [],
  disabledKeys: () => []
});

defineSlots<{ default(): any }>();

const visible = defineModel<boolean>("visible");

const route = useRoute();
const router = useRouter();
const settingStore = useAppSettingStore();
const asyncRouteStore = useAsyncRouteStore();
const { closeCurrentTab, closeOtherTabs, closeAllTabs, closeLeftTabs, closeRightTabs } =
  useTabsViewStore();

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: "刷新",
      key: "reloadCurrent",
      icon: svgIconRender({ icon: "solar:refresh-outline", fontSize: 18 })
    },
    {
      label: `关闭`,
      key: "closeCurrent",
      icon: svgIconRender({ icon: "ant-design:close-outlined", fontSize: 18 })
    },
    {
      label: `关闭左边`,
      key: "closeLeft",
      icon: svgIconRender({ icon: "mdi:format-horizontal-align-left", fontSize: 18 })
    },
    {
      label: `关闭右边`,
      key: "closeRight",
      icon: svgIconRender({ icon: "mdi:format-horizontal-align-right", fontSize: 18 })
    },
    {
      label: "关闭其他",
      key: "closeOther",
      icon: svgIconRender({ icon: "ant-design:column-width-outlined", fontSize: 18 })
    },
    {
      label: "关闭全部",
      key: "closeAll",
      icon: svgIconRender({ icon: "ant-design:line-outlined", fontSize: 18 })
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
    v-if="props.type === 'dropdown'"
    placement="bottom"
    trigger="hover"
    :options="options"
    @select="handleDropdown"
  >
    <button>
      <SvgIcon icon="icon-park-outline:more-app" class="stroke-2 text-lg" />
    </button>
  </n-dropdown>

  <n-dropdown
    v-else
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
