import { StoreEnum } from "@/lib/enums/storeEnum";
import designSetting, { DesignSettingProps } from "@/settings/designSetting";
import { store } from "@/store";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useDesignSettingStore = defineStore(
  StoreEnum.design,
  () => {
    const theme = ref(designSetting.theme);
    const themeColor = ref(designSetting.themeColor);
    const appThemeList = ref(designSetting.appThemeList);

    const darkNav = ref(designSetting.darkNav);
    const grayMode = ref(designSetting.grayMode);

    const inverted = computed(() => {
      return theme.value === "dark";
    });

    // 设置 app 颜色主题变量
    const setAppThemeVariable = (value?: string) => {
      document.documentElement.style.setProperty(
        "--primary-foreground",
        value || themeColor.value || ""
      );
    };

    // 设置 app 颜色主题
    const setThemeColor = (value: string) => {
      themeColor.value = value;
      setAppThemeVariable(value);
    };

    // 设置主题 暗黑模式
    const setTheme = (value: DesignSettingProps["theme"]) => {
      theme.value = value;
    };

    // 设置 侧边栏, 顶栏, 灰色模式
    const setMode = (type: "darkNav" | "grayMode", value: boolean) => {
      if (type === "darkNav") {
        darkNav.value = value;
      } else if (type === "grayMode") {
        grayMode.value = value;
      }
    };

    return {
      theme,
      themeColor,
      appThemeList,
      darkNav,
      grayMode,
      inverted,
      setMode,
      setTheme,
      setThemeColor,
      setAppThemeVariable
    };
  },
  {
    persist: true
  }
);

// Need to be used outside the setup
export function useDesignSetting() {
  return useDesignSettingStore(store);
}
