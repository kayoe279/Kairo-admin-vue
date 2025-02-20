<script lang="ts" setup>
import { naiveI18nOptions } from "@/lib/i18n";
import { useAppStore, useThemeSettingStore } from "@/store";
import { darkTheme as naiveDarkTheme } from "naive-ui";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const appStore = useAppStore();
const themeStore = useThemeSettingStore();
const { themeMode, themeOverrides } = storeToRefs(themeStore);

const darkTheme = computed(() => (themeMode.value === "dark" ? naiveDarkTheme : undefined));
const naiveLocale = computed(() => naiveI18nOptions[appStore.locale] ?? naiveI18nOptions["zh-CN"]);

// const timer = ref<NodeJS.Timeout>();

// const timekeeping = () => {
//   clearInterval(timer.value);

//   if (route.name == "login" || isLock.value) return;
//   // 设置不锁屏
//   useScreenLock.setLock(false);
//   // 重置锁屏时间
//   useScreenLock.setLockTime();
//   timer.value = setInterval(() => {
//     // 锁屏倒计时递减
//     useScreenLock.setLockTime(lockTime.value - 1);
//     if (lockTime.value <= 0) {
//       // 设置锁屏
//       useScreenLock.setLock(true);
//       return clearInterval(timer.value);
//     }
//   }, 1000);
// };

// onMounted(() => {
//   document.addEventListener("mousedown", timekeeping);
// });

// onUnmounted(() => {
//   document.removeEventListener("mousedown", timekeeping);
// });
</script>

<template>
  <n-config-provider
    :locale="naiveLocale.locale"
    :date-locale="naiveLocale.dateLocale"
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
    class="h-full"
  >
    <AppProvider>
      <RouterView />
    </AppProvider>
  </n-config-provider>

  <!-- 暂时不要这个 -->
  <!-- <transition v-if="isLock && $route.name !== 'login'" name="slide-up">
    <LockScreen />
  </transition> -->
</template>
