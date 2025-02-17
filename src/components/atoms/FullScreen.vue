<script setup lang="ts">
defineOptions({
  name: "ReloadButton"
});

interface Props {
  loading?: boolean;
}

defineProps<Props>();
</script>

<template>
  <ButtonIcon tooltip-content="刷新页面">
    <icon-ant-design-reload-outlined :class="{ 'animate-duration-750 animate-spin': loading }" />
  </ButtonIcon>
</template>

<style scoped></style>
