import { useAsyncRouteStore } from "./asyncRoute";
import { TABS_WHITE_LIST } from "@/lib/constants";
import { PageEnum } from "@/lib/enums/pageEnum";
import { StoreEnum } from "@/lib/enums/storeEnum";
import { defineStore } from "pinia";
import { ref } from "vue";
import { type RouteLocationNormalizedLoadedGeneric, useRoute, useRouter } from "vue-router";

type Route = Pick<
  RouteLocationNormalizedLoadedGeneric,
  "name" | "path" | "meta" | "hash" | "params" | "query" | "fullPath"
>;

export type TabItem = Route & {
  name: string;
  isFixed?: boolean;
};

export const useTabsViewStore = defineStore(
  StoreEnum.tabViews,
  () => {
    const route = useRoute();
    const router = useRouter();
    const asyncRouteStore = useAsyncRouteStore();

    const activeTabId = ref<string>("");
    const tabsList = ref<TabItem[]>([]);

    const setActiveTabId = (id: string) => {
      activeTabId.value = id;
    };

    const filterTabsByIds = (tabIds: string[], tabs: TabItem[]) => {
      return tabs.filter((tab) => !tabIds.includes(tab.name));
    };

    //保留固定路由
    const retainAffixRoute = (list: TabItem[]) => {
      return list.filter((item) => item?.meta?.affix ?? false);
    };

    const getTabByRoute = (route: Route) => {
      const name = route.name as string;
      const { fullPath, hash, meta, params, path, query } = route;
      return {
        fullPath,
        hash,
        meta,
        name,
        params,
        path,
        query,
        isFixed: (route.meta.affix as boolean) ?? false
      };
    };

    // 初始化tab
    const initTabs = () => {
      const homeTab = tabsList.value.some((item) => item.name === PageEnum.BASE_HOME_NAME);
      if (!homeTab) {
        const homeRoute = asyncRouteStore.homeRoute as unknown as Route;
        if (homeRoute) {
          tabsList.value.unshift(getTabByRoute(homeRoute));
        }
      }
    };
    // 添加标签页
    const addTab = (route: Route) => {
      const name = route.name as string;
      if (TABS_WHITE_LIST.includes(name as PageEnum)) return;
      const isExists = tabsList.value.some((item) => item.name == name);
      if (!isExists) {
        tabsList.value.push(getTabByRoute(route));
      }
      setActiveTabId(name);
    };
    // 关闭左侧
    const closeLeftTabs = (tabId: string) => {
      const index = tabsList.value.findIndex((item) => item.name == tabId);
      tabsList.value = tabsList.value.filter(
        (item, i) => i >= index || (item?.meta?.affix ?? false)
      );
    };
    // 关闭右侧
    const closeRightTabs = (tabId: string) => {
      const index = tabsList.value.findIndex((item) => item.name == tabId);
      tabsList.value = tabsList.value.filter(
        (item, i) => i <= index || (item?.meta?.affix ?? false)
      );
    };
    // 关闭其他
    const closeOtherTabs = (tabId: string) => {
      tabsList.value = tabsList.value.filter(
        (item) => item.name == tabId || (item?.meta?.affix ?? false)
      );
      setActiveTabId(tabId);
      router.replace({ name: tabId });
    };
    // 关闭当前页
    const closeCurrentTab = (tabId: string, cb?: () => void) => {
      console.log("%c [ tabId ]-101", "font-size:13px; background:pink; color:#bf2c9f;", tabId);
      if (tabsList.value.length === 1) {
        return;
      }
      const isRemoveActiveTab = activeTabId.value === tabId;
      tabsList.value = filterTabsByIds([tabId], tabsList.value);
      if (isRemoveActiveTab) {
        const currentRoute = tabsList.value[Math.max(0, tabsList.value.length - 1)];
        setActiveTabId(currentRoute.name);
        router.push({ name: currentRoute.name });
      }
      cb?.();
    };
    // 关闭全部
    const closeAllTabs = () => {
      tabsList.value = retainAffixRoute(tabsList.value);
    };

    //切换 tab
    const switchTabItem = (tabId: string) => {
      if (tabId === route.name) return;
      const currentTab = tabsList.value.find((item) => item.name === tabId);
      if (!currentTab) return;
      setActiveTabId(tabId);
      router.push({ name: currentTab.name });
    };

    return {
      activeTabId,
      setActiveTabId,
      tabsList,
      initTabs,
      addTab,
      closeLeftTabs,
      closeRightTabs,
      closeOtherTabs,
      closeCurrentTab,
      closeAllTabs,
      switchTabItem
    };
  },
  {
    persist: true
  }
);
