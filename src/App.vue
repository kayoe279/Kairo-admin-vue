<template>
  <NConfigProvider
    v-if="!isLock"
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
  >
    <AppProvider>
      <RouterView />
    </AppProvider>
  </NConfigProvider>

  <transition v-if="isLock && $route.name !== 'login'" name="slide-up">
    <LockScreen />
  </transition>
</template>

<script lang="ts" setup>
import { AppProvider } from "@/components/Application";
import { LockScreen } from "@/components/Lockscreen";
import { lighten } from "@/lib/index";
import { useDesignSettingStore } from "@/store/modules/designSetting";
import { useScreenLockStore } from "@/store/modules/screenLock.js";
import { darkTheme, dateZhCN, zhCN } from "naive-ui";
import { computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const useScreenLock = useScreenLockStore();
const designStore = useDesignSettingStore();

const isLock = computed(() => useScreenLock.isLocked);
const lockTime = computed(() => useScreenLock.lockTime);
const getThemeOverrides = computed(() => {
  const appTheme = designStore.appTheme;
  const lightenStr = lighten(designStore.appTheme, 6);
  return {
    common: {
      primaryColor: appTheme,
      primaryColorHover: lightenStr,
      primaryColorPressed: lightenStr,
      primaryColorSuppl: appTheme
    },
    LoadingBar: {
      colorLoading: appTheme
    }
  };
});
const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined));

let timer: NodeJS.Timer;

const timekeeping = () => {
  clearInterval(timer);
  if (route.name == "login" || isLock.value) return;
  // 设置不锁屏
  useScreenLock.setLock(false);
  // 重置锁屏时间
  useScreenLock.setLockTime();
  timer = setInterval(() => {
    // 锁屏倒计时递减
    useScreenLock.setLockTime(lockTime.value - 1);
    if (lockTime.value <= 0) {
      // 设置锁屏
      useScreenLock.setLock(true);
      return clearInterval(timer);
    }
  }, 1000);
};

onMounted(() => {
  designStore.setAppThemeVariable();
  document.addEventListener("mousedown", timekeeping);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", timekeeping);
});
</script>
