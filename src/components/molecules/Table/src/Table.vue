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
              <SvgIcon icon="solar:question-circle-broken" class="text-foreground text-base" />
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
            <button type="button" @click="reload">
              <SvgIcon icon="ep:refresh-right" class="text-foreground text-[19px]" />
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
import ColumnSetting from "./components/settings/ColumnSetting.vue";
import { useColumns } from "./hooks/useColumns";
import { useDataSource } from "./hooks/useDataSource";
import { useLoading } from "./hooks/useLoading";
import { usePagination } from "./hooks/usePagination";
import { createTableContext } from "./hooks/useTableContext";
import { basicProps } from "./props";
import type { BasicTableProps } from "./types/table";
import { useWindowSizeFn } from "@/hooks/event/useWindowSizeFn";
import { getViewportOffset } from "@/lib/utils/dom";
import { isBoolean } from "@/lib/utils/is";
import { ColumnHeightOutlined, QuestionCircleOutlined, ReloadOutlined } from "@vicons/antd";
import { useDebounceFn, useElementBounding, useEventListener, useWindowSize } from "@vueuse/core";
import { DataTableInst } from "naive-ui";
import { computed, nextTick, onMounted, ref, toRaw, unref, useSlots } from "vue";

// const densityOptions = [
//   {
//     type: "menu",
//     label: "紧凑",
//     key: "small"
//   },
//   {
//     type: "menu",
//     label: "默认",
//     key: "medium"
//   },
//   {
//     type: "menu",
//     label: "宽松",
//     key: "large"
//   }
// ];

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
const wrapRef = ref<HTMLDivElement | null>(null);
// let paginationEl: HTMLElement | null;
const isStriped = ref(props.striped || false);
const tableData = ref<Record<string, any>[]>([]);
const innerPropsRef = ref<Partial<BasicTableProps>>();

const tableRef = ref<DataTableInst | null>(null);
const deviceHeight = ref(150);
const HEADER_HEIGHT = 64;
const MARGIN_HEIGHT = 30;
const DEFAULT_PAGINATION_HEIGHT = 30;

const { height: windowHeight } = useWindowSize();

const getProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
});

const tableSize = ref(unref(getProps).size || "medium");

const { getLoading, setLoading } = useLoading(getProps);

const { getPaginationInfo, setPagination } = usePagination(getProps);

const { getDataSourceRef, getDataSource, getRowKey, reload } = useDataSource(
  getProps,
  {
    getPaginationInfo,
    setPagination,
    tableData,
    setLoading
  },
  emit
);

const { getPageColumns, setColumns, getColumns, getCacheColumns, setCacheColumnsField } =
  useColumns(getProps);

//页码切换
const updatePage = (page: number) => {
  setPagination({ page: page });
  reload();
};

//分页数量切换
const updatePageSize = (size: number) => {
  setPagination({ page: 1, pageSize: size });
  reload();
};

//密度切换
// function densitySelect(e) {
//   tableSize.value = e;
// }

//获取表格大小
// const getTableSize = computed(() => tableSize.value);

//组装表格信息
const getBindValues = computed(() => {
  const tableData = unref(getDataSourceRef);
  const maxHeight = tableData.length ? `${unref(deviceHeight)}px` : "auto";
  return {
    ...unref(getProps),
    loading: unref(getLoading),
    columns: toRaw(unref(getPageColumns)),
    rowKey: unref(getRowKey),
    data: tableData,
    size: tableSize.value,
    remote: true,
    "max-height": maxHeight,
    title: "" // 重置为空 避免绑定到 table 上面
  };
});

//获取分页信息
const pagination = computed(() => toRaw(unref(getPaginationInfo)));

function setProps(props: Partial<BasicTableProps>) {
  innerPropsRef.value = { ...unref(innerPropsRef), ...props };
}

const setStriped = (value: boolean) => (isStriped.value = value);

const tableAction = {
  reload,
  setColumns,
  setLoading,
  setProps,
  getColumns,
  getDataSource,
  getPageColumns,
  getCacheColumns,
  setCacheColumnsField,
  emit
};

// const getCanResize = computed(() => {
//   const { canResize } = unref(getProps);
//   return canResize;
// });

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

// async function computeTableHeight() {
//   const table = tableElRef.value;
//   if (!table) return;
//   if (!unref(getCanResize)) return;
//   const tableEl = (table as any)?.$el;
//   const headEl = tableEl.querySelector(".n-data-table-thead ");
//   const { bottomIncludeBody } = getViewportOffset(headEl);
//   const headerH = 64;
//   let paginationH = 2;
//   const marginH = 24;
//   if (!isBoolean(unref(pagination))) {
//     paginationEl = tableEl.querySelector(".n-data-table__pagination") as HTMLElement;
//     if (paginationEl) {
//       const offsetHeight = paginationEl.offsetHeight;
//       paginationH += offsetHeight || 0;
//     } else {
//       paginationH += 28;
//     }
//   }
//   let height =
//     bottomIncludeBody - (headerH + paginationH + marginH + (props.resizeHeightOffset || 0));
//   const maxHeight = props.maxHeight;
//   height = maxHeight && maxHeight < height ? maxHeight : height;
//   deviceHeight.value = height;
// }

// useWindowSizeFn(computeTableHeight, 280);

// onMounted(() => {
//   nextTick(() => {
//     computeTableHeight();
//   });
// });

createTableContext({ ...tableAction, wrapRef, getBindValues });

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
