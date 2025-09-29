<script setup lang="ts">
type Props = {
  withCard?: boolean;
};

withDefaults(defineProps<Props>(), {
  withCard: true
});
</script>

<template>
  <div class="table-container flex min-h-0 flex-1 flex-col gap-4 space-y-4">
    <n-card v-if="withCard" class="min-h-0 flex-1">
      <slot />
    </n-card>
    <div v-else class="min-h-0 flex-1">
      <slot />
    </div>
  </div>
</template>
