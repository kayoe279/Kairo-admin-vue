<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-5">
      <!--顶部左侧区域-->
      <div v-if="props.title || slots.tableTitle" class="flex items-center text-base font-bold">
        <span v-if="props.title"> {{ props.title }} </span>
        <slot v-else name="tableTitle"></slot>
        <n-tooltip v-if="props.titleTooltip" trigger="hover">
          <template #trigger>
            <button type="button" class="ml-1">
              <SvgIcon icon="solar:question-circle-broken" class="text-fg-base text-base" />
            </button>
          </template>
          {{ props.titleTooltip }}
        </n-tooltip>
      </div>

      <div class="flex items-center gap-3">
        <!--顶部右侧区域-->
        <slot name="toolbar"></slot>

        <!--斑马纹-->
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-switch v-model:value="isStriped" @update:value="setStriped" />
          </template>
          <span>表格斑马纹</span>
        </n-tooltip>

        <n-divider vertical />

        <!--刷新-->
        <n-tooltip trigger="hover">
          <template #trigger>
            <button type="button" @click="() => refetch(variables)">
              <SvgIcon icon="ep:refresh-right" class="text-fg-base text-[19px]" />
            </button>
          </template>
          <span>刷新</span>
        </n-tooltip>

        <!--密度-->
        <n-tooltip trigger="hover" v-if="props.showSize">
          <template #trigger>
            <TableDensity v-model="tableSize" />
          </template>
          <span>{{ $t("table.density") }}</span>
        </n-tooltip>

        <!--表格设置单独抽离成组件-->
        <!-- <ColumnSetting /> -->
      </div>
    </div>

    <n-data-table
      ref="tableRef"
      v-bind="getBindValues"
      :striped="isStriped"
      :pagination="pagination"
      @update:page="updatePage"
      @update:page-size="updatePageSize"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </n-data-table>
  </div>
</template>

<script lang="ts" setup>
// import ColumnSetting from "./components/settings/ColumnSetting.vue";
import { useColumns } from "./hooks/useColumns";
import { usePagination } from "./hooks/usePagination";
import { createTableContext } from "./hooks/useTableContext";
import { useTableData } from "./hooks/useTableData";
import { basicProps } from "./props";
import type { BasicTableProps } from "./types/props";
import { useDebounceFn, useElementBounding, useEventListener, useWindowSize } from "@vueuse/core";
import { DataTableInst } from "naive-ui";
import { computed, nextTick, onMounted, ref, toRaw, unref, useSlots } from "vue";

const emit = defineEmits([
  "fetch-success",
  "fetch-error",
  "update:checked-row-keys",
  "edit-end",
  "edit-cancel",
  "edit-row-end",
  "edit-change"
]);

const slots = useSlots();

const props = defineProps({ ...basicProps });
const isStriped = ref(props.striped || false);
const wrapRef = ref<HTMLDivElement | null>(null);
const innerPropsRef = ref<Partial<BasicTableProps>>();
const tableRef = ref<DataTableInst | null>(null);

const deviceHeight = ref(150);
const HEADER_HEIGHT = 64;
const MARGIN_HEIGHT = 30;
const DEFAULT_PAGINATION_HEIGHT = 30;

const { height: windowHeight } = useWindowSize();

const tableProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
});

const tableSize = ref(unref(tableProps).size || "medium");

const { pagination, setPagination } = usePagination(tableProps);

const { loading, tableData, getRowKey, variables, refetch } = useTableData(tableProps, {
  pagination,
  setPagination
});

const { getPageColumns, setColumns, getColumns, getCacheColumns, setCacheColumnsField } =
  useColumns(tableProps);

//页码切换
const updatePage = (page: number) => {
  setPagination({ page: page });
};

//分页数量切换
const updatePageSize = (size: number) => {
  setPagination({ page: 1, pageSize: size });
};

//组装表格信息
const getBindValues = computed(() => {
  const maxHeight = unref(tableData).length ? `${unref(deviceHeight)}px` : "auto";
  return {
    ...unref(tableProps),
    loading: loading.value,
    columns: toRaw(unref(getPageColumns)),
    rowKey: unref(getRowKey),
    data: unref(tableData),
    size: tableSize.value,
    remote: true,
    "max-height": maxHeight,
    title: "" // 重置为空 避免绑定到 table 上面
  };
});

const setProps = (props: Partial<BasicTableProps>) => {
  innerPropsRef.value = { ...unref(innerPropsRef), ...props };
};

const setStriped = (value: boolean) => (isStriped.value = value);

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

const tableAction = {
  refetch,
  setColumns,
  setProps,
  getColumns,
  getPageColumns,
  getCacheColumns,
  setCacheColumnsField,
  emit
};

createTableContext({ ...tableAction, wrapRef, getBindValues, emit });

defineExpose(tableAction);
</script>

<style scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 0 0 16px 0;
}

.table-toolbar-right {
  display: flex;
  justify-content: flex-end;
  flex: 1;
}

.table-toolbar-right-icon {
  margin-left: 12px;
  font-size: 16px;
  cursor: pointer;
  color: var(--text-color);
}
.table-toolbar-right-icon:hover {
  color: #1890ff;
}

.table-toolbar-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
}

.table-toolbar-left-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: 600;
}

.table-toolbar-inner-popover-title {
  padding: 2px 0;
}
</style>
