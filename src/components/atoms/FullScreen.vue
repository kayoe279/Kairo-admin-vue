<script setup lang="ts">
import { useAppStore } from "@/store";

defineOptions({
  name: "FullScreen"
});

interface Props {
  full?: boolean;
}

const props = defineProps<Props>();
const appStore = useAppStore();
</script>

<template>
  <ButtonIcon
    :key="String(full)"
    :tooltipContent="full ? $t('app.exitFullScreen') : $t('app.fullScreen')"
    :icon="props.full ? 'ant-design:fullscreen-exit-outlined' : 'ant-design:fullscreen-outlined'"
    @click="() => appStore.toggleFullScreen()"
  />
</template>
