<template>
  <NConfigProvider
    v-if="!isLock"
    :locale="zhCN"
    :theme="darkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
    class="h-full"
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
import { LockScreen } from "@/components/LockScreen";
import AppProvider from "@/layout/AppProvider.vue";
import { lighten } from "@/lib/utils";
import { useDesignSettingStore } from "@/store/modules/designSetting";
import { useScreenLockStore } from "@/store/modules/screenLock.js";
import { dateZhCN, darkTheme as naiveDarkTheme, zhCN } from "naive-ui";
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const useScreenLock = useScreenLockStore();
const designStore = useDesignSettingStore();
const { theme, themeColor, grayMode } = storeToRefs(designStore);

const darkTheme = computed(() => (theme.value === "dark" ? naiveDarkTheme : undefined));
const isLock = computed(() => useScreenLock.isLocked);
const lockTime = computed(() => useScreenLock.lockTime);
const getThemeOverrides = computed(() => {
  const lightenStr = lighten(themeColor.value, 6);
  return {
    common: {
      primaryColor: themeColor.value,
      primaryColorHover: lightenStr,
      primaryColorPressed: lightenStr,
      primaryColorSuppl: themeColor.value
    },
    LoadingBar: {
      colorLoading: themeColor.value
    }
  };
});

// set gray-mode class to html or body dom
watch(grayMode, (value) => {
  if (value) {
    document.body.classList.add("gray-mode");
  } else {
    document.body.classList.remove("gray-mode");
  }
});

const timer = ref<NodeJS.Timeout>();

const timekeeping = () => {
  clearInterval(timer.value);

  if (route.name == "login" || isLock.value) return;
  // 设置不锁屏
  useScreenLock.setLock(false);
  // 重置锁屏时间
  useScreenLock.setLockTime();
  timer.value = setInterval(() => {
    // 锁屏倒计时递减
    useScreenLock.setLockTime(lockTime.value - 1);
    if (lockTime.value <= 0) {
      // 设置锁屏
      useScreenLock.setLock(true);
      return clearInterval(timer.value);
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
