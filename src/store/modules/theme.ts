import { StoreEnum } from "@/lib/enums/storeEnum";
import { themeSetting } from "@/lib/settings/theme";
import { lighten } from "@/lib/utils";
import { useColorMode } from "@vueuse/core";
import cloneDeep from "lodash-es/cloneDeep";
import type { GlobalThemeOverrides } from "naive-ui";
import { defineStore } from "pinia";
import { computed, ref, toRefs, watch } from "vue";

export type ThemeType = "primary" | "info" | "success" | "warning" | "error";
export type ThemeMode = "light" | "dark" | "auto";

export const useThemeStore = defineStore(
  StoreEnum.theme,
  () => {
    const settings = ref(cloneDeep(themeSetting));

    const { system, store } = useColorMode({
      emitAuto: true
    });

    const themeMode = computed(() => {
      return store.value === "auto" ? system.value : store.value;
    });

    const isDark = computed(() => themeMode.value === "dark");

    // naive-ui 主题 overrides
    const themeOverrides = computed<GlobalThemeOverrides>(() => {
      const themeColor = settings.value.themeColor;
      const infoColor = settings.value.infoColor;
      const successColor = settings.value.successColor;
      const warningColor = settings.value.warningColor;
      const errorColor = settings.value.errorColor;
      const lightenStr = lighten(themeColor, 6);
      const infoStr = lighten(infoColor, 6);
      const successStr = lighten(successColor, 6);
      const warningStr = lighten(warningColor, 6);
      const errorStr = lighten(errorColor, 6);

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
          borderRadius: "5px"
        },
        LoadingBar: {
          colorLoading: themeColor
        }
      };
    });

    // 设置 app 颜色主题变量
    const setAppThemeVariable = (value?: string) => {
      document.documentElement.style.setProperty(
        "--fg-primary",
        value || settings.value.themeColor || ""
      );
    };

    // 设置 app 颜色主题
    const setThemeColor = (type: ThemeType, value: string) => {
      if (type === "primary") {
        settings.value.themeColor = value;
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
    const setThemeMode = (mode: ThemeMode) => {
      store.value = mode;
    };

    // 设置灰色模式
    const toggleGrayMode = (value: boolean) => {
      if (value) {
        document.body.classList.add("gray-mode");
      } else {
        document.body.classList.remove("gray-mode");
      }
      settings.value.grayMode = value;
    };

    // 重置store
    const resetDesignSetting = () => {
      Object.assign(settings.value, {
        ...cloneDeep(themeSetting)
      });
    };

    watch(
      () => settings.value.themeColor,
      (newVal) => {
        setAppThemeVariable(newVal);
      },
      {
        immediate: true
      }
    );

    return {
      ...toRefs(settings.value),
      system,
      storeTheme: store,
      themeMode,
      isDark,
      themeOverrides,
      toggleGrayMode,
      setThemeMode,
      setThemeColor,
      setAppThemeVariable,
      resetDesignSetting
    };
  },
  {
    persist: true
  }
);
