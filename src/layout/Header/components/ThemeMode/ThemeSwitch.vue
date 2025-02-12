<template>
  <div v-if="position === 'header'">
    <div @click="() => handleToggleTheme(isDark ? 'light' : 'dark')">
      <NIcon size="20" :component="isDark ? SunnyOutline : MoonOutline" />
    </div>
  </div>
  <div v-else class="m-auto flex w-[70%] items-center justify-center">
    <NTabs
      type="segment"
      animated
      :on-update:value="handleToggleTheme"
      :default-value="designStore.theme"
    >
      <NTabPane name="light">
        <!-- @vue-ignore -->
        <template #tab>
          <NIcon size="20" :component="Sunny" />
        </template>
      </NTabPane>
      <NTabPane name="dark">
        <!-- @vue-ignore -->
        <template #tab>
          <NIcon size="20" :component="Moon" />
        </template>
      </NTabPane>
    </NTabs>
  </div>
</template>

<script setup lang="ts">
import { useDesignSettingStore } from "@/store/modules/designSetting";
import { Moon, MoonOutline, Sunny, SunnyOutline } from "@vicons/ionicons5";
import { useDark, useToggle } from "@vueuse/core";

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
const designStore = useDesignSettingStore();

const handleToggleTheme = (value: "light" | "dark") => {
  toggleDark();
  designStore.setTheme(value);
};
</script>

<style>
.n-tabs .n-tabs-rail .n-tabs-capsule {
  border-radius: 8px !important;
}
</style>
