<script setup lang="ts">
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";

defineOptions({
  name: "ReloadButton"
});

defineProps<{
  loading?: boolean;
}>();

const appStore = useAppStore();
</script>

<template>
  <ButtonIcon
    icon="solar:refresh-outline"
    tooltipContent="刷新页面"
    :class="cn({ 'pointer-events-none animate-spin': !appStore.reloadFlag })"
    @click="appStore.reloadPage()"
  />
</template>
