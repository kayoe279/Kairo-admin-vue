import { StoreEnum } from "@/lib/enums/storeEnum";
import { lighten } from "@/lib/utils";
import designSetting, { ThemeSettingProps } from "@/settings/themeSetting";
import { store } from "@/store";
import cloneDeep from "lodash-es/cloneDeep";
import type { GlobalThemeOverrides } from "naive-ui";
import { defineStore } from "pinia";
import { computed, ref, toRefs } from "vue";

export type ThemeType = "primary" | "info" | "success" | "warning" | "error";

export const useThemeSettingStore = defineStore(
  StoreEnum.theme,
  () => {
    const settings = ref(cloneDeep(designSetting));

    const inverted = computed(() => {
      return settings.value.theme === "dark";
    });

    // naive-ui 主题 overrides
    const themeOverrides = computed<GlobalThemeOverrides>(() => {
      const themeColor = settings.value.themeColor;
      const infoColor = settings.value.infoColor;
      const successColor = settings.value.successColor;
      const warningColor = settings.value.warningColor;
      const errorColor = settings.value.errorColor;
      const lightenStr = lighten(themeColor, 6);
      const infoStr = lighten(themeColor, 6);
      const successStr = lighten(themeColor, 6);
      const warningStr = lighten(themeColor, 6);
      const errorStr = lighten(themeColor, 6);

      return {
        common: {
          primaryColor: themeColor,
          primaryColorHover: lightenStr,
          primaryColorPressed: lightenStr,
          primaryColorSuppl: themeColor,

          infoColor: infoColor,
          infoColorHover: infoStr,
          infoColorPressed: infoStr,
          infoColorSuppl: infoColor,

          successColor: successColor,
          successColorHover: successStr,
          successColorPressed: successStr,
          successColorSuppl: successColor,

          warningColor: warningColor,
          warningColorHover: warningStr,
          warningColorPressed: warningStr,
          warningColorSuppl: warningColor,

          errorColor: errorColor,
          errorColorHover: errorStr,
          errorColorPressed: errorStr,
          errorColorSuppl: errorColor,
          borderRadius: "6px"
        },
        LoadingBar: {
          colorLoading: themeColor
        }
      };
    });

    // 设置 app 颜色主题变量
    const setAppThemeVariable = (value?: string) => {
      document.documentElement.style.setProperty(
        "--primary-foreground",
        value || settings.value.themeColor || ""
      );
    };

    // 设置 app 颜色主题
    const setThemeColor = (type: ThemeType, value: string) => {
      if (type === "primary") {
        settings.value.themeColor = value;
        setAppThemeVariable(value);
      } else if (type === "info") {
        settings.value.infoColor = value;
      } else if (type === "success") {
        settings.value.successColor = value;
      } else if (type === "warning") {
        settings.value.warningColor = value;
      } else if (type === "error") {
        settings.value.errorColor = value;
      }
    };

    // 设置主题 暗黑模式
    const setTheme = (value: ThemeSettingProps["theme"]) => {
      settings.value.theme = value;
    };

    // 设置 侧边栏, 顶栏, 灰色模式
    const setMode = (type: "darkNav" | "grayMode", value: boolean) => {
      if (type === "darkNav") {
        settings.value.darkNav = value;
      } else if (type === "grayMode") {
        settings.value.grayMode = value;
      }
    };

    // 重置store
    const resetDesignSetting = () => {
      Object.assign(settings.value, {
        ...cloneDeep(designSetting)
      });
    };

    return {
      ...toRefs(settings.value),
      inverted,
      themeOverrides,
      setMode,
      setTheme,
      setThemeColor,
      setAppThemeVariable,
      resetDesignSetting
    };
  },
  {
    persist: true
  }
);

// Need to be used outside the setup
export function useDesignSetting() {
  return useThemeSettingStore(store);
}
