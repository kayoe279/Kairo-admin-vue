<script lang="ts" setup>
import { useThemeSettingStore } from "@/store/modules/themeSetting";
import { storeToRefs } from "pinia";

const themeStore = useThemeSettingStore();
const { darkNav, grayMode } = storeToRefs(themeStore);
</script>

<template>
  <div class="space-y-4 py-3">
    <ThemeSwitch position="drawer" />
    <SettingItem :title="$t('app.theme.darkSidebar')">
      <n-switch v-model:value="darkNav" />
    </SettingItem>
    <SettingItem :title="$t('app.theme.grayMode')">
      <n-switch v-model:value="grayMode" />
    </SettingItem>
  </div>
</template>
