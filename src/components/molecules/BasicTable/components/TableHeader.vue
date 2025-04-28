<template>
  <div class="flex justify-between pb-4">
    <div class="flex flex-1 items-center justify-start">
      <slot name="header-left"></slot>
      <div v-if="title" class="flex items-center justify-start">
        <span class="text-base font-semibold">{{ title }}</span>
        <n-tooltip v-if="titleTooltip" trigger="hover">
          <template #trigger>
            <n-icon class="ml-1 cursor-pointer text-sm text-gray-500">
              <QuestionCircleOutlined />
            </n-icon>
          </template>
          {{ titleTooltip }}
        </n-tooltip>
      </div>
    </div>
    <div class="flex flex-1 justify-end">
      <slot name="header-right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { QuestionCircleOutlined } from "@vicons/antd";
import { NIcon, NTooltip } from "naive-ui";

defineProps<{
  title?: string;
  titleTooltip?: string;
}>();
</script>

<style lang="less" scoped>
.table-header {
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

  &-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 16px;
    font-weight: 600;

    &-tooltip {
      margin-left: 4px;
      font-size: 14px;
      color: var(--text-color);
      cursor: pointer;
    }
  }
}
</style>
