import { useThemeSettingStore } from "@/store/modules/themeSetting";
import { computed } from "vue";

export function useDesignSetting() {
  const themeStore = useThemeSettingStore();

  const getDarkTheme = computed(() => themeStore.theme === "dark");

  const getAppTheme = computed(() => themeStore.themeColor);

  const getAppThemeList = computed(() => themeStore.appThemeList);

  return {
    getDarkTheme,
    getAppTheme,
    getAppThemeList
  };
}
