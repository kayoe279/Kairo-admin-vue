<template>
  <div v-if="position === 'header'">
    <div @click="() => handleToggleTheme(isDark ? 'light' : 'dark')">
      <n-icon size="20" :component="isDark ? SunnyOutline : MoonOutline" />
    </div>
  </div>
  <div v-else class="m-auto flex w-[70%] items-center justify-center">
    <n-tabs type="segment" animated :value="themeStore.theme" :on-update:value="handleToggleTheme">
      <n-tab-pane name="light">
        <!-- @vue-ignore -->
        <template #tab>
          <n-icon size="20" :component="Sunny" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="dark">
        <!-- @vue-ignore -->
        <template #tab>
          <n-icon size="20" :component="Moon" />
        </template>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { useThemeSettingStore } from "@/store/modules/themeSetting";
import { Moon, MoonOutline, Sunny, SunnyOutline } from "@vicons/ionicons5";
import { useDark, useToggle } from "@vueuse/core";
import { watch } from "vue";

withDefaults(
  defineProps<{
    position?: "header" | "drawer";
  }>(),
  {
    position: "header"
  }
);
const isDark = useDark();
const toggleDark = useToggle(isDark);
const themeStore = useThemeSettingStore();

const handleToggleTheme = (value: "light" | "dark") => {
  themeStore.setTheme(value);
};

watch(
  () => themeStore.theme,
  (value) => {
    if (value === "light" && isDark.value) {
      toggleDark();
    }
    if (value === "dark" && !isDark.value) {
      toggleDark();
    }
  }
);
</script>

<style>
.n-tabs .n-tabs-rail .n-tabs-capsule {
  border-radius: 8px !important;
}
</style>
