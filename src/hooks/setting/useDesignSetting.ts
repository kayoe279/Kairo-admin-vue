import { useDesignSettingStore } from "@/store/modules/designSetting";
import { computed } from "vue";

export function useDesignSetting() {
  const designStore = useDesignSettingStore();

  const getDarkTheme = computed(() => designStore.theme === "dark");

  const getAppTheme = computed(() => designStore.themeColor);

  const getAppThemeList = computed(() => designStore.appThemeList);

  return {
    getDarkTheme,
    getAppTheme,
    getAppThemeList
  };
}
