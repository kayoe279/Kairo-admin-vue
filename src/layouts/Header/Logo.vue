<script lang="ts" setup>
import { cn } from "@/lib";
import { appConfig } from "@/lib/settings/app";
import { useAppStore } from "@/store";
import { computed } from "vue";

const appStore = useAppStore();
const collapsed = computed(() => appStore.menuSetting.collapsed);
</script>

<template>
  <div class="flex h-16 items-center justify-center overflow-hidden whitespace-nowrap">
    <SvgIcon localIcon="logo" :class="cn('inline h-8 w-auto', { 'mr-2': !collapsed })" />
    <h2
      :class="
        cn(
          'font-poppins m-0 inline overflow-hidden text-xl transition-all duration-300 ease-in-out',
          {
            'basis-0 opacity-0': collapsed
          }
        )
      "
    >
      {{ appConfig.title }}
    </h2>
  </div>
</template>
