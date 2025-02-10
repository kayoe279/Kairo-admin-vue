import { StoreEnum } from "@/lib/enums/storeEnum";
import projectSetting from "@/settings/projectSetting";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProjectSettingStore = defineStore(
  StoreEnum.setting,
  () => {
    const navMode = ref(projectSetting.navMode);
    const navTheme = ref(projectSetting.navTheme);
    const isMobile = ref(projectSetting.isMobile);
    const headerSetting = ref(projectSetting.headerSetting);
    const showFooter = ref(projectSetting.showFooter);
    const menuSetting = ref(projectSetting.menuSetting);
    const multiTabsSetting = ref(projectSetting.multiTabsSetting);
    const crumbsSetting = ref(projectSetting.crumbsSetting);
    const permissionMode = ref(projectSetting.permissionMode);
    const isPageAnimate = ref(projectSetting.isPageAnimate);
    const pageAnimateType = ref(projectSetting.pageAnimateType);

    const setNavTheme = (value: string) => {
      navTheme.value = value;
    };

    const setIsMobile = (value: boolean) => {
      isMobile.value = value;
    };

    return {
      navMode,
      navTheme,
      isMobile,
      headerSetting,
      showFooter,
      menuSetting,
      multiTabsSetting,
      crumbsSetting,
      permissionMode,
      isPageAnimate,
      pageAnimateType,
      setNavTheme,
      setIsMobile
    };
  },
  {
    persist: true
  }
);
