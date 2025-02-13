import { StoreEnum } from "@/lib/enums/storeEnum";
import projectSetting, { AppSettingProps } from "@/settings/appSetting";
import { useToggle } from "@vueuse/core";
import cloneDeep from "lodash-es/cloneDeep";
import { defineStore } from "pinia";
import { ref, toRefs } from "vue";

export const useAppSettingStore = defineStore(
  StoreEnum.setting,
  () => {
    const settings = ref(cloneDeep(projectSetting));

    const [open, toggleDrawer] = useToggle(false);

    const setNavTheme = (value: string) => {
      settings.value.navTheme = value;
    };

    const setNavMode = (value: AppSettingProps["navMode"]) => {
      settings.value.navMode = value;
    };

    // 重置 store
    const resetAppSetting = () => {
      Object.assign(settings.value, {
        ...cloneDeep(projectSetting)
      });
    };

    return {
      ...toRefs(settings.value),
      open,
      toggleDrawer,
      setNavTheme,
      setNavMode,
      resetAppSetting
    };
  },
  {
    persist: true
  }
);
