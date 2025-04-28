<template>
  <div class="flex justify-between pb-4">
    <div class="flex flex-1 items-center justify-start">
      <slot name="toolbar-left"></slot>
    </div>
    <div class="flex flex-1 justify-end">
      <slot name="toolbar-right"></slot>
      <n-space>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary circle :loading="loading" @click="$emit('refresh')">
              <template #icon>
                <n-icon><ReloadOutlined /></n-icon>
              </template>
            </n-button>
          </template>
          刷新
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary circle @click="$emit('export')">
              <template #icon>
                <n-icon><ExportOutlined /></n-icon>
              </template>
            </n-button>
          </template>
          导出
        </n-tooltip>
        <n-tooltip v-if="selectedCount > 0" trigger="hover">
          <template #trigger>
            <n-button quaternary circle type="error" @click="$emit('batch-delete')">
              <template #icon>
                <n-icon><DeleteOutlined /></n-icon>
              </template>
            </n-button>
          </template>
          批量删除
        </n-tooltip>
      </n-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DeleteOutlined, ExportOutlined, ReloadOutlined } from "@vicons/antd";
import { NButton, NIcon, NSpace, NTooltip } from "naive-ui";

defineProps<{
  loading?: boolean;
  selectedCount?: number;
}>();

defineEmits<{
  (e: "refresh"): void;
  (e: "export"): void;
  (e: "batch-delete"): void;
}>();
</script>

<style lang="less" scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 0 0 16px 0;

  &-left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
  }

  &-right {
    display: flex;
    justify-content: flex-end;
    flex: 1;
  }
}
</style>
