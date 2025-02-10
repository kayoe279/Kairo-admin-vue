import { StoreEnum } from "@/lib/enums/storeEnum";
import designSetting from "@/settings/designSetting";
import { store } from "@/store";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDesignSettingStore = defineStore(
  StoreEnum.design,
  () => {
    const darkTheme = ref(designSetting.darkTheme);
    const appTheme = ref(designSetting.appTheme);
    const appThemeList = ref(designSetting.appThemeList);

    const setAppThemeVariable = (value?: string) => {
      document.documentElement.style.setProperty(
        "--color-primary-active",
        value || appTheme.value || ""
      );
    };

    const setAppTheme = (value: string) => {
      appTheme.value = value;
      setAppThemeVariable(value);
    };

    return {
      darkTheme,
      appTheme,
      appThemeList,
      setAppTheme,
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
