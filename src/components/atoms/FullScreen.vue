<script setup lang="ts">
import { useAppSettingStore } from "@/store/modules/appSetting";

defineOptions({
  name: "FullScreen"
});

interface Props {
  full?: boolean;
}

const props = defineProps<Props>();
const settingStore = useAppSettingStore();
</script>

<template>
  <ButtonIcon
    :key="String(full)"
    :tooltipContent="full ? '退出全屏' : '全屏'"
    :icon="props.full ? 'ant-design:fullscreen-exit-outlined' : 'ant-design:fullscreen-outlined'"
    @click="() => settingStore.toggleFullScreen()"
  />
</template>
