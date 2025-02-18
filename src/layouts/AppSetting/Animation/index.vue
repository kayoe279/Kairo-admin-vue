<script lang="ts" setup>
import { animates as animateOptions } from "@/settings/appSetting";
import { useAppStore } from "@/store";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const { isPageAnimate, pageAnimateType } = storeToRefs(appStore);
</script>

<template>
  <div class="space-y-4 py-3">
    <SettingItem title="启用动画">
      <n-switch v-model:value="isPageAnimate" />
    </SettingItem>
    <SettingItem title="动画类型">
      <n-select v-model:value="pageAnimateType" :options="animateOptions" class="!w-30" />
    </SettingItem>
  </div>
</template>
