import { useRouteStore } from "./route";
import { PAGE, StoreEnum } from "@/lib";
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

export const useTabsStore = defineStore(
  StoreEnum.tabViews,
  () => {
    const route = useRoute();
    const router = useRouter();
    const routeStore = useRouteStore();

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
      const homeTab = tabsList.value.some((item) => item.name === PAGE.HOME_NAME_REDIRECT);
      if (!homeTab) {
        const homeRoute = routeStore.homeRoute as unknown as Route;
        if (homeRoute) {
          tabsList.value.unshift(getTabByRoute(homeRoute));
        }
      }
    };
    // 添加标签页
    const addTab = (route: Route) => {
      const name = route.name as string;
      if (route.meta?.hidden) return;
      const isExists = tabsList.value.some((item) => item.name == name);
      if (!isExists) {
        tabsList.value.push(getTabByRoute(route));
      }
      setActiveTabId(name);
    };
    // 关闭左侧
    const closeLeftTabs = (tabId: string) => {
      const index = tabsList.value.findIndex((item) => item.name == tabId);
      const activeIndex = tabsList.value.findIndex((item) => item.name == activeTabId.value);
      tabsList.value = tabsList.value.filter(
        (item, i) => i >= index || (item?.meta?.affix ?? false)
      );
      if (activeIndex < index) {
        const shouldRoute = tabsList.value.filter((item) => !item.meta?.affix)?.[0];
        shouldRoute && router.replace(shouldRoute.path);
      }
    };
    // 关闭右侧
    const closeRightTabs = (tabId: string) => {
      const index = tabsList.value.findIndex((item) => item.name == tabId);
      const activeIndex = tabsList.value.findIndex((item) => item.name == activeTabId.value);
      tabsList.value = tabsList.value.filter(
        (item, i) => i <= index || (item?.meta?.affix ?? false)
      );
      if (activeIndex > index) {
        const shouldRoute = tabsList.value[Math.max(0, tabsList.value.length - 1)];
        shouldRoute && router.replace(shouldRoute.path);
      }
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

    // 清空所有
    const clearAllTabs = () => {
      activeTabId.value = "";
      tabsList.value = [];
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
      switchTabItem,
      clearAllTabs
    };
  },
  {
    persist: true
  }
);
