<template>
  <div class="w-full">
    <TableHeader :title="title" :title-tooltip="titleTooltip">
      <template #header-left>
        <slot name="header-left"></slot>
      </template>
      <template #header-right>
        <slot name="header-right"></slot>
      </template>
    </TableHeader>

    <TableToolbar
      :loading="loading"
      :selected-count="selectedRowKeys.length"
      @refresh="handleRefresh"
      @export="handleExport"
      @batch-delete="handleBatchDelete"
    >
      <template #toolbar-left>
        <slot name="toolbar-left"></slot>
      </template>
      <template #toolbar-right>
        <slot name="toolbar-right"></slot>
      </template>
    </TableToolbar>

    <n-data-table
      ref="tableRef"
      :columns="getColumns"
      :data="data"
      :loading="loading"
      :row-key="getRowKey"
      :pagination="pagination"
      :striped="striped"
      :size="size"
      @update:checked-row-keys="onSelectChange"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </n-data-table>

    <TableFooter>
      <template #footer-left>
        <slot name="footer-left"></slot>
      </template>
      <template #footer-right>
        <slot name="footer-right"></slot>
      </template>
    </TableFooter>

    <ColumnSetting
      v-model:show="showColumnSetting"
      :columns="columns"
      :default-checked-keys="defaultCheckedKeys"
      @confirm="handleColumnSettingConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import ColumnSetting from "./components/ColumnSetting.vue";
import TableFooter from "./components/TableFooter.vue";
import TableHeader from "./components/TableHeader.vue";
import TableToolbar from "./components/TableToolbar.vue";
import type { BasicTableProps } from "./types/table";
import { computed, ref } from "vue";

const props = withDefaults(defineProps<BasicTableProps>(), {
  title: "",
  titleTooltip: "",
  data: () => [],
  loading: false,
  rowKey: "id",
  showPagination: true,
  striped: false,
  size: "medium",
  canResize: true,
  resizeHeightOffset: 0
});

const emit = defineEmits<{
  (e: "update:checked-row-keys", keys: string[]): void;
  (e: "update:page", page: number): void;
  (e: "update:page-size", pageSize: number): void;
}>();

const tableRef = ref();
const showColumnSetting = ref(false);
const defaultCheckedKeys = ref<string[]>([]);
const selectedRowKeys = ref<string[]>([]);

// 获取行 key
const getRowKey = computed(() => {
  if (typeof props.rowKey === "function") {
    return props.rowKey;
  }
  return (row: any) => row[props.rowKey as string];
});

// 获取显示的列
const getColumns = computed(() => {
  return props.columns.filter((col) => defaultCheckedKeys.value.includes(col.key));
});

// 选择行
function onSelectChange(keys: string[]) {
  selectedRowKeys.value = keys;
  emit("update:checked-row-keys", keys);
}

// 页码改变
function handlePageChange(page: number) {
  emit("update:page", page);
}

// 每页条数改变
function handlePageSizeChange(pageSize: number) {
  emit("update:page-size", pageSize);
}

// 刷新
function handleRefresh() {
  emit("update:page", 1);
}

// 导出
async function handleExport() {
  if (props.onExport) {
    await props.onExport(props.data);
  }
}

// 批量删除
async function handleBatchDelete() {
  if (props.onBatchDelete) {
    await props.onBatchDelete(selectedRowKeys.value);
  }
}

// 列设置确认
function handleColumnSettingConfirm(keys: string[]) {
  defaultCheckedKeys.value = keys;
}

defineExpose({
  tableRef,
  selectedRowKeys,
  handleRefresh,
  handleExport,
  handleBatchDelete
});
</script>

<style lang="less" scoped>
.basic-table {
  width: 100%;
}
</style>
