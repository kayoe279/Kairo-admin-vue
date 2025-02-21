<script lang="ts" setup>
import { appConfig } from "@/lib/settings/app";
import { cn } from "@/lib/utils";

defineProps<{ collapsed?: boolean }>();
</script>

<template>
  <div class="flex h-16 items-center justify-center overflow-hidden whitespace-nowrap">
    <SvgIcon localIcon="logo" class="mr-2 inline h-8 w-auto" />
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
