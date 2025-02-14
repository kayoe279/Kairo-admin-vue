import { ROUTE_WHITE_LIST } from "@/lib/constants";
import { StoreEnum } from "@/lib/enums/storeEnum";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { RouteLocationNormalized } from "vue-router";

export type RouteItem = Partial<RouteLocationNormalized> & {
  fullPath: string;
  path: string;
  name: string;
  hash: string;
  meta: object;
  params: object;
  query: object;
};

export type ITabsViewState = {
  tabsList: RouteItem[]; // 标签页
};

//保留固定路由
function retainAffixRoute(list: any[]) {
  return list.filter((item) => item?.meta?.affix ?? false);
}

export const useTabsViewStore = defineStore(StoreEnum.tabViews, () => {
  const tabsList = ref<RouteItem[]>([]);
  const getTabsList = computed(() => tabsList.value);
  const setTabsList = (routes: RouteItem[]) => {
    tabsList.value = routes;
  };

  // 初始化标签页
  const initTabs = (routes: RouteItem[]) => {
    tabsList.value = routes;
  };
  // 添加标签页
  const addTab = (route: RouteItem): boolean => {
    if (ROUTE_WHITE_LIST.includes(route.name)) return false;
    const isExists = tabsList.value.some((item) => item.fullPath == route.fullPath);
    if (!isExists) {
      tabsList.value.push(route);
    }
    return true;
  };
  // 关闭左侧
  const closeLeftTabs = (route: RouteItem) => {
    const index = tabsList.value.findIndex((item) => item.fullPath == route.fullPath);
    tabsList.value = tabsList.value.filter((item, i) => i >= index || (item?.meta?.affix ?? false));
  };
  // 关闭右侧
  const closeRightTabs = (route: RouteItem) => {
    const index = tabsList.value.findIndex((item) => item.fullPath == route.fullPath);
    tabsList.value = tabsList.value.filter((item, i) => i <= index || (item?.meta?.affix ?? false));
  };
  // 关闭其他
  const closeOtherTabs = (route: RouteItem) => {
    tabsList.value = tabsList.value.filter(
      (item) => item.fullPath == route.fullPath || (item?.meta?.affix ?? false)
    );
  };
  // 关闭当前页
  const closeCurrentTab = (route: RouteItem) => {
    const index = tabsList.value.findIndex((item) => item.fullPath == route.fullPath);
    tabsList.value.splice(index, 1);
  };
  // 关闭全部
  const closeAllTabs = () => {
    tabsList.value = retainAffixRoute(tabsList.value);
  };

  return {
    tabsList,
    getTabsList,
    setTabsList,
    initTabs,
    addTab,
    closeLeftTabs,
    closeRightTabs,
    closeOtherTabs,
    closeCurrentTab,
    closeAllTabs
  };
});
