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
</template>
