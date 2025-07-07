<script lang="ts" setup>
import { useThemeStore } from "@/store/modules/theme";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const { darkNav, grayMode } = storeToRefs(themeStore);
</script>

<template>
  <div class="space-y-4 py-3">
    <ThemeSwitch position="drawer" />
    <SettingItem :title="$t('app.theme.darkSidebar')">
      <n-switch v-model:value="darkNav" />
    </SettingItem>
    <SettingItem :title="$t('app.theme.grayMode')">
      <n-switch v-model:value="grayMode" @update:value="themeStore.toggleGrayMode" />
    </SettingItem>
  </div>
</template>
