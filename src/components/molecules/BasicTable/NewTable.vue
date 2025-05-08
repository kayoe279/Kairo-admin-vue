<script lang="ts" setup>
import ColumnSetting from "./components/ColumnSetting.vue";
import TableDensity from "./components/TableDensity.vue";
import { useColumns } from "./hooks/useColumns";
import { createTableContext } from "./hooks/useTableContext";
import type { BasicTableProps } from "./props";
import { useElementBounding, useEventListener, useWindowSize } from "@vueuse/core";
import { useDebounceFn } from "@vueuse/core";
import omit from "lodash/omit";
import type { DataTableInst } from "naive-ui";
import { computed, nextTick, onMounted, ref, useSlots } from "vue";

const props = withDefaults(defineProps<BasicTableProps>(), {
  total: 0,
  showSize: true,
  pagination: () => ({
    pageSize: 10,
    page: 1,
    pageCount: 1,
    itemCount: 10
  })
});

const slots = useSlots();

const { height: windowHeight } = useWindowSize();

const tableSize = ref(props.size || "medium");
const tableRef = ref<DataTableInst | null>(null);
const deviceHeight = ref(150);
const HEADER_HEIGHT = 64;
const MARGIN_HEIGHT = 30;
const DEFAULT_PAGINATION_HEIGHT = 30;

const tableProps = computed(() => {
  const baseProps = omit(props, [
    "queryPrefix",
    "showSize",
    "total",
    "resizeHeightOffset",
    "maxHeight"
  ]);

  const maxHeight = props.data?.length ? `${deviceHeight.value}px` : "auto";
  return {
    ...baseProps,
    size: tableSize.value,
    "max-height": maxHeight
  };
});

const { getPageColumns, setColumns, getColumns, getCacheColumns, setCacheColumnsField } =
  useColumns(tableProps);

const computeTableHeight = async () => {
  const table = tableRef.value;
  if (!table) return;

  const tableEl = (table as any)?.$el;
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

createTableContext({
  tableRef,
  tableProps,
  setColumns,
  getColumns
  // getPageColumns,
  // getCacheColumns,
  // setCacheColumnsField
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-4">
      <div v-if="props.title || slots.tableTitle" class="flex items-center text-base font-bold">
        <span v-if="props.title"> {{ props.title }} </span>
        <slot v-else name="tableTitle"></slot>
        <n-tooltip v-if="props.titleTooltip" trigger="hover">
          <template #trigger>
            <button type="button" class="ml-1">
              <SvgIcon icon="solar:question-circle-broken" class="text-foreground text-base" />
            </button>
          </template>
          {{ props.titleTooltip }}
        </n-tooltip>
      </div>
      <div class="flex items-center gap-2">
        <slot name="toolbar"></slot>
        <!--斑马纹-->
        <!-- <n-tooltip trigger="hover">
          <template #trigger>
            <div class="table-toolbar-right-icon mr-2">
              <n-switch v-model:value="isStriped" @update:value="setStriped" />
            </div>
          </template>
          <span>表格斑马纹</span>
        </n-tooltip>
        <n-divider vertical /> -->

        <n-divider v-if="slots.toolbar" vertical />

        <!--密度-->
        <n-tooltip trigger="hover" v-if="props.showSize">
          <template #trigger>
            <TableDensity v-model="tableSize" />
          </template>
          <span>{{ $t("table.density") }}</span>
        </n-tooltip>

        <!--表格设置-->
        <!-- <ColumnSetting
          :show="showColumnSetting"
          :columns="columns"
          :defaultCheckedKeys="defaultCheckedKeys"
        /> -->
      </div>
    </div>
    <n-data-table
      ref="tableRef"
      class="max-h-full"
      v-bind="tableProps"
      remote
      bordered
      :size="tableSize"
    />
  </div>
</template>
