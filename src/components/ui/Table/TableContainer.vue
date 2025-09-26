<script setup lang="ts">
import { useAppStore } from "@/store";

const appStore = useAppStore();

type Props = {
  withCard?: boolean;
};

withDefaults(defineProps<Props>(), {
  withCard: true
});
</script>

<template>
  <div class="table-container flex min-h-0 flex-1 flex-col gap-4 space-y-4">
    <NCard v-if="withCard" class="min-h-0 flex-1">
      <slot />
    </NCard>
    <slot v-else />
  </div>
</template>
