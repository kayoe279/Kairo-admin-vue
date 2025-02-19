import { StoreEnum } from "@/lib/enums/storeEnum";
import { type AppSettingProps, appSetting } from "@/lib/settings/app";
import { useToggle } from "@vueuse/core";
import cloneDeep from "lodash-es/cloneDeep";
import { defineStore } from "pinia";
import { nextTick, ref, toRefs } from "vue";

export const useAppStore = defineStore(
  StoreEnum.setting,
  () => {
    const settings = ref(cloneDeep(appSetting));

    const [open, toggleDrawer] = useToggle(false);
    const [reloadFlag, toggleReloadFlag] = useToggle(true);
    const [fullScreen, toggleFullScreen] = useToggle(false);

    const setNavTheme = (value: string) => {
      settings.value.navTheme = value;
    };

    const setNavMode = (value: AppSettingProps["navMode"]) => {
      settings.value.navMode = value;
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
      reloadFlag,
      open,
      fullScreen,
      toggleFullScreen,
      toggleDrawer,
      setNavTheme,
      setNavMode,
      reloadPage,
      resetAppSetting
    };
  },
  {
    persist: true
  }
);
