<script setup lang="ts">
import { useTable } from "@/hooks";
import { DEFAULT_PAGE_SIZE } from "@/lib";
import { useDebounceFn, useElementBounding, useEventListener, useWindowSize } from "@vueuse/core";
import type { DataTableColumns, DataTableProps } from "naive-ui";
import { computed, nextTick, onMounted, ref, watch } from "vue";

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
  resizeHeightOffset?: number;
  maxHeight?: number;
  reCalcHeight?: boolean;
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

const tableRef = ref();

const deviceHeight = ref(150);
const HEADER_HEIGHT = 64;
const MARGIN_HEIGHT = 30;
const DEFAULT_PAGINATION_HEIGHT = 30;

const { height: windowHeight } = useWindowSize();

const { tableData, loading, pagination, refresh, handlePageChange, handlePageSizeChange } =
  useTable(
    props.apiFunction,
    computed(() => ({
      defaultPageSize: props.pageSize,
      immediate: props.immediate,
      searchParams: props.searchParams
    }))
  );

// 处理行点击
const handleRowClick = (row: any, index: number) => {
  emit("row-click", row, index);
};

// 处理行双击
const handleRowDblclick = (row: any, index: number) => {
  emit("row-dblclick", row, index);
};

const tableMaxHeight = computed(() => {
  return tableData.value.length ? `${deviceHeight.value}px` : "auto";
});

const computeTableHeight = async () => {
  const table = tableRef.value;
  if (!table) return;

  const tableEl = table?.$el;
  const headEl = tableEl.querySelector(".n-data-table-thead") as HTMLElement;
  const paginationEl = tableEl.querySelector(".n-data-table__pagination") as HTMLElement;

  const { top } = useElementBounding(headEl);
  const bottomIncludeBody = windowHeight.value - top.value;

  // 计算分页高度
  const paginationHeight = paginationEl ? paginationEl.offsetHeight + 2 : DEFAULT_PAGINATION_HEIGHT;

  // 计算总高度
  const totalFixedHeight =
    HEADER_HEIGHT + paginationHeight + MARGIN_HEIGHT + (props.resizeHeightOffset || 0);
  let height = bottomIncludeBody - totalFixedHeight;

  // 如果设置了最大高度，取较小值
  if (props.maxHeight && props.maxHeight < height) {
    height = props.maxHeight;
  }

  deviceHeight.value = height;
};

useEventListener(window, "resize", useDebounceFn(computeTableHeight, 280));

onMounted(() => {
  nextTick(() => {
    computeTableHeight();
  });
});

watch(
  () => props.reCalcHeight,
  () => {
    computeTableHeight();
  }
);

// 暴露方法给父组件
defineExpose({
  loading,
  refresh
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
      ref="tableRef"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      :bordered="bordered"
      :striped="striped"
      :scroll-x="scrollX"
      :max-height="tableMaxHeight"
      :row-key="rowKey"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
  </div>
</template>
