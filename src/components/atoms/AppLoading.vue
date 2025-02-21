<script setup lang="ts">
import { appConfig } from "@/lib/settings/app";
</script>

<template>
  <div class="size-screen fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
    <SvgIcon localIcon="logo" class="h-20 w-auto animate-bounce" />
    <h2 class="text-2xl font-bold">{{ appConfig.title }}</h2>
  </div>
</template>
