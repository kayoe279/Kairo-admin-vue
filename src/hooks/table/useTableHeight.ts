import { useDebounceFn, useElementBounding } from "@vueuse/core";
import { Ref, nextTick, onMounted, ref, watch } from "vue";

export interface UseTableHeightOptions {
  /**
   * 额外的高度偏移量，用于微调
   */
  resizeHeightOffset?: number;
  /**
   * 最大高度
   */
  maxHeight?: number;
  /**
   * 是否监听整个文档的元素变化
   */
  watchDocumentResize?: boolean;
  /**
   * 防抖延迟时间（毫秒）
   */
  debounceDelay?: number;
}

// 计算表格高度公式：table-container - table-operation - n-data-table-thead - n-data-table__pagination - 12(分页margin)

export const useTableHeight = (tableRef: Ref<HTMLElement>, options: UseTableHeightOptions = {}) => {
  const { debounceDelay = 50 } = options;

  const padding = 40;
  const tableHeight = ref(500);
  const tableContainer = ref<HTMLElement | null>(null);

  const { height: containerHeight } = useElementBounding(tableContainer);

  const computeTableHeight = async () => {
    const table = tableRef.value;
    if (!table) return;

    if (!tableContainer.value) return;
    const tableContainerEl = tableContainer.value;

    const { height: containerHeight } = useElementBounding(tableContainerEl);

    const operationEl = tableContainerEl.querySelector(".table-operation") as HTMLElement;
    const headEl = tableContainerEl.querySelector(".n-data-table-thead") as HTMLElement;
    const paginationEl = tableContainerEl.querySelector(".n-data-table__pagination") as HTMLElement;

    const operationHeight = operationEl?.offsetHeight ? operationEl?.offsetHeight + 16 : 0;
    const headerHeight = headEl?.offsetHeight || 0;
    const paginationHeight = paginationEl?.offsetHeight ? paginationEl?.offsetHeight + 12 : 0;

    const height =
      containerHeight.value - operationHeight - headerHeight - paginationHeight - padding;

    tableHeight.value = Math.floor(Math.max(height, 500));
  };

  // 防抖计算函数
  const debouncedComputeTableHeight = useDebounceFn(computeTableHeight, debounceDelay);

  watch(
    containerHeight,
    () => {
      computeTableHeight();
    },
    { immediate: true }
  );

  onMounted(() => {
    nextTick(() => {
      tableContainer.value = document.querySelector(".table-container") as HTMLElement;
      computeTableHeight();
    });
  });

  return {
    tableHeight,
    refreshTableHeight: debouncedComputeTableHeight
  };
};
