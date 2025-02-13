<template>
  <div class="flex items-center justify-between">
    <span>{{ title }}</span>
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{ title: string }>();
defineSlots<{ default: () => any }>();
</script>
