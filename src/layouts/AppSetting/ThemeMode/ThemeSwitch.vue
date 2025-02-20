<script setup lang="ts">
import { useThemeSettingStore } from "@/store/modules/themeSetting";
import { useDark, useToggle } from "@vueuse/core";
import { watch } from "vue";

withDefaults(defineProps<{ position?: "header" | "drawer" }>(), { position: "header" });

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

<template>
  <ButtonIcon
    v-if="position === 'header'"
    :icon="isDark ? 'solar:sun-2-broken' : 'solar:moon-stars-broken'"
    :tooltipContent="$t('app.theme.themeSwitch')"
    @click="() => handleToggleTheme(isDark ? 'light' : 'dark')"
  />

  <div v-else class="m-auto flex w-[70%] items-center justify-center">
    <n-tabs type="segment" animated :value="themeStore.theme" :on-update:value="handleToggleTheme">
      <n-tab-pane name="light">
        <!-- @vue-ignore -->
        <template #tab>
          <SvgIcon icon="solar:sun-bold" class="text-xl" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="dark">
        <!-- @vue-ignore -->
        <template #tab>
          <SvgIcon icon="solar:moon-stars-bold" class="text-xl" />
        </template>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style>
.n-tabs .n-tabs-rail .n-tabs-capsule {
  border-radius: 8px !important;
}
</style>
