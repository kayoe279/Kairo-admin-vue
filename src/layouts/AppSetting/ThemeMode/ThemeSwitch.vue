<script setup lang="ts">
import { type ThemeMode, useThemeSettingStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed } from "vue";

withDefaults(defineProps<{ position?: "header" | "drawer" }>(), { position: "header" });

const themeStore = useThemeSettingStore();
const { themeMode, storeTheme } = storeToRefs(themeStore);

const isDark = computed(() => themeMode.value === "dark");

const handleToggleTheme = (value: ThemeMode) => {
  themeStore.setThemeMode(value);
};
</script>

<template>
  <ButtonIcon
    v-if="position === 'header'"
    :icon="isDark ? 'solar:sun-2-broken' : 'solar:moon-stars-broken'"
    :tooltipContent="$t('app.theme.themeSwitch')"
    @click="() => handleToggleTheme(isDark ? 'light' : 'dark')"
  />

  <div v-else class="m-auto mb-2 flex w-[80%] items-center justify-center">
    <n-tabs type="segment" animated :value="storeTheme" :on-update:value="handleToggleTheme">
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
      <n-tab-pane name="auto">
        <!-- @vue-ignore -->
        <template #tab>
          <SvgIcon icon="solar:sunrise-broken" class="text-xl" />
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
