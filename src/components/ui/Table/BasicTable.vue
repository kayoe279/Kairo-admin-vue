<script setup lang="ts">
import { useTable } from "@/hooks";
import { DEFAULT_PAGE_SIZE } from "@/lib";
import type { DataTableColumns, DataTableProps } from "naive-ui";

// Props 定义
type TableProps = {
  columns: DataTableColumns<any>;
  apiFunction: (params: Record<string, any>) => any;
  searchParams?: Record<string, any>;
  immediate?: boolean;
  pageSize?: number;
  bordered?: boolean;
  striped?: boolean;
  scrollX?: number;
  rowKey?: DataTableProps["rowKey"];
};

const props = withDefaults(defineProps<TableProps>(), {
  searchParams: () => ({}),
  immediate: true,
  pageSize: DEFAULT_PAGE_SIZE,
  bordered: true,
  striped: true,
  rowKey: (row: any) => row.id
});

// Emits 定义
const emit = defineEmits(["row-click", "row-dblclick"]);

const {
  tableData,
  loading,
  pagination,
  refresh,
  updateSearchParams,
  handlePageChange,
  handlePageSizeChange
} = useTable(props.apiFunction, {
  defaultPageSize: props.pageSize,
  immediate: props.immediate,
  searchParams: props.searchParams
});

// 处理行点击
const handleRowClick = (row: any, index: number) => {
  emit("row-click", row, index);
};

// 处理行双击
const handleRowDblclick = (row: any, index: number) => {
  emit("row-dblclick", row, index);
};

// 暴露方法给父组件
defineExpose({
  refresh,
  updateSearchParams
});
</script>

<template>
  <div class="space-y-4">
    <!-- 操作按钮区域 -->
    <div v-if="$slots.headerLeft || $slots.headerRight">
      <NSpace justify="space-between">
        <slot name="headerLeft" />
        <slot name="headerRight" />
      </NSpace>
    </div>
    <NDataTable
      remote
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      :bordered="bordered"
      :striped="striped"
      :scroll-x="scrollX"
      :row-key="rowKey"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
  </div>
</template>
