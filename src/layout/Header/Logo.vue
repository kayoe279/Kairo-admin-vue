<template>
  <div class="flex h-16 items-center justify-center overflow-hidden whitespace-nowrap">
    <img :src="websiteConfig.logo" alt="" :class="cn('h-8 w-auto', { 'mr-2': !collapsed })" />
    <h2 v-show="!collapsed" class="m-0">{{ websiteConfig.title }}</h2>
  </div>
</template>

<script lang="ts" setup>
import { websiteConfig } from "@/config/website.config";
import { cn } from "@/lib/utils";

defineProps<{ collapsed: boolean }>();
</script>
