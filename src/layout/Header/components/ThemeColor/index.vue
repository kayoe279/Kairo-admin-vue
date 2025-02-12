<template>
  <div class="space-y-4 py-3">
    <div class="flex items-center justify-between">
      <span>主色</span>
      <NSwitch v-model:value="darkNav" />
    </div>
    <div class="flex items-center justify-between">
      <div class="drawer-setting-item-title">灰色模式</div>
      <div class="drawer-setting-item-action">
        <NSwitch v-model:value="grayMode" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDesignSettingStore } from "@/store/modules/designSetting";
import { storeToRefs } from "pinia";

const designStore = useDesignSettingStore();
const { darkNav, grayMode } = storeToRefs(designStore);
</script>
