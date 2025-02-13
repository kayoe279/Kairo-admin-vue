<template>
  <div class="space-y-4 py-3">
    <ThemeSwitch position="drawer" />
    <SettingItem title="暗色侧边栏">
      <n-switch v-model:value="darkNav" />
    </SettingItem>
    <SettingItem title="灰色模式">
      <n-switch v-model:value="grayMode" />
    </SettingItem>
  </div>
</template>

<script lang="ts" setup>
import { useThemeSettingStore } from "@/store/modules/themeSetting";
import { storeToRefs } from "pinia";

const themeStore = useThemeSettingStore();
const { darkNav, grayMode } = storeToRefs(themeStore);
</script>
