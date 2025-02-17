<script lang="ts" setup>
import { cn } from "@/lib/utils";
import type { AppSettingProps } from "@/settings/appSetting";
import { useAppSettingStore } from "@/store/modules/appSetting";
import { storeToRefs } from "pinia";

const settingStore = useAppSettingStore();
const { navMode } = storeToRefs(settingStore);

const togNavMode = (mode: AppSettingProps["navMode"]) => {
  settingStore.setNavMode(mode);
};
</script>

<template>
  <div class="grid grid-cols-3 gap-x-5 py-3">
    <div class="size-full h-16">
      <n-tooltip placement="bottom">
        <template #trigger>
          <button
            :class="
              cn(
                'hover:border-primary flex size-full gap-x-1.5 rounded-md border-2 p-1.5 shadow transition-colors',
                navMode === 'vertical' ? 'border-primary' : 'border-background'
              )
            "
            @click="togNavMode('vertical')"
          >
            <div class="bg-primary/70 h-full w-4.5 rounded-sm" />
            <div class="flex h-full min-w-0 flex-1 flex-col gap-y-1.5">
              <div class="bg-primary h-4 w-full rounded-sm" />
              <div class="bg-primary/50 min-h-0 w-full flex-1 rounded-sm" />
            </div>
          </button>
        </template>
        <span>左侧菜单模式</span>
      </n-tooltip>
    </div>

    <div class="size-full h-16">
      <n-tooltip placement="bottom">
        <template #trigger>
          <button
            :class="
              cn(
                'hover:border-primary flex size-full gap-x-1.5 rounded-md border-2 p-1.5 shadow transition-colors',
                navMode === 'horizontal' ? 'border-primary' : 'border-background'
              )
            "
            @click="togNavMode('horizontal')"
          >
            <div class="flex h-full min-w-0 flex-1 flex-col gap-y-1.5">
              <div class="bg-primary h-4 w-full rounded-sm" />
              <div class="bg-primary/50 min-h-0 w-full flex-1 rounded-sm" />
            </div>
          </button>
        </template>
        <span>顶部菜单模式</span>
      </n-tooltip>
    </div>

    <div class="size-full h-16">
      <n-tooltip placement="bottom">
        <template #trigger>
          <button
            :class="
              cn(
                'hover:border-primary flex size-full flex-col gap-y-1.5 rounded-md border-2 p-1.5 shadow transition-colors',
                navMode === 'horizontal-mix' ? 'border-primary' : 'border-background'
              )
            "
            @click="togNavMode('horizontal-mix')"
          >
            <div class="bg-primary h-4 w-full rounded-sm" />
            <div class="flex min-h-0 w-full flex-1 gap-x-1.5">
              <div class="bg-primary/70 h-full w-4.5 rounded-sm" />
              <div class="bg-primary/50 min-h-0 w-full flex-1 rounded-sm" />
            </div>
          </button>
        </template>
        <span>顶部菜单混合模式</span>
      </n-tooltip>
    </div>
  </div>
</template>
