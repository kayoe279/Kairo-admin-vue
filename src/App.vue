<template>
  <NConfigProvider
    :locale="zhCN"
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
    :date-locale="dateZhCN"
    class="h-full"
  >
    <AppProvider>
      <RouterView />
    </AppProvider>
  </NConfigProvider>

  <!-- 暂时不要这个 -->
  <!-- <transition v-if="isLock && $route.name !== 'login'" name="slide-up">
    <LockScreen />
  </transition> -->
</template>

<script lang="ts" setup>
import { useThemeSettingStore } from "@/store/modules/themeSetting";
import { dateZhCN, darkTheme as naiveDarkTheme, zhCN } from "naive-ui";
import { storeToRefs } from "pinia";
import { computed, watch } from "vue";

const themeStore = useThemeSettingStore();
const { theme, themeOverrides, grayMode } = storeToRefs(themeStore);

const darkTheme = computed(() => (theme.value === "dark" ? naiveDarkTheme : undefined));

// set gray-mode class to html or body dom
watch(grayMode, (value) => {
  if (value) {
    document.body.classList.add("gray-mode");
  } else {
    document.body.classList.remove("gray-mode");
  }
});

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
//   themeStore.setAppThemeVariable();
//   document.addEventListener("mousedown", timekeeping);
// });

// onUnmounted(() => {
//   document.removeEventListener("mousedown", timekeeping);
// });
</script>
