import { useDocumentResize } from "./useDocumentResize";
import { useAppStore } from "@/store";
import {
  useDebounceFn,
  useElementBounding,
  useEventListener,
  useResizeObserver,
  useWindowSize
} from "@vueuse/core";
import { Ref, nextTick, onMounted, ref } from "vue";

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

const MARGIN_HEIGHT = 30;
const DEFAULT_PAGINATION_HEIGHT = 30;

export const useTableHeight = (tableRef: Ref<HTMLElement>, options: UseTableHeightOptions = {}) => {
  const { watchDocumentResize = true, debounceDelay = 280, ...restOptions } = options;

  const deviceHeight = ref(150);

  const { headerSetting } = useAppStore();

  const { height: windowHeight } = useWindowSize();

  const computeTableHeight = async () => {
    const table = tableRef.value;
    if (!table) return;

    const tableEl = (table as any)?.$el;
    const headEl = tableEl.querySelector(".n-data-table-thead") as HTMLElement;
    const paginationEl = tableEl.querySelector(".n-data-table__pagination") as HTMLElement;

    const { top } = useElementBounding(headEl);
    const bottomIncludeBody = windowHeight.value - top.value;

    // 计算分页高度
    const paginationHeight = paginationEl
      ? paginationEl.offsetHeight + 5
      : DEFAULT_PAGINATION_HEIGHT;

    // 计算总高度
    const totalFixedHeight =
      headerSetting.height +
      paginationHeight +
      MARGIN_HEIGHT +
      (restOptions.resizeHeightOffset || 0);
    let height = bottomIncludeBody - totalFixedHeight;

    // 如果设置了最大高度，取较小值
    if (restOptions.maxHeight && restOptions.maxHeight < height) {
      height = restOptions.maxHeight;
    }

    deviceHeight.value = height;
  };

  // 防抖计算函数
  const debouncedComputeTableHeight = useDebounceFn(computeTableHeight, debounceDelay);

  // 监听窗口大小变化
  useEventListener(window, "resize", debouncedComputeTableHeight);

  // 监听表格元素尺寸变化
  useResizeObserver(tableRef, debouncedComputeTableHeight);

  // 监听整个文档的元素变化（根据配置决定是否启用）
  const { startObserving: startDocumentObserving, stopObserving: stopDocumentObserving } =
    useDocumentResize(computeTableHeight, {
      debounceDelay,
      subtree: true,
      immediate: false,
      autoStart: watchDocumentResize
    });

  onMounted(() => {
    nextTick(() => {
      computeTableHeight();
    });
  });

  return {
    deviceHeight,
    computeTableHeight,
    startDocumentObserving,
    stopDocumentObserving
  };
};
