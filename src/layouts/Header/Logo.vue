<script lang="ts" setup>
import logoImage from "@/assets/images/avatar.jpg";
import { appConfig } from "@/lib/settings/app";
import { cn } from "@/lib/utils";

defineProps<{ collapsed?: boolean }>();
</script>

<template>
  <div class="flex h-16 items-center justify-center overflow-hidden whitespace-nowrap">
    <img :src="logoImage" alt="" :class="cn('h-8 w-auto', { 'mr-2': !collapsed })" />
    <Transition name="fade-slide">
      <h2 v-show="!collapsed" class="font-poppins m-0 text-xl">{{ appConfig.title }}</h2>
    </Transition>
  </div>
</template>
