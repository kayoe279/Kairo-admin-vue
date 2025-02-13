import { useAppSettingStore } from "@/store/modules/appSetting";
import { computed } from "vue";

export function useProjectSetting() {
  const projectStore = useAppSettingStore();

  const navMode = computed(() => projectStore.navMode);

  const navTheme = computed(() => projectStore.navTheme);

  const headerSetting = computed(() => projectStore.headerSetting);

  const multiTabsSetting = computed(() => projectStore.multiTabsSetting);

  const menuSetting = computed(() => projectStore.menuSetting);

  const breadcrumbsSetting = computed(() => projectStore.breadcrumbsSetting);

  const permissionMode = computed(() => projectStore.permissionMode);

  const showFooter = computed(() => projectStore.showFooter);

  const isPageAnimate = computed(() => projectStore.isPageAnimate);

  const pageAnimateType = computed(() => projectStore.pageAnimateType);

  return {
    navMode,
    navTheme,
    headerSetting,
    multiTabsSetting,
    menuSetting,
    breadcrumbsSetting,
    permissionMode,
    showFooter,
    isPageAnimate,
    pageAnimateType
  };
}
