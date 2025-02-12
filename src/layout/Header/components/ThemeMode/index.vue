<template>
  <div class="space-y-4 py-3">
    <ThemeSwitch position="drawer" />
    <div class="flex items-center justify-between">
      <span>暗色侧边栏</span>
      <NSwitch v-model:value="darkNav" />
    </div>
    <div class="flex items-center justify-between">
      <span>灰色模式</span>
      <NSwitch v-model:value="grayMode" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ThemeSwitch from "./ThemeSwitch.vue";
import { useDesignSettingStore } from "@/store/modules/designSetting";
import { storeToRefs } from "pinia";

const designStore = useDesignSettingStore();
const { darkNav, grayMode } = storeToRefs(designStore);
</script>
