import { StoreEnum, getCurrentLocale, setCurrentLocale } from "@/lib";
import { setI18nLocale } from "@/lib/i18n";
import { type AppSettingProps, appSetting } from "@/lib/settings/app";
import { useToggle } from "@vueuse/core";
import cloneDeep from "lodash-es/cloneDeep";
import { defineStore } from "pinia";
import { nextTick, ref, toRefs } from "vue";

export const useAppStore = defineStore(
  StoreEnum.setting,
  () => {
    const settings = ref(cloneDeep(appSetting));
    const locale = ref(getCurrentLocale() || import.meta.env.VITE_DEFAULT_LOCALE);

    const [open, toggleDrawer] = useToggle(false);
    const [reloadFlag, toggleReloadFlag] = useToggle(true);
    const [fullScreen, toggleFullScreen] = useToggle(false);

    const setNavTheme = (value: string) => {
      settings.value.navTheme = value;
    };

    const setNavMode = (value: AppSettingProps["navMode"]) => {
      settings.value.navMode = value;
    };

    const toggleMenuCollapsed = (value?: boolean) => {
      settings.value.menuSetting.collapsed =
        value !== undefined ? value : !settings.value.menuSetting.collapsed;
    };

    const setLocale = (value: Locale) => {
      setI18nLocale(value);
      setCurrentLocale(value);
      locale.value = value;
    };

    // 重置 store
    const resetAppSetting = () => {
      Object.assign(settings.value, {
        ...cloneDeep(appSetting)
      });
    };

    // 刷新页面
    const reloadPage = async (duration = 300) => {
      toggleReloadFlag(false);
      const d = settings.value.isPageAnimate ? duration : 40;
      await nextTick();
      await new Promise((resolve) => {
        setTimeout(resolve, d);
      });

      toggleReloadFlag(true);
    };

    return {
      ...toRefs(settings.value),
      locale,
      reloadFlag,
      open,
      fullScreen,
      toggleMenuCollapsed,
      toggleFullScreen,
      toggleDrawer,
      setNavTheme,
      setNavMode,
      setLocale,
      reloadPage,
      resetAppSetting
    };
  },
  {
    persist: true
  }
);
